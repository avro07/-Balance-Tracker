import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensures assets are loaded relatively, critical for cPanel hosting in subdirectories
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});