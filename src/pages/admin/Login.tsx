import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(username, password)
    if (success) {
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main px-4 py-8">
      <div className="w-full max-w-md space-y-8 rounded-[3rem] border border-white/10 bg-bg-surface/95 p-12 shadow-soft">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-gold-primary bg-white/5 text-2xl text-gold-primary">
            <i className="fa-solid fa-mug-hot" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Knet's Brew</p>
          <h1 className="mt-4 text-3xl font-semibold text-cream">Admin Portal</h1>
          <p className="mt-3 text-sm text-cream-muted">Sign in to manage orders and inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jireh"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gold-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

      </div>
    </div>
  )
}
