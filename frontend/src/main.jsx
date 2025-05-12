import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "quill/dist/quill.snow.css";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
