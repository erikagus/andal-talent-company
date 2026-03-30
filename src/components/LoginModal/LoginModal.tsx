import { useState } from 'react'
import { TextField, Button } from 'design-system'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'
import './LoginModal.css'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email.trim(), password)
    setLoading(false)
    if (ok) {
      onClose()
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="login-overlay" onClick={onClose} role="presentation">
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Close */}
        <button className="login-modal__close" onClick={onClose} aria-label="Close dialog">
          ×
        </button>

        {/* Brand */}
        <div className="login-modal__brand">
          <div className="login-modal__logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="var(--schemes-brand-brand-500, #7066FF)" />
              <text x="20" y="26" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="sans-serif">A</text>
            </svg>
          </div>
          <h2 id="login-modal-title" className="login-modal__title">Sign in to Andal</h2>
          <p className="login-modal__subtitle">Enter your credentials to access your account.</p>
        </div>

        {/* Form */}
        <form className="login-modal__form" onSubmit={handleSubmit} noValidate>
          <TextField
            labelText="Email"
            placeholder="Enter your email"
            type="email"
            size="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mandatory
          />
          <div className="login-modal__pw-wrap">
            <TextField
              labelText="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              size="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mandatory
            />
            <button
              type="button"
              className="login-modal__pw-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="login-modal__error" role="alert">
              {error}
            </p>
          )}

          <Button variant="Solid" size="Medium" color="Primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {/* Hint */}
        <p className="login-modal__hint">
          <strong>Admin:</strong> admin@andal.com / admin123<br />
          <strong>Employee:</strong> employee@andal.com / emp123<br />
          <strong>New Employee:</strong> newbie@andal.com / new123
        </p>
      </div>
    </div>
  )
}
