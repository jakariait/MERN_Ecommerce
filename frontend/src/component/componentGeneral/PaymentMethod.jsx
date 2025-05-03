import bkash from "../../assets/bKash.jpg"
const PaymentMethod = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
        Payment Method
      </h1>

      <div className="flex flex-col gap-2">
        <label className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition duration-200">
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={selectedMethod === "cash_on_delivery"}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="primaryAccentColor w-5 h-5"
              />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="bkash"
                checked={selectedMethod === "bkash"}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="primaryAccentColor w-5 h-5"
              />
              <img src={bkash} alt="bkash"  className="w-[136] h-10" />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;



