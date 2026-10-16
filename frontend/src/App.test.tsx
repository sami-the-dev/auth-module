import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/App'
import { AuthProvider } from '@/auth/AuthProvider'
import { makeStore } from '@/store'

function renderAt(path: string) {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </MemoryRouter>
    </Provider>,
  )
}

describe('routing', () => {
  it('redirects unauthenticated users to sign in', async () => {
    renderAt('/')
    expect(await screen.findByText('Welcome back. Enter your credentials.')).toBeInTheDocument()
  })

  it('shows validation errors on the sign up form', async () => {
    renderAt('/signup')
    await userEvent.type(screen.getByLabelText('Name'), 'ab')
    await userEvent.type(screen.getByLabelText('Password'), 'weak')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText(/name must be at least 3/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/at least 8 characters$/i)).toBeInTheDocument()
  })
})
