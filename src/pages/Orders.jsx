import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import EmptyState from '../components/EmptyState.jsx'
import { sampleOrders } from '../data/orders.js'

const statusColor = {
  Delivered: 'text-mint-600 bg-mint-500/10',
  'Out for Delivery': 'text-teal-700 bg-teal-100',
  'Order Confirmed': 'text-navy-900/60 bg-navy-900/5',
}

export default function Orders() {
  if (sampleOrders.length === 0) {
    return <EmptyState icon="📦" title="No orders yet" message="Your orders will show up here once you place one." ctaLabel="Start Shopping" ctaTo="/medicines" />
  }

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-6">My Orders</h1>
      <div className="space-y-3.5">
        {sampleOrders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="focus-ring block bg-white rounded-xl2 border border-navy-900/5 shadow-card hover:shadow-cardHover p-4 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600"><Package size={16} /></div>
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-[11px] text-navy-900/40">{o.date}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-navy-900/30" />
            </div>
            <p className="text-xs text-navy-900/50 line-clamp-1 mb-2">
              {o.items.map((i) => i.name).join(', ')}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColor[o.status] || 'bg-navy-900/5 text-navy-900/60'}`}>{o.status}</span>
              <span className="text-sm font-bold">₹{o.total}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
