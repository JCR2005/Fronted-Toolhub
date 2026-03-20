import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './styles/index.css'
import App from './app/App'
import { initGA } from './lib/analytics'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize Google Analytics if the environment variable is provided.
// Set VITE_GA_MEASUREMENT_ID in your deployment (Netlify env vars) to enable.
initGA(import.meta.env.VITE_GA_MEASUREMENT_ID)
