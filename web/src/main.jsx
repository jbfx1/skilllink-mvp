import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry } from './lib/sentry'
import { analytics } from './lib/analytics'

// Initialize error tracking
initSentry()

// Initialize analytics
analytics.init()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
