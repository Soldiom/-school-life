import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/-school-life/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeManifestIcons: false,
      manifest: {
        id: "./",
        name: "School Life | الحياة المدرسية",
        short_name: "School Life",
        description: "A bilingual English and Arabic learning world for preschool, school, and university learners.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "any",
        background_color: "#f8f6fc",
        theme_color: "#19113f",
        categories: ["education", "games", "kids"],
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,png,svg,webp}"],
        navigateFallback: "index.html",
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});
