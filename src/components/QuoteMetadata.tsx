import type { QuoteData } from '../types/QuoteData'
import './QuoteMetadata.css'

interface QuoteMetadataProps {
  quoteData: QuoteData
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

function QuoteMetadata({ quoteData }: QuoteMetadataProps) {
  const metadata = quoteData.metadata

  // Don't render if there's no metadata
  if (!metadata || (
    !metadata.customerWarnings?.length &&
    !metadata.extractedTerms?.length &&
    !metadata.leaserName &&
    metadata.budgetFlexibility === undefined &&
    metadata.preTaxTopUp === undefined
  )) {
    return null
  }

  return (
    <div className="quote-metadata">
      <h3>📋 Quote Information</h3>
      
      <div className="metadata-sections">
        {/* Provider and Flexibility Info */}
        {(metadata.leaserName || metadata.budgetFlexibility || metadata.preTaxTopUp !== undefined) && (
          <div className="metadata-card">
            <h4>Provider & Flexibility</h4>
            <div className="metadata-items">
              {metadata.leaserName && (
                <div className="metadata-item">
                  <span className="item-label">Provider:</span>
                  <span className="item-value leaser-name">{metadata.leaserName}</span>
                </div>
              )}
              {metadata.budgetFlexibility && (
                <div className="metadata-item">
                  <span className="item-label">Budget Flexibility:</span>
                  <span className={`item-value flex-badge flex-${metadata.budgetFlexibility}`}>
                    {capitalize(metadata.budgetFlexibility)}
                  </span>
                </div>
              )}
              {metadata.preTaxTopUp !== undefined && (
                <div className="metadata-item">
                  <span className="item-label">Pre-Tax Top-Up:</span>
                  <span className={`item-value flex-badge ${metadata.preTaxTopUp ? 'flex-yes' : 'flex-no'}`}>
                    {metadata.preTaxTopUp ? 'Allowed ✓' : 'Not Allowed ✗'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer Warnings */}
        {metadata.customerWarnings && metadata.customerWarnings.length > 0 && (
          <div className="metadata-card warnings-card">
            <h4>⚠️ Customer Warnings</h4>
            <div className="warnings-list">
              <p className="warnings-intro">
                These are important considerations that may affect your lease:
              </p>
              <ul>
                {metadata.customerWarnings.map((warning, idx) => (
                  <li key={idx} className="warning-item">
                    <span className="warning-icon">⚠️</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Extracted Terms */}
        {metadata.extractedTerms && metadata.extractedTerms.length > 0 && (
          <div className="metadata-card terms-card">
            <h4>📋 Key Terms & Conditions</h4>
            <div className="terms-list">
              <p className="terms-intro">
                Important terms extracted from the quote:
              </p>
              <ul>
                {metadata.extractedTerms.map((term, idx) => (
                  <li key={idx} className="term-item">
                    <span className="term-bullet">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="metadata-footer">
        <p>
          💡 <strong>Tip:</strong> Always verify this information directly with the provider 
          before making any decisions. These details were extracted from the quote and may need confirmation.
        </p>
      </div>
    </div>
  )
}

export default QuoteMetadata
