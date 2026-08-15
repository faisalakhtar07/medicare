import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FlaskConical, Clock, Home, Info, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function LabTestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    api.getLabTest(id).then(setTest).catch(() => setNotFound(true)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-3xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading...</div>
  if (notFound || !test) return <EmptyState icon="🧪" title="Test not found" message="This lab test may be unavailable." ctaLabel="Browse Lab Tests" ctaTo="/lab-tests" />

  const discountPct = Math.round(((test.mrp - test.price) / test.mrp) * 100)

  const bookTest = async () => {
    if (!isAuthenticated) {
      showToast('Please login to book a test')
      navigate('/login')
      return
    }
    try {
      await api.bookLabTest({ testId: test.id, testName: test.name, price: test.price })
      setBooked(true)
    } catch (err) {
      showToast(err.message || 'Could not book test')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600"><FlaskConical size={22} /></div>
        <div>
          <p className="text-xs text-navy-900/40">{test.category}</p>
          <h1 className="text-xl font-display font-bold">{test.name}</h1>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-bold">₹{test.price}</span>
        <span className="text-sm text-navy-900/35 line-through">₹{test.mrp}</span>
        <span className="text-sm font-semibold text-mint-600">{discountPct}% OFF</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-skyfaint rounded-xl p-3.5 text-center">
          <p className="text-xs text-navy-900/40 mb-1">Sample Type</p>
          <p className="text-sm font-semibold">{test.sample}</p>
        </div>
        <div className="bg-skyfaint rounded-xl p-3.5 text-center">
          <p className="text-xs text-navy-900/40 mb-1">Reports In</p>
          <p className="text-sm font-semibold">{test.reportTime}</p>
        </div>
        <div className="bg-skyfaint rounded-xl p-3.5 text-center">
          <p className="text-xs text-navy-900/40 mb-1">Parameters</p>
          <p className="text-sm font-semibold">{test.includes}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Info size={15} className="text-teal-600" /> Preparation Instructions</h2>
        <p className="text-sm text-navy-900/60">{test.fasting}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2">Parameters Included</h2>
        <div className="flex flex-wrap gap-2">
          {test.parameters?.map((p) => (
            <span key={p} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">{p}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-navy-900/50 bg-skyfaint rounded-xl p-3.5 mb-6">
        <Home size={14} className="text-teal-600" /> Free sample collection from your home
      </div>

      <Button className="w-full sm:w-auto" onClick={bookTest}>Book Test</Button>

      <Modal open={booked} onClose={() => setBooked(false)} title="Test Booked">
        <div className="text-center py-4">
          <CheckCircle2 size={44} className="text-mint-600 mx-auto mb-3" />
          <p className="text-sm font-semibold mb-1">{test.name} booked successfully</p>
          <p className="text-xs text-navy-900/50 mb-5">Saved to your account. Our team will contact you to schedule sample collection. You can also check status anytime from your profile.</p>
          <Button as={Link} to="/lab-tests" className="w-full">Browse More Tests</Button>
        </div>
      </Modal>
    </div>
  )
}
