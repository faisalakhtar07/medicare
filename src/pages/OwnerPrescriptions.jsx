import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { ChevronLeft, FileText, Download } from 'lucide-react'
import { api, FILE_BASE } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const STATUS_COLOR = {
  'Pending Review': 'bg-amber-100 text-amber-700',
  Verified: 'bg-mint-500/10 text-mint-600',
  Rejected: 'bg-coral/10 text-coral',
}

export default function OwnerPrescriptions() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.ownerPrescriptions().then(setPrescriptions).finally(() => setLoading(false))

  useEffect(() => {
    if (user?.role === 'owner') load()
  }, [user])

  if (!authLoading && !isAuthenticated) return <Navigate to="/staff/login" replace />
  if (!authLoading && user && user.role !== 'owner') return <Navigate to="/" replace />
  if (authLoading || loading) return <div className="max-w-3xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading prescriptions...</div>

  const updateStatus = async (id, status) => {
    try {
      await api.updatePrescriptionStatus(id, status)
      showToast(`Marked as ${status}`)
      load()
    } catch (err) {
      showToast(err.message || 'Could not update status')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <Link to="/owner" className="focus-ring inline-flex items-center gap-1 text-xs text-navy-900/50 mb-4">
        <ChevronLeft size={14} /> Back to dashboard
      </Link>
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Customer Prescriptions</h1>
      <p className="text-sm text-navy-900/50 mb-6">Every prescription customers have uploaded, newest first.</p>

      {prescriptions.length === 0 ? (
        <div className="text-center py-14">
          <FileText size={32} className="text-navy-900/20 mx-auto mb-3" />
          <p className="text-sm text-navy-900/50">No prescriptions uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.user?.name}</p>
                <p className="text-xs text-navy-900/40">{p.user?.mobile} · {new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLOR[p.status]}`}>{p.status}</span>
              <a href={`${FILE_BASE}${p.fileUrl}`} target="_blank" rel="noreferrer" className="focus-ring text-navy-900/40 hover:text-teal-700 shrink-0" aria-label="View file">
                <Download size={17} />
              </a>
              <select
                value={p.status}
                onChange={(e) => updateStatus(p.id, e.target.value)}
                className="focus-ring text-xs font-medium border border-navy-900/15 rounded-full px-2.5 py-1.5 bg-white shrink-0"
              >
                <option>Pending Review</option>
                <option>Verified</option>
                <option>Rejected</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
