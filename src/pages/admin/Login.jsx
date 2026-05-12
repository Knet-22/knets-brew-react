import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { session, staff, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session && staff) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSubmitting(true)
    const { error } = await signIn(email.trim(), password)
    if (error) { setError(error.message || 'Invalid credentials.'); setSubmitting(false); return }
    navigate('/admin')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <i className="fas fa-mug-hot"></i>
          <h1 className="serif"><strong>Knet's</strong> <em>Brew</em></h1>
          <span className="label-text">Staff Portal</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" className="form-control" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@knetsbrew.ph"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" className="form-control" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Signing in...' : <>Sign In <i className="fas fa-arrow-right"></i></>}
          </button>
        </form>

        <Link to="/" className="login-back">← Back to site</Link>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem;
          background:
            linear-gradient(rgba(13,8,6,.88), rgba(13,8,6,.95)),
            url('https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=1920&q=80') center/cover no-repeat fixed;
        }
        .login-card {
          width: 100%; max-width: 440px;
          padding: 2.8rem 2rem;
          background: var(--bean);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .login-brand {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-brand i {
          font-size: 2.4rem;
          color: var(--gold);
          margin-bottom: .8rem;
        }
        .login-brand h1 {
          font-size: 2.2rem;
          margin: 0;
          font-style: italic;
        }
        .login-brand h1 strong { color: var(--gold); font-weight: 500; font-style: normal; }
        .login-brand h1 em { color: var(--cream); font-style: italic; }
        .login-brand .label-text { display: block; margin-top: .25rem; }
        .login-form { display: flex; flex-direction: column; gap: 1rem; }
        .login-back {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          font-family: 'Inter', sans-serif;
          font-size: .65rem;
          font-weight: 500;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--text-m);
          transition: color .2s;
        }
        .login-back:hover { color: var(--gold); }
      `}</style>
    </div>
  )
}
