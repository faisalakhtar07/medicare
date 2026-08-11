import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShieldAlert } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { showToast } = useToast()
  const discountPct = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const wishlisted = isWishlisted(product.id)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-xl2 border border-navy-900/5 shadow-card hover:shadow-cardHover p-3.5 flex flex-col"
    >
      <button
        onClick={() => {
          toggleWishlist(product)
          showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist')
        }}
        aria-label="Toggle wishlist"
        className="focus-ring absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
      >
        <Heart size={16} className={wishlisted ? 'fill-coral text-coral' : 'text-navy-900/40'} />
      </button>

      <Link to={`/medicines/${product.id}`} className="focus-ring rounded-lg">
        <div className="h-28 rounded-lg bg-skyfaint flex items-center justify-center text-4xl mb-3">
          {product.image}
        </div>
        {product.prescriptionRequired && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-coral bg-coral/10 px-2 py-0.5 rounded-full mb-1.5">
            <ShieldAlert size={11} /> Rx Required
          </span>
        )}
        <p className="text-[11px] text-navy-900/50 font-medium">{product.brand}</p>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <p className="text-[11px] text-navy-900/40 mb-2">{product.packSize}</p>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-base font-bold text-navy-900">₹{product.price}</span>
          <span className="text-xs text-navy-900/35 line-through">₹{product.mrp}</span>
          {discountPct > 0 && <span className="text-xs font-semibold text-mint-600">{discountPct}% OFF</span>}
        </div>
      </Link>

      <button
        onClick={() => {
          addToCart(product)
          showToast(`${product.name} added to cart`)
        }}
        className="focus-ring mt-auto w-full py-2 rounded-full border border-teal-600 text-teal-700 text-sm font-semibold hover:bg-teal-600 hover:text-white transition-colors"
      >
        Add to Cart
      </button>
    </motion.div>
  )
}
