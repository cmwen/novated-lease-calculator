import './InfoSection.css'

function InfoSection() {
  return (
    <div className="info-section">
      <h2>📚 What is a Novated Lease?</h2>
      
      <div className="info-grid">
        <div className="info-card">
          <div className="info-icon">📝</div>
          <h3>The Basics</h3>
          <p>
            A novated lease is a three-way agreement between you, your employer, and a finance company. 
            Your employer pays for your vehicle and running costs from your pre-tax salary, potentially 
            reducing your taxable income.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">💡</div>
          <h3>How It Works</h3>
          <p>
            You choose a vehicle, your employer leases it and makes payments from your pre-tax salary. 
            The lease can include running costs like fuel, insurance, registration, and maintenance. 
            At the end of the lease, you can buy the vehicle, trade it in, or return it.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">✅</div>
          <h3>Benefits</h3>
          <ul>
            <li>Potential tax savings on vehicle and running costs</li>
            <li>Bundled running costs (fuel, insurance, maintenance)</li>
            <li>Flexibility to choose your vehicle</li>
            <li>Option to upgrade vehicles regularly</li>
            <li>Reduced GST on vehicle purchase (for business use)</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-icon">⚠️</div>
          <h3>Considerations</h3>
          <ul>
            <li>Fringe Benefits Tax (FBT) may apply</li>
            <li>Residual value must be paid at end of lease</li>
            <li>Lease continues even if you change jobs</li>
            <li>Annual km limits may apply</li>
            <li>Provider fees and charges apply</li>
            <li>Your take-home pay will be reduced</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-icon">🎯</div>
          <h3>Who Benefits Most?</h3>
          <p>
            Novated leases typically provide the best value for employees who:
          </p>
          <ul>
            <li>Earn a moderate to high income</li>
            <li>Drive regularly for work and personal use</li>
            <li>Want a new vehicle every few years</li>
            <li>Prefer predictable vehicle costs</li>
            <li>Have an employer who offers salary packaging</li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-icon">📊</div>
          <h3>FBT Explained</h3>
          <p>
            Fringe Benefits Tax (FBT) is a tax employers pay on certain benefits provided to employees. 
            For novated leases, FBT can be reduced by making employee contributions (ECM) from post-tax salary, 
            or by meeting statutory formula requirements. Electric vehicles may qualify for FBT exemptions.
          </p>
        </div>
      </div>

      <div className="info-highlight">
        <h3>💡 Key Tip</h3>
        <p>
          To maximize savings, consider vehicles with lower FBT rates, make strategic employee contributions, 
          and ensure your annual kilometers are accurately estimated. Electric and low-emission vehicles may 
          qualify for FBT exemptions under current legislation.
        </p>
      </div>
    </div>
  )
}

export default InfoSection
