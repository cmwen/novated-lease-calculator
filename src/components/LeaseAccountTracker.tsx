import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import type { YearlyBreakdown } from '../types/QuoteData'
import './LeaseAccountTracker.css'

interface LeaseAccountTrackerProps {
  yearlyBreakdowns: YearlyBreakdown[]
  residualValue: number
}

function LeaseAccountTracker({ yearlyBreakdowns, residualValue }: LeaseAccountTrackerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  let cumulativePaid = 0
  const trackingData = yearlyBreakdowns.map((year) => {
    cumulativePaid += year.principalPayment + year.interestPayment
    
    return {
      year: `Year ${year.year}`,
      yearNum: year.year,
      remainingBalance: year.remainingPrincipal,
      paidToDate: cumulativePaid,
      residual: residualValue,
      equity: 0
    }
  })

  trackingData.push({
    year: 'End',
    yearNum: yearlyBreakdowns.length + 1,
    remainingBalance: 0,
    paidToDate: cumulativePaid,
    residual: residualValue,
    equity: 0
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="tracker-tooltip">
          <p className="tooltip-title">{payload[0].payload.year}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const totalFinanced = yearlyBreakdowns[0].remainingPrincipal + 
                       yearlyBreakdowns.reduce((sum, y) => sum + y.principalPayment, 0)

  return (
    <div className="lease-account-tracker">
      <h2>📈 Lease Account Tracker</h2>
      <p className="tracker-intro">
        Track your lease balance, payments, and remaining obligations over time
      </p>

      <div className="tracker-summary">
        <div className="summary-card">
          <div className="summary-label">Total Amount Financed</div>
          <div className="summary-value">{formatCurrency(totalFinanced)}</div>
          <div className="summary-note">Principal + Interest</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Paid Over Lease Term</div>
          <div className="summary-value">{formatCurrency(cumulativePaid)}</div>
          <div className="summary-note">All lease payments</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-label">Residual at End</div>
          <div className="summary-value">{formatCurrency(residualValue)}</div>
          <div className="summary-note">Balloon payment due</div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Lease Balance Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={trackingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="year" stroke="var(--text-color)" />
            <YAxis stroke="var(--text-color)" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="remainingBalance" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              stroke="#3b82f6" 
              name="Remaining Balance"
            />
            <Line 
              type="monotone" 
              dataKey="paidToDate" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Paid to Date"
            />
            <Line 
              type="monotone" 
              dataKey="residual" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Residual Value"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="account-composition">
        <h3>Account Composition Timeline</h3>
        <div className="composition-timeline">
          {yearlyBreakdowns.map((year) => {
            const percentPaid = ((cumulativePaid - year.remainingPrincipal) / totalFinanced) * 100
            return (
              <div key={year.year} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-label">Year {year.year}</div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-stats">
                    <div className="stat">
                      <span className="stat-label">Remaining Balance:</span>
                      <span className="stat-value">{formatCurrency(year.remainingPrincipal)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Paid This Year:</span>
                      <span className="stat-value">{formatCurrency(year.principalPayment + year.interestPayment)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percentPaid}%` }}></div>
                  </div>
                  <div className="progress-label">{percentPaid.toFixed(1)}% of finance paid</div>
                </div>
              </div>
            )
          })}
          <div className="timeline-item final">
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              <div className="marker-label">End of Lease</div>
            </div>
            <div className="timeline-content">
              <div className="final-stats">
                <div className="final-stat">
                  <span className="stat-label">Total Paid:</span>
                  <span className="stat-value success">{formatCurrency(cumulativePaid)}</span>
                </div>
                <div className="final-stat">
                  <span className="stat-label">Residual Due:</span>
                  <span className="stat-value highlight">{formatCurrency(residualValue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tracker-note">
        <h4>💡 Understanding Your Lease Account</h4>
        <ul>
          <li><strong>Remaining Balance:</strong> The financed amount (vehicle price minus residual) still owed on the lease</li>
          <li><strong>Paid to Date:</strong> Cumulative principal and interest payments made</li>
          <li><strong>Residual Value:</strong> The balloon payment due at lease end, set by ATO guidelines</li>
          <li><strong>At Lease End:</strong> You've paid off the financed portion, but still owe the residual to own the vehicle</li>
        </ul>
      </div>
    </div>
  )
}

export default LeaseAccountTracker
