import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { env } from 'shared'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '',
  server: {
    host: env.HOST,
    port: env.GOSIPO_APP_PORT
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8888',
    //     changeOrigin: true
    //   },
    //   '/socket.io': {
    //     target: 'ws://localhost:8888',
    //     ws: true
    //   }
    // }
  }
})
