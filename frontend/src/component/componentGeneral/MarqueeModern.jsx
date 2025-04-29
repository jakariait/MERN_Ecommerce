import React from "react";

const MarqueeModern = () => {
  const messages = [
    "🔥 50% OFF Sale!",
    "🚚 Free Shipping on orders over $50",
    "🧥 New Arrivals Just Dropped",
    "💳 Secure Checkout Guaranteed",
  ];

  return (
    <div className="w-full overflow-hidden secondaryBgColor py-3">
      <div className="flex gap-12 whitespace-nowrap marquee-track text-white text-sm sm:text-base font-medium">
        {messages.map((msg, index) => (
          <span key={index}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeModern;
