import React, { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

const AbandonedCartTracker = ({
	addressData,
	cart,
	totalAmount,
	user,
	apiUrl,
	orderPlaced,
}) => {
	const location = useLocation();
	const orderPlacedRef = useRef(orderPlaced);
	console.log(orderPlaced);
	// Keep track of the latest orderPlaced value
	useEffect(() => {
		orderPlacedRef.current = orderPlaced;
		if (orderPlaced) {
			console.log(
				"[AbandonedCartTracker] Order placed, clearing all tracking flags"
			);
			sessionStorage.removeItem("wasInCheckout");
			sessionStorage.removeItem("abandonedCartSent");
			sessionStorage.setItem("orderPlaced", "true");
		}
	}, [orderPlaced]);

	const isOrderPlaced = useCallback(() => {
		return (
			orderPlacedRef.current || sessionStorage.getItem("orderPlaced") === "true"
		);
	}, []);

	const canSend = useCallback(() => {
		if (isOrderPlaced()) {
			console.log(
				"[AbandonedCartTracker] Order placed, not sending abandoned cart"
			);
			return false;
		}

		if (location.pathname.includes("/checkout")) {
			sessionStorage.removeItem("abandonedCartSent");
		}

		const canSendResult =
			addressData?.phone?.length === 11 &&
			cart?.length > 0 &&
			!sessionStorage.getItem("abandonedCartSent");

		console.log("[AbandonedCartTracker] canSend check:", {
			orderPlaced: orderPlacedRef.current,
			orderPlacedInStorage: sessionStorage.getItem("orderPlaced"),
			phoneLength: addressData?.phone?.length,
			cartLength: cart?.length,
			alreadySent: sessionStorage.getItem("abandonedCartSent"),
			result: canSendResult,
			currentPath: location.pathname,
		});

		return canSendResult;
	}, [location.pathname, addressData, cart, isOrderPlaced]);

	const getPayload = useCallback(
		() => ({
			userId: user?._id || undefined,
			fullName: addressData?.fullName || undefined,
			number: addressData?.phone,
			email: addressData?.email || undefined,
			address: addressData?.address || undefined,
			cartItems: cart.map((item) => {
				const variantId =
					item.variantId && item.variantId !== "Default"
						? item.variantId
						: undefined;
				return {
					productId: item.productId,
					...(variantId && { variantId }),
					price:
						item.discountPrice > 0 ? item.discountPrice : item.originalPrice,
					quantity: item.quantity,
				};
			}),
			totalAmount,
		}),
		[addressData, cart, totalAmount, user?._id]
	);

	const sendAbandonedCart = useCallback(() => {
		if (isOrderPlaced()) {
			console.log("[AbandonedCartTracker] Order placed, aborting send");
			return;
		}

		if (!canSend()) {
			console.log(
				"[AbandonedCartTracker] Cannot send abandoned cart - conditions not met"
			);
			return;
		}

		const payload = getPayload();
		console.log("[AbandonedCartTracker] Sending payload:", payload);

		try {
			navigator.sendBeacon(
				`${apiUrl}/abandoned-cart`,
				new Blob([JSON.stringify(payload)], {
					type: "application/json",
				})
			);
			sessionStorage.setItem("abandonedCartSent", "true");
			console.log("[AbandonedCartTracker] Abandoned cart sent successfully");
		} catch (error) {
			console.error(
				"[AbandonedCartTracker] Failed to send abandoned cart",
				error
			);
		}
	}, [apiUrl, canSend, getPayload, isOrderPlaced]);

	// Detect navigation changes
	useEffect(() => {
		const handleRouteChange = () => {
			if (isOrderPlaced()) {
				console.log(
					"[AbandonedCartTracker] Order placed, not tracking navigation"
				);
				return;
			}

			const currentPath = window.location.pathname;
			const wasInCheckout = sessionStorage.getItem("wasInCheckout") === "true";

			if (currentPath.includes("/checkout")) {
				sessionStorage.setItem("wasInCheckout", "true");
				sessionStorage.removeItem("abandonedCartSent");
			} else if (wasInCheckout) {
				console.log("[AbandonedCartTracker] Left checkout page");
				sendAbandonedCart();
				sessionStorage.removeItem("wasInCheckout");
			}
		};

		handleRouteChange();

		window.addEventListener("popstate", handleRouteChange);

		const originalPushState = window.history.pushState;
		const originalReplaceState = window.history.replaceState;

		window.history.pushState = function () {
			originalPushState.apply(this, arguments);
			handleRouteChange();
		};

		window.history.replaceState = function () {
			originalReplaceState.apply(this, arguments);
			handleRouteChange();
		};

		return () => {
			window.removeEventListener("popstate", handleRouteChange);
			window.history.pushState = originalPushState;
			window.history.replaceState = originalReplaceState;
		};
	}, [location.pathname, sendAbandonedCart, isOrderPlaced]);

	// Send abandoned cart on page unload
	useEffect(() => {
		const handleUnload = () => {
			if (isOrderPlaced()) {
				console.log(
					"[AbandonedCartTracker] Order placed, not sending on unload"
				);
				return;
			}
			console.log("[AbandonedCartTracker] Page unload detected");
			sendAbandonedCart();
		};

		window.addEventListener("beforeunload", handleUnload);
		return () => window.removeEventListener("beforeunload", handleUnload);
	}, [sendAbandonedCart, isOrderPlaced]);

	return null;
};

export default AbandonedCartTracker;
