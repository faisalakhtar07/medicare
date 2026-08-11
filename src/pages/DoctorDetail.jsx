import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Star, Clock, Info, CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import Button from '../components/Button.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Avatar from '../components/Avatar.jsx'
import { doctors } from '../data/doctors.js'
import { openWhatsApp, buildDoctorMessage } from '../utils/whatsapp.js'

const slots = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM', '7:30 PM']

export default function DoctorDetail() {
  const { id } = useParams()
  const doctor = doctors.find((d) => d.id === id)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(false)

  if (!doctor) return <EmptyState icon="🩺" title="Doctor not found" message="This profile may be unavailable." ctaLabel="Browse Doctors" ctaTo="/doctors" />

  const bookNow = () => {
    setBooked(true)
    openWhatsApp(buildDoctorMessage({ doctor, slot }), doctor.phone)
  }

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <div className="flex items-start gap-4 mb-6">
        <Avatar name={doctor.name} color={doctor.color} size={80} />
        <div>
          <h1 className="text-xl font-display font-bold">{doctor.name}</h1>
          <p className="text-sm text-teal-700 font-medium">{doctor.specialization}</p>
          <p className="text-xs text-navy-900/40 mb-2">{doctor.experience} experience</p>
          <div className="flex items-center gap-1 text-xs text-navy-900/60 mb-1">
            <Star size={13} className="fill-amber-400 text-amber-400" /> {doctor.rating} ({doctor.reviews} reviews)
          </div>
          <p className="flex items-center gap-1.5 text-xs text-navy-900/50">
            <Phone size={12} className="text-teal-600" /> +{doctor.phone.replace(/^91/, '91 ')}
          </p>
        </div>
      </div>

      <div className="bg-skyfaint rounded-xl p-4 flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-navy-900/40">Consultation Fee</p>
          <p className="text-lg font-bold">₹{doctor.fee}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${doctor.availableToday ? 'bg-mint-500/10 text-mint-600' : 'bg-navy-900/5 text-navy-900/40'}`}>
          <Clock size={12} /> {doctor.availableToday ? 'Available Today' : doctor.nextSlot}
        </span>
      </div>

      <h2 className="text-sm font-semibold mb-3">Select a Time Slot</h2>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {slots.map((s) => (
          <button
            key={s}
            onClick={() => setSlot(s)}
            className={`focus-ring text-xs font-semibold py-2.5 rounded-lg border ${slot === s ? 'bg-teal-600 text-white border-teal-600' : 'border-navy-900/15 text-navy-900/70'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-lg p-3 text-[11px] text-amber-900/80 leading-relaxed mb-6">
        <Info size={14} className="shrink-0 mt-0.5" />
        Demo consultation booking only. No real medical advice is provided through this frontend.
      </div>

      <Button className="w-full sm:w-auto" disabled={!slot} onClick={bookNow}>
        Book Consultation {slot && `· ${slot}`}
      </Button>

      <Modal open={booked} onClose={() => setBooked(false)} title="Consultation Booked">
        <div className="text-center py-4">
          <CheckCircle2 size={44} className="text-mint-600 mx-auto mb-3" />
          <p className="text-sm font-semibold mb-1">Booked with {doctor.name}</p>
          <p className="text-xs text-navy-900/50 mb-5">We've opened WhatsApp directly with {doctor.name.replace('Dr. ', 'Dr. ')} — just hit send. You'll receive a reminder before the consultation.</p>
          <div className="flex flex-col gap-2">
            <button onClick={bookNow} className="focus-ring w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-mint-600 py-1">
              <MessageCircle size={16} /> Open WhatsApp again
            </button>
            <Button as={Link} to="/doctors" className="w-full">Back to Doctors</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
