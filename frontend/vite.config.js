// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
//
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5050",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//
//   build: {
//     chunkSizeWarningLimit: 1500,
//
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (!id.includes("node_modules")) return;
//
//           // ⚡ Separate big libraries first
//           if (id.includes("react-slick") || id.includes("slick-carousel"))
//             return "slick";
//           if (id.includes("quill")) return "quill-editor";
//           if (id.includes("react")) return "react-core";
//           if (id.includes("axios")) return "axios";
//           if (id.includes("dayjs")) return "dayjs";
//           if (id.includes("zustand")) return "zustand";
//           if (id.includes("react-router")) return "react-router";
//           if (id.includes("react-hook-form")) return "rh-form";
//           if (id.includes("@tanstack")) return "react-query";
//           if (id.includes("primereact")) return "primereact";
//           if (id.includes("@mui")) return "mui";
//           if (id.includes("@emotion")) return "emotion";
//           if (id.includes("@nivo")) return "nivo";
//           if (id.includes("framer-motion")) return "framer-motion";
//           if (id.includes("react-data-table")) return "data-table";
//           if (id.includes("react-share")) return "react-share";
//           if (id.includes("react-select")) return "react-select";
//           if (id.includes("exceljs")) return "exceljs";
//           if (id.includes("file-saver")) return "file-saver";
//           if (id.includes("react-icons")) return "react-icons";
//
//           // ⚡ Auto–split remaining dependencies
//           const pkg = id
//             .split("node_modules/")[1]
//             .split("/")[0]
//             .replace("@", "")
//             .replace("/", "-");
//
//           return `vendor-${pkg}`;
//         },
//       },
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    /* 🔥 Gzip + Brotli compression for smaller JS/CSS */
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),

    /* 📊 Bundle Analyzer */
    visualizer({
      filename: "dist-analysis.html",
      open: false, // set to true if you want auto-open
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    hmr: {
      overlay: true, // better error visibility
    },
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    target: "es2020", // faster, modern builds
    cssTarget: "chrome80",

    minify: "esbuild", // fastest minifier

    sourcemap: false, // set true only if debugging production

    chunkSizeWarningLimit: 1500,

    rollupOptions: {
      output: {
        // 🎯 smart vendor splitting
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react")) return "react-vendor";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("zustand")) return "zustand";
          if (id.includes("mui")) return "mui";
          if (id.includes("quill")) return "quill-editor";
          if (id.includes("@tanstack/react-query")) return "react-query";
          if (id.includes("slick-carousel")) return "slick-carousel";
          if (id.includes("exceljs")) return "exceljs";

          return "vendor";
        },

        // ⚡ preload JS/CSS intelligently
        inlineDynamicImports: false,
      },
    },

    // 🚀 Generate smaller vendor code
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
