import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/VALOWISH/',
  build: { target: 'es2020', outDir: 'dist', sourcemap: false },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
