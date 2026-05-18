interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-tight text-cream sm:text-5xl">{title}</h2>
      <p className="text-sm leading-7 text-cream-muted sm:text-base">{description}</p>
    </div>
  )
}
