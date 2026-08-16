import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Phone, MapPin, IndianRupee, LogOut, Package, ShieldCheck } from 'lucide-react'
import Button from '../components/Button.jsx'
import Modal from '../components/Modal.jsx'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function DeliveryDashboard() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [otpModalOrder, setOtpModalOrder] = useState(null)
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const load = () => api.deliveryOrders().then(setOrders)

  useEffect(() => {
    if (user?.role !== 'delivery') return
    setLoading(true)
    load().finally(() => setLoading(false))
  }, [user])

  // Poll every 10s so newly assigned orders show up without a manual refresh.
  useEffect(() => {
    if (user?.role !== 'delivery') return
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [user])

  if (!authLoading && !isAuthenticated) return <Navigate to="/staff/login" replace />
  if (!authLoading && user && user.role !== 'delivery') return <Navigate to="/" replace />
  if (authLoading || loading) return <div className="max-w-2xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading your deliveries...</div>

  const updateStatus = async (id, status) => {
    try {
      await api.deliveryUpdateStatus(id, status)
      showToast(`Marked as ${status}`)
      load()
    } catch (err) {
      showToast(err.message || 'Could not update status')
    }
  }

  const openDeliverModal = (order) => {
    setOtpModalOrder(order)
    setOtpInput('')
    setOtpError('')
  }

  const confirmDelivery = async () => {
    if (!otpModalOrder) return
    setVerifying(true)
    setOtpError('')
    try {
      await api.deliveryUpdateStatus(otpModalOrder.id, 'Delivered', otpInput.trim())
      showToast('Delivery confirmed ✅')
      setOtpModalOrder(null)
      load()
    } catch (err) {
      setOtpError(err.message || 'Incorrect OTP')
    } finally {
      setVerifying(false)
    }
  }

  const active = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
  const completed = orders.filter((o) => o.status === 'Delivered')

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="text-xl md:text-2xl font-display font-bold">My Deliveries</h1>
        <button onClick={() => { logout(); navigate('/') }} className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-coral">
          <LogOut size={14} /> Logout
        </button>
      </div>
      <p className="text-sm text-navy-900/50 mb-6">Welcome, {user?.name}</p>

      {active.length === 0 ? (
        <div className="text-center py-10">
          <Package size={32} className="text-navy-900/20 mx-auto mb-2" />
          <p className="text-sm text-navy-900/40">No active deliveries assigned to you right now.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {active.map((o) => (
            <div key={o.id} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">{o.orderNumber}</p>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">{o.status}</span>
              </div>
              <p className="text-sm font-medium mb-0.5">{o.user?.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-navy-900/50 mb-1">
                <Phone size={12} /> {o.address?.mobile || o.user?.mobile}
              </p>
              <p className="flex items-start gap-1.5 text-xs text-navy-900/50 mb-2">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                {o.address?.house}, {o.address?.street}, {o.address?.area}, {o.address?.city} - {o.address?.pin}
              </p>
              <p className="flex items-center gap-1 text-sm font-bold mb-3">
                <IndianRupee size={13} /> {o.total}
                <span className="text-[11px] font-normal text-navy-900/40 ml-1">
                  ({o.paymentMethod === 'cod' ? 'Collect on delivery' : `Paid via ${o.paymentMethod?.toUpperCase()}`})
                </span>
              </p>

              <div className="flex gap-2">
                {o.status !== 'Out for Delivery' && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, 'Out for Delivery')}>Picked Up / Out for Delivery</Button>
                )}
                {o.status === 'Out for Delivery' && (
                  <Button size="sm" onClick={() => openDeliverModal(o)}>
                    <ShieldCheck size={14} /> Mark Delivered (needs OTP)
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mb-3">Completed</h2>
          <div className="space-y-2">
            {completed.map((o) => (
              <div key={o.id} className="flex items-center justify-between bg-skyfaint rounded-xl px-4 py-3">
                <span className="text-xs font-medium">{o.orderNumber} · {o.user?.name}</span>
                <span className="text-[11px] text-mint-600 font-semibold">Delivered</span>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={!!otpModalOrder} onClose={() => setOtpModalOrder(null)} title="Confirm Delivery">
        <div className="space-y-3">
          <p className="text-sm text-navy-900/60">
            Ask <span className="font-semibold text-navy-900">{otpModalOrder?.user?.name}</span> for the 4-digit code from their app, and enter it below to confirm this order reached them.
          </p>
          <input
            autoFocus
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter 4-digit OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
            className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-3 text-center text-2xl font-bold tracking-[0.5em]"
          />
          {otpError && <p className="text-xs text-coral text-center">{otpError}</p>}
          <Button className="w-full" disabled={otpInput.length !== 4 || verifying} onClick={confirmDelivery}>
            {verifying ? 'Verifying...' : 'Confirm Delivery'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
