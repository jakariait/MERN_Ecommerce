import React from "react";

const PaymentMethod = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
        Payment Method
      </h1>

      <div className="flex flex-col gap-2">
        <label className="w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                className="primaryAccentColor w-5 h-5"
                checked
                readOnly
              />
              <span>Cash On Delivery</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;
