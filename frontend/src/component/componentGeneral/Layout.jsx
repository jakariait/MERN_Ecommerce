import Headers from './Headers.jsx';
import Footer from './Footer.jsx';
import MarqueeModern from './MarqueeModern.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MarqueeModern />
      <Headers />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
