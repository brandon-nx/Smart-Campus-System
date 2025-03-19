import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows access via local IP and ngrok
    allowedHosts: ['2b66-103-211-105-202.ngrok-free.app'] // your ngrok URL here
  }
});