import './Disclaimer.css'

function Disclaimer() {
  return (
    <div className="disclaimer">
      <div className="disclaimer-icon">⚠️</div>
      <div className="disclaimer-content">
        <h3>Important Disclaimer</h3>
        <p>
          This calculator provides <strong>estimates only</strong> and should not be considered financial advice. 
          Novated lease arrangements involve complex tax and financial considerations that vary based on individual circumstances.
        </p>
        <p>
          <strong>Always consult with:</strong>
        </p>
        <ul>
          <li>A qualified tax advisor or accountant</li>
          <li>Your employer's HR or payroll department</li>
          <li>A licensed financial advisor</li>
          <li>An approved novated lease provider</li>
        </ul>
        <p>
          Results may not reflect your actual savings. Terms, conditions, fees, and tax treatments can vary significantly 
          between providers and circumstances. The information provided is general in nature and does not take into account 
          your specific situation or objectives.
        </p>
      </div>
    </div>
  )
}

export default Disclaimer
