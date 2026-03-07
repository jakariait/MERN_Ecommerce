import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { getDynamicRoutes } from "./src/sitemap-generator.js";

// https://vitejs/dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5050", // your backend
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
