import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, peso } from '../lib/supabase.js'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', 1)
        .eq('is_available', 1)
        .order('price', { ascending: false })
        .limit(6)
      setFeatured(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="page home-page">
      {/* HERO */}
      <section className="kb-hero">
        <div className="kb-hero-inner">
          <div className="hero-eyebrow">
            <span></span>
            <span className="label-text">Calape · Bohol · Est 2024</span>
            <span></span>
          </div>
          <h1>
            Rare <em>Beans.</em><br/>
            Patient <em>Brewing.</em>
          </h1>
          <p className="kb-sub">
            Black Ivory. Kopi Luwak. Panama Geisha. The world's most extraordinary coffees,
            served at a quiet table tucked away in Bohol.
          </p>
          <div className="kb-cta">
            <Link to="/menu" className="btn btn-primary">
              View the Collection <i className="fas fa-arrow-right"></i>
            </Link>
            <Link to="/order" className="btn btn-outline">Order Now</Link>
          </div>
          <div className="hero-marquee">
            <span>Black Ivory</span>
            <i className="fas fa-circle"></i>
            <span>Kopi Luwak</span>
            <i className="fas fa-circle"></i>
            <span>Panama Geisha</span>
            <i className="fas fa-circle"></i>
            <span>Blue Mountain</span>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <span className="label-text">Our Collection</span>
            <h2>Bestsellers from the <em>Bar</em></h2>
            <div className="gold-divider" style={{ maxWidth: 180, margin: '.5rem auto 0' }}>
              <i className="fas fa-coffee"></i>
            </div>
          </div>

          {loading ? (
            <div className="loader">Loading</div>
          ) : (
            <div className="featured-grid">
              {featured.map(p => (
                <article key={p.id} className="featured-card">
                  <div className="featured-img">
                    {p.image ? <img src={p.image} alt={p.name} /> : <i className="fas fa-mug-hot"></i>}
                    {Number(p.price) >= 400 && <span className="rare-badge">Rare</span>}
                  </div>
                  <div className="featured-body">
                    <span className="label-text" style={{ fontSize: '.6rem' }}>{p.category}</span>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="featured-foot">
                      <span className="price serif">{peso(p.price)}</span>
                      <Link to="/menu" className="featured-link">View →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/menu" className="btn btn-outline">See Full Menu</Link>
          </div>
        </div>
      </section>

      {/* RARE ORIGINS */}
      <section className="rare-section">
        <div className="container">
          <div className="rare-grid">
            <div>
              <span className="label-text">The Rare Origins</span>
              <h2>Coffees you'll <em>remember</em> forever.</h2>
              <div className="gold-divider" style={{ maxWidth: 80, margin: '.7rem 0 1.5rem' }}>
                <i className="fas fa-coffee"></i>
              </div>
              <p>
                Most cafes serve coffee. We serve <em>experiences</em>. From the legendary Black Ivory
                — naturally processed by Thai elephants — to the elusive Kopi Luwak from the
                forests of Sumatra, each bean has traveled a long journey to reach your cup.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Brewed by hand. Served on porcelain. No rushing here.
              </p>
              <Link to="/menu" className="btn btn-outline" style={{ marginTop: '1.8rem' }}>
                Explore Rare Origins
              </Link>
            </div>
            <div className="rare-stats">
              <div className="rare-stat">
                <div className="serif rare-num">17+</div>
                <div className="label-text">Curated Brews</div>
              </div>
              <div className="rare-stat">
                <div className="serif rare-num">4</div>
                <div className="label-text">Rare Origins</div>
              </div>
              <div className="rare-stat">
                <div className="serif rare-num">14h</div>
                <div className="label-text">Daily Brewing</div>
              </div>
              <div className="rare-stat">
                <div className="serif rare-num">★★★★★</div>
                <div className="label-text">Patron Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HAPPY HOUR */}
      <section className="happy-hour">
        <div className="container">
          <div className="hh-card">
            <span className="label-text">Daily 2pm – 5pm</span>
            <h2 className="serif"><em>15% off</em> Happy Hour</h2>
            <p>The afternoon lull deserves a treat. Every drink, 15% off, every weekday.</p>
            <p style={{ marginTop: '.5rem', color: 'var(--gold)', fontSize: '.85rem' }}>
              <i className="fas fa-graduation-cap"></i> Students get 10% off with valid ID — all day, every day.
            </p>
          </div>
        </div>
      </section>

      <style>{css}</style>
    </div>
  )
}

const css = `
.home-page { padding-top: 0; }

/* HERO */
.kb-hero {
  position: relative;
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background:
    linear-gradient(to bottom, rgba(13,8,6,.82) 0%, rgba(13,8,6,.55) 50%, rgba(13,8,6,.92) 100%),
    url('https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=1920&q=80') center/cover no-repeat;
  padding: 6rem 1.5rem 4rem;
  overflow: hidden;
}
.kb-hero-inner {
  text-align: center;
  max-width: 820px;
  position: relative;
  z-index: 2;
  animation: fadeUp 1s cubic-bezier(.4,0,.2,1) both;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 1.2rem;
  margin-bottom: 2rem;
}
.hero-eyebrow span:first-child, .hero-eyebrow span:last-child {
  width: 40px; height: 1px; background: var(--gold-d);
}
.kb-hero h1 {
  font-size: clamp(3.5rem, 9vw, 6.5rem);
  line-height: .95;
  margin-bottom: 1rem;
  font-weight: 400;
}
.kb-hero h1 em {
  color: var(--gold);
  font-style: italic;
  font-family: 'Playfair Display', serif;
}
.kb-sub {
  font-size: clamp(1rem, 1.7vw, 1.18rem);
  margin: 1.5rem auto 2.5rem;
  max-width: 580px;
  line-height: 1.85;
  font-style: italic;
  font-family: 'Cormorant Garamond', serif;
  color: var(--cream-d);
}
.kb-cta {
  display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
  margin-bottom: 3rem;
}
.hero-marquee {
  display: inline-flex; align-items: center; gap: 1.2rem;
  padding: .8rem 1.5rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  color: var(--gold);
  font-family: 'Inter', sans-serif;
  font-size: .65rem;
  font-weight: 400;
  letter-spacing: .3em;
  text-transform: uppercase;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-marquee i { font-size: .25rem; opacity: .6; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* FEATURED */
.featured-section { padding: 6rem 0 4rem; background: var(--espresso); }
.section-head { text-align: center; margin-bottom: 3rem; }
.section-head h2 em { color: var(--gold); font-style: italic; }
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.5rem;
}
.featured-card {
  background: var(--bean);
  border: 1px solid var(--border);
  transition: all .35s;
  overflow: hidden;
}
.featured-card:hover {
  border-color: var(--gold);
  transform: translateY(-6px);
  box-shadow: var(--shadow);
}
.featured-img {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, var(--crema), var(--mahogany));
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  font-size: 3rem;
  opacity: .9;
  overflow: hidden;
}
.featured-img img { width: 100%; height: 100%; object-fit: cover; }
.rare-badge {
  position: absolute; top: 14px; right: 14px;
  background: var(--gold); color: var(--espresso);
  font-family: 'Inter', sans-serif;
  font-size: .58rem; font-weight: 500;
  letter-spacing: .2em;
  text-transform: uppercase;
  padding: .3rem .7rem;
}
.featured-body { padding: 1.5rem; }
.featured-body h3 { margin: .4rem 0 .6rem; color: var(--cream); font-size: 1.5rem; }
.featured-body p { font-size: .88rem; min-height: 3.6em; line-height: 1.6; }
.featured-foot {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 1.3rem; padding-top: 1rem;
  border-top: 1px solid var(--border-l);
}
.featured-foot .price {
  color: var(--gold);
  font-size: 1.4rem;
}
.featured-link {
  font-family: 'Inter', sans-serif;
  font-size: .65rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--gold);
  transition: color .2s, transform .2s;
}
.featured-link:hover { color: var(--gold-l); transform: translateX(3px); }

/* RARE ORIGINS */
.rare-section { padding: 6rem 0; background: var(--bean); }
.rare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
.rare-grid h2 em {
  color: var(--gold);
  font-style: italic;
  font-family: 'Playfair Display', serif;
}
.rare-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.rare-stat {
  padding: 2rem 1.5rem;
  background: var(--crema);
  border: 1px solid var(--border);
  text-align: center;
  transition: all .3s;
}
.rare-stat:hover { border-color: var(--gold); transform: translateY(-3px); }
.rare-num {
  font-size: 3rem;
  color: var(--gold);
  margin-bottom: .4rem;
  font-family: 'Playfair Display', serif;
  font-weight: 400;
}

/* HAPPY HOUR */
.happy-hour { padding: 4rem 0 5rem; background: var(--espresso); }
.hh-card {
  background:
    linear-gradient(135deg, rgba(200,156,76,.08), rgba(200,156,76,.02)),
    var(--bean);
  border: 1px solid var(--gold);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}
.hh-card h2 em { color: var(--gold); font-style: italic; }
.hh-card h2 { margin: .8rem 0 1rem; }

@media (max-width: 768px) {
  .rare-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .rare-stats { grid-template-columns: 1fr 1fr; gap: 1rem; }
  .rare-stat { padding: 1.5rem 1rem; }
  .rare-num { font-size: 2.2rem; }
}
`
