import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { ChevronLeft, Bell, Package, CreditCard, XCircle, CheckCheck } from 'lucide-react'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const iconFor = {
  order_placed: Package,
  order_status: Package,
  payment_success: CreditCard,
  payment_failed: XCircle,
  order_cancelled: XCircle,
  general: Bell,
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function NotificationsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.myNotifications().then((d) => setNotifications(d.notifications)).finally(() => setLoading(false))

  useEffect(() => {
    if (isAuthenticated) load()
  }, [isAuthenticated])

  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />

  const markRead = async (id) => {
    await api.markNotificationRead(id)
    load()
  }

  const markAllRead = async () => {
    await api.markAllNotificationsRead()
    load()
  }

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <Link to="/profile" className="focus-ring inline-flex items-center gap-1 text-xs text-navy-900/50 mb-4">
        <ChevronLeft size={14} /> Back to profile
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-display font-bold">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button onClick={markAllRead} className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-teal-700">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-navy-900/40 text-center py-10">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="text-center py-14">
          <Bell size={32} className="text-navy-900/20 mx-auto mb-3" />
          <p className="text-sm text-navy-900/50">No notifications yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card divide-y divide-navy-900/5">
          {notifications.map((n) => {
            const Icon = iconFor[n.type] || Bell
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`focus-ring w-full text-left flex items-start gap-3 p-4 hover:bg-skyfaint ${!n.read ? 'bg-teal-50/30' : ''}`}
              >
                <span className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Icon size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{n.title}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />}
                  </span>
                  <p className="text-xs text-navy-900/50 leading-relaxed mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-navy-900/30 mt-1">{formatDate(n.createdAt)}</p>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
