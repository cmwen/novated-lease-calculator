import type { SavedQuote, QuoteData } from '../types/QuoteData'

const STORAGE_KEY = 'novated_lease_saved_quotes'

export function getSavedQuotes(): SavedQuote[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load saved quotes:', error)
    return []
  }
}

export function saveQuote(name: string, data: QuoteData, notes?: string): SavedQuote {
  const quotes = getSavedQuotes()
  
  const newQuote: SavedQuote = {
    id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    data,
    savedAt: new Date().toISOString(),
    notes
  }
  
  quotes.push(newQuote)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
  
  return newQuote
}

export function updateQuote(id: string, updates: Partial<Omit<SavedQuote, 'id' | 'savedAt'>>): boolean {
  try {
    const quotes = getSavedQuotes()
    const index = quotes.findIndex(q => q.id === id)
    
    if (index === -1) return false
    
    quotes[index] = {
      ...quotes[index],
      ...updates
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
    return true
  } catch (error) {
    console.error('Failed to update quote:', error)
    return false
  }
}

export function deleteQuote(id: string): boolean {
  try {
    const quotes = getSavedQuotes()
    const filtered = quotes.filter(q => q.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Failed to delete quote:', error)
    return false
  }
}

export function getQuoteById(id: string): SavedQuote | null {
  const quotes = getSavedQuotes()
  return quotes.find(q => q.id === id) || null
}
