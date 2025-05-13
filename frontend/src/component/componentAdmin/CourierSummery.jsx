import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const CourierSummery = ({ phone }) => {
  const [courierData, setCourierData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!phone) return;

    const fetchCourierStats = async () => {
      setLoading(true);
      setError("");
      setCourierData(null);

      try {
        const response = await axios.post(
          `${apiUrl}/courier-check`,
          { phone }
        );

        if (response.data.status === "success") {
          setCourierData(response.data.courierData);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourierStats();
  }, [phone]);

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {courierData && (
        <div className={" grid grid-cols-2 gap-x-2 gap-y-1 w-44"}>
          <p>Total: {courierData.summary.total_parcel}</p>
          <p>Success: {courierData.summary.success_parcel}</p>
          <p>Cancelled: {courierData.summary.cancelled_parcel}</p>
          <p>Ratio: {courierData.summary.success_ratio}%</p>
        </div>
      )}
    </div>
  );
};

export default CourierSummery;
