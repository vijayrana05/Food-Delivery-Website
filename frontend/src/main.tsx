import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

export const authService = "http://localhost:5000";
export const restaurantService = "http://localhost:5001";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="822918619012-r1jc176velrueu1aq2q0pec5c4bvs2fu.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
