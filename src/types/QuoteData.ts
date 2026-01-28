// Type definitions for novated lease quote data

export interface VehicleDetails {
  make: string
  model: string
  year: number
  purchasePrice: number
  driveawayPrice?: number
}

export interface LeaseTerms {
  durationYears: number
  interestRate: number // Annual interest rate as decimal (e.g., 0.07 for 7%)
  annualKilometers: number
}

export interface Fees {
  establishmentFee: number
  monthlyAdminFee: number
  endOfLeaseFee: number
}

export interface RunningCosts {
  fuelPerYear: number
  insurancePerYear: number
  maintenancePerYear: number
  registrationPerYear: number
  tyresPerYear: number
}

export interface FBTDetails {
  // Employee Contribution Method (ECM)
  employeeContributionAmount: number // Annual amount employee contributes post-tax
  // Statutory method calculation
  useStatutoryMethod: boolean
  statutoryRate?: number // Default 0.20 for most vehicles
}

export interface EmployeeDetails {
  annualSalary: number
  taxableIncome: number // May differ from salary if other income sources
  hasHELPDebt: boolean
  helpRepaymentRate?: number
}

// Values provided by the quote (vs calculated by us)
export interface QuoteProvidedValues {
  residualValue?: number // What the quote says the residual will be
  totalFinanceCharges?: number // What the quote says total interest will be
  fortnightlyPayment?: number // The fortnightly payment amount from quote
  monthlyPayment?: number // The monthly payment amount from quote
  totalPayments?: number // Total of all payments over lease term (from quote)
  totalLeaseCost?: number // What the quote claims is the total cost
  taxSavings?: number // Tax savings claimed by the quote
  gstSavings?: number // GST savings claimed by the quote
}

export interface QuoteData {
  vehicle: VehicleDetails
  leaseTerms: LeaseTerms
  fees: Fees
  runningCosts: RunningCosts
  fbt: FBTDetails
  employee: EmployeeDetails
  quoteProvidedValues?: QuoteProvidedValues // Optional: values from the quote itself
  customNotes?: string
}

// Calculation result types

export interface YearlyBreakdown {
  year: number
  principalPayment: number
  interestPayment: number
  runningCosts: number
  fees: number
  fbtCost: number
  taxSavings: number
  gstSavings: number
  netCost: number
  remainingPrincipal: number
}

export interface CostBreakdown {
  vehiclePrice: number
  financeCharges: number
  establishmentFee: number
  adminFees: number
  runningCosts: number
  fbtCost: number
  endOfLeaseFee: number
  totalGrossCost: number
  taxSavings: number
  gstSavings: number
  netCostBeforeResidual: number
  residualValue: number
  totalNetCost: number
}

// Comparison between quote-provided values and our calculations
export interface QuoteDiscrepancy {
  field: string
  label: string
  quoteValue: number
  calculatedValue: number
  difference: number
  percentageDiff: number
  isSignificant: boolean // True if difference is >5%
  explanation?: string
}

export interface QuoteValidation {
  discrepancies: QuoteDiscrepancy[]
  hasSignificantIssues: boolean
  overallAssessment: 'accurate' | 'minor_differences' | 'significant_differences' | 'major_concerns'
}

export interface TaxCalculation {
  grossIncome: number
  taxableIncome: number
  incomeTax: number
  medicareLevy: number
  helpRepayment: number
  totalTax: number
  netIncome: number
  effectiveTaxRate: number
  marginalTaxRate: number
}

export interface BuyVsLeaseComparison {
  buyOutright: {
    vehiclePrice: number
    runningCosts: number
    opportunityCost: number
    totalCost: number
    vehicleValueAtEnd: number
    netPosition: number
  }
  novatedLease: {
    totalCostBeforeResidual: number
    residualPayment: number
    totalCost: number
    vehicleValueAtEnd: number
    netPosition: number
  }
  difference: number
  recommendation: string
}

export interface PostLeaseScenario {
  scenarioType: 'purchase' | 'sell' | 'return' | 'extend'
  residualValue: number
  estimatedMarketValue: number
  description: string
  financialOutcome: number
  recommendation: string
}

// Saved quote with metadata for comparison
export interface SavedQuote {
  id: string
  name: string
  data: QuoteData
  savedAt: string
  notes?: string
}
