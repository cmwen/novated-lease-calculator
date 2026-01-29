import type { QuoteData, CostBreakdown } from '../types/QuoteData'
import './CostStructureBreakdown.css'

interface CostStructureBreakdownProps {
  quote: QuoteData
  breakdown: CostBreakdown
}

interface TooltipProps {
  text: string
  children: React.ReactNode
}

function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="tooltip-container">
      {children}
      <span className="tooltip-icon" title={text}>ℹ️</span>
      <span className="tooltip-text">{text}</span>
    </span>
  )
}

function CostStructureBreakdown({ quote, breakdown }: CostStructureBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Calculate categorized costs
  const purchaseCosts = {
    vehiclePrice: breakdown.vehiclePrice,
    financeCharges: breakdown.financeCharges,
    total: breakdown.vehiclePrice + breakdown.financeCharges
  }

  const leaserFees = {
    establishmentFee: breakdown.establishmentFee,
    adminFees: breakdown.adminFees,
    endOfLeaseFee: breakdown.endOfLeaseFee,
    total: breakdown.establishmentFee + breakdown.adminFees + breakdown.endOfLeaseFee
  }

  const reimbursableRunningCosts = {
    fuel: quote.runningCosts.fuelPerYear * quote.leaseTerms.durationYears,
    insurance: quote.runningCosts.insurancePerYear * quote.leaseTerms.durationYears,
    maintenance: quote.runningCosts.maintenancePerYear * quote.leaseTerms.durationYears,
    registration: quote.runningCosts.registrationPerYear * quote.leaseTerms.durationYears,
    tyres: quote.runningCosts.tyresPerYear * quote.leaseTerms.durationYears,
    total: breakdown.runningCosts
  }

  const nonReimbursableCosts = {
    fbtCost: breakdown.fbtCost,
    total: breakdown.fbtCost
  }

  return (
    <div className="cost-structure-breakdown">
      <h3>📊 Cost Structure Breakdown</h3>
      <p className="breakdown-intro">
        Understanding where your money goes: Purchase costs, leaser fees, and reimbursable running costs.
      </p>

      <div className="cost-categories">
        {/* PURCHASE COSTS */}
        <div className="cost-category purchase-costs">
          <div className="category-header">
            <h4>🚗 Purchase Costs</h4>
            <Tooltip text="The cost of acquiring and financing the vehicle. This is the base amount you're borrowing.">
              <span className="category-total">{formatCurrency(purchaseCosts.total)}</span>
            </Tooltip>
          </div>
          <div className="category-items">
            <div className="cost-item">
              <Tooltip text="The drive-away price of the vehicle including GST. This is what you would pay if buying outright.">
                <span className="item-label">Vehicle Purchase Price</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(purchaseCosts.vehiclePrice)}</span>
            </div>
            <div className="cost-item">
              <Tooltip text={`Finance charges over ${quote.leaseTerms.durationYears} years at ${(quote.leaseTerms.interestRate * 100).toFixed(2)}% interest. Formula: Total payments minus principal (excluding residual).`}>
                <span className="item-label">Finance Charges (Interest)</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(purchaseCosts.financeCharges)}</span>
            </div>
          </div>
        </div>

        {/* LEASER FEES */}
        <div className="cost-category leaser-fees">
          <div className="category-header">
            <h4>💼 Leaser Fees</h4>
            <Tooltip text="Fees charged by the leasing company for administration and management. These are non-reimbursable overhead costs.">
              <span className="category-total">{formatCurrency(leaserFees.total)}</span>
            </Tooltip>
          </div>
          <div className="category-items">
            <div className="cost-item">
              <Tooltip text="One-time fee charged when setting up the lease. Covers documentation and application processing.">
                <span className="item-label">Establishment Fee</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(leaserFees.establishmentFee)}</span>
            </div>
            <div className="cost-item">
              <Tooltip text={`Monthly fee of ${formatCurrency(quote.fees.monthlyAdminFee)}/month × ${quote.leaseTerms.durationYears * 12} months for account management and administration.`}>
                <span className="item-label">Admin Fees (Total)</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(leaserFees.adminFees)}</span>
            </div>
            <div className="cost-item">
              <Tooltip text="Fee charged when the lease ends, regardless of what you do with the vehicle (purchase, return, or trade-in).">
                <span className="item-label">End of Lease Fee</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(leaserFees.endOfLeaseFee)}</span>
            </div>
          </div>
        </div>

        {/* REIMBURSABLE RUNNING COSTS */}
        <div className="cost-category reimbursable-costs">
          <div className="category-header">
            <h4>⛽ Reimbursable Running Costs</h4>
            <Tooltip text="These costs are paid from your pre-tax salary, providing tax savings. You would pay these anyway if you owned the vehicle outright.">
              <span className="category-total">{formatCurrency(reimbursableRunningCosts.total)}</span>
            </Tooltip>
          </div>
          <div className="category-items">
            <div className="cost-item highlight-reimbursable">
              <Tooltip text={`Annual fuel/electricity cost of ${formatCurrency(quote.runningCosts.fuelPerYear)} × ${quote.leaseTerms.durationYears} years. Paid from pre-tax salary, reducing your taxable income.`}>
                <span className="item-label">Fuel/Electricity</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(reimbursableRunningCosts.fuel)}</span>
            </div>
            <div className="cost-item highlight-reimbursable">
              <Tooltip text={`Annual insurance premium of ${formatCurrency(quote.runningCosts.insurancePerYear)} × ${quote.leaseTerms.durationYears} years. Compare with market rates to ensure no markup.`}>
                <span className="item-label">Insurance</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(reimbursableRunningCosts.insurance)}</span>
            </div>
            <div className="cost-item highlight-reimbursable">
              <Tooltip text={`Annual maintenance/servicing of ${formatCurrency(quote.runningCosts.maintenancePerYear)} × ${quote.leaseTerms.durationYears} years. Check if this is a reasonable market rate.`}>
                <span className="item-label">Maintenance</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(reimbursableRunningCosts.maintenance)}</span>
            </div>
            <div className="cost-item highlight-reimbursable">
              <Tooltip text={`Annual registration/CTP of ${formatCurrency(quote.runningCosts.registrationPerYear)} × ${quote.leaseTerms.durationYears} years. Required government charges.`}>
                <span className="item-label">Registration/CTP</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(reimbursableRunningCosts.registration)}</span>
            </div>
            <div className="cost-item highlight-reimbursable">
              <Tooltip text={`Annual tyre replacement of ${formatCurrency(quote.runningCosts.tyresPerYear)} × ${quote.leaseTerms.durationYears} years. May include one or two sets depending on usage.`}>
                <span className="item-label">Tyres</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(reimbursableRunningCosts.tyres)}</span>
            </div>
          </div>
          <div className="reimbursable-note">
            ✅ These costs provide tax benefits as they're paid pre-tax, saving you approximately {formatCurrency(breakdown.taxSavings)} in tax over the lease term.
          </div>
        </div>

        {/* NON-REIMBURSABLE COSTS */}
        <div className="cost-category non-reimbursable-costs">
          <div className="category-header">
            <h4>🏢 Non-Reimbursable Costs</h4>
            <Tooltip text="Costs that don't qualify for tax deductions. These are additional expenses you pay as a result of the lease structure.">
              <span className="category-total">{formatCurrency(nonReimbursableCosts.total)}</span>
            </Tooltip>
          </div>
          <div className="category-items">
            <div className="cost-item">
              <Tooltip text={`Fringe Benefits Tax charged on the personal use benefit. Calculated using statutory method at ${(quote.fbt.statutoryRate || 0.20) * 100}% rate. This is paid by your employer but typically passed on to you.`}>
                <span className="item-label">FBT Cost</span>
              </Tooltip>
              <span className="item-value">{formatCurrency(nonReimbursableCosts.fbtCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOTAL SUMMARY */}
      <div className="cost-summary">
        <h4>Total Cost Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Gross Cost</span>
            <span className="summary-value">{formatCurrency(breakdown.totalGrossCost)}</span>
          </div>
          <div className="summary-item savings">
            <Tooltip text="Tax savings from salary packaging. Running costs and lease payments reduce your taxable income based on your marginal tax rate.">
              <span className="summary-label">Tax Savings</span>
            </Tooltip>
            <span className="summary-value">-{formatCurrency(breakdown.taxSavings)}</span>
          </div>
          <div className="summary-item savings">
            <Tooltip text="GST savings on eligible items. The vehicle and running costs include GST which can be claimed back through the lease structure.">
              <span className="summary-label">GST Savings</span>
            </Tooltip>
            <span className="summary-value">-{formatCurrency(breakdown.gstSavings)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Net Cost (Before Residual)</span>
            <span className="summary-value">{formatCurrency(breakdown.netCostBeforeResidual)}</span>
          </div>
          <div className="summary-item">
            <Tooltip text={`Balloon payment due at end of lease based on ATO residual values (${((breakdown.residualValue / breakdown.vehiclePrice) * 100).toFixed(1)}% of vehicle price).`}>
              <span className="summary-label">Residual Payment</span>
            </Tooltip>
            <span className="summary-value">+{formatCurrency(breakdown.residualValue)}</span>
          </div>
          <div className="summary-item total">
            <span className="summary-label">Total Net Cost</span>
            <span className="summary-value">{formatCurrency(breakdown.totalNetCost)}</span>
          </div>
        </div>
      </div>

      {/* KEY INSIGHTS */}
      <div className="cost-insights">
        <h4>💡 Key Insights</h4>
        <ul>
          <li>
            <strong>Purchase vs Fees:</strong> You're paying {formatCurrency(leaserFees.total)} ({((leaserFees.total / purchaseCosts.total) * 100).toFixed(1)}%) in leaser fees on top of the {formatCurrency(purchaseCosts.total)} purchase cost.
          </li>
          <li>
            <strong>Reimbursable Benefit:</strong> The {formatCurrency(reimbursableRunningCosts.total)} in running costs provides {formatCurrency(breakdown.taxSavings)} in tax savings ({((breakdown.taxSavings / reimbursableRunningCosts.total) * 100).toFixed(1)}% return).
          </li>
          <li>
            <strong>Interest Cost:</strong> You're paying {formatCurrency(purchaseCosts.financeCharges)} ({((purchaseCosts.financeCharges / breakdown.vehiclePrice) * 100).toFixed(1)}% of vehicle price) in interest charges.
          </li>
          <li>
            <strong>Net Benefit:</strong> After tax and GST savings, your net cost is {formatCurrency(breakdown.totalNetCost)}, compared to {formatCurrency(breakdown.totalGrossCost)} gross.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default CostStructureBreakdown
