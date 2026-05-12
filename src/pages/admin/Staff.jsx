import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'

const BLANK = { id: null, name: '', username: '', email: '', user_type: 'staff', is_active: 1 }

export default function AdminStaff() {
  const { staff: me } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('staff').select('*').order('id')
    setItems(data || []); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!editing.name.trim() || !editing.email.trim() || !editing.username.trim()) return

    const payload = {
      name: editing.name.trim(),
      username: editing.username.trim(),
      email: editing.email.trim(),
      user_type: editing.user_type,
      is_active: editing.is_active ? 1 : 0
    }

    if (editing.id) {
      await supabase.from('staff').update(payload).eq('id', editing.id)
      setEditing(null); load()
    } else {
      const { error } = await supabase.from('staff').insert(payload)
      if (error) { setMsg(error.message); return }
      setMsg(`Staff row created. IMPORTANT: also create the login in Supabase → Authentication → Users with email "${payload.email}" so this person can sign in.`)
      load()
    }
  }

  const toggleActive = async (s) => {
    if (s.id === me?.id) { alert("You can't deactivate your own account."); return }
    await supabase.from('staff').update({ is_active: s.is_active === 1 ? 0 : 1 }).eq('id', s.id)
    load()
  }

  const handleDelete = async (s) => {
    if (s.id === me?.id) { alert("You can't delete your own account."); return }
    if (!confirm(`Delete "${s.name}"?\n\nNote: This only removes the staff row. To fully revoke access, also delete the Auth user in Supabase → Authentication → Users.`)) return
    await supabase.from('staff').delete().eq('id', s.id)
    load()
  }

  return (
    <>
      <div className="page-title-bar">
        <div>
          <h1>Staff Management</h1>
          <p>Manage admin and staff accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(BLANK); setMsg('') }}>
          <i className="fas fa-user-plus"></i> Add Staff
        </button>
      </div>

      {msg && <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>{msg}</div>}

      <div className="data-card">
        <div className="table-wrap">
          {loading ? <div className="loader">Loading</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ color: 'var(--cream)' }}>
                        {s.name} {s.id === me?.id && <span style={{ color: 'var(--gold)', fontSize: '.75rem' }}>(you)</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: '.88rem' }}>{s.username}</td>
                    <td style={{ fontSize: '.88rem' }}>{s.email || '—'}</td>
                    <td><span className={`role-pill role-${s.user_type}`}>{s.user_type}</span></td>
                    <td>
                      <span className={`badge ${s.is_active ? 'badge-completed' : 'badge-cancelled'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="action-icon" onClick={() => setEditing(s)} title="Edit"><i className="fas fa-edit"></i></button>
                      <button className="action-icon" onClick={() => toggleActive(s)} title="Toggle"><i className="fas fa-power-off"></i></button>
                      <button className="action-icon danger" onClick={() => handleDelete(s)} title="Delete"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <div className="modal-head">
              <h3>{editing.id ? 'Edit Staff' : 'New Staff'}</h3>
              <button type="button" className="modal-close" onClick={() => setEditing(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              {!editing.id && (
                <div className="alert alert-info" style={{ marginBottom: '1rem', fontSize: '.85rem' }}>
                  <strong>Heads up:</strong> creating staff here adds a database row only.
                  You'll also need to create their login in Supabase → <strong>Authentication → Users</strong> with the same email.
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" className="form-control" value={editing.name}
                    onChange={e => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Username *</label>
                  <input type="text" className="form-control" value={editing.username}
                    onChange={e => setEditing({ ...editing, username: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" className="form-control" value={editing.email}
                  onChange={e => setEditing({ ...editing, email: e.target.value })} required
                  disabled={!!editing.id} />
                {editing.id && <small style={{ color: 'var(--text-l)' }}>Email can't be changed here. Update it in Supabase Authentication instead.</small>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select className="form-control" value={editing.user_type}
                    onChange={e => setEditing({ ...editing, user_type: e.target.value })}>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <label className="check-label" style={{ marginBottom: '.8rem' }}>
                    <input type="checkbox" checked={!!editing.is_active}
                      onChange={e => setEditing({ ...editing, is_active: e.target.checked ? 1 : 0 })} />
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
