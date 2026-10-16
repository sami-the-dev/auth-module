import { createContext, useContext } from 'react'
import type { User } from '@/services/types'
import type { SignInValues, SignUpValues } from '@/lib/validation'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (values: SignInValues) => Promise<void>
  signUp: (values: SignUpValues) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
