import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { getWhatsAppLink } from '@/utils/brand';
import useGeneralInfoStore from '@/store/GeneralInfoStore';

const OrderByPhoneWhatsapp = ({ product, quantity = 1, price = 0 }) => {
  const { GeneralInfoList } = useGeneralInfoStore();

  const whatsappNumber = GeneralInfoList?.WhatsAppNumber?.trim();

  if (!product || !whatsappNumber) return null;

  const formatPrice = (value) =>
    isNaN(Number(value)) ? value : Number(value).toLocaleString();

  const whatsappMessage = [
    'Hello, I want to place an order (Cash on Delivery):',
    `Product: ${product.name}`,
    `Quantity: ${quantity}`,
    `Price: Tk. ${formatPrice(price)}`,
    'Payment: Cash on Delivery',
  ].join('\n');

  const whatsappLink = `${getWhatsAppLink()}?text=${encodeURIComponent(whatsappMessage)}`;
  const telLink = `tel:${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <div className=" mt-5 grid grid-cols-1 gap-2 md:gap-3">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 bg-[#28D366] hover:opacity-90 text-white font-semibold text-sm md:text-base rounded-lg px-3 py-2.5 md:py-3 transition"
      >
        <FaWhatsapp className="text-lg md:text-xl shrink-0" />
        Order on WhatsApp
      </a>

      <a
        href={telLink}
        className="flex items-center justify-center gap-2 primaryBgColor accentTextColor hover:opacity-90 font-semibold text-sm md:text-base rounded-lg px-3 py-2.5 md:py-3 transition"
      >
        <FaPhoneAlt className="text-lg md:text-xl shrink-0" />
        <span className="flex flex-col leading-tight text-center">
          <span>Call to Order</span>
          <span className="text-[11px] md:text-xs font-normal opacity-90">
            {whatsappNumber}
          </span>
        </span>
      </a>
    </div>
  );
};

export default OrderByPhoneWhatsapp;
