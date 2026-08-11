import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { products } from '../data/products.js'

export default function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const results = useMemo(() => {
    if (!q) return []
    const lower = q.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.generic.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower) || p.category.includes(lower)
    )
  }, [q])

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-lg md:text-xl font-display font-bold mb-1">Results for "{q}"</h1>
      <p className="text-xs text-navy-900/40 mb-6">{results.length} products found</p>

      {results.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No products found"
          message="We couldn't find a match. Try searching for the generic name or a related category."
          ctaLabel="Browse Medicines"
          ctaTo="/medicines"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
