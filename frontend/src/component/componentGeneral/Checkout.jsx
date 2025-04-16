import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore.js";
import useAuthUserStore from "../../store/AuthUserStore.js";

import ImageComponent from "./ImageComponent.jsx";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import RewardPoints from "./RewardPoints.jsx";

const Checkout = () => {
  // Destructure cart actions from the store
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthUserStore();

  const apiUrl = import.meta.env.VITE_API_URL;

  const [rewardPointsUsed, setRewardPointsUsed] = useState(0);

  const handleRewardPointsChange = (value) => {
    setRewardPointsUsed(value);
  };
  // Calculate the total amount and total number of items in the cart
  const totalAmount = cart.reduce((total, item) => {
    const price =
      item.discountPrice > 0 ? item.discountPrice : item.originalPrice;
    return total + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Format the total amount with commas for better readability
  const formattedTotalAmount = (amount) => {
    return Number(amount).toLocaleString();
  };

  // State to handle shipping options and loading status
  const [shipping, setShipping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch shipping options from the server when the component mounts
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getAllShipping`);

        if (res.data.success) {
          setShipping(res.data.data);
          setMessage(res.data.message);
        } else {
          setMessage("Failed to fetch shipping options.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching shipping options.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipping();
  }, []);

  // State to store selected shipping option
  const [selectedShipping, setSelectedShipping] = useState(0);

  // Automatically set the first shipping option as default
  useEffect(() => {
    if (shipping.length > 0) {
      setSelectedShipping(shipping[0].value);
    }
  }, [shipping]);

  // State to store free delivery threshold
  const [freeDelivery, setFreeDelivery] = useState(1500);

  // Calculate the actual shipping cost based on total amount and free delivery threshold
  const actualShippingCost =
    freeDelivery > 1 && totalAmount >= freeDelivery ? 0 : selectedShipping;

  // Calculate the grand total (subtotal + shipping cost)
  const grandTotal = totalAmount - rewardPointsUsed + actualShippingCost;

  return (
    <div className="xl:container xl:mx-auto px-2 py-1 md:px-6 md:py-5">
      {/* Page Header */}
      <div className="flex flex-col justify-between items-center gap-2">
        <h1 className="text-2xl">Checkout</h1>

        {/* Breadcrumbs for navigation */}
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>

        {/* Login/Register prompt */}
        {!user && (
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2 bg-yellow-100 p-3 rounded-lg">
            <div>Have an account? Please Login or Register</div>
            <div className="flex gap-6">
              <Link to="/login">
                <button className="primaryBgColor accentTextColor px-6 rounded-lg py-2 cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="primaryBgColor accentTextColor px-6 rounded-lg py-2 cursor-pointer">
                  Register
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Order Review and Address Section */}
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-10 mt-6"}>
        {/* Address Form Section */}
        <div className={"flex flex-col gap-4"}>
          <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
            Address
          </h1>

          {/* Full Name Input */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">
              Full Name <span className="text-red-600">*</span>
            </h2>
            <input
              type="text"
              placeholder="ex Mr./Mrs/Miss"
              className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
              required
              value={user?.fullName || ""}
            />
          </div>

          {/* Mobile Number Input */}
          <div className={"flex flex-col gap-2"}>
            <h2>
              Mobile Number <span className="text-red-600">*</span>
            </h2>
            <input
              type="tel"
              placeholder="ex 01234567890"
              className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
              required
              value={user?.phone || ""}
            />
          </div>

          {/* Address Input */}
          <div className={"flex flex-col gap-2"}>
            <h2>
              Address <span className="text-red-600">*</span>
            </h2>
            <input
              type="text"
              placeholder="ex Houese no. / Building / Street / Area"
              className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
              required
              value={user?.address || ""}
            />
          </div>

          {/* Email Input (Optional) */}
          <div className={"flex flex-col gap-2"}>
            <h2>
              Email <span className={"text-sm"}>(Optional)</span>
            </h2>
            <input
              type="email"
              placeholder="ex 01234567890"
              className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
              required
              value={user?.email || ""}
            />
          </div>

          {/* Shipping Options */}
          <div className={"flex flex-col gap-4"}>
            <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
              Select Shipping Option
            </h1>

            {/* Loading or Error Message for Shipping */}
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="text-gray-500">Loading shipping options...</div>
              ) : message && shipping.length === 0 ? (
                <div className="text-red-500">{message}</div>
              ) : (
                shipping.map((option, index) => (
                  <label
                    key={index}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition duration-200 `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.value}
                          checked={selectedShipping === option.value}
                          onChange={() => setSelectedShipping(option.value)}
                          className="primaryAccentColor w-5 h-5"
                        />
                        {option.name}
                      </div>
                      <div>Tk. {option.value}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Delivery Method */}
          <div className={"flex flex-col gap-4"}>
            <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
              Delivery Method
            </h1>

            <div className="flex flex-col gap-2">
              <label
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition duration-200 `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      className="primaryAccentColor w-5 h-5 "
                      checked
                    />
                    <span>
                      Home Delivery{" "}
                      {freeDelivery > 0 && (
                        <span className="text-sm text-gray-600">
                          (Enjoy free delivery on purchases of{" "}
                          <span className="text-red-500">
                            Tk. {formattedTotalAmount(freeDelivery)}
                          </span>{" "}
                          or more!)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Review Section */}
        <div>
          <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
            Order Review
          </h1>
          <div className="grid gap-4">
            {cart.map((item) => (
              <div
                key={`${item.id || item.productId || index}-${item.variant}`}
                className="grid grid-cols-3 gap-3 items-center shadow rounded-lg p-3 "
              >
                {/* Delete Button */}
                <div className="flex items-center justify-baseline gap-2">
                  <button
                    onClick={() => removeFromCart(item.productId, item.variant)}
                    className="text-red-500 text-lg cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                  {/* Product Thumbnail */}
                  <Link to={`/product/${item.slug}`}>
                    <ImageComponent
                      imageName={item.thumbnail}
                      altName={item.name}
                      className="object-cover"
                      skeletonHeight={"100"}
                    />
                  </Link>
                </div>

                <div className="flex flex-col items-center justify-baseline gap-4">
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="line-clamp-2 overflow-hidden text-ellipsis">
                      {item.name}
                    </h3>
                  </Link>
                  {item.variant !== "Default" && <p>Size: {item.variant}</p>}
                </div>

                <div className="flex flex-col items-center justify-baseline gap-4">
                  <div>
                    {item.discountPrice > 0 ? (
                      <p>
                        Price: Tk.{" "}
                        {formattedTotalAmount(
                          item.discountPrice * item.quantity,
                        )}
                      </p>
                    ) : (
                      <p>
                        Price: Tk.{" "}
                        {formattedTotalAmount(
                          item.originalPrice * item.quantity,
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center">
                      {/* Decrease Quantity Button */}
                      <button
                        className="primaryBgColor accentTextColor px-2 py-2 rounded-l cursor-pointer"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variant,
                            item.quantity - 1,
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className={"px-3 py-1 bg-gray-200"}>
                        {item.quantity}
                      </span>
                      {/* Increase Quantity Button */}
                      <button
                        className="primaryBgColor accentTextColor px-2 py-2 rounded-r cursor-pointer"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variant,
                            item.quantity + 1,
                          )
                        }
                        disabled={item.quantity >= 5}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/*Reward Points*/}
            {user && (
              <RewardPoints
                availablePoints={user.rewardPoints}
                points={rewardPointsUsed}
                onPointsChange={handleRewardPointsChange}
              />
            )}

            {/* Order Summary */}
            <div
              className={
                "shadow bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg p-4 flex flex-col justify-between "
              }
            >
              <h3 className="font-medium text-center">Order Summary</h3>
              <div className="flex justify-between">
                <div>Total Items:</div>
                <div>{totalItems}</div>
              </div>
              <div className="flex justify-between">
                <div>Total Amount:</div>
                <div>Tk. {formattedTotalAmount(totalAmount)}</div>
              </div>

              {user && (
                <div className="flex justify-between">
                  <div>Reward Points Used:</div>
                  <div>{rewardPointsUsed}</div>
                </div>
              )}

              <div className="flex justify-between">
                <div>Shipping:</div>
                <div>Tk. {formattedTotalAmount(actualShippingCost)}</div>
              </div>
              <div className="flex justify-between font-semibold ">
                <div>Grand Total:</div>
                <div>Tk. {formattedTotalAmount(grandTotal)}</div>
              </div>
            </div>

            <div className={"mb-3"}>
              {/* Proceed to Checkout Button */}
              <button
                onClick={() => alert("Proceeding to checkout!")}
                className="primaryBgColor accentTextColor w-full py-3 text-center text-white text-xl cursor-pointer rounded-lg"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
