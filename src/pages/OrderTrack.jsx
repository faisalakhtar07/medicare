import { useParams } from 'react-router-dom'
import OrderTimeline from '../components/OrderTimeline.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { sampleOrders } from '../data/orders.js'

export default function OrderTrack() {
  const { id } = useParams()
  const order = sampleOrders.find((o) => o.id === id) || sampleOrders[0]

  if (!order) return <EmptyState icon="📦" title="Order not found" message="We couldn't find this order." ctaLabel="View Orders" ctaTo="/orders" />

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1">Order {order.id}</h1>
      <p className="text-sm text-navy-900/50 mb-8">Placed on {order.date} · ₹{order.total}</p>

      <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5 md:p-6 mb-6">
        <OrderTimeline currentStep={order.currentStep} />
      </div>

      <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5">
        <h2 className="text-sm font-semibold mb-3">Items in this order</h2>
        {order.items.map((i) => (
          <div key={i.name} className="flex justify-between text-sm text-navy-900/60 py-1.5">
            <span>{i.name} × {i.qty}</span>
            <span>₹{i.price * i.qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
