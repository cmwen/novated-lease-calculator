import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { YearlyBreakdown } from '../types/QuoteData'
import './YearlyBreakdown.css'

interface YearlyBreakdownProps {
  yearlyBreakdowns: YearlyBreakdown[]
}

function YearlyBreakdown({ yearlyBreakdowns }: YearlyBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const chartData = yearlyBreakdowns.map(year => ({
    name: `Year ${year.year}`,
    'Principal': year.principalPayment,
    'Interest': year.interestPayment,
    'Running Costs': year.runningCosts,
    'Fees': year.fees,
    'FBT': year.fbtCost,
    'Net Cost': year.netCost
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="yearly-tooltip">
          <p className="tooltip-label">{label}</p>
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
    <div className="yearly-breakdown">
      <h2>📊 Year-by-Year Breakdown</h2>
      <p className="breakdown-intro">
        Detailed view of costs, savings, and payments for each year of your lease
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Principal" stackId="costs" fill="#3b82f6" />
            <Bar dataKey="Interest" stackId="costs" fill="#8b5cf6" />
            <Bar dataKey="Running Costs" stackId="costs" fill="#10b981" />
            <Bar dataKey="Fees" stackId="costs" fill="#f59e0b" />
            <Bar dataKey="FBT" stackId="costs" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="breakdown-table-container">
        <h3>Detailed Breakdown Table</h3>
        <div className="table-scroll">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Running Costs</th>
                <th>Fees</th>
                <th>FBT</th>
                <th>Gross Cost</th>
                <th>Tax Savings</th>
                <th>GST Savings</th>
                <th>Net Cost</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {yearlyBreakdowns.map((year) => {
                const grossCost = year.principalPayment + year.interestPayment + year.runningCosts + year.fees + year.fbtCost
                return (
                  <tr key={year.year}>
                    <td><strong>Year {year.year}</strong></td>
                    <td>{formatCurrency(year.principalPayment)}</td>
                    <td>{formatCurrency(year.interestPayment)}</td>
                    <td>{formatCurrency(year.runningCosts)}</td>
                    <td>{formatCurrency(year.fees)}</td>
                    <td>{formatCurrency(year.fbtCost)}</td>
                    <td className="subtotal">{formatCurrency(grossCost)}</td>
                    <td className="savings">-{formatCurrency(year.taxSavings)}</td>
                    <td className="savings">-{formatCurrency(year.gstSavings)}</td>
                    <td className="total">{formatCurrency(year.netCost)}</td>
                    <td>{formatCurrency(year.remainingPrincipal)}</td>
                  </tr>
                )
              })}
              <tr className="totals-row">
                <td><strong>TOTALS</strong></td>
                <td><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.principalPayment, 0))}</strong></td>
                <td><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.interestPayment, 0))}</strong></td>
                <td><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.runningCosts, 0))}</strong></td>
                <td><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.fees, 0))}</strong></td>
                <td><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.fbtCost, 0))}</strong></td>
                <td className="subtotal"><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.principalPayment + y.interestPayment + y.runningCosts + y.fees + y.fbtCost, 0))}</strong></td>
                <td className="savings"><strong>-{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.taxSavings, 0))}</strong></td>
                <td className="savings"><strong>-{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.gstSavings, 0))}</strong></td>
                <td className="total"><strong>{formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.netCost, 0))}</strong></td>
                <td><strong>$0</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="breakdown-insights">
        <h3>📈 Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-label">Average Annual Cost</div>
            <div className="insight-value">
              {formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.netCost, 0) / yearlyBreakdowns.length)}
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Total Interest Paid</div>
            <div className="insight-value">
              {formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.interestPayment, 0))}
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Total Tax Savings</div>
            <div className="insight-value savings">
              {formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.taxSavings, 0))}
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Total GST Savings</div>
            <div className="insight-value savings">
              {formatCurrency(yearlyBreakdowns.reduce((sum, y) => sum + y.gstSavings, 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YearlyBreakdown
