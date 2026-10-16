import { API_ROUTES } from '@/config/api'
import { baseApi } from './baseApi'
import type { AuthResponse, SignInRequest, SignUpRequest } from './types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation<AuthResponse, SignUpRequest>({
      query: (body) => ({ url: API_ROUTES.auth.signUp, method: 'POST', body }),
    }),
    signIn: build.mutation<AuthResponse, SignInRequest>({
      query: (body) => ({ url: API_ROUTES.auth.signIn, method: 'POST', body }),
    }),
  }),
})

export const { useSignUpMutation, useSignInMutation } = authApi
