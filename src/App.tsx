import { useState, useEffect } from 'react'
import './App.css'
import Calculator from './components/Calculator'
import InfoSection from './components/InfoSection'
import Disclaimer from './components/Disclaimer'
import KeyLinks from './components/KeyLinks'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>🚗 Novated Lease Calculator</h1>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <p className="subtitle">Your complete guide to novated leasing in Australia</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Disclaimer />
          <Calculator />
          <InfoSection />
          <KeyLinks />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Novated Lease Calculator. For educational purposes only.</p>
          <p>Not financial advice. Consult with a qualified professional.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
