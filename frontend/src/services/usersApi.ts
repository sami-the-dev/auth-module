import { API_ROUTES } from '@/config/api'
import { baseApi } from './baseApi'
import type { User } from './types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => API_ROUTES.users.me,
      providesTags: ['User'],
    }),
  }),
})

export const { useGetMeQuery } = usersApi
