import { useState, useRef, useEffect } from 'react'
import { Bell, Package, CreditCard, XCircle, CheckCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
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

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// Plays a short two-tone "new order" beep using the Web Audio API —
// no external mp3 file needed, works the moment the page has had a click.
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime
    ;[880, 1108].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + i * 0.18)
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.18 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.16)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.18)
      osc.stop(now + i * 0.18 + 0.18)
    })
  } catch {
    // Web Audio unsupported/blocked — fail silently, badge still updates
  }
}

export default function NotificationBell() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef(null)
  const prevUnreadRef = useRef(null) // null = "haven't loaded yet", so we never beep on first load

  const load = () => {
    if (!isAuthenticated) return
    api.myNotifications().then((d) => {
      setNotifications(d.notifications)
      setUnreadCount(d.unreadCount)
      if (prevUnreadRef.current !== null && d.unreadCount > prevUnreadRef.current) {
        playAlertSound()
      }
      prevUnreadRef.current = d.unreadCount
    }).catch(() => {})
  }

  useEffect(() => {
    load()
    if (!isAuthenticated) return
    // Owner/delivery get a faster poll so "new order" alerts feel closer to real-time.
    const intervalMs = user?.role === 'owner' || user?.role === 'delivery' ? 6000 : 15000
    const interval = setInterval(load, intervalMs)
    return () => clearInterval(interval)
  }, [isAuthenticated, user?.role])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!isAuthenticated) return null

  const markRead = async (id) => {
    await api.markNotificationRead(id)
    load()
  }

  const markAllRead = async () => {
    await api.markAllNotificationsRead()
    load()
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open) load() }}
        className="focus-ring relative text-navy-900/70 hover:text-teal-700"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-xl2 shadow-cardHover border border-navy-900/5 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-navy-900/5">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="focus-ring flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-xs text-navy-900/40 py-8">No notifications yet</p>
              ) : (
                notifications.map((n) => {
                  const Icon = iconFor[n.type] || Bell
                  return (
                    <button
                      key={n.id}
                      onClick={() => !n.read && markRead(n.id)}
                      className={`focus-ring w-full text-left flex items-start gap-3 px-4 py-3 border-b border-navy-900/5 last:border-0 hover:bg-skyfaint ${!n.read ? 'bg-teal-50/40' : ''}`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <Icon size={14} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold truncate">{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />}
                        </span>
                        <p className="text-[11px] text-navy-900/50 leading-snug mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-navy-900/30 mt-1">{timeAgo(n.createdAt)}</p>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
