import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, 
    port: 5173,
    strictPort: true,
    allowedHosts: ['632f-113-211-214-146.ngrok-free.app'],
  }
});
