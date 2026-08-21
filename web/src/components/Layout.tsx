import { Outlet } from 'react-router-dom'
import { EnquiryProvider } from '../context/EnquiryContext'
import { EnquiryModal } from './EnquiryModal'
import { Footer } from './Footer'
import { MobileStickyCta } from './MobileStickyCta'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <EnquiryProvider>
      <div className="min-h-svh bg-paper pb-16 sm:pb-0">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <MobileStickyCta />
        <EnquiryModal />
      </div>
    </EnquiryProvider>
  )
}
