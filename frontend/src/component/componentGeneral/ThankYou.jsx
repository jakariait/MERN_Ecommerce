import React from "react";
import { useParams, Link } from "react-router-dom";
import { PackageCheck } from "lucide-react";

const ThankYou = () => {
  const { orderId } = useParams();

  return (
    <div className="flex items-center justify-center  p-14">
      <div className=" p-8 rounded-lg shadow text-center ">
        <PackageCheck className="primaryTextColor mx-auto mb-4" size={120} />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Order Successful!
        </h1>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Thank You!
        </h1>

        <p className="text-gray-600 mb-4">
          We receive your order. We will be in touch and contact you soon.
        </p>
        <div className="bg-gray-200 p-4 rounded-md mb-6">
          <p className={"primaryTextColor text-lg"}>Order NO: {orderId}</p>
        </div>
        <div className={"flex flex-row gap-6 justify-center items-center"}>
          <Link
            to="/"
            className="w-42 inline-block primaryBgColor accentTextColor px-6 py-2 rounded-lg "
          >
            Track My Order
          </Link>
          <Link
            to="/"
            className="w-42 inline-block primaryBgColor accentTextColor px-6 py-2 rounded-lg "
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
