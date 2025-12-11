import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Force dev server restart by updating config
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@supabase/supabase-js'],
    force: true,
  },
  resolve: {
    dedupe: ['@supabase/supabase-js'],
  },
  server: {
    force: true,
  },
});
