import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AdminUser {
  id: string
  username: string
  name: string
  role: 'admin' | 'staff'
}

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'knets_brew_admin_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
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
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === 'jireh' && password === 'faith') {
      const newUser: AdminUser = {
        id: '1',
        username,
        name: 'Admin',
        role: 'admin',
      }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return true
    }
    if (username === 'staff@knets.ph' && password === 'staff123') {
      const newUser: AdminUser = {
        id: '2',
        username,
        name: 'Staff',
        role: 'staff',
      }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
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
