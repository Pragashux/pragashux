/**
 * Central fee configuration.
 * Replace placeholder values with confirmed academy fees.
 * Leave a field as null to display ₹XX,XXX until the number is set.
 */
export type Money = number | null

export const pricingConfig = {
  currencySymbol: '₹',
  COURSE_FEE: null as Money,
  GST: null as Money,
  ONE_TIME_DISCOUNT: null as Money,
  ONE_TIME_PRICE: null as Money,
  EMI_3_MONTH: null as Money,
  EMI_6_MONTH: null as Money,
  EMI_9_MONTH: null as Money,
  EMI_12_MONTH: null as Money,
  note: 'Final fees may vary by course, batch and applicable offers.',
}

export const emiPlans = [
  { id: '3', label: '3 months', key: 'EMI_3_MONTH' as const },
  { id: '6', label: '6 months', key: 'EMI_6_MONTH' as const },
  { id: '9', label: '9 months', key: 'EMI_9_MONTH' as const },
  { id: '12', label: '12 months', key: 'EMI_12_MONTH' as const },
]

export function formatMoney(value: Money): string {
  if (value === null) return '₹XX,XXX'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function computeOneTimeTotal(): Money {
  const { COURSE_FEE, GST, ONE_TIME_DISCOUNT, ONE_TIME_PRICE } = pricingConfig
  if (ONE_TIME_PRICE !== null) return ONE_TIME_PRICE
  if (COURSE_FEE === null || GST === null || ONE_TIME_DISCOUNT === null) return null
  return COURSE_FEE + GST - ONE_TIME_DISCOUNT
}
