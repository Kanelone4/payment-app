import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    server :{
      host: '0.0.0.0',
      port: 5173,
     allowedHosts: ['929d-154-66-135-180.ngrok-free.app'],
    },
   
})
