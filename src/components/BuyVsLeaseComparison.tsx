import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { BuyVsLeaseComparison } from '../types/QuoteData'
import './BuyVsLeaseComparison.css'

interface BuyVsLeaseComparisonProps {
  comparison: BuyVsLeaseComparison
  leaseTerm: number
}

function BuyVsLeaseComparison({ comparison, leaseTerm }: BuyVsLeaseComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const chartData = [
    {
      name: 'Buy Outright',
      'Vehicle Cost': comparison.buyOutright.vehiclePrice,
      'Running Costs': comparison.buyOutright.runningCosts,
      'Opportunity Cost': comparison.buyOutright.opportunityCost,
      'Total': comparison.buyOutright.totalCost
    },
    {
      name: 'Novated Lease',
      'Lease Payments': comparison.novatedLease.totalCostBeforeResidual,
      'Residual': comparison.novatedLease.residualPayment,
      'Total': comparison.novatedLease.totalCost
    }
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="comparison-tooltip">
          <p className="tooltip-title">{payload[0].payload.name}</p>
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

  const leaseSaves = comparison.difference > 0

  return (
    <div className="buy-vs-lease-comparison">
      <h2>⚖️ Buy Outright vs Novated Lease</h2>
      <p className="comparison-intro">
        Complete financial comparison over {leaseTerm} years
      </p>

      <div className="verdict-banner">
        <div className={`verdict ${leaseSaves ? 'lease-wins' : 'buy-wins'}`}>
          <div className="verdict-icon">{leaseSaves ? '🎯' : '💰'}</div>
          <div className="verdict-content">
            <div className="verdict-title">
              {leaseSaves ? 'Novated Lease is More Cost-Effective' : 'Buying Outright is More Cost-Effective'}
            </div>
            <div className="verdict-savings">
              Save approximately {formatCurrency(Math.abs(comparison.difference))}
            </div>
            <div className="verdict-note">{comparison.recommendation}</div>
          </div>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="option-card buy">
          <div className="option-header">
            <h3>💵 Buy Outright</h3>
            <div className="option-subtitle">Pay cash today</div>
          </div>

          <div className="cost-breakdown">
            <div className="cost-line">
              <span>Vehicle Purchase Price</span>
              <strong>{formatCurrency(comparison.buyOutright.vehiclePrice)}</strong>
            </div>
            <div className="cost-line">
              <span>Running Costs ({leaseTerm} years)</span>
              <strong>{formatCurrency(comparison.buyOutright.runningCosts)}</strong>
            </div>
            <div className="cost-line">
              <span>Opportunity Cost</span>
              <strong>{formatCurrency(comparison.buyOutright.opportunityCost)}</strong>
            </div>
            <div className="cost-line total">
              <span>Total Cost</span>
              <strong>{formatCurrency(comparison.buyOutright.totalCost)}</strong>
            </div>
            <div className="cost-line positive">
              <span>Vehicle Value After {leaseTerm} Years</span>
              <strong>-{formatCurrency(comparison.buyOutright.vehicleValueAtEnd)}</strong>
            </div>
            <div className="cost-line net">
              <span>Net Position</span>
              <strong>{formatCurrency(comparison.buyOutright.netPosition)}</strong>
            </div>
          </div>

          <div className="pros-cons">
            <div className="pros">
              <h4>✓ Advantages</h4>
              <ul>
                <li>Own the vehicle immediately</li>
                <li>No ongoing payments</li>
                <li>No interest charges</li>
                <li>Full control and flexibility</li>
              </ul>
            </div>
            <div className="cons">
              <h4>✗ Disadvantages</h4>
              <ul>
                <li>Large upfront capital outlay</li>
                <li>Opportunity cost of tied-up funds</li>
                <li>No tax benefits</li>
                <li>Pay GST on vehicle and running costs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="option-card lease">
          <div className="option-header">
            <h3>🚗 Novated Lease</h3>
            <div className="option-subtitle">Salary packaging</div>
          </div>

          <div className="cost-breakdown">
            <div className="cost-line">
              <span>Total Lease Payments</span>
              <strong>{formatCurrency(comparison.novatedLease.totalCostBeforeResidual)}</strong>
            </div>
            <div className="cost-line">
              <span>Residual Payment at End</span>
              <strong>{formatCurrency(comparison.novatedLease.residualPayment)}</strong>
            </div>
            <div className="cost-line total">
              <span>Total Cost</span>
              <strong>{formatCurrency(comparison.novatedLease.totalCost)}</strong>
            </div>
            <div className="cost-line positive">
              <span>Vehicle Value After {leaseTerm} Years</span>
              <strong>-{formatCurrency(comparison.novatedLease.vehicleValueAtEnd)}</strong>
            </div>
            <div className="cost-line net">
              <span>Net Position</span>
              <strong>{formatCurrency(comparison.novatedLease.netPosition)}</strong>
            </div>
          </div>

          <div className="pros-cons">
            <div className="pros">
              <h4>✓ Advantages</h4>
              <ul>
                <li>Tax savings on income</li>
                <li>GST savings on vehicle and costs</li>
                <li>Spread payments over time</li>
                <li>Preserve capital for investments</li>
              </ul>
            </div>
            <div className="cons">
              <h4>✗ Disadvantages</h4>
              <ul>
                <li>Interest charges on financing</li>
                <li>FBT costs to consider</li>
                <li>Large residual payment at end</li>
                <li>Tied to employer arrangement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="visual-comparison">
        <h3>Cost Comparison Chart</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Vehicle Cost" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Running Costs" stackId="a" fill="#10b981" />
            <Bar dataKey="Opportunity Cost" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Lease Payments" stackId="b" fill="#8b5cf6" />
            <Bar dataKey="Residual" stackId="b" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="comparison-notes">
        <h3>📊 Analysis Notes</h3>
        <ul>
          <li><strong>Opportunity Cost:</strong> Assumes 5% annual return if cash was invested instead of buying the vehicle</li>
          <li><strong>Depreciation:</strong> Vehicle value estimated using 15% annual depreciation rate</li>
          <li><strong>Net Position:</strong> Takes into account the vehicle's remaining value at end of period</li>
          <li><strong>Tax Benefits:</strong> Novated lease includes income tax and GST savings already deducted</li>
          <li><strong>Running Costs:</strong> Buying outright pays these post-tax, novated lease saves tax and GST on them</li>
        </ul>
      </div>
    </div>
  )
}

export default BuyVsLeaseComparison
