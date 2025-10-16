import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { firebaseMessagingPlugin } from "./vite-plugin-firebase-messaging.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: true,
    watch: {
      usePolling: false,
    },
  },
  plugins: [
    react(),
    firebaseMessagingPlugin(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(/%VITE_GTM_ID%/g, process.env.VITE_GTM_ID || 'GTM-PFHVCZSB');
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
}));
