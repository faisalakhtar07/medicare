import { Link, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, MapPin, Package, ShieldCheck } from 'lucide-react'
import Button from '../components/Button.jsx'

export default function OrderSuccess() {
  const { state } = useLocation()
  if (!state) return <Navigate to="/" replace />
  const { orderId, address, total, deliveryMethod, paid } = state
  const eta = deliveryMethod === 'express' ? '24 hours' : '2–4 days'

  return (
    <div className="max-w-lg mx-auto px-5 lg:px-6 py-14 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="w-20 h-20 rounded-full bg-mint-500/10 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle2 size={40} className="text-mint-600" />
      </motion.div>
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Order Placed Successfully!</h1>
      <p className="text-sm text-navy-900/50 mb-8">
        {paid ? 'Payment received — your order has been confirmed.' : 'Your order has been confirmed and is being prepared.'}
      </p>

      <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5 text-left mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-navy-900/40">Order ID</span>
          <span className="text-sm font-bold">{orderId}</span>
        </div>
        {paid && (
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-navy-900/40">Payment</span>
            <span className="text-xs font-semibold text-mint-600 flex items-center gap-1"><ShieldCheck size={13} /> Paid</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-navy-900/40">Estimated Delivery</span>
          <span className="text-sm font-medium">{eta}</span>
        </div>
        <div className="h-px bg-navy-900/10 my-3" />
        <div className="flex items-start gap-2 mb-3">
          <MapPin size={14} className="text-teal-600 mt-0.5 shrink-0" />
          <p className="text-xs text-navy-900/60">
            {address.house}, {address.street}, {address.area}, {address.city}, {address.state} – {address.pin}
          </p>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-navy-900/40 flex items-center gap-1"><Package size={13} /> Total Amount</span>
          <span className="text-base font-bold">₹{total}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button as={Link} to="/orders" variant="outline">View Orders</Button>
        <Button as={Link} to="/medicines" variant="ghost">Continue Shopping</Button>
        <Button as={Link} to="/orders">Track Order</Button>
      </div>
    </div>
  )
}
