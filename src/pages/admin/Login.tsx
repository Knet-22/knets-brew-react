import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Only redirect once auth state is fully resolved (not while loading)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [loading, isAuthenticated, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const success = await login(username, password)
    if (!success) {
      setError('Invalid username or password.')
    }
    setSubmitting(false)
  }

  // Show spinner while auth is resolving to prevent form flash
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-main">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main px-4 py-8">
      <div className="w-full max-w-md space-y-8 rounded-[3rem] border border-white/10 bg-bg-surface/95 p-8 shadow-soft sm:p-12">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-gold-primary bg-white/5 text-2xl text-gold-primary">
            <i className="fa-solid fa-mug-hot" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Knet's Brew</p>
          <h1 className="mt-4 text-3xl font-semibold text-cream">Dashboard</h1>
          <p className="mt-3 text-sm text-cream-muted">Sign in to manage orders and inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-cream">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-cream outline-none transition focus:border-gold-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 transition hover:text-cream"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </label>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gold-light px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main shadow-[0_0_24px_rgba(196,154,108,0.4)] transition hover:bg-gold-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
