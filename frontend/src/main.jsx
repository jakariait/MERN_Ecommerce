import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "quill/dist/quill.snow.css";
import "react-loading-skeleton/dist/skeleton.css";
import MetaProvider from "../src/component/componentGeneral/MetaProvider.jsx";

import ReactGA from "react-ga4";

ReactGA.initialize("G-GVD1LV60K0"); // Replace with your GA4 Measurement ID
ReactGA.send("pageview");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MetaProvider />
  </StrictMode>
);
