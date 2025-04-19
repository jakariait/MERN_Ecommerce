import React, { useEffect, useState } from "react";
import axios from "axios";

// Stores
import useCartStore from "../../store/useCartStore.js";
import useAuthUserStore from "../../store/AuthUserStore.js";

// Custom Components
import AddressForm from "./AddressForm.jsx";
import ShippingOptions from "./ShippingOptions.jsx";
import OrderReview from "./OrderReview.jsx";
import CouponSection from "./CouponSection.jsx";
import RewardPoints from "./RewardPoints.jsx";
import DeliveryMethod from "./DeliveryMethod.jsx";
import OrderSummary from "./OrderSummary.jsx";
import CheckoutHeader from "./CheckoutHeader.jsx";
import PaymentMethod from "./PaymentMethod.jsx";

const Checkout = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // Store values
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthUserStore();

  // Coupon & Reward
  const [rewardPointsUsed, setRewardPointsUsed] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Shipping state
  const [selectedShipping, setSelectedShipping] = useState({
    name: "",
    value: 0,
  });

  // Free Delivery
  const [freeDelivery, setFreeDelivery] = useState(null);

  const [vatPercentage, setVatPercentage] = useState(null);

  // Shipping Details Handler
  const [addressData, setAddressData] = useState({});

  // Handle data received from AddressForm
  const handleAddressChange = (data) => {
    setAddressData(data);
  };

  const handleRewardPointsChange = (value) => {
    setRewardPointsUsed(value);
  };

  // Fetch free delivery threshold
  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getFreeDeliveryAmount`);
        if (res.data?.success) {
          setFreeDelivery(res.data.data.value);
        }
      } catch (err) {
        console.error("Failed to fetch free delivery amount", err);
      }
    };

    fetchAmount();
  }, []);

  // Price Calculations
  const totalAmount = cart.reduce((total, item) => {
    const price =
      item.discountPrice > 0 ? item.discountPrice : item.originalPrice;
    return total + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formattedTotalAmount = (amount) => Number(amount).toLocaleString();

  const actualShippingCost =
    freeDelivery > 1 && totalAmount >= freeDelivery
      ? 0
      : selectedShipping.value;

  let discount = appliedCoupon?.discountAmount || 0;

  // Calculate total amount after reward points and coupon discount
  const amountAfterDiscounts = totalAmount - rewardPointsUsed - discount;

  // --- VAT Calculation (e.g., 5%) ---
  const vatAmount = (amountAfterDiscounts * vatPercentage) / 100;

  useEffect(() => {
    const fetchVatAmount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getVatPercentage`);
        if (res.data?.success) {
          setVatPercentage(res.data.data.value);
        }
      } catch (err) {
        console.error("Failed to fetch VAT Percentage", err);
      }
    };

    fetchVatAmount();
  }, []);

  if (vatPercentage === null || freeDelivery === null) return null;

  // --- Grand Total ---
  const grandTotal =
    amountAfterDiscounts + vatAmount + actualShippingCost;

  return (
    <div className="xl:container xl:mx-auto p-4">
      <CheckoutHeader user={user} />

      <div className="grid gap-12 md:grid-cols-2">
        {/* Left Column - Address & Shipping */}
        <div className="space-y-8">
          {/* Address Option */}
          <AddressForm user={user} onAddressChange={handleAddressChange} />

          {/* Shipping Options */}
          <ShippingOptions onShippingChange={setSelectedShipping} />

          {/* Delivery Method */}
          <DeliveryMethod
            freeDelivery={freeDelivery}
            formattedTotalAmount={formattedTotalAmount}
          />
          {/* Payment Method */}
          <PaymentMethod />
        </div>

        {/* Right Column - Order Review */}
        <div className="space-y-8">
          <OrderReview
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            formattedTotalAmount={formattedTotalAmount}
          />

          {/* Coupon Section */}
          <CouponSection
            orderAmount={totalAmount}
            setAppliedCouponGlobal={setAppliedCoupon}
          />

          {/* Reward Points */}
          {user && (
            <RewardPoints
              availablePoints={user.rewardPoints}
              points={rewardPointsUsed}
              onPointsChange={handleRewardPointsChange}
            />
          )}

          {/* Final Order Summary */}
          <OrderSummary
            totalItems={totalItems}
            totalAmount={totalAmount}
            rewardPointsUsed={rewardPointsUsed}
            actualShippingCost={actualShippingCost}
            grandTotal={grandTotal}
            discount={discount}
            appliedCoupon={appliedCoupon}
            formattedTotalAmount={formattedTotalAmount}
            showRewardPoints={!!user}
            vatAmount={vatAmount}
            vatPercentage={vatPercentage}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
