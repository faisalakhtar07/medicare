import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cross, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      showToast('Logged in successfully')
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-10 md:py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white mx-auto mb-3">
          <Cross size={22} />
        </div>
        <h1 className="text-xl font-display font-bold">Welcome back</h1>
        <p className="text-sm text-navy-900/50">Login to manage your orders and prescriptions.</p>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/30" />
          <input
            required
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full border border-navy-900/15 rounded-lg pl-10 pr-3.5 py-2.5 text-sm"
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/30" />
          <input
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring w-full border border-navy-900/15 rounded-lg pl-10 pr-10 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-navy-900/40 hover:text-navy-900/70"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-coral">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="text-center text-xs text-navy-900/50 mt-6">
        New here? <Link to="/signup" className="focus-ring text-teal-700 font-semibold">Create an account</Link>
      </p>
      <p className="text-center text-xs text-navy-900/40 mt-3">
        <Link to="/staff/login" className="focus-ring hover:text-navy-900/70">Owner / Delivery Login →</Link>
      </p>
      <p className="text-center text-[11px] text-navy-900/30 mt-3">
      </p>
    </div>
  )
}
