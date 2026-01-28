import type { SavedQuote } from '../types/QuoteData'
import { calculateCostBreakdown, validateQuoteValues } from '../utils/calculations'
import './QuoteComparison.css'

interface QuoteComparisonProps {
  quotes: (SavedQuote | null)[]
}

function QuoteComparison({ quotes }: QuoteComparisonProps) {
  const validQuotes = quotes.filter((q): q is SavedQuote => q !== null)

  if (validQuotes.length === 0) {
    return (
      <div className="quote-comparison">
        <div className="comparison-empty">
          <h3>No Quotes Selected</h3>
          <p>Select up to 3 quotes from your saved quotes to compare them side-by-side.</p>
        </div>
      </div>
    )
  }

  const breakdowns = validQuotes.map(quote => ({
    quote,
    breakdown: calculateCostBreakdown(quote.data),
    validation: validateQuoteValues(quote.data)
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const formatFortnightly = (annualCost: number) => {
    return formatCurrency(annualCost / 26)
  }

  // Find best and worst values for highlighting
  const findBest = (values: number[], lowerIsBetter: boolean = true) => {
    if (values.length === 0) return null
    return lowerIsBetter ? Math.min(...values) : Math.max(...values)
  }

  const netCosts = breakdowns.map(b => b.breakdown.totalNetCost)
  const bestNetCost = findBest(netCosts)

  const vehiclePrices = breakdowns.map(b => b.breakdown.vehiclePrice)
  const bestVehiclePrice = findBest(vehiclePrices)

  const financeCharges = breakdowns.map(b => b.breakdown.financeCharges)
  const bestFinanceCharges = findBest(financeCharges)

  const totalFees = breakdowns.map(b => b.breakdown.establishmentFee + b.breakdown.adminFees + b.breakdown.endOfLeaseFee)
  const bestTotalFees = findBest(totalFees)

  const residualValues = breakdowns.map(b => b.breakdown.residualValue)
  const bestResidualValue = findBest(residualValues, false) // Higher is better

  const interestRates = validQuotes.map(q => q.data.leaseTerms.interestRate)
  const bestInterestRate = findBest(interestRates)

  return (
    <div className="quote-comparison">
      <h2>Quote Comparison</h2>
      <p className="comparison-intro">
        Compare up to 3 leasing quotes side-by-side focusing on what matters most: total cost, payments, and fees. Best values are highlighted in green.
      </p>

      <div className="comparison-table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="row-header">Metric</th>
              {validQuotes.map(quote => (
                <th key={quote.id} className="quote-header">
                  <div className="quote-name">{quote.name}</div>
                  <div className="quote-vehicle">
                    {quote.data.vehicle.year} {quote.data.vehicle.make} {quote.data.vehicle.model}
                  </div>
                  <div className="quote-date">
                    Saved: {new Date(quote.savedAt).toLocaleDateString()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>💰 KEY COSTS - What You Really Pay</td>
            </tr>
            <tr className="total-row">
              <td className="row-label"><strong>Total Net Cost (incl. Residual)</strong></td>
              {breakdowns.map(({ quote, breakdown }) => {
                const isBest = breakdown.totalNetCost === bestNetCost
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    <strong>{formatCurrency(breakdown.totalNetCost)}</strong>
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="row-label">Fortnightly Cost (Before Residual)</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>
                  {formatFortnightly((breakdown.netCostBeforeResidual / quote.data.leaseTerms.durationYears))}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Vehicle Purchase Price</td>
              {breakdowns.map(({ quote, breakdown }) => {
                const isBest = breakdown.vehiclePrice === bestVehiclePrice
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    {formatCurrency(breakdown.vehiclePrice)}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="row-label">Residual/Balloon Payment</td>
              {breakdowns.map(({ quote, breakdown }) => {
                const isBest = breakdown.residualValue === bestResidualValue
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    {formatCurrency(breakdown.residualValue)}
                  </td>
                )
              })}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>🔍 Interest & Fees - Hidden Costs Revealed</td>
            </tr>
            <tr>
              <td className="row-label">Interest Rate</td>
              {validQuotes.map(quote => {
                const isBest = quote.data.leaseTerms.interestRate === bestInterestRate
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    {formatPercent(quote.data.leaseTerms.interestRate)}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="row-label">Total Interest Charges</td>
              {breakdowns.map(({ quote, breakdown }) => {
                const isBest = breakdown.financeCharges === bestFinanceCharges
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    {formatCurrency(breakdown.financeCharges)}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="row-label">Establishment Fee</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.fees.establishmentFee)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Monthly Admin Fee</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.fees.monthlyAdminFee)}/month</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Total Admin Fees (All Months)</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.adminFees)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">End of Lease Fee</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.fees.endOfLeaseFee)}</td>
              ))}
            </tr>
            <tr className="highlight-row">
              <td className="row-label"><strong>Total Fees</strong></td>
              {breakdowns.map(({ quote, breakdown }) => {
                const totalFees = breakdown.establishmentFee + breakdown.adminFees + breakdown.endOfLeaseFee
                const isBest = totalFees === bestTotalFees
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    <strong>{formatCurrency(totalFees)}</strong>
                  </td>
                )
              })}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>📊 Payment Breakdown</td>
            </tr>
            <tr>
              <td className="row-label">Total Gross Cost</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.totalGrossCost)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Total Running Costs ({validQuotes[0]?.data.leaseTerms.durationYears} years)</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.runningCosts)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">FBT Cost</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.fbtCost)}</td>
              ))}
            </tr>
            <tr className="highlight-row">
              <td className="row-label">Tax Savings</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id} className="positive-value">
                  -{formatCurrency(breakdown.taxSavings)}
                </td>
              ))}
            </tr>
            <tr className="highlight-row">
              <td className="row-label">GST Savings</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id} className="positive-value">
                  -{formatCurrency(breakdown.gstSavings)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Net Cost (Before Residual)</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.netCostBeforeResidual)}</td>
              ))}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>🚗 Vehicle & Lease Details</td>
            </tr>
            <tr>
              <td className="row-label">Lease Duration</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{quote.data.leaseTerms.durationYears} years</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Annual Kilometers</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{quote.data.leaseTerms.annualKilometers.toLocaleString()} km</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Annual Fuel/Electricity</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.fuelPerYear)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Annual Insurance</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.insurancePerYear)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Annual Maintenance</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.maintenancePerYear)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {validQuotes.length > 1 && (
        <div className="comparison-summary">
          <h3>Quick Summary</h3>
          <div className="summary-cards">
            <div className="summary-card best">
              <div className="summary-label">Best Deal (Lowest Total Cost)</div>
              <div className="summary-value">
                {formatCurrency(Math.min(...netCosts))}
              </div>
              <div className="summary-quote">
                {breakdowns.find(b => b.breakdown.totalNetCost === Math.min(...netCosts))?.quote.name}
              </div>
            </div>
            <div className="summary-card worst">
              <div className="summary-label">Highest Cost</div>
              <div className="summary-value">
                {formatCurrency(Math.max(...netCosts))}
              </div>
              <div className="summary-quote">
                {breakdowns.find(b => b.breakdown.totalNetCost === Math.max(...netCosts))?.quote.name}
              </div>
            </div>
            <div className="summary-card difference">
              <div className="summary-label">You Could Save</div>
              <div className="summary-value">
                {formatCurrency(Math.max(...netCosts) - Math.min(...netCosts))}
              </div>
              <div className="summary-quote">By choosing the best option</div>
            </div>
          </div>
          
          <div className="cost-insights">
            <h4>💡 Key Insights:</h4>
            <ul>
              <li><strong>Interest rates</strong> range from {formatPercent(Math.min(...interestRates))} to {formatPercent(Math.max(...interestRates))}</li>
              <li><strong>Total fees</strong> vary by {formatCurrency(Math.max(...totalFees) - Math.min(...totalFees))}</li>
              <li><strong>Finance charges</strong> differ by {formatCurrency(Math.max(...financeCharges) - Math.min(...financeCharges))}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Quote Validation - Show discrepancies between quote claims and calculations */}
      {breakdowns.some(b => b.validation.discrepancies.length > 0) && (
        <div className="quote-validation-section">
          <h3>⚠️ Quote Validation - Claims vs Our Calculations</h3>
          <p className="validation-intro">
            When quotes provide their own numbers, we compare them with our independent calculations to help you spot potential issues.
          </p>

          {breakdowns.map(({ quote, validation }) => {
            if (validation.discrepancies.length === 0) return null

            const assessmentColors = {
              'accurate': 'assessment-good',
              'minor_differences': 'assessment-ok',
              'significant_differences': 'assessment-warning',
              'major_concerns': 'assessment-danger'
            }

            const assessmentLabels = {
              'accurate': '✓ Accurate',
              'minor_differences': '⚠️ Minor Differences',
              'significant_differences': '⚠️ Significant Differences',
              'major_concerns': '❌ Major Concerns'
            }

            return (
              <div key={quote.id} className="validation-card">
                <div className="validation-header">
                  <h4>{quote.name}</h4>
                  <span className={`assessment-badge ${assessmentColors[validation.overallAssessment]}`}>
                    {assessmentLabels[validation.overallAssessment]}
                  </span>
                </div>

                <div className="discrepancies-table-container">
                  <table className="discrepancies-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quote Claims</th>
                        <th>Our Calculation</th>
                        <th>Difference</th>
                        <th>Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validation.discrepancies.map((disc, idx) => (
                        <tr key={idx} className={disc.isSignificant ? 'significant-discrepancy' : ''}>
                          <td className="field-label">
                            {disc.label}
                            {disc.isSignificant && <span className="warning-icon"> ⚠️</span>}
                          </td>
                          <td className="quote-value">{formatCurrency(disc.quoteValue)}</td>
                          <td className="calculated-value">{formatCurrency(disc.calculatedValue)}</td>
                          <td className={`difference ${disc.difference > 0 ? 'higher' : 'lower'}`}>
                            {disc.difference > 0 ? '+' : ''}{formatCurrency(disc.difference)}
                            <span className="percent-diff"> ({disc.percentageDiff > 0 ? '+' : ''}{disc.percentageDiff.toFixed(1)}%)</span>
                          </td>
                          <td className="explanation">
                            {disc.explanation || 'Values are very close - likely accurate.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {validation.hasSignificantIssues && (
                  <div className="validation-warning">
                    <strong>⚠️ Action Required:</strong> This quote has significant discrepancies. 
                    Contact the provider to clarify these differences before making a decision.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default QuoteComparison
