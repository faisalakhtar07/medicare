import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ChevronLeft, Package } from 'lucide-react'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminCustomerDetail() {
  const { id } = useParams()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.isAdmin) return
    api.adminCustomer(id).then(setData).finally(() => setLoading(false))
  }, [id, user])

  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />
  if (!authLoading && user && !user.isAdmin) return <Navigate to="/profile" replace />
  if (loading || authLoading) return <div className="max-w-3xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading...</div>
  if (!data) return null

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <Link to="/admin" className="focus-ring inline-flex items-center gap-1 text-xs text-navy-900/50 mb-4">
        <ChevronLeft size={14} /> Back to dashboard
      </Link>
      <h1 className="text-xl font-display font-bold mb-1">{data.user.name}</h1>
      <p className="text-sm text-navy-900/50 mb-6">{data.user.email} · +91 {data.user.mobile}</p>

      <h2 className="text-sm font-semibold mb-3">Order History ({data.orders.length})</h2>
      {data.orders.length === 0 ? (
        <p className="text-sm text-navy-900/40">This customer hasn't placed any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {data.orders.map((o) => (
            <div key={o._id} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-teal-600" />
                  <span className="text-sm font-semibold">{o.orderNumber}</span>
                </div>
                <span className="text-xs text-navy-900/40">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              {o.items.map((i) => (
                <div key={i.name} className="flex justify-between text-xs text-navy-900/60 py-0.5">
                  <span>{i.name} × {i.qty}</span>
                  <span>₹{i.price * i.qty}</span>
                </div>
              ))}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-900/5">
                <span className="text-[11px] font-semibold text-navy-900/50">{o.status}</span>
                <span className="text-sm font-bold">₹{o.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
