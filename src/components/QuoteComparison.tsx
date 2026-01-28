import type { SavedQuote } from '../types/QuoteData'
import { calculateCostBreakdown } from '../utils/calculations'
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
    breakdown: calculateCostBreakdown(quote.data)
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

  // Find best and worst values for highlighting
  const findBest = (values: number[], lowerIsBetter: boolean = true) => {
    if (values.length === 0) return null
    return lowerIsBetter ? Math.min(...values) : Math.max(...values)
  }

  const netCosts = breakdowns.map(b => b.breakdown.totalNetCost)
  const bestNetCost = findBest(netCosts)

  const taxSavings = breakdowns.map(b => b.breakdown.taxSavings)
  const bestTaxSavings = findBest(taxSavings, false)

  return (
    <div className="quote-comparison">
      <h2>Quote Comparison</h2>
      <p className="comparison-intro">
        Compare up to 3 leasing quotes side-by-side. Best values are highlighted in green.
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
              <td colSpan={validQuotes.length + 1}>Vehicle & Lease Terms</td>
            </tr>
            <tr>
              <td className="row-label">Purchase Price</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.vehicle.purchasePrice)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Lease Duration</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{quote.data.leaseTerms.durationYears} years</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Interest Rate</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatPercent(quote.data.leaseTerms.interestRate)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Annual Kilometers</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{quote.data.leaseTerms.annualKilometers.toLocaleString()} km</td>
              ))}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>Fees</td>
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
                <td key={quote.id}>{formatCurrency(quote.data.fees.monthlyAdminFee)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">End of Lease Fee</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.fees.endOfLeaseFee)}</td>
              ))}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>Annual Running Costs</td>
            </tr>
            <tr>
              <td className="row-label">Fuel/Electricity</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.fuelPerYear)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Insurance</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.insurancePerYear)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Maintenance</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.maintenancePerYear)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Registration</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.registrationPerYear)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Tyres</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.runningCosts.tyresPerYear)}</td>
              ))}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>Total Cost Breakdown</td>
            </tr>
            <tr>
              <td className="row-label">Total Gross Cost</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.totalGrossCost)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Finance Charges</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.financeCharges)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Total Running Costs</td>
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
              {breakdowns.map(({ quote, breakdown }) => {
                const isBest = breakdown.taxSavings === bestTaxSavings
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    {formatCurrency(breakdown.taxSavings)}
                  </td>
                )
              })}
            </tr>
            <tr className="highlight-row">
              <td className="row-label">GST Savings</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.gstSavings)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">Residual Value</td>
              {breakdowns.map(({ quote, breakdown }) => (
                <td key={quote.id}>{formatCurrency(breakdown.residualValue)}</td>
              ))}
            </tr>
            <tr className="total-row">
              <td className="row-label"><strong>Total Net Cost</strong></td>
              {breakdowns.map(({ quote, breakdown }) => {
                const isBest = breakdown.totalNetCost === bestNetCost
                return (
                  <td key={quote.id} className={isBest ? 'best-value' : ''}>
                    <strong>{formatCurrency(breakdown.totalNetCost)}</strong>
                  </td>
                )
              })}
            </tr>

            <tr className="section-header">
              <td colSpan={validQuotes.length + 1}>Employee Details</td>
            </tr>
            <tr>
              <td className="row-label">Annual Salary</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{formatCurrency(quote.data.employee.annualSalary)}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label">HELP Debt</td>
              {validQuotes.map(quote => (
                <td key={quote.id}>{quote.data.employee.hasHELPDebt ? 'Yes' : 'No'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {validQuotes.length > 1 && (
        <div className="comparison-summary">
          <h3>Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-label">Lowest Net Cost</div>
              <div className="summary-value">
                {formatCurrency(Math.min(...netCosts))}
              </div>
              <div className="summary-quote">
                {breakdowns.find(b => b.breakdown.totalNetCost === Math.min(...netCosts))?.quote.name}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Highest Net Cost</div>
              <div className="summary-value">
                {formatCurrency(Math.max(...netCosts))}
              </div>
              <div className="summary-quote">
                {breakdowns.find(b => b.breakdown.totalNetCost === Math.max(...netCosts))?.quote.name}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Price Difference</div>
              <div className="summary-value difference">
                {formatCurrency(Math.max(...netCosts) - Math.min(...netCosts))}
              </div>
              <div className="summary-quote">Between best and worst</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuoteComparison
