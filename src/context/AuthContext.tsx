import { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'employee' | 'new_employee'
}

interface AuthContextValue {
  currentUser: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  promoteToEmployee: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  async function login(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('email', email)
      .eq('password', password)
      .neq('role', 'superadmin')
      .single()
    if (error || !data) return false
    setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role })
    return true
  }

  function logout() {
    setCurrentUser(null)
  }

  async function promoteToEmployee() {
    if (!currentUser) return
    await supabase
      .from('users')
      .update({ onboarding_done: true, role: 'employee' })
      .eq('id', currentUser.id)
    setCurrentUser(prev => prev ? { ...prev, role: 'employee' } : null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, promoteToEmployee }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
