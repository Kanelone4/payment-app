import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, 
    strictPort: true, 
    open: true, 
    cors: true, 
    allowedHosts: ["a440-154-66-135-180.ngrok-free.app"], 
    proxy: {
      '/api': 'https://rightcomsaasapiv2.onrender.com'
    }
  },
});
