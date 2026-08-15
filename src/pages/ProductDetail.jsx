import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, Minus, Plus, Heart, ShieldAlert, Truck, BadgeCheck, ChevronRight } from 'lucide-react'
import Button from '../components/Button.jsx'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { api } from '../utils/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { showToast } = useToast()

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p)
        return api.getProducts({ category: p.category })
      })
      .then((list) => setRelated(list.filter((p) => p.id !== id).slice(0, 4)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-6xl mx-auto px-5 py-16 text-center text-sm text-navy-900/40">Loading product...</div>
  if (notFound || !product) {
    return <EmptyState icon="📦" title="Product not found" message="This product may have been removed or is unavailable." ctaLabel="Browse Medicines" ctaTo="/medicines" />
  }

  const discountPct = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <div className="flex items-center gap-1 text-xs text-navy-900/40 mb-5">
        <Link to="/medicines" className="focus-ring hover:text-teal-700">Medicines</Link>
        <ChevronRight size={12} />
        <span className="text-navy-900/70">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square rounded-xl2 bg-skyfaint flex items-center justify-center text-9xl mb-3 overflow-hidden">
            {product.image?.startsWith('http') ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              product.image || '💊'
            )}
          </div>
        </div>

        <div>
          {product.prescriptionRequired && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-coral bg-coral/10 px-2.5 py-1 rounded-full mb-3">
              <ShieldAlert size={12} /> Prescription Required
            </span>
          )}
          <p className="text-xs font-medium text-navy-900/50">{product.brand}</p>
          <h1 className="text-xl md:text-2xl font-display font-bold mb-1">{product.name}</h1>
          <p className="text-sm text-navy-900/50 mb-3">{product.generic} · {product.packSize}</p>

          <div className="flex items-center gap-1.5 mb-4">
            <span className="flex items-center gap-1 bg-mint-500/10 text-mint-600 text-xs font-semibold px-2 py-0.5 rounded">
              <Star size={11} className="fill-mint-600" /> {product.rating}
            </span>
            <span className="text-xs text-navy-900/40">{product.reviews} ratings</span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold">₹{product.price}</span>
            <span className="text-sm text-navy-900/35 line-through">₹{product.mrp}</span>
            {discountPct > 0 && <span className="text-sm font-semibold text-mint-600">{discountPct}% OFF</span>}
          </div>
          <p className="text-[11px] text-navy-900/40 mb-5">Inclusive of all taxes</p>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center border border-navy-900/15 rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="focus-ring w-9 h-9 flex items-center justify-center" aria-label="Decrease quantity"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="focus-ring w-9 h-9 flex items-center justify-center" aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
            <button
              onClick={() => { toggleWishlist(product); showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist') }}
              className="focus-ring w-10 h-10 rounded-full border border-navy-900/15 flex items-center justify-center"
              aria-label="Toggle wishlist"
            >
              <Heart size={16} className={wishlisted ? 'fill-coral text-coral' : 'text-navy-900/40'} />
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <Button variant="outline" className="flex-1" onClick={() => { addToCart(product, qty); showToast(`${product.name} added to cart`) }}>Add to Cart</Button>
            <Button className="flex-1" onClick={() => { addToCart(product, qty); navigate('/checkout') }}>Buy Now</Button>
          </div>

          <div className="flex items-center gap-4 text-xs text-navy-900/50 bg-skyfaint rounded-xl p-3.5 mb-6">
            <span className="flex items-center gap-1.5"><Truck size={15} className="text-teal-600" /> Delivery in 2-4 days</span>
            <span className="flex items-center gap-1.5"><BadgeCheck size={15} className="text-teal-600" /> 100% Genuine</span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Product Information</h3>
              <p className="text-navy-900/60 leading-relaxed">{product.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-navy-900/40">Manufacturer</span><p className="font-medium">{product.manufacturer}</p></div>
              <div><span className="text-navy-900/40">Country of Origin</span><p className="font-medium">{product.country}</p></div>
            </div>
            <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3.5 text-xs text-amber-900/80 leading-relaxed">
              Please read the product packaging and consult a qualified healthcare professional when necessary.
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-display font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
