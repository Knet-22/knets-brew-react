import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft ${className}`}>
      {children}
    </div>
  )
}
