
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://shopease-ecommerce-app-jv4u.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
