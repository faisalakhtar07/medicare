import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cross, Eye, EyeOff } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '' })
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { register } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: form.password,
      })
      showToast('Account created successfully')
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Signup failed')
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
        <h1 className="text-xl font-display font-bold">Create your account</h1>
        <p className="text-sm text-navy-900/50">Join MEDICARE for faster checkout and order tracking.</p>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
        <input required type="tel" placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
        <input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
        <div className="relative">
          <input
            required
            type={showPassword ? 'text' : 'password'}
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 pr-10 text-sm"
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

        <label className="flex items-start gap-2 text-xs text-navy-900/60">
          <input required type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-teal-600 w-4 h-4 mt-0.5" />
          I agree to the <Link to="/terms" className="text-teal-700 font-medium">Terms & Conditions</Link> and <Link to="/privacy" className="text-teal-700 font-medium">Privacy Policy</Link>
        </label>

        {error && <p className="text-xs text-coral">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-xs text-navy-900/50 mt-6">
        Already have an account? <Link to="/login" className="focus-ring text-teal-700 font-semibold">Login</Link>
      </p>
      <p className="text-center text-[11px] text-navy-900/30 mt-3">
        Make sure your backend server is running at localhost:5000
      </p>
    </div>
  )
}
