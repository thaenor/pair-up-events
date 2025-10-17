import './index.css'

import { createRoot } from 'react-dom/client'

import './lib/sentry'

import App from './App.tsx'

createRoot(document.getElementById("root")!).render(<App />);
