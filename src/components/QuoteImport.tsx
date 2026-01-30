import { useState } from 'react'
import type { QuoteData } from '../types/QuoteData'
import { saveQuote } from '../utils/quoteStorage'
import './QuoteImport.css'

interface QuoteImportProps {
  onImport: (data: QuoteData) => void
}

const LLM_EXTRACTION_PROMPT = `You are a financial analysis assistant helping consumers understand the true cost of novated lease quotes. Extract all financial information from the provided quote and analyze it to uncover hidden costs.

**CRITICAL INSTRUCTIONS:**

1. **Read the quote carefully** - Look for all costs, fees, and charges
2. **ALL VALUES MUST BE PRE-TAX AND EXCLUDE GST:**
   - Extract the BASE vehicle price BEFORE GST (divide drive-away by 1.1 if needed)
   - Extract ALL costs as PRE-TAX values (excluding GST)
   - This is CRUCIAL for accurate comparison calculations
   - If a value includes GST, explicitly note it and provide the ex-GST amount
   - Example: If quote shows $55,000 drive-away, extract $50,000 as purchasePrice
3. **Extract BOTH provided values AND underlying data:**
   - Extract what the quote CLAIMS (residual value, total cost, payments, etc.)
   - Extract the data we need to CALCULATE these ourselves (vehicle price, interest rate, term, etc.)
   - This allows us to compare their numbers with our calculations
4. **INTEREST RATE - PAY SPECIAL ATTENTION:**
   - The interest rate in quotes is often the EFFECTIVE rate after accounting for tax benefits
   - Look for explicit interest rate statements (e.g., "7.0% p.a." or "comparison rate 7.5%")
   - If the quote shows fortnightly/monthly payments, back-calculate the rate
   - Note: Some quotes may show a lower "effective" rate due to tax savings - we need the ACTUAL finance rate
   - If unclear, use a conservative estimate around 7% (0.07)
5. **Identify ALL hidden costs and fees:**
   - Management fees (monthly/annual)
   - Establishment/application fees
   - End-of-lease fees
   - Insurance markups or broker fees
   - Maintenance package costs
   - Document fees
   - Any other administrative charges
6. **Extract metadata and terms:**
   - Leaser/provider name
   - Budget flexibility information (can the budget be adjusted? is pre-tax top-up allowed?)
   - Key terms and conditions that might be unfavorable to customers
   - Any unusual clauses or restrictions
7. **Output ONLY valid JSON** matching the structure below

**Required JSON Structure:**

\`\`\`json
{
  "vehicle": {
    "make": "Toyota",
    "model": "RAV4",
    "year": 2024,
    "purchasePrice": 50000
  },
  "leaseTerms": {
    "durationYears": 3,
    "interestRate": 0.07,
    "annualKilometers": 15000
  },
  "fees": {
    "establishmentFee": 500,
    "monthlyAdminFee": 10,
    "endOfLeaseFee": 350
  },
  "runningCosts": {
    "fuelPerYear": 2000,
    "insurancePerYear": 1200,
    "maintenancePerYear": 800,
    "registrationPerYear": 800,
    "tyresPerYear": 200
  },
  "fbt": {
    "employeeContributionAmount": 0,
    "useStatutoryMethod": true,
    "statutoryRate": 0.20
  },
  "employee": {
    "annualSalary": 80000,
    "taxableIncome": 80000,
    "hasHELPDebt": false,
    "helpRepaymentRate": 0
  },
  "quoteProvidedValues": {
    "residualValue": 23440,
    "totalFinanceCharges": 5250,
    "fortnightlyPayment": 450,
    "monthlyPayment": 975,
    "totalPayments": 35100,
    "totalLeaseCost": 58540,
    "taxSavings": 8500,
    "gstSavings": 4545
  },
  "metadata": {
    "leaserName": "FleetPartners",
    "budgetFlexibility": "flexible",
    "preTaxTopUp": true,
    "customerWarnings": [
      "Early termination fee of $2000 applies if lease is ended before term",
      "Annual adjustment fee of $150 charged each year"
    ],
    "extractedTerms": [
      "Budget can be adjusted quarterly with 30 days notice",
      "Pre-tax top-up allowed up to $5000/year",
      "Insurance must be purchased through provider's network"
    ]
  }
}
\`\`\`

**Field Descriptions - FOCUS ON COSTS:**

**VEHICLE & CORE COSTS (Most Important):**
- **vehicle.purchasePrice**: Drive-away price EXCLUDING GST (pre-tax value)
  - This is the base amount being financed
  - If quote shows $55,000 drive-away, extract as $50,000 ($55,000 / 1.1)
  - GST is calculated separately in our tool
- **leaseTerms.interestRate**: Annual FINANCE interest rate as decimal (e.g., 7% = 0.07)
  - TRY TO CALCULATE this from the payment amount if not stated
  - This is the actual interest rate on the loan, NOT an "effective" rate after tax
  - Look for: "comparison rate", "interest rate", "rate p.a."
  - This determines how much extra you pay over the lease term
  - Common range: 0.05-0.10 (5%-10%)
  - WARNING: Some quotes show "effective rate after tax" - we need the ACTUAL rate
- **leaseTerms.durationYears**: Length of lease (typically 1-5 years)
- **leaseTerms.annualKilometers**: Expected annual kilometers

**FEES & HIDDEN COSTS (Critical for Comparison - ALL PRE-TAX):**
- **fees.establishmentFee**: One-time setup/application fee (pre-tax, ex-GST)
  - Often hidden in "documentation" or "processing" fees
  - Typical range: $300-$800
- **fees.monthlyAdminFee**: Monthly account management fee (pre-tax, ex-GST)
  - This is MONTHLY, not annual
  - Multiply by lease term to see total impact
  - Typical range: $8-$15 per month
- **fees.endOfLeaseFee**: Fee charged at lease end (pre-tax, ex-GST)
  - May be called "disposal fee", "payout fee", or "termination fee"
  - Typical range: $300-$500

**RUNNING COSTS (Annual - ALL PRE-TAX, EX-GST - These are REIMBURSABLE via pre-tax deductions):**
- **fuelPerYear**: Annual fuel/electricity costs (pre-tax, ex-GST)
- **insurancePerYear**: Annual insurance premium (pre-tax, ex-GST)
  - Watch for markups above market rates
- **maintenancePerYear**: Annual service and maintenance (pre-tax, ex-GST)
  - If included as a "package", check if it's competitive
- **registrationPerYear**: Annual registration/CTP (pre-tax, ex-GST)
- **tyresPerYear**: Annual tyre replacement costs (pre-tax, ex-GST)

NOTE: Running costs are reimbursable - they're paid from your pre-tax salary, providing tax savings.

**FBT & TAX (Less Important for Comparison):**
- **fbt.employeeContributionAmount**: Annual post-tax employee contribution
- **fbt.useStatutoryMethod**: true if using statutory FBT method
- **fbt.statutoryRate**: Statutory rate (0.20 for most vehicles, 0 for EVs)

**EMPLOYEE DETAILS:**
- **employee.annualSalary**: Gross annual salary
- **employee.taxableIncome**: Taxable income (usually same as salary)
- **employee.hasHELPDebt**: true/false
- **employee.helpRepaymentRate**: HELP repayment rate as decimal (0-0.10)

**QUOTE PROVIDED VALUES (Extract what the quote claims - these may include GST):**
- **quoteProvidedValues.residualValue**: The residual/balloon payment stated in the quote
  - We'll compare this with ATO minimum residual values
- **quoteProvidedValues.totalFinanceCharges**: Total interest charges claimed
  - We'll verify this matches the interest rate and payment structure
- **quoteProvidedValues.fortnightlyPayment**: Fortnightly payment amount from quote
  - Extract this even if monthly is also provided
- **quoteProvidedValues.monthlyPayment**: Monthly payment amount from quote
  - Extract this even if fortnightly is also provided
- **quoteProvidedValues.totalPayments**: Sum of all payments over the lease term
  - Not including residual, just the regular payments
- **quoteProvidedValues.totalLeaseCost**: Total cost of lease claimed by quote
  - This might include or exclude residual - note what it includes
- **quoteProvidedValues.taxSavings**: Tax savings claimed by the provider
  - We'll recalculate this based on actual tax rates
- **quoteProvidedValues.gstSavings**: GST savings claimed by the provider
  - We'll verify this is accurate

**METADATA (NEW - Extract important information):**
- **metadata.leaserName**: Name of the leasing company/provider
  - Extract from letterhead, footer, or company name in the quote
- **metadata.budgetFlexibility**: Can the budget be adjusted?
  - "fixed" = No adjustments allowed
  - "flexible" = Can adjust with notice
  - "adjustable" = Quarterly or annual adjustments allowed
  - "unknown" = Not specified
- **metadata.preTaxTopUp**: true if pre-tax top-up is allowed
  - Look for mentions of "budget adjustment", "pre-tax contribution", or "top-up"
- **metadata.customerWarnings**: Array of unfavorable terms (extract ALL that apply)
  - Early termination fees/penalties
  - Annual adjustment fees
  - Excessive admin charges
  - Insurance/maintenance must be purchased through specific providers
  - High balloon payment requirements
  - Restrictions on vehicle modifications
  - Any other terms that seem disadvantageous to customers
- **metadata.extractedTerms**: Array of key terms that differ from standard
  - Budget adjustment policies
  - Top-up allowances
  - Special conditions or requirements
  - Unique features or restrictions

**IMPORTANT NOTES:**
- **CRITICAL**: All amounts (except quoteProvidedValues) MUST be pre-tax and exclude GST
- If a value in quoteProvidedValues is not stated in the quote, omit it (don't set to 0)
- Only include quoteProvidedValues that are explicitly stated
- Use 0 for fees/costs that aren't mentioned
- All quoteProvidedValues should match EXACTLY what's in the quote
- Include metadata fields even if not all information is available

**ANALYSIS TIPS:**
- Compare fortnightly payments across quotes - but also check the interest rate!
- Low payments might mean high interest or long term
- Check if insurance/maintenance costs are marked up
- Total fees over the lease term can add thousands to the cost
- The residual value determines your final balloon payment
- Budget flexibility and pre-tax top-up can significantly impact affordability
- Always extract PRE-TAX values to ensure accurate comparison baseline

**Now extract and analyze the data from the following quote:**

[PASTE YOUR QUOTE HERE]`

function QuoteImport({ onImport }: QuoteImportProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSaveOption, setShowSaveOption] = useState(false)
  const [quoteName, setQuoteName] = useState('')
  const [importedData, setImportedData] = useState<QuoteData | null>(null)

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput) as QuoteData
      
      if (!parsed.vehicle || !parsed.leaseTerms || !parsed.employee) {
        throw new Error('Missing required fields in JSON')
      }
      
      // Pre-populate quote name with leaser name and vehicle if available
      if (!quoteName && parsed.metadata?.leaserName) {
        const vehicle = `${parsed.vehicle.make} ${parsed.vehicle.model}`
        setQuoteName(`${vehicle} - ${parsed.metadata.leaserName}`)
      }
      
      setError(null)
      setImportedData(parsed)
      setShowSaveOption(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
  }

  const handleLoadWithoutSaving = () => {
    if (importedData) {
      onImport(importedData)
      resetForm()
    }
  }

  const handleSaveAndLoad = () => {
    if (!importedData) return
    
    if (!quoteName.trim()) {
      setError('Please enter a name for this quote')
      return
    }

    try {
      saveQuote(quoteName.trim(), importedData)
      onImport(importedData)
      resetForm()
    } catch (err) {
      setError('Failed to save quote. Please try again.')
    }
  }

  const resetForm = () => {
    setJsonInput('')
    setError(null)
    setShowSaveOption(false)
    setQuoteName('')
    setImportedData(null)
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(LLM_EXTRACTION_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy. Please manually select and copy the text.')
    }
  }

  return (
    <div className="quote-import">
      <h2>📋 Import Quote Data</h2>
      <p className="quote-import-intro">
        Have a novated lease quote? Use an AI assistant to extract the data automatically!
      </p>

      <div className="import-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Get the Extraction Prompt</h3>
            <button 
              className="btn-secondary"
              onClick={() => setShowPrompt(!showPrompt)}
            >
              {showPrompt ? 'Hide Prompt' : 'Show LLM Extraction Prompt'}
            </button>
            
            {showPrompt && (
              <div className="prompt-container">
                <div className="prompt-header">
                  <span>Copy this prompt and use it with ChatGPT, Claude, or any LLM</span>
                  <button onClick={copyPrompt} className="btn-copy">
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <pre className="prompt-text">{LLM_EXTRACTION_PROMPT}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Paste Your Quote</h3>
            <p>Paste your novated lease quote text or PDF contents after the prompt in your AI assistant.</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Import the JSON</h3>
            <p>Copy the JSON output from the AI and paste it here:</p>
            <textarea
              className="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste the JSON output here...'
              rows={10}
            />
            {error && <div className="error-message">{error}</div>}
            
            {!showSaveOption ? (
              <button 
                className="btn-primary"
                onClick={handleImport}
                disabled={!jsonInput.trim()}
              >
                Import Quote Data
              </button>
            ) : (
              <div className="save-options">
                <h4>Quote Imported Successfully!</h4>
                <p>Would you like to save this quote for comparison later?</p>
                
                <div className="save-input-group">
                  <input
                    type="text"
                    placeholder="Enter a name for this quote (e.g., Toyota RAV4 - Dealer A)"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    className="quote-name-input"
                  />
                </div>
                
                <div className="save-actions">
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadWithoutSaving}
                  >
                    Load Without Saving
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleSaveAndLoad}
                  >
                    Save & Load Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="manual-entry-note">
        <p>
          <strong>Prefer manual entry?</strong> You can also fill in all the fields manually below.
        </p>
      </div>
    </div>
  )
}

export default QuoteImport
