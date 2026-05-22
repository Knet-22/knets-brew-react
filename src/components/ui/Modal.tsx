import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  eyebrow?: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({ open, title, eyebrow = 'Checkout', children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-0 sm:items-center sm:px-4 sm:py-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-bg-deep/95 shadow-soft backdrop-blur-xl sm:rounded-[2rem]">
        {/* Sticky header with close button always visible */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">{eyebrow}</p>
            <h2 className="text-xl font-semibold text-cream sm:text-2xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
