import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { QuoteData } from '../types/QuoteData'
import { calculateIncomeTax } from '../utils/calculations'
import './TaxImpactCalculator.css'

interface TaxImpactCalculatorProps {
  quoteData: QuoteData
  annualPackageAmount: number
}

function TaxImpactCalculator({ quoteData, annualPackageAmount }: TaxImpactCalculatorProps) {
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

  const beforeLease = calculateIncomeTax(
    quoteData.employee.taxableIncome,
    quoteData.employee.hasHELPDebt,
    quoteData.employee.helpRepaymentRate
  )

  const reducedTaxableIncome = quoteData.employee.taxableIncome - annualPackageAmount

  const afterLease = calculateIncomeTax(
    reducedTaxableIncome,
    quoteData.employee.hasHELPDebt,
    quoteData.employee.helpRepaymentRate
  )

  const taxSavings = beforeLease.totalTax - afterLease.totalTax
  const netIncomeIncrease = afterLease.netIncome - beforeLease.netIncome + annualPackageAmount

  const chartData = [
    {
      scenario: 'Without Lease',
      'Gross Income': beforeLease.grossIncome,
      'Income Tax': beforeLease.incomeTax,
      'Medicare Levy': beforeLease.medicareLevy,
      'HELP Repayment': beforeLease.helpRepayment,
      'Net Income': beforeLease.netIncome
    },
    {
      scenario: 'With Lease',
      'Gross Income': afterLease.grossIncome,
      'Income Tax': afterLease.incomeTax,
      'Medicare Levy': afterLease.medicareLevy,
      'HELP Repayment': afterLease.helpRepayment,
      'Net Income': afterLease.netIncome
    }
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="tax-tooltip">
          <p className="tooltip-title">{payload[0].payload.scenario}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="tax-impact-calculator">
      <h2>📊 Tax Impact Analysis</h2>
      <p className="tax-intro">
        See how salary packaging affects your tax, PAYG withholding, and take-home pay
      </p>

      <div className="impact-summary">
        <div className="summary-card highlight">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-label">Annual Tax Savings</div>
            <div className="summary-value">{formatCurrency(taxSavings)}</div>
            <div className="summary-note">Reduced income tax + Medicare Levy</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <div className="summary-label">Effective Take-Home Benefit</div>
            <div className="summary-value">{formatCurrency(netIncomeIncrease)}</div>
            <div className="summary-note">After packaging the vehicle</div>
          </div>
        </div>
      </div>

      <div className="tax-comparison-grid">
        <div className="tax-scenario before">
          <h3>Before Novated Lease</h3>
          <div className="tax-details">
            <div className="detail-row">
              <span>Gross Taxable Income</span>
              <strong>{formatCurrency(beforeLease.grossIncome)}</strong>
            </div>
            <div className="detail-row tax">
              <span>Income Tax</span>
              <strong>-{formatCurrency(beforeLease.incomeTax)}</strong>
            </div>
            <div className="detail-row tax">
              <span>Medicare Levy (2%)</span>
              <strong>-{formatCurrency(beforeLease.medicareLevy)}</strong>
            </div>
            {beforeLease.helpRepayment > 0 && (
              <div className="detail-row tax">
                <span>HELP Repayment</span>
                <strong>-{formatCurrency(beforeLease.helpRepayment)}</strong>
              </div>
            )}
            <div className="detail-row total-tax">
              <span>Total Tax</span>
              <strong>-{formatCurrency(beforeLease.totalTax)}</strong>
            </div>
            <div className="detail-row net">
              <span>Net Income</span>
              <strong>{formatCurrency(beforeLease.netIncome)}</strong>
            </div>
            <div className="detail-row rate">
              <span>Effective Tax Rate</span>
              <strong>{formatPercent(beforeLease.effectiveTaxRate)}</strong>
            </div>
            <div className="detail-row rate">
              <span>Marginal Tax Rate</span>
              <strong>{formatPercent(beforeLease.marginalTaxRate)}</strong>
            </div>
          </div>
        </div>

        <div className="tax-scenario after">
          <h3>After Novated Lease</h3>
          <div className="package-banner">
            Salary Package: {formatCurrency(annualPackageAmount)}
          </div>
          <div className="tax-details">
            <div className="detail-row">
              <span>Reduced Taxable Income</span>
              <strong>{formatCurrency(afterLease.grossIncome)}</strong>
            </div>
            <div className="detail-row tax">
              <span>Income Tax</span>
              <strong>-{formatCurrency(afterLease.incomeTax)}</strong>
            </div>
            <div className="detail-row tax">
              <span>Medicare Levy (2%)</span>
              <strong>-{formatCurrency(afterLease.medicareLevy)}</strong>
            </div>
            {afterLease.helpRepayment > 0 && (
              <div className="detail-row tax">
                <span>HELP Repayment</span>
                <strong>-{formatCurrency(afterLease.helpRepayment)}</strong>
              </div>
            )}
            <div className="detail-row total-tax">
              <span>Total Tax</span>
              <strong>-{formatCurrency(afterLease.totalTax)}</strong>
            </div>
            <div className="detail-row net">
              <span>Net Income</span>
              <strong>{formatCurrency(afterLease.netIncome)}</strong>
            </div>
            <div className="detail-row rate">
              <span>Effective Tax Rate</span>
              <strong>{formatPercent(afterLease.effectiveTaxRate)}</strong>
            </div>
            <div className="detail-row rate">
              <span>Marginal Tax Rate</span>
              <strong>{formatPercent(afterLease.marginalTaxRate)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="tax-chart">
        <h3>Visual Tax Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="scenario" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Gross Income" fill="#3b82f6" />
            <Bar dataKey="Income Tax" fill="#ef4444" />
            <Bar dataKey="Medicare Levy" fill="#f59e0b" />
            {beforeLease.helpRepayment > 0 && <Bar dataKey="HELP Repayment" fill="#8b5cf6" />}
            <Bar dataKey="Net Income" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="payg-explanation">
        <h3>💡 Understanding PAYG Withholding Changes</h3>
        <p>
          When you start a novated lease, your employer will adjust your PAYG (Pay As You Go) tax withholding 
          because your taxable income is reduced. Here's what happens:
        </p>
        <ul>
          <li><strong>Reduced Withholding:</strong> Your employer withholds less tax each pay cycle because your taxable income is lower</li>
          <li><strong>More Take-Home:</strong> You'll see more money in your bank account each pay period</li>
          <li><strong>Package Deduction:</strong> The novated lease amount is deducted pre-tax, reducing your taxable income</li>
          <li><strong>At Tax Time:</strong> Your tax return reflects the lower taxable income and tax already paid through PAYG</li>
          <li><strong>No Surprise Bill:</strong> Because PAYG is adjusted correctly, you won't owe extra tax at year-end</li>
        </ul>
      </div>

      <div className="tax-warning">
        <strong>⚠️ Important Tax Considerations:</strong>
        <ul>
          <li>These calculations use 2025-26 Australian tax rates and 2% Medicare Levy</li>
          <li>HELP/HECS repayments are calculated based on your repayment threshold</li>
          <li>FBT (Fringe Benefits Tax) is separate and paid by your employer</li>
          <li>Your individual circumstances may affect actual tax outcomes</li>
          <li>Always consult with a qualified tax advisor for personalized advice</li>
          <li>Report any novated lease arrangements to the ATO as required</li>
        </ul>
      </div>
    </div>
  )
}

export default TaxImpactCalculator
