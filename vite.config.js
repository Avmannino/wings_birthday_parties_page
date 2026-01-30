// vite.config.js (project root)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // ✅ IMPORTANT for GitHub Pages (repo site)
  base: "/wings_birthday_parties_page/",

  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});