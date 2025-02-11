import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'poc',
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
