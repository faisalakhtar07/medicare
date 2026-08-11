import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import CartItem from '../components/CartItem.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, itemTotal, mrpTotal, discount, deliveryFee, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6">
        <EmptyState icon="🛒" title="Your cart is empty" message="Your cart is waiting for some healthcare essentials." ctaLabel="Browse Medicines" ctaTo="/medicines" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-6">Shopping Cart ({items.length})</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4 md:p-5">
          {items.map((item) => <CartItem key={item.id} item={item} />)}
        </div>

        <div>
          <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5 sticky top-20">
            <h2 className="text-sm font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm text-navy-900/60">
              <div className="flex justify-between"><span>Item Total</span><span>₹{mrpTotal}</span></div>
              <div className="flex justify-between text-mint-600"><span>Discount</span><span>−₹{discount}</span></div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-mint-600 font-medium">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="h-px bg-navy-900/10 my-2" />
              <div className="flex justify-between text-navy-900 font-bold text-base">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>
            {deliveryFee > 0 && (
              <p className="flex items-center gap-1.5 text-[11px] text-navy-900/40 mt-3">
                <Info size={12} /> Free delivery above ₹499
              </p>
            )}
            <Button as={Link} to="/checkout" className="w-full mt-5">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
