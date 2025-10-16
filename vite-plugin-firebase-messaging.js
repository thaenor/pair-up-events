import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function firebaseMessagingPlugin() {
  return {
    name: 'firebase-messaging-sw',
    generateBundle() {
      // Read the Firebase messaging service worker template
      const swPath = resolve(__dirname, 'public/firebase-messaging-sw.js');
      let swContent = readFileSync(swPath, 'utf8');
      
      // Replace placeholder values with environment variables
      const replacements = {
        'YOUR_API_KEY': process.env.VITE_FIREBASE_API_KEY || '',
        'YOUR_AUTH_DOMAIN': process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        'YOUR_PROJECT_ID': process.env.VITE_FIREBASE_PROJECT_ID || '',
        'YOUR_APP_ID': process.env.VITE_FIREBASE_APP_ID || '',
        'YOUR_STORAGE_BUCKET': process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        'YOUR_MESSAGING_SENDER_ID': process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      };
      
      Object.entries(replacements).forEach(([placeholder, value]) => {
        swContent = swContent.replace(new RegExp(placeholder, 'g'), value);
      });
      
      // Write the configured service worker to the dist folder
      this.emitFile({
        type: 'asset',
        fileName: 'firebase-messaging-sw.js',
        source: swContent
      });
    }
  };
}
