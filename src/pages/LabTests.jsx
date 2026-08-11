import { useState, useMemo } from 'react'
import LabTestCard from '../components/LabTestCard.jsx'
import { labTests, labCategories } from '../data/labTests.js'

export default function LabTests() {
  const [active, setActive] = useState('All')
  const filtered = useMemo(() => (active === 'All' ? labTests : labTests.filter((t) => t.category === active)), [active])

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Lab Tests</h1>
      <p className="text-sm text-navy-900/50 mb-6">Book diagnostic tests with sample collection from home.</p>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((t) => <LabTestCard key={t.id} test={t} />)}
      </div>
    </div>
  )
}
