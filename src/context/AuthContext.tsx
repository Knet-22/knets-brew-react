import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface AdminUser {
  id: string
  username: string
  name: string
  role: 'admin' | 'staff'
}

export interface StaffAccount {
  id: string
  username: string
  name: string
  password: string
}

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  addStaffAccount: (account: Omit<StaffAccount, 'id'>) => void
  removeStaffAccount: (id: string) => void
  staffAccounts: StaffAccount[]
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const SESSION_KEY = 'knets_brew_admin_session'
const STAFF_KEY = 'knets_brew_staff_v1'

function loadStaffAccounts(): StaffAccount[] {
  try {
    const stored = localStorage.getItem(STAFF_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return []
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(loadStaffAccounts)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, unknown>
        if (parsed && typeof parsed === 'object') {
          const username = typeof parsed.username === 'string' ? parsed.username : typeof parsed.email === 'string' ? parsed.email : ''
          if (username) {
            setUser({
              id: typeof parsed.id === 'string' ? parsed.id : '1',
              username,
              name: typeof parsed.name === 'string' ? parsed.name : 'Admin',
              role: parsed.role === 'staff' ? 'staff' : 'admin',
            })
          }
        }
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Hardcoded admin
    if (username === 'jireh@gmail.com' && password === 'faith') {
      const newUser: AdminUser = { id: '1', username, name: 'Admin', role: 'admin' }
      setUser(newUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
      return true
    }
    // Hardcoded default staff
    if (username === 'jai' && password === '212121') {
      const newUser: AdminUser = { id: '2', username, name: 'Staff', role: 'staff' }
      setUser(newUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
      return true
    }
    // Dynamic staff accounts
    const dynamicStaff = loadStaffAccounts()
    const found = dynamicStaff.find((s) => s.username === username && s.password === password)
    if (found) {
      const newUser: AdminUser = { id: found.id, username: found.username, name: found.name, role: 'staff' }
      setUser(newUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  const addStaffAccount = (account: Omit<StaffAccount, 'id'>) => {
    const newAccount: StaffAccount = { ...account, id: `staff-${Date.now()}` }
    setStaffAccounts((prev) => {
      const updated = [...prev, newAccount]
      localStorage.setItem(STAFF_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const removeStaffAccount = (id: string) => {
    setStaffAccounts((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      localStorage.setItem(STAFF_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, addStaffAccount, removeStaffAccount, staffAccounts }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
