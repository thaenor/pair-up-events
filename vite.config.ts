import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    hmr: true,
    watch: {
      usePolling: false,
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.tsx'],
    // CSS processing adds memory overhead; set to false if memory issues persist
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/*.e2e.spec.ts',
      '**/*.e2e.test.ts',
      '**/tests/e2e/**',
    ],
    // Memory optimization: limit workers in CI to prevent memory leaks
    // Use fewer workers to reduce memory consumption per process
    // Each worker with jsdom can consume 2-4GB, so limit to 2 workers in CI
    pool: 'threads',
    poolOptions: {
      threads: {
        // Limit threads in CI to prevent excessive memory usage
        // In CI, use 2 threads max; locally, use default (based on CPU cores)
        maxThreads: process.env.CI ? 2 : undefined,
        minThreads: process.env.CI ? 1 : undefined,
        // Better memory isolation between threads
        isolate: true,
      },
    },
    // Improve test isolation to prevent memory leaks
    isolate: true,
    // Reduce memory footprint by limiting test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    // Coverage disabled to reduce memory usage
    coverage: {
      enabled: false,
    },
  },
}))
