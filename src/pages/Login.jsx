import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cross, Smartphone, Mail } from 'lucide-react'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Login() {
  const [mode, setMode] = useState('mobile')
  const [value, setValue] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  const submit = (e) => {
    e.preventDefault()
    if (!otpSent) {
      setOtpSent(true)
      showToast('OTP sent')
    } else {
      showToast('Logged in successfully')
      navigate('/profile')
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

      <div className="flex bg-skyfaint rounded-full p-1 mb-6">
        <button onClick={() => { setMode('mobile'); setOtpSent(false) }} className={`focus-ring flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full ${mode === 'mobile' ? 'bg-white shadow-sm' : 'text-navy-900/50'}`}>
          <Smartphone size={13} /> Mobile
        </button>
        <button onClick={() => { setMode('email'); setOtpSent(false) }} className={`focus-ring flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full ${mode === 'email' ? 'bg-white shadow-sm' : 'text-navy-900/50'}`}>
          <Mail size={13} /> Email
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        {!otpSent ? (
          <input
            required
            type={mode === 'mobile' ? 'tel' : 'email'}
            placeholder={mode === 'mobile' ? 'Mobile Number' : 'Email Address'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm"
          />
        ) : (
          <div>
            <p className="text-xs text-navy-900/50 mb-2">Enter the OTP sent to {value || 'your ' + mode}</p>
            <input
              required
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm tracking-[0.5em] text-center font-semibold"
            />
          </div>
        )}
        <Button type="submit" className="w-full">{otpSent ? 'Verify & Login' : 'Send OTP'}</Button>
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
        New here? <Link to="/signup" className="focus-ring text-teal-700 font-semibold">Create an account</Link>
      </p>
    </div>
  )
}
