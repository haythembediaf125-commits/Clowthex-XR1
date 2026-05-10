import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output to dist/ — Capacitor will pick it up from there
    outDir: "dist",
    // Inline small assets so the app works fully offline
    assetsInlineLimit: 10240,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["framer-motion", "lucide-react", "recharts"],
          data: ["idb", "@tanstack/react-query"],
        },
      },
    },
  },
  // Required for Capacitor: serve from root without SSR
  base: "./",
});
