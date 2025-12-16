import { useEffect, useState } from "react";
import axios from "axios";
import useAuthAdminStore from "./AuthAdminStore.js";

const useCourierStatus = (orderData, sent) => {
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  const apiURL = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!orderData?.order_id || !sent) {
        setDeliveryStatus(null);
        return;
      }
      try {
        const response = await axios.get(
          `${apiURL}/courier/status/${orderData.order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.status === "success") {
          const statusData = response.data.data;
          if (statusData.delivery_status) {
            setDeliveryStatus(statusData.delivery_status);
          } else if (statusData.data && statusData.data.order_status) {
            setDeliveryStatus(statusData.data.order_status);
          } else {
            setDeliveryStatus(null);
          }
        } else {
          console.error("Unexpected response:", response.data);
          setDeliveryStatus(null);
        }
      } catch (error) {
        console.error("Error fetching order status:", error.message);
        setDeliveryStatus(null);
      }
    };

    fetchOrderStatus();
  }, [sent, orderData, apiURL, token]);

  return deliveryStatus;
};

export default useCourierStatus;
