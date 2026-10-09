import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { powerApps } from '@microsoft/power-apps-vite/plugin';

// UI-only mode can run before the user authenticates or initializes Power Apps.
export default defineConfig({
  base: './',
  plugins: [react(), ...(process.env.POWER_APPS_UI_ONLY === '1' ? [] : [powerApps()])],
  server: { host: '127.0.0.1', port: 5173, strictPort: true }
});
