import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { products, CAFE_ADDRESS, CAFE_PHONE, CAFE_HOURS } from '../data/products'

export default function Home() {
  const featured = products.filter((product) => product.featured).slice(0, 3)

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-[3rem] bg-hero-glow px-6 py-20 sm:px-10 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(166,124,82,0.16),_transparent_36%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-8 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.45em] text-cream-muted">Calape, Bohol's Finest</p>
            <h1 className="text-5xl font-semibold leading-tight tracking-[-0.03em] text-cream sm:text-6xl">
              Knet's Brew — Crafted for Those Who Know the Difference
            </h1>
            <p className="max-w-xl text-base leading-8 text-cream-muted sm:text-lg">
              Rare, world-class coffee and artisanal pastries — proudly crafted in Calape, Bohol
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="inline-flex items-center justify-center rounded-full bg-gold-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-bg-main transition hover:bg-gold-light">
                Explore menu
              </Link>
              <Link to="/order" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm uppercase tracking-[0.28em] text-cream transition hover:border-gold-primary hover:text-gold-primary">
                Reserve your cup
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:max-w-md">
            {featured.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">{product.category}</p>
                <h2 className="mt-4 text-2xl font-semibold text-cream">{product.name}</h2>
                <p className="mt-3 text-sm leading-7 text-cream-muted">{product.description}</p>
                <span className="mt-6 inline-flex rounded-full bg-gold-primary/10 px-4 py-2 text-sm font-semibold text-gold-primary">₱{product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Signature Reserve"
            title="Experience rare coffee that feels as crafted as jewelry."
            description="We bring premium beans from iconic origins, then serve them in an intimate dark-luxe atmosphere designed for quiet indulgence."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="surface-glow rounded-[2rem] border border-white/10 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-cream-muted">Tasting notes</p>
              <h3 className="mt-4 text-2xl font-semibold text-cream">Silk, cherry, smoke, and citrus.</h3>
              <p className="mt-4 text-sm leading-7 text-cream-muted">
                Each cup is balanced to highlight the origin and roasting signature. Expect quiet complexity, clean finishes, and a luxurious warmth.
              </p>
            </article>
            <article className="surface-glow rounded-[2rem] border border-white/10 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-cream-muted">The ritual</p>
              <h3 className="mt-4 text-2xl font-semibold text-cream">Slow brew, polished service.</h3>
              <p className="mt-4 text-sm leading-7 text-cream-muted">
                From custom espresso to cold brew, our baristas curate every order with mindful precision and a premium presentation.
              </p>
            </article>
          </div>
        </div>

        <div className="surface-glow rounded-[3rem] border border-white/10 bg-bg-surface/90 p-8 sm:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Why choose Knet’s Brew</p>
          <h3 className="mt-5 text-3xl font-semibold text-cream">A premium coffee destination for locals and travellers alike.</h3>
          <ul className="mt-8 space-y-6 text-sm text-cream-muted">
            <li className="flex gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gold-primary/10 text-gold-primary">01</span>
              <div>
                <strong className="block text-cream">Crafted from rare beans</strong>
                Hand-selected limited roasts including Black Ivory, Kopi Luwak and Panama Geisha.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gold-primary/10 text-gold-primary">02</span>
              <div>
                <strong className="block text-cream">Elegant dark luxury</strong>
                A calm modern lounge ambience with elevated service and details.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gold-primary/10 text-gold-primary">03</span>
              <div>
                <strong className="block text-cream">Fast online ordering</strong>
                Reserve your coffee ahead, then arrive with your order ready in minutes.
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Featured Collection"
          title="Select from our curated rare roast menu."
          description="These premium classics and signature offerings are ready to be reserved for your next visit."
        />
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
