import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { formatCurrency } from '../lib/format'

const sampleProgress = [
  { label: 'Confirmed', description: 'Your reservation has been received.' },
  { label: 'Preparing', description: 'Our barista is preparing your coffee.' },
  { label: 'Ready for pickup', description: 'Your order is waiting at the counter.' },
]

export default function Track() {
  const { code: routeCode } = useParams<{ code: string }>()
  const [code, setCode] = useState(routeCode ?? '')
  const [submitted, setSubmitted] = useState(false)

  const isValid = code.trim().toUpperCase().startsWith('KB-')
  const showStatus = submitted && isValid

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Track"
          title="Follow your premium coffee reservation in real time."
          description="Enter your reservation code and view the current status of your order at Knet’s Brew."
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Enter reservation code"
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-4 text-cream outline-none transition focus:border-gold-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-gold-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-bg-main transition hover:bg-gold-light"
          >
            Track order
          </button>
        </form>
      </section>

      {submitted ? (
        showStatus ? (
          <section className="space-y-8 rounded-[3rem] border border-white/10 bg-bg-surface/90 p-10 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Reservation code</p>
                <p className="mt-2 text-3xl font-semibold text-cream">{code}</p>
              </div>
              <div className="rounded-full bg-gold-primary/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-gold-primary">
                Ready soon
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {sampleProgress.map((step, index) => (
                <div key={step.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <span className="text-xs uppercase tracking-[0.35em] text-cream-muted">Step {index + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold text-cream">{step.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-cream-muted">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-cream-muted">
              <p className="font-semibold text-cream">Estimated total</p>
              <p className="mt-2 text-lg font-semibold text-gold-primary">{formatCurrency(420)}</p>
            </div>
          </section>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-cream-muted">
            <p className="text-lg font-semibold text-cream">Reservation not found</p>
            <p className="mt-3 text-sm leading-7">Please check your reservation code and try again.</p>
          </div>
        )
      ) : null}
    </div>
  )
}
