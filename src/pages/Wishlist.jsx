import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function Wishlist() {
  const { wishlist } = useWishlist()

  if (wishlist.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6">
        <EmptyState icon="💚" title="Your wishlist is empty" message="Save products you love to find them here later." ctaLabel="Browse Medicines" ctaTo="/medicines" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-6">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {wishlist.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
