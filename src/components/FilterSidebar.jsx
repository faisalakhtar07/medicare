const priceRanges = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 – ₹500', min: 100, max: 500 },
  { label: '₹500 – ₹1500', min: 500, max: 1500 },
  { label: 'Above ₹1500', min: 1500, max: Infinity },
]

export default function FilterSidebar({ brands, filters, setFilters }) {
  const toggleBrand = (brand) => {
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter((b) => b !== brand) : [...f.brands, brand],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Prescription</h4>
        <label className="flex items-center gap-2 text-sm text-navy-900/70">
          <input
            type="checkbox"
            checked={filters.rxOnly}
            onChange={(e) => setFilters((f) => ({ ...f, rxOnly: e.target.checked }))}
            className="accent-teal-600 w-4 h-4"
          />
          Prescription required only
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-900/70 mt-2">
          <input
            type="checkbox"
            checked={filters.otcOnly}
            onChange={(e) => setFilters((f) => ({ ...f, otcOnly: e.target.checked }))}
            className="accent-teal-600 w-4 h-4"
          />
          No prescription needed
        </label>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((r) => (
            <label key={r.label} className="flex items-center gap-2 text-sm text-navy-900/70">
              <input
                type="radio"
                name="price"
                checked={filters.price?.label === r.label}
                onChange={() => setFilters((f) => ({ ...f, price: r }))}
                className="accent-teal-600 w-4 h-4"
              />
              {r.label}
            </label>
          ))}
          {filters.price && (
            <button onClick={() => setFilters((f) => ({ ...f, price: null }))} className="text-xs text-teal-700 font-medium focus-ring">
              Clear price filter
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3">Brand</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm text-navy-900/70">
              <input
                type="checkbox"
                checked={filters.brands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="accent-teal-600 w-4 h-4"
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {[4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
              className={`focus-ring text-xs font-semibold px-3 py-1.5 rounded-full border ${
                filters.minRating === r ? 'bg-teal-600 text-white border-teal-600' : 'border-navy-900/15 text-navy-900/60'
              }`}
            >
              {r}★ & up
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
