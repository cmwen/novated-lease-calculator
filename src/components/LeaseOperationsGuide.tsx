import './LeaseOperationsGuide.css'

interface RoleCard {
  icon: string
  title: string
  description: string
  bullets: string[]
}

interface TimelineStep {
  title: string
  description: string
}

interface ContactRow {
  situation: string
  who: string
  why: string
}

interface ProviderLink {
  label: string
  url: string
}

const roleCards: RoleCard[] = [
  {
    icon: '🏢',
    title: 'Employer / payroll',
    description: 'Your employer is the party to the novation agreement, so payroll is what turns the package into real deductions each pay cycle.',
    bullets: [
      'Starts and stops your pre-tax deductions',
      'Processes any post-tax employee contribution method (ECM) amounts if FBT needs to be offset',
      'Reports salary and any reportable fringe benefits on your income statement'
    ]
  },
  {
    icon: '🧾',
    title: 'Salary packaging provider',
    description: 'This provider translates the annual package into payroll deductions and keeps the running-cost budget aligned with your pay cycle.',
    bullets: [
      'Builds or adjusts your package budget',
      'Tracks how much of the budget has been funded from salary',
      'Helps rebalance deductions if your costs are consistently above or below budget'
    ]
  },
  {
    icon: '🚗',
    title: 'Novated lease provider',
    description: 'This is the vehicle and lease administration side of the arrangement. In some programs, it is the same group as the salary packaging provider.',
    bullets: [
      'Manages the finance contract, lease account, and driver portal',
      'Issues cards or approves payments for eligible running costs',
      'Handles claims, servicing approvals, registration, and end-of-lease options'
    ]
  },
  {
    icon: '🙋',
    title: 'You',
    description: 'Once the lease settles, you are the person keeping the arrangement running smoothly day to day.',
    bullets: [
      'Use the correct card or claim path for each expense',
      'Keep tax invoices, odometer readings, and charging evidence when required',
      'Review your balance, budget, and residual decision before lease end'
    ]
  }
]

const settlementSteps: TimelineStep[] = [
  {
    title: 'Lease settles and your account goes live',
    description: 'Your vehicle is delivered or ready for delivery, your provider portal is activated, and cards or approved payment methods are usually arranged from this point.'
  },
  {
    title: 'Payroll begins funding the package',
    description: 'Each pay, money is taken from salary before tax, and sometimes after tax as ECM, then allocated to finance, fees, and the running-cost budget.'
  },
  {
    title: 'The running-cost budget starts building up',
    description: 'The provider uses your annual estimate for fuel, charging, tyres, servicing, insurance, and registration, then spreads that budget across your pay cycles.'
  },
  {
    title: 'You spend against the budget',
    description: 'Eligible costs are usually paid either with a provider card / approved merchant network or by paying yourself first and then lodging a reimbursement claim.'
  },
  {
    title: 'The budget gets reviewed and corrected',
    description: 'If you spend more than expected, your deductions may need to rise. If you spend less, the excess usually stays in the account until review, adjustment, or reconciliation.'
  },
  {
    title: 'Tax time and lease end are reconciled',
    description: 'At tax time you check payroll reporting and any RFBA implications. At lease end you choose whether to pay the residual, refinance it, sell/trade the car, or move to a new lease.'
  }
]

const contactRows: ContactRow[] = [
  {
    situation: 'Payroll deduction looks wrong',
    who: 'Employer payroll and salary packaging provider',
    why: 'They control the deduction setup, ECM split, and any changes to the amount coming out of each pay.'
  },
  {
    situation: 'Claim is stuck or card is declined',
    who: 'Novated lease provider support',
    why: 'They can see your claim status, merchant rules, account balance, card setup, and supporting documents.'
  },
  {
    situation: 'Registration, servicing, tyres, or repairs',
    who: 'Novated lease provider support',
    why: 'They usually approve eligible work, manage approved merchants, and confirm whether there are enough funds in your budget.'
  },
  {
    situation: 'EV charging method or evidence',
    who: 'Your provider EV / novated support team',
    why: 'Charging rules are provider-specific, especially for home charging, public charging, Chargefox access, and what proof is needed.'
  },
  {
    situation: 'Tax return, HELP, MLS, or RFBA effects',
    who: 'Registered tax agent or accountant',
    why: 'Your provider can explain the lease, but your tax adviser should tell you how the arrangement affects your return and income-tested items.'
  },
  {
    situation: 'Residual, refinance, sale, or early exit',
    who: 'Novated lease provider end-of-lease team',
    why: 'They administer the residual amount, payout figures, sale/trade process, and what happens if you change jobs or end early.'
  }
]


const sourceLinks: ProviderLink[] = [
  {
    label: 'ATO electric cars exemption',
    url: 'https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/electric-cars-exemption'
  },
  {
    label: 'ATO taxable value of a car fringe benefit',
    url: 'https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/cars-and-fbt/taxable-value-of-a-car-fringe-benefit'
  },
  {
    label: 'ATO reducing your FBT liability',
    url: 'https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/exemptions-concessions-and-other-ways-to-reduce-fbt/reducing-your-fbt-liability'
  },
  {
    label: 'ATO reportable fringe benefits',
    url: 'https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/reportable-fringe-benefits-for-employees'
  }
]

function LeaseOperationsGuide() {
  return (
    <section className="operations-guide">
      <h2>🧭 After settlement: how your novated lease actually runs</h2>
      <p className="operations-intro">
        Settlement is the point where your car, payroll deductions, and running-cost budget start working
        together. From then on, the big questions are usually practical ones: who pays what, who do you talk
        to, what happens if you pay yourself first, and what changes again at tax time and lease end?
      </p>

      <div className="operations-banner">
        <strong>Quick reality check:</strong> the salary packaging provider and novated lease provider are
        sometimes different companies, and sometimes the same group under different brands. The packaging side
        usually handles payroll deductions and budget settings. The lease side usually handles the car account,
        cards, claims, servicing approvals, and residual.
      </div>

      <div className="operations-grid roles-grid">
        {roleCards.map((card) => (
          <article key={card.title} className="operations-card role-card">
            <div className="role-header">
              <span className="role-icon" aria-hidden="true">{card.icon}</span>
              <h3>{card.title}</h3>
            </div>
            <p>{card.description}</p>
            <ul>
              {card.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="operations-panel">
        <h3>What happens after the lease is settled?</h3>
        <div className="timeline">
          {settlementSteps.map((step, index) => (
            <article key={step.title} className="timeline-item">
              <div className="timeline-marker" aria-hidden="true">{index + 1}</div>
              <div className="timeline-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="operations-panel">
        <h3>Money flow and budget flow</h3>
        <p className="panel-intro">
          The same lease usually has two flows running in parallel: payroll funding the package, and the
          provider paying or reimbursing eligible vehicle costs from that funded balance.
        </p>

        <div className="flow-group">
          <div className="flow-lane" aria-label="Payroll funding flow">
            <div className="flow-box primary">
              <strong>Your gross salary</strong>
              <span>Before salary packaging</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-box">
              <strong>Employer payroll</strong>
              <span>Pre-tax package and any ECM post-tax split are deducted here</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-box">
              <strong>Provider-managed account</strong>
              <span>Budget funds build up over each pay cycle</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-box">
              <strong>Lease, fees, and running costs</strong>
              <span>Finance, admin fees, and eligible vehicle expenses are paid from here</span>
            </div>
          </div>

          <div className="flow-note">
            If FBT applies, an after-tax ECM amount can sit next to the pre-tax deduction to reduce or offset
            the taxable value of the benefit.
          </div>
        </div>

        <div className="flow-group">
          <div className="flow-lane" aria-label="Running cost spending flow">
            <div className="flow-box success">
              <strong>Running-cost budget</strong>
              <span>Fuel, charging, tyres, servicing, insurance, registration and similar items</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-box">
              <strong>Provider card / approved merchant</strong>
              <span>Best way to avoid out-of-pocket spend where your program supports it</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">or</div>
            <div className="flow-box warning">
              <strong>You pay first</strong>
              <span>Keep the tax invoice and claim reimbursement through the provider portal</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-box">
              <strong>Reimbursement outcome</strong>
              <span>Paid only if the cost is eligible, documented, and there is enough funded balance</span>
            </div>
          </div>
        </div>

        <div className="budget-grid" aria-label="Running cost budget cycle">
          <div className="budget-card">
            <strong>1. Estimate</strong>
            <p>Start with a realistic annual budget for driving, charging, servicing, rego, tyres, and insurance.</p>
          </div>
          <div className="budget-card">
            <strong>2. Fund</strong>
            <p>The annual estimate is spread across your pays, so the account fills gradually instead of all at once.</p>
          </div>
          <div className="budget-card">
            <strong>3. Spend</strong>
            <p>Eligible costs draw down the balance whenever a card is used, a merchant bills the provider, or a claim is reimbursed.</p>
          </div>
          <div className="budget-card">
            <strong>4. Review</strong>
            <p>Too low means higher deductions or short-term out-of-pocket spend. Too high means surplus cash is tied up until review or reconciliation.</p>
          </div>
        </div>
      </section>

      <div className="operations-grid comparison-grid">
        <section className="operations-card compare-card direct">
          <h3>Provider card vs paying yourself</h3>
          <div className="compare-columns">
            <div>
              <h4>Use the provider card when possible</h4>
              <ul>
                <li>Usually the smoothest way to keep spending inside the package</li>
                <li>Often required for the provider’s preferred fuel or service networks</li>
                <li>Less paperwork because the merchant bills the provider directly</li>
                <li>Usually the best path if you want to avoid out-of-pocket spend entirely</li>
              </ul>
            </div>
            <div>
              <h4>Pay yourself and claim only when needed</h4>
              <ul>
                <li>Useful if you forgot the card, used a non-network merchant, or paid an urgent cost yourself</li>
                <li>Keep a valid tax invoice and proof of payment</li>
                <li>Submit the claim promptly through the provider portal</li>
                <li>Expect rejection if the account is short of funds or the expense is not eligible</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="operations-card compare-card reimburse">
          <h3>Why reimbursements sometimes get rejected</h3>
          <ul>
            <li>The receipt is missing, unreadable, or not a valid tax invoice.</li>
            <li>The expense sits outside the packaged categories or does not relate to the leased vehicle.</li>
            <li>The claim is duplicated or the provider card already paid the same cost.</li>
            <li>There is not enough funded balance in your account at the time the claim is reviewed.</li>
            <li>The claim was lodged too late, after the lease ended, or after a provider cut-off.</li>
            <li>The EV charging evidence or claim method does not match the provider’s rules for that FBT year.</li>
          </ul>
        </section>
      </div>

      <section className="operations-panel">
        <h3>How to avoid out-of-pocket payments entirely</h3>
        <div className="tip-grid">
          <article className="tip-card">
            <strong>Set the budget properly at the start</strong>
            <p>Include rego, insurance, tyres, servicing, roadside assistance, fuel or charging, and any known annual costs.</p>
          </article>
          <article className="tip-card">
            <strong>Use cards and approved merchants first</strong>
            <p>Card-based spending is usually the cleanest way to keep costs inside the package and avoid claims admin.</p>
          </article>
          <article className="tip-card">
            <strong>Review the balance before big spend</strong>
            <p>Tyres, annual insurance, registration, and EV charging hardware can blow through a budget faster than routine fuel.</p>
          </article>
          <article className="tip-card">
            <strong>Ask for a budget review early</strong>
            <p>If your kilometres, charging pattern, or insurance premium changed, ask for the deduction to be reset before the account runs dry.</p>
          </article>
          <article className="tip-card">
            <strong>Know the EV charging method</strong>
            <p>Do not assume home charging, public charging, and accessories all follow the same rule. Confirm the exact process with your provider.</p>
          </article>
          <article className="tip-card">
            <strong>Submit claims fast and keep evidence</strong>
            <p>Even eligible claims can be delayed if the invoice is weak, the odometer evidence is missing, or the lease is already closing out.</p>
          </article>
        </div>
      </section>

      <div className="operations-grid detail-grid">
        <section className="operations-card">
          <h3>How FBT is calculated in this setup</h3>
          <ol className="formula-list">
            <li>Work out the car&apos;s base value and how many days it was available for private use.</li>
            <li>Apply the statutory formula or operating cost method. In many employee novated lease programs, the statutory method is the practical default.</li>
            <li>Reduce the taxable value by any after-tax employee contributions if ECM is being used.</li>
            <li>Apply the FBT gross-up and FBT rate to the taxable value to work out the employer&apos;s FBT exposure.</li>
            <li>Check whether the car qualifies for the electric car exemption, because eligible EVs can remove the normal FBT cash cost altogether.</li>
          </ol>
          <div className="formula-note">
            <strong>How this app estimates it:</strong> the calculator uses a simplified statutory-rate model with a
            20% statutory rate, a 47% FBT rate, and a Type 1 gross-up for yearly estimates, then offsets the result
            with employee contributions where relevant. That is useful for education, but your payroll and provider
            calculation can differ because of timing, base-value rules, exemptions, and record-keeping.
          </div>
        </section>

        <section className="operations-card">
          <h3>Who to talk to, and when</h3>
          <div className="contact-grid">
            {contactRows.map((row) => (
              <div key={row.situation} className="contact-row">
                <div>
                  <span className="contact-label">Situation</span>
                  <strong>{row.situation}</strong>
                </div>
                <div>
                  <span className="contact-label">Who to talk to</span>
                  <strong>{row.who}</strong>
                </div>
                <div>
                  <span className="contact-label">Why</span>
                  <p>{row.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="operations-panel">
        <h3>Tax time: what to do and who should help</h3>
        <ul className="tax-checklist">
          <li>Start with your employer income statement and any year-end summary from the packaging or lease provider.</li>
          <li>Check whether a reportable fringe benefits amount appears, because it can affect HELP, Medicare levy surcharge, and other income-tested items even when it is not taxed like salary.</li>
          <li>Do not assume you can claim packaged running costs again in your tax return. Ask your accountant before claiming anything that has already been salary packaged.</li>
          <li>If your deductions, ECM amounts, or RFBA reporting look wrong, ask payroll and the provider to correct the source data before you lodge.</li>
          <li>Use a registered tax agent or accountant for the actual return. The provider explains the lease mechanics; your tax adviser explains your tax outcome.</li>
        </ul>
      </section>

      <footer className="operations-sources">
        <strong>Source links used for this section</strong>
        <p>
          Tax rules and thresholds can change each financial year, so treat these as starting
          points and confirm the current rules with the ATO or your tax adviser.
        </p>
        <div className="source-links">
          {sourceLinks.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </section>
  )
}

export default LeaseOperationsGuide
