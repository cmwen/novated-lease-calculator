import { useState, useEffect } from 'react'
import './Disclaimer.css'

function Disclaimer() {
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('disclaimerExpanded')
      return saved ? JSON.parse(saved) : true // Default to expanded
    } catch {
      return true // Default to expanded if parsing fails
    }
  })

  useEffect(() => {
    localStorage.setItem('disclaimerExpanded', JSON.stringify(isExpanded))
  }, [isExpanded])

  const toggleDisclaimer = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`disclaimer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="disclaimer-header" onClick={toggleDisclaimer}>
        <div className="disclaimer-icon">⚠️</div>
        <h3>Important Disclaimer - Please Read Carefully</h3>
        <button className="disclaimer-toggle" aria-label={isExpanded ? "Collapse disclaimer" : "Expand disclaimer"}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      {isExpanded && (
      <div className="disclaimer-content">
        
        <div className="disclaimer-section">
          <h4>Educational Purpose Only</h4>
          <p>
            This calculator is designed for <strong>educational and informational purposes only</strong>. 
            It provides simplified estimates to help you understand novated leases and is NOT financial advice.
          </p>
        </div>

        <div className="disclaimer-section">
          <h4>Calculation Limitations</h4>
          <p>All calculations and estimates provided by this tool:</p>
          <ul>
            <li>Use <strong>simplified formulas</strong> and assumptions that may not reflect real-world complexity</li>
            <li>Are based on <strong>2025-26 Australian tax rates</strong> which may change</li>
            <li>Use <strong>estimated depreciation rates</strong> - actual vehicle values vary significantly</li>
            <li>Assume <strong>standard FBT calculations</strong> - your specific situation may differ</li>
            <li>Do not account for <strong>state-specific variations</strong> in costs and regulations</li>
            <li>May not include <strong>all possible fees, charges, or hidden costs</strong></li>
            <li>Cannot predict <strong>future interest rates, fuel costs, or market conditions</strong></li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h4>Your Actual Results Will Differ</h4>
          <p>
            Real novated lease arrangements involve numerous variables unique to your situation, including but not limited to:
          </p>
          <ul>
            <li>Your employer's specific novated lease policies and approved providers</li>
            <li>Negotiated vehicle prices, interest rates, and fee structures</li>
            <li>Your complete tax situation including deductions, offsets, and other income</li>
            <li>Vehicle make/model-specific running costs and depreciation rates</li>
            <li>Your actual driving patterns and vehicle usage (personal vs business)</li>
            <li>Changes in tax law, ATO rulings, and FBT regulations</li>
            <li>Your employment status and salary changes during the lease term</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h4>Professional Advice is Essential</h4>
          <p><strong>Before making any financial decisions, you MUST consult with:</strong></p>
          <ul>
            <li><strong>Qualified Tax Advisor or Accountant:</strong> To understand your specific tax implications</li>
            <li><strong>Your Employer's HR/Payroll Department:</strong> To confirm their novated lease policies</li>
            <li><strong>Licensed Financial Advisor:</strong> To ensure this fits your financial goals</li>
            <li><strong>Approved Novated Lease Provider:</strong> To get accurate quotes and terms</li>
            <li><strong>Legal Advisor:</strong> If you have questions about contractual obligations</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h4>No Warranties or Guarantees</h4>
          <p>
            We make <strong>no warranties, representations, or guarantees</strong> regarding the accuracy, 
            completeness, or reliability of the information or calculations provided. We are not responsible 
            for any errors, omissions, or decisions made based on this calculator.
          </p>
        </div>

        <div className="disclaimer-section">
          <h4>Data Privacy</h4>
          <p>
            All calculations are performed <strong>locally in your browser</strong>. No personal or financial 
            data is transmitted to any server or stored by this application.
          </p>
        </div>

        <div className="disclaimer-important">
          <strong>⚠️ DO NOT use this calculator as your sole basis for making financial decisions.</strong>
          <br/>
          <strong>⚠️ DO NOT enter into a novated lease without professional advice tailored to your situation.</strong>
          <br/>
          <strong>⚠️ DO NOT assume these calculations represent your actual costs or savings.</strong>
        </div>

        <div className="disclaimer-footer">
          <p>
            By using this calculator, you acknowledge that you have read, understood, and agree to this disclaimer. 
            You accept full responsibility for any decisions you make and understand that this tool provides 
            estimates only for educational purposes.
          </p>
        </div>
      </div>
      )}
    </div>
  )
}

export default Disclaimer
