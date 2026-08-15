import { useEffect, useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Package, Clock, CheckCircle2, Truck, IndianRupee, Users, LogOut, ChevronDown, FileText } from 'lucide-react'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const STATUS_FLOW = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
const STATUS_COLOR = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-teal-100 text-teal-700',
  Delivered: 'bg-mint-500/10 text-mint-600',
  Cancelled: 'bg-coral/10 text-coral',
}

export default function OwnerDashboard() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [deliveryStaff, setDeliveryStaff] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    const params = filter === 'All' ? {} : { status: filter }
    api.ownerOrders(params).then(setOrders)
  }

  useEffect(() => {
    if (user?.role !== 'owner') return
    setLoading(true)
    Promise.all([api.ownerStats(), api.ownerOrders(filter === 'All' ? {} : { status: filter }), api.getDeliveryStaff()])
      .then(([s, o, d]) => {
        setStats(s)
        setOrders(o)
        setDeliveryStaff(d)
      })
      .finally(() => setLoading(false))
  }, [user, filter])

  // Poll every 10s so new orders and status changes show up without a manual refresh.
  useEffect(() => {
    if (user?.role !== 'owner') return
    const interval = setInterval(() => {
      api.ownerStats().then(setStats)
      loadOrders()
    }, 10000)
    return () => clearInterval(interval)
  }, [user, filter])

  if (!authLoading && !isAuthenticated) return <Navigate to="/staff/login" replace />
  if (!authLoading && user && user.role !== 'owner') return <Navigate to="/" replace />
  if (authLoading || loading) return <div className="max-w-6xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading dashboard...</div>

  const updateStatus = async (orderId, status) => {
    try {
      await api.ownerUpdateStatus(orderId, status)
      showToast(`Order marked as ${status}`)
      loadOrders()
    } catch (err) {
      showToast(err.message || 'Could not update status')
    }
  }

  const assignDelivery = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) return
    try {
      await api.ownerAssignDelivery(orderId, deliveryBoyId)
      showToast('Delivery staff assigned')
      loadOrders()
    } catch (err) {
      showToast(err.message || 'Could not assign delivery staff')
    }
  }

  const statCards = [
    { label: 'Pending', value: stats?.pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Preparing', value: stats?.preparing, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Out for Delivery', value: stats?.outForDelivery, icon: Truck, color: 'text-teal-600 bg-teal-50' },
    { label: 'Delivered', value: stats?.delivered, icon: CheckCircle2, color: 'text-mint-600 bg-mint-500/10' },
    { label: 'Customers', value: stats?.customers, icon: Users, color: 'text-navy-900 bg-navy-900/5' },
    { label: 'Revenue', value: `₹${stats?.totalRevenue ?? 0}`, icon: IndianRupee, color: 'text-coral bg-coral/10' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="text-xl md:text-2xl font-display font-bold">Owner Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/owner/prescriptions" className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-teal-700">
            <FileText size={14} /> Prescriptions
          </Link>
          <button onClick={() => { logout(); navigate('/') }} className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-coral">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
      <p className="text-sm text-navy-900/50 mb-6">Welcome back, {user?.name}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-3.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${c.color}`}>
              <c.icon size={15} />
            </div>
            <p className="text-lg font-bold">{c.value ?? 0}</p>
            <p className="text-[11px] text-navy-900/40">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4">
        {['All', ...STATUS_FLOW].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`focus-ring shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === s ? 'bg-navy-950 text-white border-navy-950' : 'border-navy-900/15 text-navy-900/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-navy-900/40 py-10 text-center">No orders in this category.</p>
      ) : (
        <div className="space-y-3 mt-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-bold">{o.orderNumber}</p>
                  <p className="text-xs text-navy-900/50">{o.user?.name} · {o.user?.mobile}</p>
                  <p className="text-[11px] text-navy-900/40 mt-0.5">{o.address?.house}, {o.address?.area}, {o.address?.city}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${o.paymentStatus === 'Paid' ? 'bg-mint-500/10 text-mint-600' : o.paymentStatus === 'Failed' ? 'bg-coral/10 text-coral' : 'bg-navy-900/5 text-navy-900/40'}`}>
                    {o.paymentStatus} · {o.paymentMethod?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-navy-900/60 space-y-0.5 mb-3">
                {o.items?.map((i) => (
                  <div key={i.name} className="flex justify-between">
                    <span>{i.name} × {i.qty}</span>
                    <span>₹{i.price * i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm font-bold mb-3 pt-2 border-t border-navy-900/5">
                <span>Total</span>
                <span>₹{o.total}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="focus-ring appearance-none text-xs font-semibold border border-navy-900/15 rounded-full pl-3 pr-7 py-1.5 bg-white"
                  >
                    {STATUS_FLOW.filter((s) => s !== 'Out for Delivery' || o.assignedTo).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-navy-900/40" />
                </div>

                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) => assignDelivery(o.id, e.target.value)}
                    className="focus-ring appearance-none text-xs font-semibold border border-navy-900/15 rounded-full pl-3 pr-7 py-1.5 bg-white"
                  >
                    <option value="" disabled>{o.assignedTo ? `Assigned: ${o.assignedTo.name}` : 'Assign delivery → sets Out for Delivery'}</option>
                    {deliveryStaff.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-navy-900/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
