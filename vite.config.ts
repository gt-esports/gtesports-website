import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // TODO: Remove this in production / Change to true in development
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  // server: {
  //
  // }
})
