import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import ScrollToTop from './ScrollToTop'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg-main text-cream">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        {children}
      </div>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  )
}
