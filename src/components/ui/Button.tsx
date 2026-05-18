import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  children: ReactNode
}

const variantStyles = {
  primary: 'bg-gold-primary text-bg-main hover:bg-gold-light',
  ghost: 'border border-white/10 bg-white/5 text-cream hover:border-gold-primary hover:text-gold-primary',
  outline: 'border border-gold-primary/30 bg-transparent text-cream hover:bg-gold-primary/10',
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] transition ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
