import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/config/api'
import type { RootState } from '@/store'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

/** Signs the user out when the API rejects the stored token. */
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra)
  if (result.error?.status === 401 && (api.getState() as RootState).auth.token) {
    api.dispatch({ type: 'auth/signedOut' })
  }
  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User'],
  endpoints: () => ({}),
})
