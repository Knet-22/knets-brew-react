export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand"><strong>Knet's</strong> Brew</div>
          <p>Rare beans. Patient brewing. A premium coffee experience tucked away in Calape, Bohol — where every cup tells a story from far-off origins.</p>
        </div>
        <div>
          <h4>Visit Us</h4>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Ulbujan, Calape, Bohol</li>
            <li><i className="fas fa-phone"></i> +63 966 364 0516</li>
            <li><i className="fas fa-envelope"></i> hello@knetsbrew.ph</li>
          </ul>
        </div>
        <div>
          <h4>Hours</h4>
          <ul>
            <li><i className="fas fa-clock"></i> Mon–Fri · 8:00am – 10:00pm</li>
            <li><i className="fas fa-clock"></i> Sat–Sun · 9:00am – 11:00pm</li>
            <li><i className="fas fa-percent"></i> Happy Hour · 2pm–5pm daily · 15% off</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {year} Knet's Brew · All rights reserved · <a href="/admin/login">Staff Portal</a>
      </div>
    </footer>
  )
}
