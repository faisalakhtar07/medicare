import { Link } from 'react-router-dom'
import { Star, Clock, Phone } from 'lucide-react'
import Button from './Button.jsx'
import Avatar from './Avatar.jsx'

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card hover:shadow-cardHover transition-shadow p-4 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={doctor.name} color={doctor.color} size={56} />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{doctor.name}</h3>
          <p className="text-xs text-teal-700 font-medium">{doctor.specialization}</p>
          <p className="text-[11px] text-navy-900/40">{doctor.experience} experience</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-navy-900/60 mb-2">
        <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> {doctor.rating} ({doctor.reviews})</span>
        <span className={`flex items-center gap-1 ${doctor.availableToday ? 'text-mint-600' : 'text-navy-900/40'}`}>
          <Clock size={12} /> {doctor.nextSlot}
        </span>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-navy-900/40 mb-3">
        <Phone size={11} /> +{doctor.phone.replace(/^91/, '91 ')}
      </p>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-sm font-bold">₹{doctor.fee} <span className="font-normal text-xs text-navy-900/40">/ consult</span></span>
        <Button as={Link} to={`/doctors/${doctor.id}`} size="sm">Consult Now</Button>
      </div>
    </div>
  )
}
