import { useState, useEffect, useMemo } from 'react'
import LabTestCard from '../components/LabTestCard.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'
import { labCategories } from '../data/labTests.js'
import { api } from '../utils/api.js'

export default function LabTests() {
  const [active, setActive] = useState('All')
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getLabTests()
      .then(setTests)
      .catch(() => setError('Could not reach the backend. Make sure it is running at localhost:5000.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => (active === 'All' ? tests : tests.filter((t) => t.category === active)), [active, tests])

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Lab Tests</h1>
      <p className="text-sm text-navy-900/50 mb-6">Book diagnostic tests with sample collection from home.</p>

      {error && <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 text-sm text-amber-900/80 mb-5">{error}</div>}

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4 mb-2">
        {['All', ...labCategories].map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`focus-ring shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              active === c ? 'bg-teal-600 text-white border-teal-600' : 'border-navy-900/15 text-navy-900/60'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((t) => <LabTestCard key={t.id} test={t} />)}
        </div>
      )}
    </div>
  )
}
