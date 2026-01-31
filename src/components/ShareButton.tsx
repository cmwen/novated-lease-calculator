import { useState } from 'react'
import type { QuoteData } from '../types/QuoteData'
import { generateShareUrl } from '../utils/urlSharing'
import './ShareButton.css'

interface ShareButtonProps {
  quoteData: QuoteData
}

function ShareButton({ quoteData }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const handleShare = () => {
    const url = generateShareUrl(quoteData)
    setShareUrl(url)
    setShowModal(true)
    setCopied(false)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback: Select text for manual copy
      try {
        const input = document.querySelector('.share-url-input') as HTMLInputElement
        if (input) {
          input.select()
          input.setSelectionRange(0, 99999) // For mobile devices
        }
      } catch {
        // If all else fails, user can manually copy
        console.warn('Please manually copy the URL')
      }
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setCopied(false)
  }

  return (
    <>
      <button className="share-btn" onClick={handleShare} title="Share this quote">
        🔗 Share Quote
      </button>

      {showModal && (
        <div className="share-modal-overlay" onClick={handleClose}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Your Quote</h3>
              <button className="close-btn" onClick={handleClose}>✕</button>
            </div>
            <div className="share-modal-content">
              <p className="share-description">
                Anyone with this link can view your quote configuration. 
                No personal data is sent to any server - the quote is encoded directly in the URL.
              </p>
              <div className="share-url-container">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="share-url-input"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button 
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopyToClipboard}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="share-tips">
                <h4>💡 Tips:</h4>
                <ul>
                  <li>The URL contains your entire quote configuration</li>
                  <li>Share it via email, messaging apps, or social media</li>
                  <li>Recipients can modify the quote and create their own variations</li>
                  <li>All calculations are done locally in the browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ShareButton
