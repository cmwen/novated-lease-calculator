import './KeyLinks.css'

function KeyLinks() {
  const links = [
    {
      title: 'Australian Taxation Office (ATO)',
      description: 'Official FBT information for car leasing and novated leases',
      url: 'https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/cars-and-fbt/car-leasing-and-fbt',
      icon: '🏛️'
    },
    {
      title: 'ATO - Electric Cars Exemption',
      description: 'Official rules for eligible EV novated leases and FBT exemption',
      url: 'https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/electric-cars-exemption',
      icon: '⚡'
    },
    {
      title: 'ATO - Reportable Fringe Benefits',
      description: 'What shows on your income statement and how it affects income tests',
      url: 'https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/reportable-fringe-benefits-for-employees',
      icon: '🧾'
    },
    {
      title: 'Moneysmart (ASIC)',
      description: 'Salary packaging and financial guidance',
      url: 'https://moneysmart.gov.au/work-and-tax/salary-packaging',
      icon: '💰'
    },
    {
      title: 'SG Fleet - Driver Support',
      description: 'Portal access, fuel card guidance, and running-cost support for SG Fleet customers',
      url: 'https://www.sgfleet.com/au/driver-support/novated-driver-support',
      icon: '🚗'
    },
    {
      title: 'SG Fleet - Reimbursement Claims',
      description: 'mySG reimbursement access for eligible out-of-pocket claims',
      url: 'https://www.sgfleet.com/au/novated-ops/novated-lease-reimbursement-claims',
      icon: '💳'
    },
    {
      title: 'Smart - EV Charging',
      description: 'Smart / SmartSalary guidance on home charging, public charging, and Chargefox',
      url: 'https://www.smart.com.au/novated-leasing/electric-vehicles-ev/ev-charging/',
      icon: '🔌'
    },
    {
      title: 'Smart - Contact & FAQs',
      description: 'Support hub for existing novated leases, account questions, and EV help',
      url: 'https://www.smart.com.au/contact-us/',
      icon: '📞'
    }
  ]

  return (
    <div className="links-section">
      <h2>🔗 Key Resources & Links</h2>
      <p className="links-intro">
        Visit these official Australian government pages and provider support hubs for authoritative
        information about novated leases, EV charging, salary packaging, tax-time reporting, and day-to-day
        account management.
      </p>

      <div className="links-grid">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card"
          >
            <div className="link-icon">{link.icon}</div>
            <div className="link-content">
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <span className="link-arrow">→</span>
            </div>
          </a>
        ))}
      </div>

      <div className="links-footer">
        <p>
          <strong>Note:</strong> Government links are best for tax rules. Provider links are best for the
          actual claims, card, and support process on your own account, which can vary by employer and
          provider program.
        </p>
      </div>
    </div>
  )
}

export default KeyLinks
