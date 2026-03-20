import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './styles/index.css'
import App from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize Google Analytics if the environment variable is provided.
// Set VITE_GA_MEASUREMENT_ID in your deployment (Netlify env vars) to enable.
// Analytics is now initialized only after user consent via the CookieConsent component.
// The CookieConsent component will call initGA(...) when the user accepts.
