import {
  FaShoppingBag,
  FaBox,
  FaShoppingCart,
  FaHeart,
  FaMoneyBillWave,
  FaComments,
} from "react-icons/fa";
import {useState} from "react";

const statsData = [
  {
    value: 16,
    label: "Total order placed",
    icon: <FaShoppingBag className="text-3xl text-blue-500" />,
  },
  {
    value: 2,
    label: "Running orders",
    icon: <FaBox className="text-3xl text-yellow-500" />,
  },
  {
    value: 2,
    label: "Items in cart",
    icon: <FaShoppingCart className="text-3xl text-green-500" />,
  },
  {
    value: 1,
    label: "Product in wishlist's",
    icon: <FaHeart className="text-3xl text-orange-500" />,
  },
  {
    value: "42,489",
    label: "Amount spent",
    icon: <FaMoneyBillWave className="text-3xl text-blue-600" />,
  },
  {
    value: 2,
    label: "Opened Tickets",
    icon: <FaComments className="text-3xl text-purple-500" />,
  },
];

const UserStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 p-2 py-5">
      {statsData.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white via-[#f4f4f9] to-white p-5 rounded-2xl shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
          <div className="bg-white rounded-full p-3 shadow">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
