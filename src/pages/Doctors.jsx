import { useState, useEffect, useMemo } from 'react'
import { Info } from 'lucide-react'
import DoctorCard from '../components/DoctorCard.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'
import { doctorSpecializations } from '../data/doctors.js'
import { api } from '../utils/api.js'

export default function Doctors() {
  const [active, setActive] = useState('All')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api
      .getDoctors()
      .then(setDoctors)
      .catch(() => setError('Could not reach the backend. Make sure it is running at localhost:5000.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => (active === 'All' ? doctors : doctors.filter((d) => d.specialization === active)), [active, doctors])

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Consult Doctors Online</h1>
      <p className="text-sm text-navy-900/50 mb-4">Connect with qualified, experienced doctors from home.</p>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-lg p-3 text-[11px] text-amber-900/80 leading-relaxed mb-6">
        <Info size={14} className="shrink-0 mt-0.5" />
        This is a demo frontend. Real medical consultation requires backend verification and licensed professionals.
      </div>

      {error && <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 text-sm text-amber-900/80 mb-5">{error}</div>}

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4">
        {['All', ...doctorSpecializations].map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`focus-ring shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              active === s ? 'bg-teal-600 text-white border-teal-600' : 'border-navy-900/15 text-navy-900/60'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filtered.map((d) => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}
    </div>
  )
}
