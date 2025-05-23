import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGeneralInfoStore from "../../store/GeneralInfoStore";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRef } from "react";
import OrderStatusUpdate from "./OrderStatusUpdate.jsx";
import CourierStats from "./CourierStats.jsx";

// Import your VITE API URL
const apiUrl = import.meta.env.VITE_API_URL; // 👈 assuming you set it in .env

const ViewOrder = () => {
  const { GeneralInfoList } = useGeneralInfoStore();

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange", text: "Pending" };
      case "intransit":
        return { color: "blue", text: "In Transit" };
      case "approved":
        return { color: "teal", text: "Approved" };
      case "delivered":
        return { color: "green", text: "Delivered" };
      case "cancelled":
        return { color: "red", text: "Cancelled" };
      case "returned":
        return { color: "purple", text: "Returned" }; // Text for returned
      default:
        return { color: "gray", text: "Unknown" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "unpaid":
        return { color: "orange", text: "Unpaid" };

      case "paid":
        return { color: "green", text: "Paid" };

      default:
        return { color: "gray", text: "Unknown" };
    }
  };

  // Helper function to display human-readable payment method
  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case "cash_on_delivery":
        return "Cash on Delivery";
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "card":
        return "Card";
      default:
        return "Unknown Method";
    }
  };

  const getDeliveryMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case "home_delivery":
        return "Home Delivery";
      default:
        return "Unknown Method";
    }
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data.order);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const orderStatusColor = getStatusColor(order.orderStatus);
  const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);

  const handlePrint = () => {
    const content = printRef.current.innerHTML; // Get the content to print

    // Create a new div or section in the body to temporarily hold the content for printing
    const printContainer = document.createElement("div");
    printContainer.innerHTML = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .invoice {
            width: 100%;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <div class="invoice">${content}</div>
      </body>
    </html>
  `;

    // Append the print container to the body temporarily
    document.body.appendChild(printContainer);

    // Trigger the print dialog
    window.print();

    // Clean up by removing the print container after printing
    setTimeout(() => {
      document.body.removeChild(printContainer);
    }, 1000); // Delay to ensure the print dialog has been opened before removing the element
  };

  return (
    <div>
      <div ref={printRef} className="p-4 shadow rounded-lg">
        <div className={"flex justify-between items-center mb-5"}>
          <div className={"text-2xl"}>{GeneralInfoList.CompanyName}</div>
          <div>
            <ImageComponent
              imageName={GeneralInfoList.PrimaryLogo}
              className={"w-30"}
            />
          </div>
          <div className={"text-2xl"}>
            <h1>Invoice</h1>
          </div>
        </div>
        <div className="flex justify-between">
          {/* Shipping Info Section */}
          <div>
            <h2 className="font-bold text-xl">Shipping Info:</h2>
            <div className="flex flex-col gap-0.5">
              <p>{order.shippingInfo.fullName}</p>
              <p>{order.shippingInfo.mobileNo}</p>
              <p>{order.shippingInfo.email}</p>
              <p>{order.shippingInfo.address}</p>
            </div>
          </div>

          {/* Order Details Section */}
          <div>
            <div className="flex justify-between flex-col gap-0.5">
              <p>
                <strong>Order No:</strong> {order.orderNo}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: orderStatusColor.color,
                  }}
                >
                  {orderStatusColor.text}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {getPaymentMethodText(order.paymentMethod)}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  style={{
                    backgroundColor: paymentStatusColor.backgroundColor,
                    color: paymentStatusColor.color,
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  className={"text-sm"}
                >
                  {paymentStatusColor.text}
                </span>
              </p>
              {order.paymentId && (
                <p>
                  <strong>Payment ID:</strong>{" "}
                  <span className="text-sm">{order.paymentId}</span>
                </p>
              )}

              {order.transId && (
                <p>
                  <strong>Transaction ID:</strong> {order.transId}
                </p>
              )}

              <p>
                <strong>Delivery Method:</strong>{" "}
                {getDeliveryMethodText(order.deliveryMethod)}
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-6">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Variant</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => {
                  const product = item.productId;

                  // Get the first variant (if any)
                  const variant = product.variants[0];

                  // Check for discount or final price
                  const price = item.price;
                  const totalPrice = price * item.quantity;

                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div>{product.name}</div>
                          <div>Category: {item.productId?.category?.name}</div>
                          <div>Code: {product.productCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {variant ? variant.sizeName : "N/A"}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price.toFixed(2)}</TableCell>

                      <TableCell>{totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="mt-6 p-1 flex justify-between ">
          <div>
            <h1>Billing Address:</h1>
            <div>
              <p>{order.shippingInfo.fullName}</p>
              <p>{order.shippingInfo.address}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <p>Sub-total: Tk.{order.subtotalAmount.toFixed(2)}</p>
            <p>Promo Discount: Tk.{order.promoDiscount.toFixed(2)}</p>
            <p>Reward Points Used: {order.rewardPointsUsed}</p>
            <p>VAT/TAX: {order.vat.toFixed(2)}</p>
            <p>Delivery Charge: {order.deliveryCharge.toFixed(2)}</p>
            <p>Special Discount Amount: {order.specialDiscount.toFixed(2)}</p>
            <p className={"text-2xl"}>
              Total Order Amount: {order.totalAmount.toFixed(2)}
            </p>
            <p className={"text-red-500"}>
              Advance: {order.advanceAmount.toFixed(2)}
            </p>
            <p className={"text-2xl"}>
              Total Due Amount: {order.dueAmount.toFixed(2)}
            </p>
            <div className="flex justify-end mb-4">
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <OrderStatusUpdate orderId={order._id} onUpdate={fetchOrder} />
      </div>
      <div className="mt-6">
        <CourierStats phone={order.shippingInfo.mobileNo} />
      </div>
    </div>
  );
};

export default ViewOrder;
