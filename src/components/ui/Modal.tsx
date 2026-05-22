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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 py-8 sm:items-center">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-bg-deep/95 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">{eyebrow}</p>
            <h2 className="text-2xl font-semibold text-cream">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
