import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import App from "../../App.jsx";

const MetaProvider = () => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiURl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const { data } = await axios.get(`${apiURl}/meta`);
        setMeta(data.data); // from res.data.data
      } catch (err) {
        console.error("Failed to fetch meta info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  if (loading) return null; // or a loader/spinner

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords.join(", ")} />
      </Helmet>
      <App />
    </>
  );
};

export default MetaProvider;
