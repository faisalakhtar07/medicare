import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Store, Bike, Eye, EyeOff } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function StaffRegister() {
  const [role, setRole] = useState('owner')
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', accessCode: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { staffRegister } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await staffRegister({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: form.password,
        role,
        accessCode: form.accessCode.trim(),
      })
      showToast('Staff account created')
      navigate(role === 'owner' ? '/owner' : '/delivery')
    } catch (err) {
      setError(err.message || 'Signup failed')
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
        <h1 className="text-xl font-display font-bold">Create Staff Account</h1>
        <p className="text-sm text-navy-900/50">Requires a valid access code from the pharmacy owner.</p>
      </div>

      <div className="flex bg-skyfaint rounded-full p-1 mb-6">
        <button type="button" onClick={() => setRole('owner')} className={`focus-ring flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full ${role === 'owner' ? 'bg-white shadow-sm text-navy-900' : 'text-navy-900/50'}`}>
          <Store size={13} /> Owner
        </button>
        <button type="button" onClick={() => setRole('delivery')} className={`focus-ring flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full ${role === 'delivery' ? 'bg-white shadow-sm text-navy-900' : 'text-navy-900/50'}`}>
          <Bike size={13} /> Delivery
        </button>
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
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-navy-900/40" aria-label="Toggle password">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <input required placeholder="Secure Access Code" value={form.accessCode} onChange={(e) => setForm({ ...form, accessCode: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />

        {error && <p className="text-xs text-coral">{error}</p>}
        <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Staff Account'}
        </Button>
      </form>

      <p className="text-center text-xs text-navy-900/50 mt-6">
        Already have an account? <Link to="/staff/login" className="focus-ring text-teal-700 font-semibold">Login</Link>
      </p>
    </div>
  )
}
