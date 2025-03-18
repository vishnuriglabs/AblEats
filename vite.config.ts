import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip warnings about pure annotations in react-helmet-async
        if (warning.message.includes('contains an annotation that Rollup cannot interpret')) {
          return;
        }
        warn(warning);
      },
    },
  },
});
