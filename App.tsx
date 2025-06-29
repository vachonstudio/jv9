'use client'

import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AppContent } from './components/AppContent'

// This is a simplified version for development or fallback use
// The main Next.js app runs through app/page.tsx
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}