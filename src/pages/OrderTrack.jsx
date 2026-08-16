import { useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ShieldCheck } from 'lucide-react'
import OrderTimeline from '../components/OrderTimeline.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { orderTimelineSteps } from '../data/orders.js'

export default function OrderTrack() {
  const { id } = useParams()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    api.getOrder(id).then(setOrder).catch(() => setNotFound(true)).finally(() => setLoading(false))
  }, [id, isAuthenticated])

  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />
  if (loading) return <div className="max-w-2xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading order...</div>
  if (notFound || !order) return <EmptyState icon="📦" title="Order not found" message="We couldn't find this order." ctaLabel="View Orders" ctaTo="/orders" />

  const currentStep = Math.max(1, orderTimelineSteps.indexOf(order.status) + 1)

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1">Order {order.orderNumber}</h1>
      <p className="text-sm text-navy-900/50 mb-8">
        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · ₹{order.total}
      </p>

      <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5 md:p-6 mb-6">
        <OrderTimeline currentStep={currentStep} />
      </div>

      {order.status === 'Out for Delivery' && order.deliveryOtp && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl2 p-5 mb-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-700 mb-2">
            <ShieldCheck size={14} /> Delivery Confirmation Code
          </p>
          <p className="text-3xl font-bold tracking-[0.4em] text-navy-900 mb-2">{order.deliveryOtp}</p>
          <p className="text-xs text-navy-900/50">Share this code with the delivery person only when your order physically arrives.</p>
        </div>
      )}

      <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5">
        <h2 className="text-sm font-semibold mb-3">Items in this order</h2>
        {order.items?.map((i) => (
          <div key={i.name} className="flex justify-between text-sm text-navy-900/60 py-1.5">
            <span>{i.name} × {i.qty}</span>
            <span>₹{i.price * i.qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
