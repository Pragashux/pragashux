export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/#home" className="group flex items-center gap-3 text-ink" aria-label="Snailtechs Academy home">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-ink text-cream">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 5c-6 0-10 4.2-10 10.2 0 5.5 3.6 9.3 8.4 10.5-.6-1.1-1-2.4-1-3.8 0-4.1 3.2-7.4 7.2-7.4.7 0 1.4.1 2 .3C21.8 8.7 19.2 5 16 5Zm5.6 10.6c-2.6 0-4.7 2.1-4.7 4.8 0 2.6 2.1 4.7 4.7 4.7s4.7-2.1 4.7-4.7-2.1-4.8-4.7-4.8Zm0 2.2c1.4 0 2.5 1.1 2.5 2.6s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.6 2.5-2.6Z"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-tight">Snailtechs</span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            Academy
          </span>
        </span>
      )}
    </a>
  )
}
