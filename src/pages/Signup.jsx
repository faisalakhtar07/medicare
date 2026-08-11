import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cross } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Signup() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '' })
  const [agreed, setAgreed] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const submit = (e) => {
    e.preventDefault()
    showToast('Account created successfully')
    navigate('/profile')
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
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />

        <label className="flex items-start gap-2 text-xs text-navy-900/60">
          <input required type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-teal-600 w-4 h-4 mt-0.5" />
          I agree to the <Link to="/terms" className="text-teal-700 font-medium">Terms & Conditions</Link> and <Link to="/privacy" className="text-teal-700 font-medium">Privacy Policy</Link>
        </label>

        <Button type="submit" className="w-full">Create Account</Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-navy-900/10 flex-1" />
        <span className="text-xs text-navy-900/40">or</span>
        <div className="h-px bg-navy-900/10 flex-1" />
      </div>

      <button className="focus-ring w-full flex items-center justify-center gap-2 border border-navy-900/15 rounded-full py-2.5 text-sm font-medium hover:bg-skyfaint">
        <span className="text-base">G</span> Continue with Google
      </button>

      <p className="text-center text-xs text-navy-900/50 mt-6">
        Already have an account? <Link to="/login" className="focus-ring text-teal-700 font-semibold">Login</Link>
      </p>
    </div>
  )
}
