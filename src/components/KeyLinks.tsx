import './KeyLinks.css'

function KeyLinks() {
  const links = [
    {
      title: 'Australian Taxation Office (ATO)',
      description: 'Official tax information and FBT guidelines',
      url: 'https://www.ato.gov.au/business/fringe-benefits-tax/types-of-fringe-benefits/car-fringe-benefits',
      icon: '🏛️'
    },
    {
      title: 'Moneysmart (ASIC)',
      description: 'Independent financial guidance on car leases',
      url: 'https://moneysmart.gov.au/car-finance/leasing',
      icon: '💰'
    },
    {
      title: 'Choice - Car Leasing Guide',
      description: 'Consumer advice and comparisons',
      url: 'https://www.choice.com.au/transport/cars/general/articles/car-leasing',
      icon: '🔍'
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
      title: 'Service NSW - Registration',
      description: 'Vehicle registration information (NSW)',
      url: 'https://www.service.nsw.gov.au/transaction/register-vehicle',
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
