import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return assetInfo.name === "index.css"
            ? "styles.css"
            : assetInfo.name || "asset-[hash]";
        },
      },
    },
    cssCodeSplit: false,
    outDir: "dist",
    assetsDir: ".",
    emptyOutDir: true,
  },
  publicDir: "public",
  base: "",
});
