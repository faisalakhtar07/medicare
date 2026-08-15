import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import EmptyState from '../components/EmptyState.jsx'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const statusColor = {
  Delivered: 'text-mint-600 bg-mint-500/10',
  'Out for Delivery': 'text-teal-700 bg-teal-100',
  'Order Confirmed': 'text-navy-900/60 bg-navy-900/5',
}

export default function Orders() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    api.myOrders().then(setOrders).finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />
  if (loading) return <div className="max-w-3xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading your orders...</div>

  if (orders.length === 0) {
    return <EmptyState icon="📦" title="No orders yet" message="Your orders will show up here once you place one." ctaLabel="Start Shopping" ctaTo="/medicines" />
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-6">My Orders</h1>
      <div className="space-y-3.5">
        {orders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="focus-ring block bg-white rounded-xl2 border border-navy-900/5 shadow-card hover:shadow-cardHover p-4 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600"><Package size={16} /></div>
                <div>
                  <p className="text-sm font-semibold">{o.orderNumber}</p>
                  <p className="text-[11px] text-navy-900/40">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-navy-900/30" />
            </div>
            <p className="text-xs text-navy-900/50 line-clamp-1 mb-2">
              {o.items?.map((i) => i.name).join(', ')}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColor[o.status] || 'bg-navy-900/5 text-navy-900/60'}`}>{o.status}</span>
              <span className="text-sm font-bold">₹{o.total}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
