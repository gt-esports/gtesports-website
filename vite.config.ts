import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { validateBuildConfiguration } from './src/lib/publicConfig'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') validateBuildConfiguration(loadEnv(mode, process.cwd(), 'VITE_'))
  return {
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
  }
})
