import { useState, useEffect } from 'react'
import type { SavedQuote, QuoteData } from '../types/QuoteData'
import { getSavedQuotes, saveQuote, deleteQuote } from '../utils/quoteStorage'
import QuoteComparison from './QuoteComparison'
import './QuoteManager.css'

interface QuoteManagerProps {
  currentQuote: QuoteData
  onLoadQuote: (quote: QuoteData) => void
}

function QuoteManager({ currentQuote, onLoadQuote }: QuoteManagerProps) {
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [quoteName, setQuoteName] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'compare'>('list')

  useEffect(() => {
    loadSavedQuotes()
  }, [])

  const loadSavedQuotes = () => {
    const quotes = getSavedQuotes()
    setSavedQuotes(quotes)
  }

  const handleSaveQuote = () => {
    if (!quoteName.trim()) {
      setSaveError('Please enter a name for this quote')
      return
    }

    try {
      saveQuote(quoteName.trim(), currentQuote, quoteNotes.trim() || undefined)
      setShowSaveDialog(false)
      setQuoteName('')
      setQuoteNotes('')
      setSaveError(null)
      loadSavedQuotes()
    } catch (error) {
      setSaveError('Failed to save quote. Please try again.')
    }
  }

  const handleDeleteQuote = (id: string) => {
    if (confirm('Are you sure you want to delete this quote?')) {
      deleteQuote(id)
      loadSavedQuotes()
      setSelectedQuotes(prev => prev.filter(qid => qid !== id))
    }
  }

  const handleSelectQuote = (id: string) => {
    setSelectedQuotes(prev => {
      if (prev.includes(id)) {
        return prev.filter(qid => qid !== id)
      } else if (prev.length < 3) {
        return [...prev, id]
      } else {
        // Replace the oldest selection
        return [...prev.slice(1), id]
      }
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getComparisonQuotes = () => {
    return selectedQuotes.map(id => savedQuotes.find(q => q.id === id) || null)
  }

  return (
    <div className="quote-manager">
      <div className="manager-header">
        <div>
          <h2>Quote Manager</h2>
          <p className="manager-intro">
            Save, compare, and manage your novated lease quotes
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowSaveDialog(true)}
        >
          Save Current Quote
        </button>
      </div>

      {showSaveDialog && (
        <div className="save-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Save Current Quote</h3>
            <div className="dialog-content">
              <div className="form-field">
                <label htmlFor="quote-name">Quote Name *</label>
                <input
                  id="quote-name"
                  type="text"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="e.g., Toyota RAV4 - Dealer A"
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label htmlFor="quote-notes">Notes (optional)</label>
                <textarea
                  id="quote-notes"
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Add any notes about this quote..."
                  rows={3}
                />
              </div>
              {saveError && <div className="error-message">{saveError}</div>}
            </div>
            <div className="dialog-actions">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowSaveDialog(false)
                  setQuoteName('')
                  setQuoteNotes('')
                  setSaveError(null)
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveQuote}
              >
                Save Quote
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="view-mode-toggle">
        <button 
          className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'compare' ? 'active' : ''}`}
          onClick={() => setViewMode('compare')}
          disabled={selectedQuotes.length === 0}
        >
          Compare View ({selectedQuotes.length}/3)
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="quotes-list">
          {savedQuotes.length === 0 ? (
            <div className="empty-state">
              <h3>No Saved Quotes</h3>
              <p>Save your first quote to start comparing different lease options.</p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <p>Select up to 3 quotes to compare side-by-side</p>
              </div>
              <div className="quotes-grid">
                {savedQuotes.map(quote => {
                  const isSelected = selectedQuotes.includes(quote.id)
                  return (
                    <div 
                      key={quote.id} 
                      className={`quote-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="quote-card-header">
                        <div className="quote-card-title">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectQuote(quote.id)}
                            disabled={!isSelected && selectedQuotes.length >= 3}
                          />
                          <h3>{quote.name}</h3>
                        </div>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteQuote(quote.id)}
                          title="Delete quote"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="quote-card-details">
                        <div className="detail-row">
                          <span className="detail-label">Vehicle:</span>
                          <span className="detail-value">
                            {quote.data.vehicle.year} {quote.data.vehicle.make} {quote.data.vehicle.model}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">
                            {formatCurrency(quote.data.vehicle.purchasePrice)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Term:</span>
                          <span className="detail-value">
                            {quote.data.leaseTerms.durationYears} years @ {(quote.data.leaseTerms.interestRate * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Salary:</span>
                          <span className="detail-value">
                            {formatCurrency(quote.data.employee.annualSalary)}
                          </span>
                        </div>
                        {quote.notes && (
                          <div className="quote-notes">
                            <span className="detail-label">Notes:</span>
                            <p>{quote.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="quote-card-footer">
                        <span className="saved-date">
                          Saved: {formatDate(quote.savedAt)}
                        </span>
                        <button
                          className="btn-secondary btn-small"
                          onClick={() => onLoadQuote(quote.data)}
                        >
                          Load Quote
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <QuoteComparison quotes={getComparisonQuotes()} />
      )}
    </div>
  )
}

export default QuoteManager
