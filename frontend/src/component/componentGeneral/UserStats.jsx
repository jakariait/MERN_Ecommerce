import { useEffect } from 'react';
import {
  FaShoppingBag,
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
} from 'react-icons/fa';
import useCartStore from '../../store/useCartStore.js';
import useAuthUserStore from '../../store/AuthUserStore.js';
import useOrderSummaryStore from '../../store/OrderSummaryStore.js';

const UserStats = () => {
  const { cart } = useCartStore();
  const { user, token } = useAuthUserStore();
  const { summaries, fetchSummaries } = useOrderSummaryStore();

  // Delivered orders
  const deliveredOrders = (summaries?.orders || []).filter(
    (order) => order.orderStatus === 'delivered',
  );

  // Running orders: orders not delivered, not returned, and not cancelled
  const runningOrders = (summaries?.orders || []).filter(
    (order) =>
      !['delivered', 'returned', 'cancelled'].includes(order.orderStatus),
  );

  // Sum total amounts of delivered orders
  const totalDeliveredAmount = deliveredOrders.reduce((sum, order) => {
    return sum + (order.totalAmount || 0);
  }, 0);
  const formattedAmount = totalDeliveredAmount.toFixed(2); // returns string "7087.80"

  useEffect(() => {
    if (!user?._id) return;

    fetchSummaries({ userId: user._id, token });
  }, [user?._id, token, fetchSummaries]);

  const statsData = [
    {
      value: summaries?.totalOrders || 0,
      label: 'Total order placed',
      icon: <FaShoppingBag className="text-3xl text-blue-500" />,
    },
    {
      value: runningOrders.length,
      label: 'Running orders',
      icon: <FaBox className="text-3xl text-yellow-500" />,
    },
    {
      value: cart?.reduce((total, item) => total + item.quantity, 0) || 0,
      label: 'Items in cart',
      icon: <FaShoppingCart className="text-3xl text-green-500" />,
    },
    {
      value: formattedAmount,
      label: 'Amount spent on delivered orders',
      icon: <FaMoneyBillWave className="text-3xl text-blue-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1  lg:grid-cols-2 gap-3 md:gap-5 p-2 py-5">
      {statsData.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white via-[#f4f4f9] to-white p-5 rounded-2xl shadow-sm flex justify-between items-center transition-all duration-200"
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
