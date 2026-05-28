import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const DEFAULT_STAFF = [
  { id: 'default-staff', username: 'jai', name: 'Staff', isDefault: true },
]

export default function AdminStaff() {
  const { staffAccounts, addStaffAccount, removeStaffAccount } = useAuth()
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  const allStaff = [
    ...DEFAULT_STAFF,
    ...staffAccounts.map((s) => ({ id: s.id, username: s.username, name: s.name, isDefault: false })),
  ]

  const handleAdd = () => {
    setError('')
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      setError('All fields are required.')
      return
    }
    const exists =
      allStaff.some((s) => s.username === form.username.trim()) ||
      form.username.trim() === 'jireh'
    if (exists) {
      setError('Username already taken.')
      return
    }
    addStaffAccount({ name: form.name.trim(), username: form.username.trim(), password: form.password.trim() })
    setForm({ name: '', username: '', password: '' })
    setAdding(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
          <h1 className="mt-2 text-4xl font-semibold text-cream">Staff</h1>
          <p className="mt-2 text-sm text-cream-muted">{allStaff.length} staff member{allStaff.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-gold-light px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_14px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary"
        >
          <i className={`fa-solid ${adding ? 'fa-xmark' : 'fa-plus'} text-xs`} />
          {adding ? 'Cancel' : 'Add staff'}
        </button>
      </div>

      {/* Add staff form */}
      {adding && (
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">New staff account</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Full name <span className="text-red-400">*</span></span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Maria Santos"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Username <span className="text-red-400">*</span></span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="e.g. maria"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Password <span className="text-red-400">*</span></span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Set a password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-cream outline-none transition focus:border-gold-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 transition hover:text-cream"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </label>
          </div>
          {error && (
            <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-2xl bg-gold-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main shadow-[0_0_18px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary"
            >
              <i className="fa-solid fa-user-plus text-xs" />
              Create account
            </button>
          </div>
        </div>
      )}

      {/* Staff list */}
      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
        <div className="space-y-3">
          {allStaff.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-primary/10 text-gold-primary">
                  <i className="fa-solid fa-user text-sm" />
                </span>
                <div>
                  <p className="font-semibold text-cream">{member.name}</p>
                  <p className="text-sm text-cream-muted">{member.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                  Staff
                </span>
                {member.isDefault ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cream-muted">
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeStaffAccount(member.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-cream/50 transition hover:border-red-500/50 hover:text-red-400"
                    aria-label={`Remove ${member.name}`}
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-cream-muted">
          <i className="fa-solid fa-circle-info mr-2 text-gold-primary/60" />
          Staff accounts can log in at <span className="text-cream">/admin/login</span> using their username and password.
        </p>
      </div>
    </div>
  )
}
