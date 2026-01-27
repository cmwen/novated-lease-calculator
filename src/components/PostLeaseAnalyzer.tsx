import type { PostLeaseScenario } from '../types/QuoteData'
import './PostLeaseAnalyzer.css'

interface PostLeaseAnalyzerProps {
  scenarios: PostLeaseScenario[]
}

function PostLeaseAnalyzer({ scenarios }: PostLeaseAnalyzerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '🚗'
      case 'sell': return '💰'
      case 'return': return '🔄'
      case 'extend': return '📝'
      default: return '📋'
    }
  }

  const getScenarioTitle = (type: string) => {
    switch (type) {
      case 'purchase': return 'Purchase the Vehicle'
      case 'sell': return 'Sell the Vehicle'
      case 'return': return 'Return to Lease Company'
      case 'extend': return 'Extend the Lease'
      default: return 'Option'
    }
  }

  const residual = scenarios[0]?.residualValue || 0
  const marketValue = scenarios[0]?.estimatedMarketValue || 0

  return (
    <div className="post-lease-analyzer">
      <h2>🔮 Post-Lease Options</h2>
      <p className="analyzer-intro">
        What happens at the end of your lease? Explore your options and their financial impact.
      </p>

      <div className="residual-summary">
        <div className="residual-card">
          <div className="residual-label">Your Residual Payment</div>
          <div className="residual-value">{formatCurrency(residual)}</div>
          <div className="residual-note">Amount owed at lease end</div>
        </div>
        <div className="residual-card">
          <div className="residual-label">Estimated Market Value</div>
          <div className="residual-value">{formatCurrency(marketValue)}</div>
          <div className="residual-note">Expected vehicle worth</div>
        </div>
        <div className={`residual-card ${marketValue > residual ? 'positive' : 'negative'}`}>
          <div className="residual-label">Equity Position</div>
          <div className="residual-value">
            {marketValue > residual ? '+' : ''}{formatCurrency(marketValue - residual)}
          </div>
          <div className="residual-note">
            {marketValue > residual ? 'Vehicle worth more than residual' : 'Residual higher than market value'}
          </div>
        </div>
      </div>

      <div className="scenarios-grid">
        {scenarios.map((scenario, index) => (
          <div key={index} className="scenario-card">
            <div className="scenario-header">
              <span className="scenario-icon">{getScenarioIcon(scenario.scenarioType)}</span>
              <h3>{getScenarioTitle(scenario.scenarioType)}</h3>
            </div>
            
            <div className="scenario-description">
              <p>{scenario.description}</p>
            </div>

            <div className="scenario-financial">
              <div className="financial-label">Financial Outcome:</div>
              <div className={`financial-value ${scenario.financialOutcome >= 0 ? 'positive' : 'negative'}`}>
                {scenario.financialOutcome >= 0 ? '+' : ''}{formatCurrency(scenario.financialOutcome)}
              </div>
            </div>

            <div className="scenario-recommendation">
              <div className="recommendation-label">💡 Analysis:</div>
              <p>{scenario.recommendation}</p>
            </div>

            <div className="scenario-details">
              <div className="detail-row">
                <span>Residual Payment:</span>
                <strong>{formatCurrency(scenario.residualValue)}</strong>
              </div>
              <div className="detail-row">
                <span>Est. Market Value:</span>
                <strong>{formatCurrency(scenario.estimatedMarketValue)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="decision-guide">
        <h3>🎯 Decision Guide</h3>
        <div className="guide-content">
          <div className="guide-section">
            <h4>Choose Purchase If:</h4>
            <ul>
              <li>You love the car and want to keep it</li>
              <li>The vehicle is worth more than the residual</li>
              <li>You have the cash or can refinance at a good rate</li>
              <li>The car has been well-maintained and reliable</li>
            </ul>
          </div>

          <div className="guide-section">
            <h4>Choose Sell If:</h4>
            <ul>
              <li>You're ready for a different vehicle</li>
              <li>The market value significantly exceeds the residual</li>
              <li>You can get a good private sale price</li>
              <li>You have time and patience for the sale process</li>
            </ul>
          </div>

          <div className="guide-section">
            <h4>Choose Return If:</h4>
            <ul>
              <li>You want the simplest, no-hassle option</li>
              <li>The car's value is close to the residual</li>
              <li>You're moving to a new lease immediately</li>
              <li>You don't have time for a private sale</li>
            </ul>
          </div>

          <div className="guide-section">
            <h4>Choose Extend If:</h4>
            <ul>
              <li>You want to keep the tax benefits going</li>
              <li>You're not ready to part with the vehicle</li>
              <li>Current interest rates are favorable</li>
              <li>You want to reduce the balloon payment size</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="analyzer-warning">
        <strong>⚠️ Important:</strong> These are estimated scenarios based on assumed depreciation rates. 
        Actual market values can vary significantly based on vehicle condition, mileage, market demand, and economic conditions. 
        Always get professional valuations before making your decision.
      </div>
    </div>
  )
}

export default PostLeaseAnalyzer
