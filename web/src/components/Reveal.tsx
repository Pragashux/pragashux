import { useEffect, useRef, type ReactNode } from 'react'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      node.style.opacity = '1'
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.animationDelay = `${delay}ms`
          node.classList.add('reveal')
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  invert = false,
}: {
  eyebrow?: string
  title: ReactNode
  copy?: string
  invert?: boolean
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p
          className={`mb-4 text-xs font-semibold uppercase tracking-[0.28em] ${invert ? 'text-accent-soft' : 'text-accent'}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl ${invert ? 'text-cream' : 'text-ink'}`}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-6 max-w-xl text-base leading-relaxed sm:text-lg ${invert ? 'text-cream/70' : 'text-muted'}`}>
          {copy}
        </p>
      )}
    </div>
  )
}
