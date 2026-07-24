import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/-school-life/",
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
