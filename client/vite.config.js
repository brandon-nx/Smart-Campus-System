import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': 'http://localhost:8080', // proxy all /api/* to backend
    },
    allowedHosts: ['8737-113-211-214-146.ngrok-free.app'],
  }
});
