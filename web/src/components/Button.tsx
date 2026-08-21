import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark'

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-dark shadow-[0_10px_30px_-12px_rgba(212,87,42,0.7)]',
  secondary:
    'bg-transparent text-ink border border-ink/15 hover:border-ink hover:bg-ink hover:text-cream',
  ghost: 'bg-white/80 text-ink border border-line hover:bg-white',
  dark: 'bg-ink text-cream hover:bg-ink-soft',
}

export function buttonClass(variant: Variant = 'primary', className = '') {
  return `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 ${styles[variant]} ${className}`
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  )
}
