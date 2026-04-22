/**
 * main.tsx — Application entry point.
 *
 * Mounts the React app into the #root element defined in index.html.
 * StrictMode is kept intentionally — it surfaces potential issues during
 * development by double-invoking renders, helping catch side-effect bugs early.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
