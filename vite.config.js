import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/tax-map_final_frontend/",
  plugins: [react()],
  server: {
    port: 3000,
  },
});
