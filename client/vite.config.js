import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allows access via local IP and ngrok
    allowedHosts: ["2b66-103-211-105-202.ngrok-free.app"], // your ngrok URL here
  },
});
