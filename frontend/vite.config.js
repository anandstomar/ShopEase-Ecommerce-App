
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
        target: 'http://ec2-35-154-100-109.ap-south-1.compute.amazonaws.com:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
