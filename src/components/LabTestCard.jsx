import { Link } from 'react-router-dom'
import { FlaskConical, Clock } from 'lucide-react'
import Button from './Button.jsx'

export default function LabTestCard({ test }) {
  const discountPct = Math.round(((test.mrp - test.price) / test.mrp) * 100)
  return (
    <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card hover:shadow-cardHover transition-shadow p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
          <FlaskConical size={16} />
        </span>
        <span className="text-[11px] font-medium text-navy-900/40">{test.category}</span>
      </div>
      <h3 className="text-sm font-semibold mb-1">{test.name}</h3>
      <p className="text-[11px] text-navy-900/50 mb-1">Includes {test.includes} parameters · {test.sample} sample</p>
      <p className="text-[11px] text-navy-900/40 flex items-center gap-1 mb-3"><Clock size={11} /> Reports in {test.reportTime}</p>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-base font-bold">₹{test.price}</span>
        <span className="text-xs text-navy-900/35 line-through">₹{test.mrp}</span>
        <span className="text-xs font-semibold text-mint-600">{discountPct}% OFF</span>
      </div>
      <Button as={Link} to={`/lab-tests/${test.id}`} className="mt-auto w-full" size="sm">Book Now</Button>
    </div>
  )
}
