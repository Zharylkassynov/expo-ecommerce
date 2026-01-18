import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ClerkProvider} from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error(
        'Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. ' +
        'Please create a .env file in the admin directory with VITE_CLERK_PUBLISHABLE_KEY=your_key. ' +
        'See .env.example for reference.'
    )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
      </ClerkProvider>
  </StrictMode>,
)
