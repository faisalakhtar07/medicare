import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { products } from '../data/products.js'

const popularSearches = ['Paracetamol', 'Vitamin D3', 'Cetirizine', 'BP Monitor', 'Ashwagandha']

export default function SearchBar({ className = '', autoFocus = false }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [recent, setRecent] = useState(['Dolo 650', 'Glucometer'])
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const suggestions = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.generic.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  const runSearch = (q) => {
    if (!q.trim()) return
    setRecent((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, 5))
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/40" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
          placeholder="Search medicines, health products & more"
          className="focus-ring w-full pl-10 pr-9 py-2.5 rounded-full bg-skyfaint border border-transparent focus:border-teal-500 focus:bg-white text-sm placeholder:text-navy-900/40 transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2" aria-label="Clear search">
            <X size={15} className="text-navy-900/40" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white rounded-xl2 shadow-cardHover border border-navy-900/5 p-4 z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => runSearch(p.name)}
                    className="focus-ring w-full text-left px-2.5 py-2 rounded-lg hover:bg-skyfaint flex items-center gap-2.5 text-sm"
                  >
                    <span className="text-lg">{p.image}</span>
                    <span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-navy-900/40"> · {p.generic}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {recent.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-navy-900/40 uppercase tracking-wide mb-1.5">Recent Searches</p>
                    {recent.map((r) => (
                      <button key={r} onClick={() => runSearch(r)} className="focus-ring w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-skyfaint flex items-center gap-2 text-sm">
                        <Clock size={13} className="text-navy-900/30" /> {r}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold text-navy-900/40 uppercase tracking-wide mb-1.5">Trending</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((p) => (
                      <button
                        key={p}
                        onClick={() => runSearch(p)}
                        className="focus-ring flex items-center gap-1 text-xs font-medium bg-skyfaint hover:bg-teal-50 px-3 py-1.5 rounded-full"
                      >
                        <TrendingUp size={11} className="text-teal-600" /> {p}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
