import { useEffect, useRef, useState } from 'react'
import EnhancedCalculator from './EnhancedCalculator'
import InfoSection from './InfoSection'
import LeaseOperationsGuide from './LeaseOperationsGuide'
import Disclaimer from './Disclaimer'
import KeyLinks from './KeyLinks'
import './HomeExperience.css'

type ExperienceSection = 'calculator' | 'settlement' | 'learn'

interface SectionConfig {
  id: ExperienceSection
  label: string
  icon: string
  title: string
  summary: string
  description: string
  highlights: string[]
  cta: string
}

const sections: SectionConfig[] = [
  {
    id: 'calculator',
    label: 'Calculator',
    icon: '🧮',
    title: 'Estimate the numbers first',
    summary: 'Start here if you want to import a quote, tweak assumptions, or compare costs before making decisions.',
    description: 'Use the calculator workspace when you want the financial detail front and centre without the long reading experience around it.',
    highlights: ['Import quotes', 'Compare scenarios', 'See tax and residual impacts'],
    cta: 'Open calculator'
  },
  {
    id: 'settlement',
    label: 'After settlement',
    icon: '🧭',
    title: 'Understand how the lease runs day to day',
    summary: 'See how payroll, providers, cards, claims, EV charging, budgets, and tax-time tasks work after the car goes live.',
    description: 'Use this guide once you have a lease in motion, or when you want the practical operational view before signing anything.',
    highlights: ['Running-cost budget', 'Claims and reimbursements', 'End-of-lease and tax time'],
    cta: 'Open operations guide'
  },
  {
    id: 'learn',
    label: 'Useful info',
    icon: '📚',
    title: 'Read the basics without calculator noise',
    summary: 'Get a cleaner learning view with core novated lease concepts, trade-offs, and the most useful official and provider links.',
    description: 'Use this section if you are still learning the terminology, want a simpler reading flow, or need direct links to source material.',
    highlights: ['What a novated lease is', 'Benefits and trade-offs', 'ATO and provider links'],
    cta: 'Open reading view'
  }
]

const getInitialSection = (): ExperienceSection => {
  try {
    const saved = localStorage.getItem('homeExperienceSection')
    if (saved === 'calculator' || saved === 'settlement' || saved === 'learn') {
      return saved
    }
  } catch {
    // Ignore storage read issues and fall back to the default view.
  }

  return 'calculator'
}

function HomeExperience() {
  const [activeSection, setActiveSection] = useState<ExperienceSection>(getInitialSection)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('homeExperienceSection', activeSection)
  }, [activeSection])

  const activeConfig = sections.find((section) => section.id === activeSection) ?? sections[0]

  const handleSectionChange = (sectionId: ExperienceSection) => {
    if (sectionId === activeSection) {
      return
    }

    setActiveSection(sectionId)

    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section className="home-experience">
      <div className="experience-overview">
        <div className="experience-overview-copy">
          <span className="experience-eyebrow">Choose your path</span>
          <h2>Use one focused view at a time</h2>
          <p>
            The homepage now separates the three most common journeys: estimating a lease, understanding what
            happens after settlement, and reading useful background information. That keeps the first screen
            lighter and makes it easier to find the right next step.
          </p>
        </div>

        <div className="experience-cards">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`experience-card ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => handleSectionChange(section.id)}
            >
              <div className="experience-card-header">
                <span className="experience-card-icon" aria-hidden="true">{section.icon}</span>
                <div>
                  <span className="experience-card-label">{section.label}</span>
                  <h3>{section.title}</h3>
                </div>
              </div>
              <p>{section.summary}</p>
              <ul>
                {section.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <span className="experience-card-cta">{section.cta}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="experience-tabs" role="tablist" aria-label="Main app sections">
        {sections.map((section) => (
          <button
            key={section.id}
            id={`experience-tab-${section.id}`}
            type="button"
            role="tab"
            className={`experience-tab ${activeSection === section.id ? 'active' : ''}`}
            aria-selected={activeSection === section.id}
            aria-controls={`experience-panel-${section.id}`}
            tabIndex={activeSection === section.id ? 0 : -1}
            onClick={() => handleSectionChange(section.id)}
          >
            <span aria-hidden="true">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      <div className="experience-active-summary">
        <div>
          <span className="experience-badge">
            {activeConfig.icon} {activeConfig.label}
          </span>
          <h2>{activeConfig.title}</h2>
          <p>{activeConfig.description}</p>
        </div>

        <ul className="experience-highlights" aria-label={`${activeConfig.label} highlights`}>
          {activeConfig.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div
        ref={panelRef}
        id={`experience-panel-${activeSection}`}
        className="experience-panel"
        role="tabpanel"
        aria-labelledby={`experience-tab-${activeSection}`}
      >
        {activeSection === 'calculator' && (
          <div className="experience-panel-stack">
            <Disclaimer />
            <EnhancedCalculator />
          </div>
        )}

        {activeSection === 'settlement' && (
          <div className="experience-panel-stack">
            <LeaseOperationsGuide />
          </div>
        )}

        {activeSection === 'learn' && (
          <div className="experience-panel-stack learn-stack">
            <InfoSection />
            <KeyLinks />
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeExperience
