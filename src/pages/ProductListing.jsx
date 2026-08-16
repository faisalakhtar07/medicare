import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'
import Modal from '../components/Modal.jsx'
import { categories } from '../data/categories.js'
import { api } from '../utils/api.js'

const sortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
]

export default function ProductListing({ title, filterCategory }) {
  const { slug } = useParams()
  const category = filterCategory !== undefined ? filterCategory : slug
  const catInfo = categories.find((c) => c.slug === category)
  const pageTitle = title || catInfo?.name || 'Products'

  const [allProducts, setAllProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sort, setSort] = useState('popularity')
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ brands: [], price: null, rxOnly: false, otcOnly: false, minRating: 0 })

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = {}
    if (category) params.category = category
    if (sort === 'price-asc' || sort === 'price-desc' || sort === 'rating') params.sort = sort

    api
      .getProducts(params)
      .then((data) => {
        setAllProducts(data)
        setBrands([...new Set(data.map((p) => p.brand))].sort())
      })
      .catch(() => setError('Could not reach the backend. Please check your internet connection or try again later.'))
      .finally(() => setLoading(false))
  }, [category, sort])

  const filtered = useMemo(() => {
    let list = allProducts
    if (filters.brands.length) list = list.filter((p) => filters.brands.includes(p.brand))
    if (filters.price) list = list.filter((p) => p.price >= filters.price.min && p.price < filters.price.max)
    if (filters.rxOnly) list = list.filter((p) => p.prescriptionRequired)
    if (filters.otcOnly) list = list.filter((p) => !p.prescriptionRequired)
    if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating)
    return list
  }, [allProducts, filters])

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-6 py-6 md:py-8">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-display font-bold">{pageTitle}</h1>
        <p className="text-xs text-navy-900/40 mt-1">{filtered.length} products found</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 text-sm text-amber-900/80 mb-5">{error}</div>
      )}

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden md:block">
          <FilterSidebar brands={brands} filters={filters} setFilters={setFilters} />
        </aside>

        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setShowFilters(true)} className="focus-ring md:hidden flex items-center gap-1.5 text-sm font-medium border border-navy-900/15 rounded-full px-3.5 py-1.5">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="focus-ring text-xs font-medium border border-navy-900/15 rounded-full px-3 py-1.5 bg-white"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="hidden md:flex items-center border border-navy-900/15 rounded-full overflow-hidden">
                <button onClick={() => setView('grid')} className={`focus-ring p-1.5 ${view === 'grid' ? 'bg-teal-600 text-white' : ''}`} aria-label="Grid view"><LayoutGrid size={14} /></button>
                <button onClick={() => setView('list')} className={`focus-ring p-1.5 ${view === 'list' ? 'bg-teal-600 text-white' : ''}`} aria-label="List view"><List size={14} /></button>
              </div>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState icon="🔍" title="No products found" message="Try adjusting your filters or browse another category." ctaLabel="Browse Medicines" ctaTo="/medicines" />
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3.5' : 'flex flex-col gap-3'}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <Modal open={showFilters} onClose={() => setShowFilters(false)} title="Filters">
        <FilterSidebar brands={brands} filters={filters} setFilters={setFilters} />
        <button onClick={() => setShowFilters(false)} className="focus-ring w-full mt-5 bg-teal-600 text-white py-2.5 rounded-full text-sm font-semibold">
          Apply Filters
        </button>
      </Modal>
    </div>
  )
}
