import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '@/services/authApi'
import { usersApi } from '@/services/usersApi'
import type { User } from '@/services/types'

export const TOKEN_KEY = 'auth_token'

export interface AuthState {
  token: string | null
  user: User | null
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: (): AuthState => ({ token: readToken(), user: null }),
  reducers: {
    signedOut: (state) => {
      state.token = null
      state.user = null
    },
  },
  extraReducers: (builder) => {
    const setSession = (state: AuthState, { payload }: { payload: { user: User; accessToken: string } }) => {
      state.token = payload.accessToken
      state.user = payload.user
    }
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, setSession)
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, setSession)
      .addMatcher(usersApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload
      })
  },
})

export const { signedOut } = authSlice.actions
