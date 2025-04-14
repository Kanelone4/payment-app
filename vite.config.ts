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
    allowedHosts: ["7ee0-41-79-219-71.ngrok-free.app"], 
    proxy: {
      '/api': 'https://rightcomsaasapi-if7l.onrender.com'
    }
  },
});
