import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  define: {
    VITE_HOST: process.env.VITE_HOST,
    VITE_ADMIN_PASSWORD: process.env.VITE_ADMIN_PASSWORD,
  }
})
