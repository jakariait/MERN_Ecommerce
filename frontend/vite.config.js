import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs/dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5050",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom") || id.includes("scheduler")) {
                return "vendor-dom";
              }
              if (
                id.includes("node_modules/react/") ||
                id.includes("node_modules/react-is")
              ) {
                return "vendor-react";
              }
              if (id.includes("react-router-dom")) {
                return "vendor-router";
              }
              if (
                id.includes("@mui/") ||
                id.includes("@emotion/")
              ) {
                return "vendor-mui";
              }
              if (id.includes("@nivo/")) {
                return "vendor-charts";
              }
              if (id.includes("quill")) {
                return "vendor-quill";
              }
              if (
                id.includes("slick-carousel") ||
                id.includes("react-slick")
              ) {
                return "vendor-carousel";
              }
              if (id.includes("react-data-table-component")) {
                return "vendor-table";
              }
              if (id.includes("primereact")) {
                return "vendor-prime";
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
  };
});
