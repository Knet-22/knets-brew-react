import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-bg-surface/90 text-cream shadow-soft backdrop-blur-sm transition duration-300 hover:border-gold-primary hover:text-gold-primary active:scale-95"
    >
      <i className="fa-solid fa-chevron-up text-sm" />
    </button>
  )
}
