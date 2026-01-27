import { useState } from 'react'
import type { QuoteData } from '../types/QuoteData'
import './QuoteImport.css'

interface QuoteImportProps {
  onImport: (data: QuoteData) => void
}

const LLM_EXTRACTION_PROMPT = `You are a financial data extraction assistant. Extract novated lease quote information from the provided document and output it as JSON.

**Instructions:**
1. Read the novated lease quote carefully
2. Extract all relevant financial information
3. Output ONLY valid JSON matching the structure below
4. Use 0 for any fees or costs not mentioned in the quote
5. Convert all percentages to decimals (e.g., 7% = 0.07)
6. Use annual amounts for all recurring costs

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
  }
}
\`\`\`

**Field Descriptions:**

- **vehicle.purchasePrice**: Total drive-away price or vehicle purchase price
- **leaseTerms.interestRate**: Annual interest rate as decimal (e.g., 7% = 0.07)
- **leaseTerms.annualKilometers**: Expected annual kilometers driven
- **fees.establishmentFee**: One-time setup fee
- **fees.monthlyAdminFee**: Monthly account management fee
- **fees.endOfLeaseFee**: Fee charged at end of lease
- **runningCosts**: All amounts should be ANNUAL costs
  - **fuelPerYear**: Annual fuel costs
  - **insurancePerYear**: Annual insurance premium
  - **maintenancePerYear**: Annual service and maintenance
  - **registrationPerYear**: Annual registration/CTP
  - **tyresPerYear**: Annual tyre replacement costs
- **fbt.employeeContributionAmount**: Annual post-tax employee contribution
- **fbt.useStatutoryMethod**: true if using statutory FBT method, false if ECM
- **fbt.statutoryRate**: Statutory rate (usually 0.20 or 0.09 for EVs)
- **employee.helpRepaymentRate**: HELP/HECS repayment rate as decimal (e.g., 0.01 for 1%)

**Now extract the data from the following quote:**

[PASTE YOUR QUOTE HERE]`

function QuoteImport({ onImport }: QuoteImportProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput) as QuoteData
      
      if (!parsed.vehicle || !parsed.leaseTerms || !parsed.employee) {
        throw new Error('Missing required fields in JSON')
      }
      
      setError(null)
      onImport(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
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
            {error && <div className="error-message">❌ {error}</div>}
            <button 
              className="btn-primary"
              onClick={handleImport}
              disabled={!jsonInput.trim()}
            >
              Import Quote Data
            </button>
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
