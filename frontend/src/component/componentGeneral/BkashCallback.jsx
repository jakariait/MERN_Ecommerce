import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";

const BkashCallback = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const executeBkash = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentID = urlParams.get("paymentID");

      if (!paymentID) {
        setErrorMessage("Invalid payment callback. Missing payment ID.");
        return;
      }

      try {
        const execRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/bkashexecute`,
          { paymentID }
        );

        if (execRes.data && execRes.data.paymentID) {
          const orderPayload = JSON.parse(localStorage.getItem("bkash_order_payload"));

          if (!orderPayload) {
            setErrorMessage("Could not find your order info. Please try again.");
            return;
          }

          orderPayload.paymentId = paymentID;

          const orderRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/orders`,
            orderPayload
          );

          if (orderRes.data.success) {
            clearCart();
            localStorage.removeItem("bkash_order_payload");
            navigate(`/thank-you/${orderRes.data.order.orderNo}`);
          } else {
            setErrorMessage("Payment succeeded but order creation failed. Please contact support.");
          }
        } else {
          setErrorMessage("bKash payment execution failed. Please try again.");
        }
      } catch (err) {
        console.error("Error finalizing bKash order", err);
        setErrorMessage("Something went wrong while processing your payment. Please try again.");
      }
    };

    executeBkash();
  }, [navigate, clearCart]);

  return (
    <div className="flex justify-center items-center">
      <div className="text-center mt-50">
        {errorMessage ? (
          <div className="text-red-600">{errorMessage}</div>
        ) : (
          <div>Processing your bKash payment...</div>
        )}
      </div>
    </div>
  );
};

export default BkashCallback;
