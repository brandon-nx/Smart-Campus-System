import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import qrcode from 'qrcode';

// Step 1: Start ngrok in background
const ngrokProcess = exec('ngrok http 5173');

// Step 2: Wait and fetch the public URL
setTimeout(() => {
  http.get('http://localhost:4040/api/tunnels', (res) => {
    let body = '';

    res.on('data', (chunk) => (body += chunk));
    res.on('end', async () => {
      try {
        const tunnels = JSON.parse(body).tunnels;
        const url = tunnels[0]?.public_url;
        if (!url) throw new Error("No tunnel found.");

        const host = new URL(url).hostname;
        console.log(`🌐 ngrok URL: ${url}`);

        // Step 3: Show QR code in terminal
        console.log('\n📱 Scan this QR code to open the app:\n');
        console.log(await qrcode.toString(url, { type: 'terminal' }));

        // Step 4: Save QR code as PNG (optional)
        qrcode.toFile('./qrcode.png', url, () => {
          console.log('🖼️  QR code saved to qrcode.png\n');
        });

        // Step 5: Update vite.config.js
        const vitePath = './vite.config.js';
        let config = fs.readFileSync(vitePath, 'utf-8');

        const updated = config.replace(
          /allowedHosts:\s*\[.*?\]/,
          `allowedHosts: ['${host}']`
        );

        fs.writeFileSync(vitePath, updated);
        console.log(`✅ Updated vite.config.js with host: ${host}`);
      } catch (err) {
        console.error("❌ Failed to update vite.config.js or generate QR:", err.message);
      }
    });
  }).on('error', (err) => {
    console.error("❌ Error accessing ngrok API:", err.message);
  });
}, 3000);
