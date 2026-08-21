import { useEffect, useId, useState, type FormEvent } from 'react'
import { courses } from '../data/courses'
import { locations } from '../data/locations'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'

const STORAGE_KEY = 'snailtechs-enquiries'

export function EnquiryModal() {
  const { open, closeEnquiry, prefill, submitted, markSubmitted } = useEnquiry()
  const titleId = useId()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: (prefill.location ?? '') as string,
    course: (prefill.course ?? '') as string,
    batch: (prefill.batch ?? '') as string,
    message: '',
  })

  useEffect(() => {
    if (open) {
      setForm((current) => ({
        ...current,
        location: (prefill.location ?? current.location) as string,
        course: (prefill.course ?? current.course) as string,
        batch: prefill.batch ?? current.batch,
      }))
    }
  }, [open, prefill])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeEnquiry()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeEnquiry])

  if (!open) return null

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = { ...form, intent: prefill.intent ?? 'counselling', createdAt: new Date().toISOString() }
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[]
    localStorage.setItem(STORAGE_KEY, JSON.stringify([payload, ...existing]))
    markSubmitted()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        aria-label="Close enquiry form"
        onClick={closeEnquiry}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        {submitted ? (
          <div className="py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Enquiry received</p>
            <h2 id={titleId} className="font-display mt-4 text-4xl tracking-tight">
              Thank you! Our academy team will contact you shortly.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-muted">
              We saved your details on this device so the team can follow up. No spam — just a conversation about your
              next step.
            </p>
            <Button className="mt-8" onClick={closeEnquiry}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Book a session</p>
            <h2 id={titleId} className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
              Tell us where you are in your design journey.
            </h2>
            <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
              <label className="grid gap-1 text-sm font-medium">
                Name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium">
                  Phone
                  <input
                    required
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Email
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium">
                  Preferred location
                  <select
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                  >
                    <option value="">Select</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.city}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Course
                  <select
                    required
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                  >
                    <option value="">Select</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-1 text-sm font-medium">
                Preferred batch
                <input
                  name="batch"
                  placeholder="Weekday / Weekend / not sure yet"
                  value={form.batch}
                  onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  className="rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Message
                <textarea
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="resize-none rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-accent"
                />
              </label>
              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={closeEnquiry}>
                  Cancel
                </Button>
                <Button type="submit">Submit enquiry</Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
