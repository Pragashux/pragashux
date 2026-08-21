import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CourseId } from '../data/courses'
import type { LocationId } from '../data/locations'

export type EnquiryIntent =
  | 'counselling'
  | 'enroll'
  | 'workshop'
  | 'batch'
  | 'course'
  | 'location'

export type EnquiryPrefill = {
  intent?: EnquiryIntent
  course?: CourseId | ''
  location?: LocationId | ''
  batch?: string
}

type EnquiryContextValue = {
  open: boolean
  prefill: EnquiryPrefill
  submitted: boolean
  openEnquiry: (prefill?: EnquiryPrefill) => void
  closeEnquiry: () => void
  markSubmitted: () => void
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null)

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [prefill, setPrefill] = useState<EnquiryPrefill>({})
  const [submitted, setSubmitted] = useState(false)

  const openEnquiry = useCallback((next: EnquiryPrefill = {}) => {
    setPrefill(next)
    setSubmitted(false)
    setOpen(true)
  }, [])

  const closeEnquiry = useCallback(() => {
    setOpen(false)
  }, [])

  const markSubmitted = useCallback(() => {
    setSubmitted(true)
  }, [])

  const value = useMemo(
    () => ({ open, prefill, submitted, openEnquiry, closeEnquiry, markSubmitted }),
    [open, prefill, submitted, openEnquiry, closeEnquiry, markSubmitted],
  )

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext)
  if (!ctx) throw new Error('useEnquiry must be used within EnquiryProvider')
  return ctx
}
