import type {
  QuoteData,
  YearlyBreakdown,
  CostBreakdown,
  TaxCalculation,
  BuyVsLeaseComparison,
  PostLeaseScenario,
  QuoteDiscrepancy,
  QuoteValidation
} from '../types/QuoteData'

const ATO_RESIDUAL_VALUES: Record<number, number> = {
  1: 0.6563,
  2: 0.5625,
  3: 0.4688,
  4: 0.3750,
  5: 0.2813
}

const TAX_BRACKETS_2025_26 = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 }
]

const MEDICARE_LEVY_RATE = 0.02

const GST_RATE = 0.10

export function calculateIncomeTax(taxableIncome: number, hasHELPDebt: boolean = false, helpRate: number = 0): TaxCalculation {
  const bracket = TAX_BRACKETS_2025_26.find(b => taxableIncome <= b.max)!
  const taxableAboveBracketMin = Math.max(0, taxableIncome - bracket.min)
  const incomeTax = bracket.base + (taxableAboveBracketMin * bracket.rate)
  
  const medicareLevy = taxableIncome * MEDICARE_LEVY_RATE
  const helpRepayment = hasHELPDebt ? taxableIncome * helpRate : 0
  
  const totalTax = incomeTax + medicareLevy + helpRepayment
  const netIncome = taxableIncome - totalTax
  const effectiveTaxRate = taxableIncome > 0 ? totalTax / taxableIncome : 0
  const marginalTaxRate = bracket.rate + MEDICARE_LEVY_RATE + (hasHELPDebt ? helpRate : 0)
  
  return {
    grossIncome: taxableIncome,
    taxableIncome,
    incomeTax,
    medicareLevy,
    helpRepayment,
    totalTax,
    netIncome,
    effectiveTaxRate,
    marginalTaxRate
  }
}

export function calculateResidualValue(vehiclePrice: number, years: number): number {
  const residualRate = ATO_RESIDUAL_VALUES[years] || ATO_RESIDUAL_VALUES[5]
  return vehiclePrice * residualRate
}

export function calculateFinanceCharge(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12
  const months = years * 12
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1)
  const totalPayments = monthlyPayment * months
  return totalPayments - principal
}

export function calculateYearlyBreakdowns(quote: QuoteData): YearlyBreakdown[] {
  const { vehicle, leaseTerms, fees, runningCosts, fbt, employee } = quote
  
  const residualValue = calculateResidualValue(vehicle.purchasePrice, leaseTerms.durationYears)
  const financeAmount = vehicle.purchasePrice - residualValue
  
  const monthlyRate = leaseTerms.interestRate / 12
  const months = leaseTerms.durationYears * 12
  const monthlyPayment = (financeAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                         (Math.pow(1 + monthlyRate, months) - 1)
  
  const breakdowns: YearlyBreakdown[] = []
  let remainingPrincipal = financeAmount
  
  // For FBT calculation using diminishing value method
  const vehicleBaseValue = vehicle.purchasePrice / (1 + GST_RATE)
  
  for (let year = 1; year <= leaseTerms.durationYears; year++) {
    let yearlyInterest = 0
    let yearlyPrincipal = 0
    
    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingPrincipal * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      
      yearlyInterest += interestPayment
      yearlyPrincipal += principalPayment
      remainingPrincipal -= principalPayment
    }
    
    const totalRunningCosts = Object.values(runningCosts).reduce((sum, cost) => sum + cost, 0)
    const annualAdminFees = fees.monthlyAdminFee * 12
    const yearFees = annualAdminFees + (year === 1 ? fees.establishmentFee : 0) + 
                     (year === leaseTerms.durationYears ? fees.endOfLeaseFee : 0)
    
    // Calculate FBT using diminishing base value (reduces by 1/3 each year)
    const yearBaseValue = vehicleBaseValue * Math.pow(2/3, year - 1)
    const fbtCost = calculateFBTCostForYear(yearBaseValue, fbt)
    
    const preTaxPackageAmount = yearlyPrincipal + yearlyInterest + totalRunningCosts + annualAdminFees
    const taxBracket = calculateIncomeTax(employee.taxableIncome, employee.hasHELPDebt, employee.helpRepaymentRate)
    const taxSavings = preTaxPackageAmount * taxBracket.marginalTaxRate
    
    const vehicleGSTSavings = (vehicle.purchasePrice * GST_RATE / leaseTerms.durationYears)
    const runningCostsGSTSavings = totalRunningCosts * GST_RATE / (1 + GST_RATE)
    const gstSavings = vehicleGSTSavings + runningCostsGSTSavings
    
    const grossCost = yearlyPrincipal + yearlyInterest + totalRunningCosts + yearFees + fbtCost
    const netCost = grossCost - taxSavings - gstSavings
    
    breakdowns.push({
      year,
      principalPayment: yearlyPrincipal,
      interestPayment: yearlyInterest,
      runningCosts: totalRunningCosts,
      fees: yearFees,
      fbtCost,
      taxSavings,
      gstSavings,
      netCost,
      remainingPrincipal: Math.max(0, remainingPrincipal)
    })
  }
  
  return breakdowns
}

export function calculateFBTCost(
  vehicleBaseValue: number,
  fbtDetails: { employeeContributionAmount: number; useStatutoryMethod: boolean; statutoryRate?: number }
): number {
  const FBT_RATE = 0.47
  
  if (!fbtDetails.useStatutoryMethod) {
    return 0
  }
  
  // Use the provided statutory rate, or default to 0.20 if undefined
  // Important: Allow 0% rate (for EVs or FBT-exempt vehicles)
  const statutoryRate = fbtDetails.statutoryRate !== undefined ? fbtDetails.statutoryRate : 0.20
  const taxableValue = vehicleBaseValue * statutoryRate
  const fbtPayable = taxableValue * FBT_RATE
  const employeeContribution = fbtDetails.employeeContributionAmount
  
  return Math.max(0, fbtPayable - (employeeContribution * FBT_RATE))
}

export function calculateFBTCostForYear(
  vehicleBaseValueForYear: number,
  fbtDetails: { employeeContributionAmount: number; useStatutoryMethod: boolean; statutoryRate?: number }
): number {
  const FBT_RATE = 0.47
  const TYPE_1_GROSSUP = 2.0802 // For GST-registered items
  
  if (!fbtDetails.useStatutoryMethod) {
    return 0
  }
  
  // Use the provided statutory rate, or default to 0.20 if undefined
  // Important: Allow 0% rate (for EVs or FBT-exempt vehicles)
  const statutoryRate = fbtDetails.statutoryRate !== undefined ? fbtDetails.statutoryRate : 0.20
  
  // Calculate taxable value
  const taxableValue = vehicleBaseValueForYear * statutoryRate
  
  // Apply Type 1 gross-up for items that include GST
  const grossedUpValue = taxableValue * TYPE_1_GROSSUP
  
  // Calculate FBT payable
  const fbtPayable = grossedUpValue * FBT_RATE
  
  // Reduce by employee contribution (also grossed up)
  const employeeContribution = fbtDetails.employeeContributionAmount
  const employeeContributionReduction = employeeContribution * TYPE_1_GROSSUP * FBT_RATE
  
  return Math.max(0, fbtPayable - employeeContributionReduction)
}

export function calculateCostBreakdown(quote: QuoteData): CostBreakdown {
  const yearlyBreakdowns = calculateYearlyBreakdowns(quote)
  const residualValue = calculateResidualValue(quote.vehicle.purchasePrice, quote.leaseTerms.durationYears)
  
  const vehiclePrice = quote.vehicle.purchasePrice
  const financeCharges = yearlyBreakdowns.reduce((sum, y) => sum + y.interestPayment, 0)
  const runningCosts = yearlyBreakdowns.reduce((sum, y) => sum + y.runningCosts, 0)
  const fbtCost = yearlyBreakdowns.reduce((sum, y) => sum + y.fbtCost, 0)
  const taxSavings = yearlyBreakdowns.reduce((sum, y) => sum + y.taxSavings, 0)
  const gstSavings = yearlyBreakdowns.reduce((sum, y) => sum + y.gstSavings, 0)
  
  const establishmentFee = quote.fees.establishmentFee
  const adminFees = quote.fees.monthlyAdminFee * 12 * quote.leaseTerms.durationYears
  const endOfLeaseFee = quote.fees.endOfLeaseFee
  
  const totalGrossCost = vehiclePrice + financeCharges + runningCosts + fbtCost
  const netCostBeforeResidual = totalGrossCost - taxSavings - gstSavings
  const totalNetCost = netCostBeforeResidual + residualValue
  
  return {
    vehiclePrice,
    financeCharges,
    establishmentFee,
    adminFees,
    runningCosts,
    fbtCost,
    endOfLeaseFee,
    totalGrossCost,
    taxSavings,
    gstSavings,
    netCostBeforeResidual,
    residualValue,
    totalNetCost
  }
}

export function calculateBuyVsLease(quote: QuoteData): BuyVsLeaseComparison {
  const leaseCosts = calculateCostBreakdown(quote)
  const years = quote.leaseTerms.durationYears
  
  const deprecationRate = 0.15
  const vehicleValueAtEnd = quote.vehicle.purchasePrice * Math.pow(1 - deprecationRate, years)
  
  const totalRunningCosts = Object.values(quote.runningCosts).reduce((sum, cost) => sum + cost, 0) * years
  const opportunityRate = 0.05
  const opportunityCost = quote.vehicle.purchasePrice * opportunityRate * years
  
  const buyTotalCost = quote.vehicle.purchasePrice + totalRunningCosts + opportunityCost
  const buyNetPosition = vehicleValueAtEnd - buyTotalCost
  
  const leaseTotalCost = leaseCosts.netCostBeforeResidual + leaseCosts.residualValue
  const leaseNetPosition = vehicleValueAtEnd - leaseTotalCost
  
  const difference = leaseNetPosition - buyNetPosition
  const recommendation = difference > 0 
    ? `Novated lease saves approximately $${Math.abs(difference).toFixed(0)}`
    : `Buying outright saves approximately $${Math.abs(difference).toFixed(0)}`
  
  return {
    buyOutright: {
      vehiclePrice: quote.vehicle.purchasePrice,
      runningCosts: totalRunningCosts,
      opportunityCost,
      totalCost: buyTotalCost,
      vehicleValueAtEnd,
      netPosition: buyNetPosition
    },
    novatedLease: {
      totalCostBeforeResidual: leaseCosts.netCostBeforeResidual,
      residualPayment: leaseCosts.residualValue,
      totalCost: leaseTotalCost,
      vehicleValueAtEnd,
      netPosition: leaseNetPosition
    },
    difference,
    recommendation
  }
}

export function calculatePostLeaseScenarios(quote: QuoteData): PostLeaseScenario[] {
  const residualValue = calculateResidualValue(quote.vehicle.purchasePrice, quote.leaseTerms.durationYears)
  const deprecationRate = 0.15
  const estimatedMarketValue = quote.vehicle.purchasePrice * Math.pow(1 - deprecationRate, quote.leaseTerms.durationYears)
  
  const scenarios: PostLeaseScenario[] = [
    {
      scenarioType: 'purchase',
      residualValue,
      estimatedMarketValue,
      description: `Pay the residual of $${residualValue.toFixed(0)} to own the vehicle outright. You can pay cash or refinance this amount.`,
      financialOutcome: estimatedMarketValue - residualValue,
      recommendation: estimatedMarketValue > residualValue 
        ? 'Good option if you want to keep the vehicle - estimated equity of $' + (estimatedMarketValue - residualValue).toFixed(0)
        : 'Vehicle may be worth less than residual - consider other options'
    },
    {
      scenarioType: 'sell',
      residualValue,
      estimatedMarketValue,
      description: `Sell the vehicle privately or through a dealer. Use proceeds to pay the residual.`,
      financialOutcome: estimatedMarketValue - residualValue,
      recommendation: estimatedMarketValue > residualValue
        ? 'You could pocket approximately $' + (estimatedMarketValue - residualValue).toFixed(0) + ' after paying the residual'
        : 'You may need to cover a shortfall of approximately $' + (residualValue - estimatedMarketValue).toFixed(0)
    },
    {
      scenarioType: 'return',
      residualValue,
      estimatedMarketValue,
      description: `Return the vehicle to the lease company. They sell it and you receive any surplus (or pay any shortfall).`,
      financialOutcome: estimatedMarketValue - residualValue - 500,
      recommendation: 'Convenient option but you may receive less than private sale due to dealer margins and return fees (~$500)'
    },
    {
      scenarioType: 'extend',
      residualValue,
      estimatedMarketValue,
      description: `Refinance the residual into a new novated lease to continue using the vehicle.`,
      financialOutcome: -residualValue * 0.07 * 3,
      recommendation: 'Allows you to continue the tax benefits. Typical 3-year extension would cost approximately $' + 
                      (residualValue * 0.07 * 3).toFixed(0) + ' in interest'
    }
  ]
  
  return scenarios
}

export function createDefaultQuote(): QuoteData {
  return {
    vehicle: {
      make: 'Toyota',
      model: 'RAV4',
      year: 2024,
      purchasePrice: 50000
    },
    leaseTerms: {
      durationYears: 3,
      interestRate: 0.07,
      annualKilometers: 15000
    },
    fees: {
      establishmentFee: 500,
      monthlyAdminFee: 10,
      endOfLeaseFee: 350
    },
    runningCosts: {
      fuelPerYear: 2000,
      insurancePerYear: 1200,
      maintenancePerYear: 800,
      registrationPerYear: 800,
      tyresPerYear: 200
    },
    fbt: {
      employeeContributionAmount: 0,
      useStatutoryMethod: true,
      statutoryRate: 0.20
    },
    employee: {
      annualSalary: 80000,
      taxableIncome: 80000,
      hasHELPDebt: false,
      helpRepaymentRate: 0
    }
  }
}

export function validateQuoteValues(quote: QuoteData): QuoteValidation {
  const discrepancies: QuoteDiscrepancy[] = []
  const providedValues = quote.quoteProvidedValues
  
  if (!providedValues) {
    return {
      discrepancies: [],
      hasSignificantIssues: false,
      overallAssessment: 'accurate'
    }
  }

  const breakdown = calculateCostBreakdown(quote)

  // Check residual value
  if (providedValues.residualValue !== undefined) {
    const calculatedResidual = breakdown.residualValue
    const diff = providedValues.residualValue - calculatedResidual
    const percentDiff = (diff / calculatedResidual) * 100

    discrepancies.push({
      field: 'residualValue',
      label: 'Residual/Balloon Payment',
      quoteValue: providedValues.residualValue,
      calculatedValue: calculatedResidual,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 5,
      explanation: Math.abs(percentDiff) > 5 
        ? `The quote's residual is ${percentDiff > 0 ? 'higher' : 'lower'} than ATO minimum residual values. ${percentDiff > 0 ? 'This increases your balloon payment.' : 'This may not meet ATO requirements.'}`
        : undefined
    })
  }

  // Check total finance charges
  if (providedValues.totalFinanceCharges !== undefined) {
    const calculatedFinanceCharges = breakdown.financeCharges
    const diff = providedValues.totalFinanceCharges - calculatedFinanceCharges
    const percentDiff = calculatedFinanceCharges > 0 ? (diff / calculatedFinanceCharges) * 100 : 0

    discrepancies.push({
      field: 'financeCharges',
      label: 'Total Interest Charges',
      quoteValue: providedValues.totalFinanceCharges,
      calculatedValue: calculatedFinanceCharges,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 5,
      explanation: Math.abs(percentDiff) > 5
        ? `The quote's interest charges are ${percentDiff > 0 ? 'higher' : 'lower'} than expected based on the stated interest rate. ${percentDiff > 0 ? 'You may be paying more than the advertised rate suggests.' : 'Double-check the calculation.'}`
        : undefined
    })
  }

  // Check fortnightly payment (if provided)
  if (providedValues.fortnightlyPayment !== undefined) {
    const annualCost = breakdown.netCostBeforeResidual / quote.leaseTerms.durationYears
    const calculatedFortnightly = annualCost / 26
    const diff = providedValues.fortnightlyPayment - calculatedFortnightly
    const percentDiff = (diff / calculatedFortnightly) * 100

    discrepancies.push({
      field: 'fortnightlyPayment',
      label: 'Fortnightly Payment',
      quoteValue: providedValues.fortnightlyPayment,
      calculatedValue: calculatedFortnightly,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 5,
      explanation: Math.abs(percentDiff) > 5
        ? `The quoted fortnightly payment ${percentDiff > 0 ? 'is higher' : 'is lower'} than our calculation. ${percentDiff > 0 ? 'This could indicate additional fees or different tax assumptions.' : 'Verify what\'s included in their calculation.'}`
        : undefined
    })
  }

  // Check monthly payment (if provided)
  if (providedValues.monthlyPayment !== undefined) {
    const annualCost = breakdown.netCostBeforeResidual / quote.leaseTerms.durationYears
    const calculatedMonthly = annualCost / 12
    const diff = providedValues.monthlyPayment - calculatedMonthly
    const percentDiff = (diff / calculatedMonthly) * 100

    discrepancies.push({
      field: 'monthlyPayment',
      label: 'Monthly Payment',
      quoteValue: providedValues.monthlyPayment,
      calculatedValue: calculatedMonthly,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 5,
      explanation: Math.abs(percentDiff) > 5
        ? `The quoted monthly payment ${percentDiff > 0 ? 'is higher' : 'is lower'} than our calculation. ${percentDiff > 0 ? 'This could indicate additional fees or different tax assumptions.' : 'Verify what\'s included in their calculation.'}`
        : undefined
    })
  }

  // Check tax savings
  if (providedValues.taxSavings !== undefined) {
    const calculatedTaxSavings = breakdown.taxSavings
    const diff = providedValues.taxSavings - calculatedTaxSavings
    const percentDiff = calculatedTaxSavings > 0 ? (diff / calculatedTaxSavings) * 100 : 0

    discrepancies.push({
      field: 'taxSavings',
      label: 'Tax Savings',
      quoteValue: providedValues.taxSavings,
      calculatedValue: calculatedTaxSavings,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 10,
      explanation: Math.abs(percentDiff) > 10
        ? `The quote's tax savings estimate ${percentDiff > 0 ? 'is higher' : 'is lower'} than our calculation based on current tax rates. ${percentDiff > 0 ? 'They may be using optimistic assumptions.' : 'Their estimate seems conservative.'}`
        : undefined
    })
  }

  // Check GST savings
  if (providedValues.gstSavings !== undefined) {
    const calculatedGSTSavings = breakdown.gstSavings
    const diff = providedValues.gstSavings - calculatedGSTSavings
    const percentDiff = calculatedGSTSavings > 0 ? (diff / calculatedGSTSavings) * 100 : 0

    discrepancies.push({
      field: 'gstSavings',
      label: 'GST Savings',
      quoteValue: providedValues.gstSavings,
      calculatedValue: calculatedGSTSavings,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 10,
      explanation: Math.abs(percentDiff) > 10
        ? `The quote's GST savings ${percentDiff > 0 ? 'is higher' : 'is lower'} than expected. ${percentDiff > 0 ? 'Verify what items they\'re claiming GST credits on.' : 'GST calculation may be conservative.'}`
        : undefined
    })
  }

  // Check total lease cost
  if (providedValues.totalLeaseCost !== undefined) {
    // Total lease cost might or might not include residual - we'll compare both
    const calculatedWithResidual = breakdown.totalNetCost
    const calculatedWithoutResidual = breakdown.netCostBeforeResidual
    
    // Check which one is closer
    const diffWithResidual = Math.abs(providedValues.totalLeaseCost - calculatedWithResidual)
    const diffWithoutResidual = Math.abs(providedValues.totalLeaseCost - calculatedWithoutResidual)
    
    const closerValue = diffWithResidual < diffWithoutResidual ? calculatedWithResidual : calculatedWithoutResidual
    const includesResidual = diffWithResidual < diffWithoutResidual
    
    const diff = providedValues.totalLeaseCost - closerValue
    const percentDiff = (diff / closerValue) * 100

    discrepancies.push({
      field: 'totalLeaseCost',
      label: `Total Lease Cost ${includesResidual ? '(incl. residual)' : '(excl. residual)'}`,
      quoteValue: providedValues.totalLeaseCost,
      calculatedValue: closerValue,
      difference: diff,
      percentageDiff: percentDiff,
      isSignificant: Math.abs(percentDiff) > 5,
      explanation: Math.abs(percentDiff) > 5
        ? `The quote's total cost ${percentDiff > 0 ? 'is higher' : 'is lower'} than our calculation. ${percentDiff > 0 ? 'There may be additional fees or costs not clearly disclosed.' : 'Verify what\'s included in their total.'}`
        : undefined
    })
  }

  const significantDiscrepancies = discrepancies.filter(d => d.isSignificant)
  const hasSignificantIssues = significantDiscrepancies.length > 0

  let overallAssessment: 'accurate' | 'minor_differences' | 'significant_differences' | 'major_concerns'
  if (significantDiscrepancies.length === 0) {
    overallAssessment = 'accurate'
  } else if (significantDiscrepancies.length <= 2) {
    overallAssessment = 'minor_differences'
  } else if (significantDiscrepancies.length <= 4) {
    overallAssessment = 'significant_differences'
  } else {
    overallAssessment = 'major_concerns'
  }

  return {
    discrepancies,
    hasSignificantIssues,
    overallAssessment
  }
}
