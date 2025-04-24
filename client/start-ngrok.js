import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import qrcode from 'qrcode';
import os from 'os';

// Step 1: Start ngrok process
console.log('🚀 Launching ngrok...');
const ngrokProcess = exec('ngrok http 5173');

// Step 2: Wait for ngrok to become available
function waitForNgrok(maxRetries = 10, delay = 1000) {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const check = () => {
      http.get('http://localhost:4040/api/tunnels', (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const tunnels = JSON.parse(body).tunnels;
            const url = tunnels[0]?.public_url;
            if (url) return resolve(url);
            throw new Error("No tunnel yet");
          } catch {
            if (++retries < maxRetries) setTimeout(check, delay);
            else reject(new Error("ngrok tunnel not available"));
          }
        });
      }).on('error', () => {
        if (++retries < maxRetries) setTimeout(check, delay);
        else reject(new Error("ngrok API not reachable"));
      });
    };

    check();
  });
}

// Step 3: Main logic
waitForNgrok().then(async (url) => {
  const host = new URL(url).hostname;
  console.log(`🌐 ngrok URL: ${url}`);

  // Step 4: Print QR code in terminal
  console.log('\n📱 Scan this QR code to open the app:\n');
  console.log(await qrcode.toString(url, { type: 'terminal' }));

  // Step 5: Save QR as PNG and open it in browser
  qrcode.toFile('./qrcode.png', url, (err) => {
    if (err) return console.error('❌ Failed to save QR:', err);
    console.log('🖼️  QR code saved to qrcode.png');

    const openCommand =
      os.platform() === 'win32'
        ? 'start qrcode.png'
        : os.platform() === 'darwin'
        ? 'open qrcode.png'
        : 'xdg-open qrcode.png';

    exec(openCommand, (error) => {
      if (error) console.error('❌ Failed to open QR code in browser:', error.message);
      else console.log('🌐 QR code image opened in browser!');
    });
  });

  // Step 6: Update vite.config.js
  const vitePath = './vite.config.js';
  const config = fs.readFileSync(vitePath, 'utf-8');
  const updated = config.replace(
    /allowedHosts:\s*\[.*?\]/,
    `allowedHosts: ['${host}']`
  );
  fs.writeFileSync(vitePath, updated);
  console.log(`✅ Updated vite.config.js with host: ${host}`);

  // 🔁 Step 6.5: Inject ngrok URL into backend .env as CLIENT_ORIGIN
  const envPath = '../server/.env'; // Update path if server folder is elsewhere
  let envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('CLIENT_ORIGIN=')) {
    envContent = envContent.replace(/CLIENT_ORIGIN=.*/g, `CLIENT_ORIGIN=${url}`);
  } else {
    envContent += `\nCLIENT_ORIGIN=${url}`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Updated server/.env with CLIENT_ORIGIN=${url}`);

  // Step 7: Start Vite
  console.log('⚡ Starting Vite dev server...\n');
  const viteProcess = exec('npm run _vite');
  viteProcess.stdout.pipe(process.stdout);
  viteProcess.stderr.pipe(process.stderr);

}).catch((err) => {
  console.error("❌ Failed to start ngrok or update Vite config:", err.message);
});