// import React from "react";
// import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
// import { Add, Remove } from "@mui/icons-material";
// import { CheckCircle, ErrorOutline } from "@mui/icons-material"; // For success/error icons
//
// const CouponSection = ({
//   expanded,
//   setExpanded,
//   coupon,
//   setCoupon,
//   handleApplyCoupon,
//   couponError,
//   appliedCoupon,
// }) => {
//   return (
//     <div className="w-full rounded-md shadow overflow-hidden bg-white">
//       {/* Accordion for expanding coupon input */}
//       <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
//         <AccordionSummary expandIcon={expanded ? <Remove /> : <Add />}>
//           <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 ">
//             Have a coupon or gift voucher?
//           </h1>
//         </AccordionSummary>
//
//         <AccordionDetails>
//           <div className="flex flex-col items-center     space-x-3">
//             <div className={"flex gap-2 accentBgColor w-full p-3 rounded-md"}>
//               <input
//                 type="text"
//                 placeholder="Enter your coupon code"
//                 value={coupon}
//                 onChange={(e) => setCoupon(e.target.value)}
//                 className="flex-grow outline-none px-4 py-2 rounded-md bg-white"
//               />
//               <button
//                 onClick={handleApplyCoupon}
//                 className="primaryBgColor accentTextColor px-6 py-2 rounded-md  cursor-pointer shadow-md "
//               >
//                 Apply Coupon
//               </button>
//             </div>
//
//             {/* Applied coupon success message */}
//             {appliedCoupon && (
//               <div className="flex items-center space-x-2 bg-green-100 w-full p-3 rounded-md mt-3">
//                 <CheckCircle sx={{ color: "#5cb85c" }} />
//                 <span className="text-green-600 text-sm">
//                   Coupon <strong>{appliedCoupon.code}</strong> applied! You
//                   saved{" "}
//                   {appliedCoupon.type === "percentage"
//                     ? `${appliedCoupon.value}%`
//                     : `Tk.${appliedCoupon.value}`}
//                   .
//                 </span>
//               </div>
//             )}
//             {/* Error or success message */}
//             {couponError && (
//               <div className="flex items-center space-x-2 bg-red-100 w-full p-3 rounded-md mt-3">
//                 <ErrorOutline sx={{ color: "#d9534f" }} />
//                 <span className="text-red-500 text-sm">{couponError}</span>
//               </div>
//             )}
//           </div>
//         </AccordionDetails>
//       </Accordion>
//     </div>
//   );
// };
//
// export default CouponSection;


import React, { useState } from "react";
import axios from "axios";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Add, Remove, CheckCircle, ErrorOutline } from "@mui/icons-material";

const CouponSection = ({

                         orderAmount,
                         setAppliedCouponGlobal, // To send coupon back to parent
                       }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [expanded, setExpanded] = useState(false);


  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/applyCoupon`, {
        code: coupon,
        orderAmount,
      });

      if (res.data.success) {
        const couponData = res.data.data;

        if (orderAmount < couponData.minimumOrder) {
          setCouponError(
            `Minimum order amount should be ৳${couponData.minimumOrder}`
          );
          setAppliedCoupon(null);
          setAppliedCouponGlobal(null);
          return;
        }

        const now = new Date();
        const startDate = new Date(couponData.startDate);
        const endDate = new Date(couponData.endDate);

        if (now < startDate || now > endDate) {
          setCouponError("This coupon is not valid at this time.");
          setAppliedCoupon(null);
          setAppliedCouponGlobal(null);
          return;
        }

        const discountAmount =
          couponData.type === "percentage"
            ? (orderAmount * couponData.value) / 100
            : couponData.value;


        const finalCoupon = { ...couponData, discountAmount };

        setAppliedCoupon(finalCoupon);
        setAppliedCouponGlobal(finalCoupon);
        setCouponError("");
      } else {
        setCouponError(res.data.message || "Invalid coupon.");
        setAppliedCoupon(null);
        setAppliedCouponGlobal(null);
      }
    } catch (err) {
      setCouponError("Failed to apply coupon. Please try again.");
      setAppliedCoupon(null);
      setAppliedCouponGlobal(null);
      console.error(err);
    }
  };

  return (
    <div className="w-full rounded-md shadow overflow-hidden bg-white">
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={expanded ? <Remove /> : <Add />}>
          <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2">
            Have a coupon or gift voucher?
          </h1>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col items-center space-x-3">
            <div className={"flex gap-2 accentBgColor w-full p-3 rounded-md"}>
              <input
                type="text"
                placeholder="Enter your coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-grow outline-none px-4 py-2 rounded-md bg-white"
              />
              <button
                onClick={handleApplyCoupon}
                className="primaryBgColor accentTextColor px-6 py-2 rounded-md cursor-pointer shadow-md"
              >
                Apply Coupon
              </button>
            </div>

            {/* Applied coupon success message */}
            {appliedCoupon && (
              <div className="flex items-center space-x-2 bg-green-100 w-full p-3 rounded-md mt-3">
                <CheckCircle sx={{ color: "#5cb85c" }} />
                <span className="text-green-600 text-sm">
                  Coupon <strong>{appliedCoupon.code}</strong> applied! You
                  saved{" "}
                  {appliedCoupon.type === "percentage"
                    ? `${appliedCoupon.value}%`
                    : `Tk.${appliedCoupon.value}`}
                  .
                </span>
              </div>
            )}

            {/* Error message */}
            {couponError && (
              <div className="flex items-center space-x-2 bg-red-100 w-full p-3 rounded-md mt-3">
                <ErrorOutline sx={{ color: "#d9534f" }} />
                <span className="text-red-500 text-sm">{couponError}</span>
              </div>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CouponSection;
