import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { CostBreakdown } from '../types/QuoteData'
import './CostBreakdownChart.css'

interface CostBreakdownChartProps {
  costBreakdown: CostBreakdown
}

const COLORS = {
  vehiclePrice: '#3b82f6',
  financeCharges: '#8b5cf6',
  establishmentFee: '#ec4899',
  adminFees: '#f59e0b',
  runningCosts: '#10b981',
  fbtCost: '#ef4444',
  endOfLeaseFee: '#6366f1',
  taxSavings: '#22c55e',
  gstSavings: '#14b8a6'
}

function CostBreakdownChart({ costBreakdown }: CostBreakdownChartProps) {
  const costData = [
    { name: 'Vehicle Price', value: costBreakdown.vehiclePrice, color: COLORS.vehiclePrice },
    { name: 'Finance Charges', value: costBreakdown.financeCharges, color: COLORS.financeCharges },
    { name: 'Establishment Fee', value: costBreakdown.establishmentFee, color: COLORS.establishmentFee },
    { name: 'Admin Fees', value: costBreakdown.adminFees, color: COLORS.adminFees },
    { name: 'Running Costs', value: costBreakdown.runningCosts, color: COLORS.runningCosts },
    { name: 'FBT Cost', value: costBreakdown.fbtCost, color: COLORS.fbtCost },
    { name: 'End of Lease Fee', value: costBreakdown.endOfLeaseFee, color: COLORS.endOfLeaseFee }
  ]

  const savingsData = [
    { name: 'Tax Savings', value: costBreakdown.taxSavings, color: COLORS.taxSavings },
    { name: 'GST Savings', value: costBreakdown.gstSavings, color: COLORS.gstSavings }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].name}</p>
          <p className="value">{formatCurrency(payload[0].value)}</p>
          <p className="percentage">
            {((payload[0].value / costBreakdown.totalGrossCost) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="cost-breakdown-chart">
      <h2>💰 Complete Cost Breakdown</h2>
      <p className="chart-intro">
        Comprehensive view of all costs, fees, and savings over the lease term
      </p>

      <div className="breakdown-grid">
        <div className="chart-section">
          <h3>Total Costs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="cost-summary">
            {costData.map((item) => (
              <div key={item.name} className="cost-item">
                <div className="cost-label">
                  <span className="color-dot" style={{ background: item.color }}></span>
                  {item.name}
                </div>
                <div className="cost-value">{formatCurrency(item.value)}</div>
              </div>
            ))}
            <div className="cost-item total">
              <div className="cost-label"><strong>Total Gross Cost</strong></div>
              <div className="cost-value"><strong>{formatCurrency(costBreakdown.totalGrossCost)}</strong></div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Your Savings</h3>
          <div className="savings-bars">
            {savingsData.map((item) => {
              const percentage = (item.value / costBreakdown.totalGrossCost) * 100
              return (
                <div key={item.name} className="savings-bar">
                  <div className="savings-label">{item.name}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%`, background: item.color }}
                    ></div>
                  </div>
                  <div className="savings-value">{formatCurrency(item.value)}</div>
                </div>
              )
            })}
          </div>

          <div className="cost-summary">
            <div className="cost-item savings">
              <div className="cost-label">
                <span className="color-dot" style={{ background: COLORS.taxSavings }}></span>
                Tax Savings
              </div>
              <div className="cost-value">-{formatCurrency(costBreakdown.taxSavings)}</div>
            </div>
            <div className="cost-item savings">
              <div className="cost-label">
                <span className="color-dot" style={{ background: COLORS.gstSavings }}></span>
                GST Savings
              </div>
              <div className="cost-value">-{formatCurrency(costBreakdown.gstSavings)}</div>
            </div>
            <div className="cost-item subtotal">
              <div className="cost-label"><strong>Net Cost Before Residual</strong></div>
              <div className="cost-value"><strong>{formatCurrency(costBreakdown.netCostBeforeResidual)}</strong></div>
            </div>
            <div className="cost-item">
              <div className="cost-label">Residual Payment (at end)</div>
              <div className="cost-value">{formatCurrency(costBreakdown.residualValue)}</div>
            </div>
            <div className="cost-item total">
              <div className="cost-label"><strong>Total Net Cost</strong></div>
              <div className="cost-value"><strong>{formatCurrency(costBreakdown.totalNetCost)}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="breakdown-explanation">
        <h4>💡 Understanding the Numbers</h4>
        <ul>
          <li><strong>Vehicle Price:</strong> The full purchase price of the vehicle</li>
          <li><strong>Finance Charges:</strong> Interest paid over the lease term</li>
          <li><strong>Establishment Fee:</strong> One-time setup fee to start the lease</li>
          <li><strong>Admin Fees:</strong> Monthly account management fees over the lease term</li>
          <li><strong>Running Costs:</strong> Fuel, insurance, maintenance, registration, and tyres</li>
          <li><strong>FBT Cost:</strong> Fringe Benefits Tax on the vehicle benefit</li>
          <li><strong>Tax Savings:</strong> Income tax saved through salary packaging</li>
          <li><strong>GST Savings:</strong> GST you don't pay on the vehicle and running costs</li>
          <li><strong>Residual Payment:</strong> Balloon payment due at end of lease to own the vehicle</li>
        </ul>
      </div>
    </div>
  )
}

export default CostBreakdownChart
