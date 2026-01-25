import { useState } from 'react'
import './Calculator.css'

function Calculator() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(50000)
  const [annualSalary, setAnnualSalary] = useState<number>(80000)
  const [leaseTermYears, setLeaseTermYears] = useState<number>(3)
  const [annualKm, setAnnualKm] = useState<number>(15000)

  // Calculate estimated results
  const calculateResults = () => {
    // Rough estimates for demonstration
    const leasePaymentPerYear = vehiclePrice / leaseTermYears
    const runningCostsPerYear = (annualKm / 1000) * 150 // Approx $150 per 1000km
    const totalAnnualCost = leasePaymentPerYear + runningCostsPerYear
    
    // Tax savings estimate (simplified)
    const marginalTaxRate = annualSalary > 180000 ? 0.45 : 
                           annualSalary > 120000 ? 0.37 :
                           annualSalary > 90000 ? 0.325 :
                           annualSalary > 45000 ? 0.325 : 0.19
    
    const estimatedTaxSavings = totalAnnualCost * marginalTaxRate
    const netCostPerYear = totalAnnualCost - estimatedTaxSavings
    const netCostPerFortnight = netCostPerYear / 26
    
    return {
      leasePaymentPerYear,
      runningCostsPerYear,
      totalAnnualCost,
      estimatedTaxSavings,
      netCostPerYear,
      netCostPerFortnight
    }
  }

  const results = calculateResults()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="calculator-section">
      <h2>💰 Novated Lease Calculator</h2>
      <p className="calculator-intro">
        Estimate your potential savings with a novated lease. This is a simplified calculator for illustration purposes only.
      </p>

      <div className="calculator-grid">
        <div className="calculator-inputs">
          <h3>Your Details</h3>
          
          <div className="input-group">
            <label htmlFor="vehiclePrice">Vehicle Purchase Price</label>
            <input
              id="vehiclePrice"
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              min="10000"
              max="200000"
              step="1000"
            />
            <span className="input-value">{formatCurrency(vehiclePrice)}</span>
          </div>

          <div className="input-group">
            <label htmlFor="annualSalary">Annual Salary (before tax)</label>
            <input
              id="annualSalary"
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              min="40000"
              max="250000"
              step="5000"
            />
            <span className="input-value">{formatCurrency(annualSalary)}</span>
          </div>

          <div className="input-group">
            <label htmlFor="leaseTermYears">Lease Term (years)</label>
            <select
              id="leaseTermYears"
              value={leaseTermYears}
              onChange={(e) => setLeaseTermYears(Number(e.target.value))}
            >
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5 years</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="annualKm">Annual Kilometers</label>
            <input
              id="annualKm"
              type="number"
              value={annualKm}
              onChange={(e) => setAnnualKm(Number(e.target.value))}
              min="5000"
              max="40000"
              step="1000"
            />
            <span className="input-value">{annualKm.toLocaleString()} km</span>
          </div>
        </div>

        <div className="calculator-results">
          <h3>Estimated Results</h3>
          
          <div className="result-item">
            <span className="result-label">Lease Payment (per year)</span>
            <span className="result-value">{formatCurrency(results.leasePaymentPerYear)}</span>
          </div>

          <div className="result-item">
            <span className="result-label">Running Costs (estimate)</span>
            <span className="result-value">{formatCurrency(results.runningCostsPerYear)}</span>
          </div>

          <div className="result-item">
            <span className="result-label">Total Annual Cost</span>
            <span className="result-value">{formatCurrency(results.totalAnnualCost)}</span>
          </div>

          <div className="result-item highlight">
            <span className="result-label">Estimated Tax Savings</span>
            <span className="result-value savings">{formatCurrency(results.estimatedTaxSavings)}</span>
          </div>

          <div className="result-item highlight">
            <span className="result-label">Net Cost (per year)</span>
            <span className="result-value">{formatCurrency(results.netCostPerYear)}</span>
          </div>

          <div className="result-item highlight primary">
            <span className="result-label">Cost Per Fortnight</span>
            <span className="result-value large">{formatCurrency(results.netCostPerFortnight)}</span>
          </div>

          <p className="result-note">
            <small>
              * This is a simplified estimate. Actual savings depend on many factors including FBT, 
              your specific tax situation, vehicle type, and running costs.
            </small>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Calculator
