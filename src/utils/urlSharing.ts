import type { QuoteData } from '../types/QuoteData'

/**
 * Encodes QuoteData to a URL-safe base64 string
 */
export function encodeQuoteToUrl(quoteData: QuoteData): string {
  try {
    const jsonString = JSON.stringify(quoteData)
    const base64 = btoa(jsonString)
    // Make it URL safe by replacing characters
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch (error) {
    console.error('Error encoding quote to URL:', error)
    throw new Error('Failed to encode quote data')
  }
}

/**
 * Decodes a URL-safe base64 string back to QuoteData
 */
export function decodeQuoteFromUrl(encodedData: string): QuoteData | null {
  try {
    // Restore base64 characters
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/')
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '='
    }
    const jsonString = atob(base64)
    return JSON.parse(jsonString) as QuoteData
  } catch (error) {
    console.error('Error decoding quote from URL:', error)
    return null
  }
}

/**
 * Generates a shareable URL for the current quote
 */
export function generateShareUrl(quoteData: QuoteData): string {
  const encodedData = encodeQuoteToUrl(quoteData)
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}?quote=${encodedData}`
}

/**
 * Extracts quote data from URL parameters
 */
export function getQuoteFromUrl(): QuoteData | null {
  const params = new URLSearchParams(window.location.search)
  const encodedQuote = params.get('quote')
  
  if (!encodedQuote) {
    return null
  }
  
  return decodeQuoteFromUrl(encodedQuote)
}

/**
 * Clears the quote parameter from the URL without reloading
 */
export function clearQuoteFromUrl(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('quote')
  window.history.replaceState({}, '', url.toString())
}
