import { useEnquiry } from '../context/EnquiryContext'

export function MobileStickyCta() {
  const { openEnquiry } = useEnquiry()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur sm:hidden">
      <button
        type="button"
        className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white"
        onClick={() => openEnquiry({ intent: 'counselling' })}
      >
        Book Free Counselling
      </button>
    </div>
  )
}
