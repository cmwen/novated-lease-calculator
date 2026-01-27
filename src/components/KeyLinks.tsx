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
      title: 'Moneysmart (ASIC)',
      description: 'Salary packaging and financial guidance',
      url: 'https://moneysmart.gov.au/work-and-tax/salary-packaging',
      icon: '💰'
    },
    {
      title: 'Moneysmart - Buying a Car',
      description: 'Complete guide to car finance options',
      url: 'https://moneysmart.gov.au/buying-a-car',
      icon: '🚗'
    },
    {
      title: 'Fair Work Ombudsman',
      description: 'Information about salary packaging and employment rights',
      url: 'https://www.fairwork.gov.au/',
      icon: '⚖️'
    },
    {
      title: 'Green Vehicle Guide',
      description: 'Information on electric and low-emission vehicles',
      url: 'https://www.greenvehicleguide.gov.au/',
      icon: '🌱'
    },
    {
      title: 'Service NSW - Vehicle Registration',
      description: 'Vehicle registration information and services',
      url: 'https://www.service.nsw.gov.au/services/registering-vehicle',
      icon: '📋'
    }
  ]

  return (
    <div className="links-section">
      <h2>🔗 Key Resources & Links</h2>
      <p className="links-intro">
        Visit these official Australian government and consumer protection websites for authoritative 
        information about novated leases, vehicle finance, and your rights.
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
          <strong>Note:</strong> Always verify information with official sources and consult 
          with qualified professionals before making financial decisions.
        </p>
      </div>
    </div>
  )
}

export default KeyLinks
