import { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';
import useCartStore from '../../store/useCartStore.js';

const FreeDeliveryBar = () => {
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cart } = useCartStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  const cachedActive = localStorage.getItem('freeDelivery:active');

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getFreeDeliveryAmount`);
        if (res.data?.success) {
          setAmount(res.data?.data?.value);
          localStorage.setItem(
            'freeDelivery:active',
            res.data?.data?.value > 0 ? 'true' : 'false',
          );
        }
      } catch (err) {
        console.error('Failed to fetch free delivery amount:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAmount();
  }, [apiUrl]);

  if (loading && cachedActive !== 'false') {
    return (
      <div className="secondaryBgColor accentTextColor w-full h-10" aria-hidden="true" />
    );
  }
  if (!amount || amount <= 0) return null;

  const totalAmount = cart.reduce((total, item) => {
    const price =
      item.discountPrice > 0 ? item.discountPrice : item.originalPrice;
    return total + price * item.quantity;
  }, 0);

  const formatPrice = (value) => Number(value).toLocaleString();

  let message;
  if (cart.length === 0) {
    message = (
      <>
        Free delivery on orders over{' '}
        <span className="font-semibold">Tk. {formatPrice(amount)}</span>
      </>
    );
  } else if (totalAmount < amount) {
    message = (
      <>
        Your cart: Tk. {formatPrice(totalAmount)} — add{' '}
        <span className="font-semibold">
          Tk. {formatPrice(amount - totalAmount)}
        </span>{' '}
        more to get free delivery
      </>
    );
  } else {
    message = (
      <span className="font-semibold">
        Free delivery unlocked for your order
      </span>
    );
  }

  return (
    <div className="secondaryBgColor accentTextColor w-full">
      <div className="min-h-10 flex items-center justify-center gap-2 px-4 text-center text-xs font-medium sm:text-sm">
        <Truck className="size-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default FreeDeliveryBar;
