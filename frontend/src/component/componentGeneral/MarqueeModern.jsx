import { useEffect, useState } from 'react';
import axios from 'axios';

const MarqueeModern = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Persisted cache so the header layout is identical from the very first paint
  // of any visited page (no bar popping in/out as data resolves).
  const cachedActive = localStorage.getItem('marquee:active');

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await axios.get(`${apiUrl}/marquee`);
        const active =
          res.data.isActive && Array.isArray(res.data.messages)
            ? res.data.messages
            : [];
        setMessages(active);
        localStorage.setItem(
          'marquee:active',
          active.length > 0 ? 'true' : 'false',
        );
      } catch (err) {
        console.error('Failed to load marquee messages:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarquee();
  }, []);

  if (loading && cachedActive !== 'false') {
    return <div className="secondaryBgColor w-full h-12" aria-hidden="true" />;
  }
  if (messages.length === 0) return null;

  return (
    <div className="w-full overflow-hidden secondaryBgColor h-12 flex items-center">
      <div className="marquee-track flex gap-12 whitespace-nowrap text-white text-sm sm:text-base font-medium animate-marquee">
        {[...messages, ...messages].map((msg, index) => (
          <span key={index}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeModern;
