import { useCallback, useMemo, type ReactNode } from 'react'
import type { SignInValues, SignUpValues } from '@/lib/validation'
import { useSignInMutation, useSignUpMutation } from '@/services/authApi'
import { baseApi } from '@/services/baseApi'
import { useGetMeQuery } from '@/services/usersApi'
import { signedOut } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)
  const user = useAppSelector((s) => s.auth.user)
  const [signInMutation] = useSignInMutation()
  const [signUpMutation] = useSignUpMutation()

  // Restore the session from a stored token.
  const { isLoading } = useGetMeQuery(undefined, { skip: !token || user !== null })
  const loading = token !== null && user === null && isLoading

  const signIn = useCallback(
    async (values: SignInValues) => {
      await signInMutation(values).unwrap()
    },
    [signInMutation],
  )

  const signUp = useCallback(
    async (values: SignUpValues) => {
      await signUpMutation(values).unwrap()
    },
    [signUpMutation],
  )

  const signOut = useCallback(() => {
    dispatch(signedOut())
    dispatch(baseApi.util.resetApiState())
  }, [dispatch])

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
