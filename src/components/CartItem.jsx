import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart()

  return (
    <div className="flex gap-3.5 py-4 border-b border-navy-900/5 last:border-0">
      <Link to={`/medicines/${item.id}`} className="focus-ring w-16 h-16 shrink-0 rounded-lg bg-skyfaint flex items-center justify-center text-2xl overflow-hidden">
        {item.image?.startsWith('http') ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          item.image || '💊'
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/medicines/${item.id}`} className="focus-ring text-sm font-semibold line-clamp-2 block">{item.name}</Link>
        <p className="text-[11px] text-navy-900/40 mt-0.5">{item.packSize}</p>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center border border-navy-900/15 rounded-full">
            <button onClick={() => updateQty(item.id, item.qty - 1)} className="focus-ring w-7 h-7 flex items-center justify-center" aria-label="Decrease quantity">
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)} className="focus-ring w-7 h-7 flex items-center justify-center" aria-label="Increase quantity">
              <Plus size={13} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">₹{item.price * item.qty}</p>
          </div>
        </div>
      </div>
      <button onClick={() => removeFromCart(item.id)} className="focus-ring self-start text-navy-900/30 hover:text-coral" aria-label="Remove item">
        <Trash2 size={16} />
      </button>
    </div>
  )
}
