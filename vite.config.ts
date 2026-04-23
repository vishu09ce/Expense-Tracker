import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite configuration — Tailwind is wired in as a Vite plugin (v4 approach, no PostCSS config needed)
export default defineConfig({
  // Base path must match the GitHub repo name exactly for GitHub Pages asset URLs to resolve
  base: '/Expense-Tracker/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
