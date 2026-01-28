import { useState } from 'react'
import type { QuoteData } from '../types/QuoteData'
import {
  createDefaultQuote,
  calculateCostBreakdown,
  calculateYearlyBreakdowns,
  calculateBuyVsLease,
  calculatePostLeaseScenarios,
  calculateResidualValue
} from '../utils/calculations'
import QuoteImport from './QuoteImport'
import CostBreakdownChart from './CostBreakdownChart'
import * as YearlyBreakdownModule from './YearlyBreakdown'
import LeaseAccountTracker from './LeaseAccountTracker'
import * as BuyVsLeaseComparisonModule from './BuyVsLeaseComparison'
import TaxImpactCalculator from './TaxImpactCalculator'
import PostLeaseAnalyzer from './PostLeaseAnalyzer'
import QuoteManager from './QuoteManager'
import './EnhancedCalculator.css'

const YearlyBreakdown = YearlyBreakdownModule.default
const BuyVsLeaseComparison = BuyVsLeaseComparisonModule.default

function EnhancedCalculator() {
  const [quoteData, setQuoteData] = useState<QuoteData>(createDefaultQuote())
  const [activeTab, setActiveTab] = useState<string>('overview')

  const handleQuoteImport = (importedData: QuoteData) => {
    setQuoteData(importedData)
    setActiveTab('overview')
  }

  const handleLoadQuote = (loadedData: QuoteData) => {
    setQuoteData(loadedData)
    setActiveTab('overview')
  }

  const handleManualUpdate = (field: string, value: any) => {
    setQuoteData(prev => {
      const keys = field.split('.')
      const updated = JSON.parse(JSON.stringify(prev))
      let current = updated
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  const costBreakdown = calculateCostBreakdown(quoteData)
  const yearlyBreakdowns = calculateYearlyBreakdowns(quoteData)
  const buyVsLease = calculateBuyVsLease(quoteData)
  const postLeaseScenarios = calculatePostLeaseScenarios(quoteData)
  const residualValue = calculateResidualValue(quoteData.vehicle.purchasePrice, quoteData.leaseTerms.durationYears)
  const annualPackageAmount = yearlyBreakdowns[0]?.principalPayment + yearlyBreakdowns[0]?.interestPayment + 
                               Object.values(quoteData.runningCosts).reduce((sum, cost) => sum + cost, 0)

  const tabs = [
    { id: 'import', label: '📋 Import Quote', icon: '📋' },
    { id: 'manage', label: '📁 Manage & Compare', icon: '📁' },
    { id: 'overview', label: '💰 Cost Breakdown', icon: '💰' },
    { id: 'yearly', label: '📊 Yearly Analysis', icon: '📊' },
    { id: 'account', label: '📈 Lease Account', icon: '📈' },
    { id: 'comparison', label: '⚖️ Buy vs Lease', icon: '⚖️' },
    { id: 'tax', label: '📊 Tax Impact', icon: '📊' },
    { id: 'postlease', label: '🔮 Post-Lease Options', icon: '🔮' }
  ]

  return (
    <div className="enhanced-calculator">
      <div className="calculator-header">
        <h2>🚗 Comprehensive Novated Lease Analysis</h2>
        <p>Explore all costs, savings, and scenarios for your novated lease</p>
      </div>

      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'import' && (
          <QuoteImport onImport={handleQuoteImport} />
        )}

        {activeTab === 'manage' && (
          <QuoteManager 
            currentQuote={quoteData}
            onLoadQuote={handleLoadQuote}
          />
        )}

        {activeTab === 'overview' && (
          <CostBreakdownChart costBreakdown={costBreakdown} />
        )}

        {activeTab === 'yearly' && (
          <YearlyBreakdown yearlyBreakdowns={yearlyBreakdowns} />
        )}

        {activeTab === 'account' && (
          <LeaseAccountTracker 
            yearlyBreakdowns={yearlyBreakdowns}
            residualValue={residualValue}
          />
        )}

        {activeTab === 'comparison' && (
          <BuyVsLeaseComparison 
            comparison={buyVsLease}
            leaseTerm={quoteData.leaseTerms.durationYears}
          />
        )}

        {activeTab === 'tax' && (
          <TaxImpactCalculator 
            quoteData={quoteData}
            annualPackageAmount={annualPackageAmount}
          />
        )}

        {activeTab === 'postlease' && (
          <PostLeaseAnalyzer scenarios={postLeaseScenarios} />
        )}
      </div>

      <div className="quick-edit-panel">
        <h3>Quick Edit Parameters</h3>
        <p className="edit-intro">Adjust any parameter below to see instant impact on costs and savings</p>
        
        <div className="edit-section">
          <h4>Vehicle & Lease Details</h4>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Vehicle Price ($)</label>
              <input
                type="number"
                value={quoteData.vehicle.purchasePrice}
                onChange={(e) => handleManualUpdate('vehicle.purchasePrice', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Lease Term (years)</label>
              <select
                value={quoteData.leaseTerms.durationYears}
                onChange={(e) => handleManualUpdate('leaseTerms.durationYears', Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(year => (
                  <option key={year} value={year}>{year} year{year > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="edit-field">
              <label>Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={(quoteData.leaseTerms.interestRate * 100).toFixed(2)}
                onChange={(e) => handleManualUpdate('leaseTerms.interestRate', Number(e.target.value) / 100)}
              />
            </div>
            <div className="edit-field">
              <label>Annual Kilometers</label>
              <input
                type="number"
                step="1000"
                value={quoteData.leaseTerms.annualKilometers}
                onChange={(e) => handleManualUpdate('leaseTerms.annualKilometers', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="edit-section">
          <h4>Fees</h4>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Establishment Fee ($)</label>
              <input
                type="number"
                value={quoteData.fees.establishmentFee}
                onChange={(e) => handleManualUpdate('fees.establishmentFee', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Monthly Admin Fee ($)</label>
              <input
                type="number"
                value={quoteData.fees.monthlyAdminFee}
                onChange={(e) => handleManualUpdate('fees.monthlyAdminFee', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>End of Lease Fee ($)</label>
              <input
                type="number"
                value={quoteData.fees.endOfLeaseFee}
                onChange={(e) => handleManualUpdate('fees.endOfLeaseFee', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="edit-section">
          <h4>Annual Running Costs</h4>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Fuel/Electricity ($/year)</label>
              <input
                type="number"
                value={quoteData.runningCosts.fuelPerYear}
                onChange={(e) => handleManualUpdate('runningCosts.fuelPerYear', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Insurance ($/year)</label>
              <input
                type="number"
                value={quoteData.runningCosts.insurancePerYear}
                onChange={(e) => handleManualUpdate('runningCosts.insurancePerYear', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Maintenance ($/year)</label>
              <input
                type="number"
                value={quoteData.runningCosts.maintenancePerYear}
                onChange={(e) => handleManualUpdate('runningCosts.maintenancePerYear', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Registration ($/year)</label>
              <input
                type="number"
                value={quoteData.runningCosts.registrationPerYear}
                onChange={(e) => handleManualUpdate('runningCosts.registrationPerYear', Number(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Tyres ($/year)</label>
              <input
                type="number"
                value={quoteData.runningCosts.tyresPerYear}
                onChange={(e) => handleManualUpdate('runningCosts.tyresPerYear', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="edit-section">
          <h4>Employee Details</h4>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Annual Salary ($)</label>
              <input
                type="number"
                value={quoteData.employee.annualSalary}
                onChange={(e) => {
                  handleManualUpdate('employee.annualSalary', Number(e.target.value))
                  handleManualUpdate('employee.taxableIncome', Number(e.target.value))
                }}
              />
            </div>
            <div className="edit-field">
              <label>HELP Debt</label>
              <select
                value={quoteData.employee.hasHELPDebt ? 'yes' : 'no'}
                onChange={(e) => {
                  const hasHelp = e.target.value === 'yes'
                  handleManualUpdate('employee.hasHELPDebt', hasHelp)
                  if (!hasHelp) {
                    handleManualUpdate('employee.helpRepaymentRate', 0)
                  }
                }}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            {quoteData.employee.hasHELPDebt && (
              <div className="edit-field">
                <label>HELP Repayment Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={((quoteData.employee.helpRepaymentRate || 0) * 100).toFixed(1)}
                  onChange={(e) => handleManualUpdate('employee.helpRepaymentRate', Number(e.target.value) / 100)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="edit-section">
          <h4>FBT Settings</h4>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Use Statutory Method</label>
              <select
                value={quoteData.fbt.useStatutoryMethod ? 'yes' : 'no'}
                onChange={(e) => handleManualUpdate('fbt.useStatutoryMethod', e.target.value === 'yes')}
              >
                <option value="yes">Yes (Recommended)</option>
                <option value="no">No</option>
              </select>
            </div>
            {quoteData.fbt.useStatutoryMethod && (
              <div className="edit-field">
                <label>Statutory Rate (%)</label>
                <input
                  type="number"
                  step="1"
                  value={(quoteData.fbt.statutoryRate! * 100).toFixed(0)}
                  onChange={(e) => handleManualUpdate('fbt.statutoryRate', Number(e.target.value) / 100)}
                />
              </div>
            )}
            <div className="edit-field">
              <label>Employee Contribution ($/year)</label>
              <input
                type="number"
                value={quoteData.fbt.employeeContributionAmount}
                onChange={(e) => handleManualUpdate('fbt.employeeContributionAmount', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCalculator
