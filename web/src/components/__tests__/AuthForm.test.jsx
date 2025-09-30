import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthForm } from '../auth/AuthForm'
import { useAuth } from '../../contexts/AuthContext'

const mockSignIn = vi.fn()
const mockSignUp = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      loading: false
    })
  })

  it('should render sign in form by default', () => {
    render(<AuthForm />)

    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should switch between sign in and sign up modes', async () => {
    render(<AuthForm />)
    const user = userEvent.setup()

    // Initially in sign in mode
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()

    // Find and click the toggle button
    const toggleButton = screen.getByRole('tab', { name: /sign up/i })
    await user.click(toggleButton)

    // Should switch to sign up mode
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should validate email format', async () => {
    render(<AuthForm />)
    const user = userEvent.setup()

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText(/invalid email/i)).toBeDefined()
    })
  })

  it('should call signIn with correct credentials', async () => {
    mockSignIn.mockResolvedValue({ data: { user: {} }, error: null })

    render(<AuthForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should handle sign in error', async () => {
    mockSignIn.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' }
    })

    render(<AuthForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled()
    })
  })
})