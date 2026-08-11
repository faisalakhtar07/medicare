export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl2 border border-navy-900/5 p-3.5 animate-pulse">
      <div className="h-28 rounded-lg bg-navy-900/5 mb-3" />
      <div className="h-2.5 w-1/3 bg-navy-900/10 rounded mb-2" />
      <div className="h-3 w-4/5 bg-navy-900/10 rounded mb-2" />
      <div className="h-3 w-2/5 bg-navy-900/10 rounded mb-3" />
      <div className="h-8 w-full bg-navy-900/5 rounded-full" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
