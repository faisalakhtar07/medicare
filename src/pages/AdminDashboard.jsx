import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Users, Package, IndianRupee, ChevronRight } from 'lucide-react'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [stats, setStats] = useState(null)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.isAdmin) return
    Promise.all([api.adminStats(), api.adminCustomers()])
      .then(([s, c]) => {
        setStats(s)
        setCustomers(c)
      })
      .finally(() => setLoading(false))
  }, [user])

  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />
  if (!authLoading && user && !user.isAdmin) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <p className="text-sm text-navy-900/50">This page is only visible to admin accounts.</p>
      </div>
    )
  }
  if (loading || authLoading) return <div className="max-w-5xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading dashboard...</div>

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Admin Dashboard</h1>
      <p className="text-sm text-navy-900/50 mb-6">Every customer and what they've bought.</p>

      <div className="grid grid-cols-3 gap-3.5 mb-8">
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-2"><Users size={16} /></div>
          <p className="text-xl font-bold">{stats?.totalCustomers ?? 0}</p>
          <p className="text-xs text-navy-900/40">Customers</p>
        </div>
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
          <div className="w-9 h-9 rounded-lg bg-mint-500/10 flex items-center justify-center text-mint-600 mb-2"><Package size={16} /></div>
          <p className="text-xl font-bold">{stats?.totalOrders ?? 0}</p>
          <p className="text-xs text-navy-900/40">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
          <div className="w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center text-coral mb-2"><IndianRupee size={16} /></div>
          <p className="text-xl font-bold">₹{stats?.totalRevenue ?? 0}</p>
          <p className="text-xs text-navy-900/40">Total Revenue</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold mb-3">Customers</h2>
      {customers.length === 0 ? (
        <p className="text-sm text-navy-900/40">No customers have registered yet.</p>
      ) : (
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card divide-y divide-navy-900/5">
          {customers.map((c) => (
            <Link key={c._id} to={`/admin/customers/${c._id}`} className="focus-ring flex items-center justify-between p-4 hover:bg-skyfaint transition-colors">
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-navy-900/40">{c.email} · +91 {c.mobile}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold">₹{c.totalSpent}</p>
                  <p className="text-[11px] text-navy-900/40">{c.orderCount} orders</p>
                </div>
                <ChevronRight size={16} className="text-navy-900/30" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
