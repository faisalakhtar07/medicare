import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, KeyRound, Eye, EyeOff, Store, Bike } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function StaffLogin() {
  const [role, setRole] = useState('owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { staffLogin } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await staffLogin({ email: email.trim().toLowerCase(), password, role, accessCode: accessCode.trim() })
      showToast(`Welcome back, ${data.name}`)
      navigate(role === 'owner' ? '/owner' : '/delivery')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-10 md:py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center text-white mx-auto mb-3">
          <ShieldCheck size={22} />
        </div>
        <h1 className="text-xl font-display font-bold">Owner / Delivery Login</h1>
        <p className="text-sm text-navy-900/50">Secure staff access — not for customer accounts.</p>
      </div>

      <div className="flex bg-skyfaint rounded-full p-1 mb-6">
        <button
          type="button"
          onClick={() => setRole('owner')}
          className={`focus-ring flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full ${role === 'owner' ? 'bg-white shadow-sm text-navy-900' : 'text-navy-900/50'}`}
        >
          <Store size={13} /> Owner
        </button>
        <button
          type="button"
          onClick={() => setRole('delivery')}
          className={`focus-ring flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full ${role === 'delivery' ? 'bg-white shadow-sm text-navy-900' : 'text-navy-900/50'}`}
        >
          <Bike size={13} /> Delivery
        </button>
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
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-navy-900/40" aria-label="Toggle password">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="relative">
          <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/30" />
          <input
            required
            type="text"
            placeholder="Secure Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="focus-ring w-full border border-navy-900/15 rounded-lg pl-10 pr-3.5 py-2.5 text-sm"
          />
        </div>

        {error && <p className="text-xs text-coral">{error}</p>}
        <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : `Login as ${role === 'owner' ? 'Owner' : 'Delivery Staff'}`}
        </Button>
      </form>

      <p className="text-center text-xs text-navy-900/50 mt-6">
        New staff member? <Link to="/staff/register" className="focus-ring text-teal-700 font-semibold">Create staff account</Link>
      </p>
      <p className="text-center text-xs text-navy-900/40 mt-4">
        <Link to="/login" className="focus-ring hover:text-teal-700">← Back to customer login</Link>
      </p>
    </div>
  )
}
