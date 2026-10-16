import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/services/baseApi'
import { authSlice, TOKEN_KEY } from './authSlice'

export function makeStore() {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  })

  // Persist the token whenever it changes.
  let lastToken = store.getState().auth.token
  store.subscribe(() => {
    const { token } = store.getState().auth
    if (token === lastToken) return
    lastToken = token
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* storage unavailable */
    }
  })
  return store
}

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
