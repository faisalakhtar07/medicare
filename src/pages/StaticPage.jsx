import { useState } from 'react'
import { Mail, Phone, MapPin, ChevronDown } from 'lucide-react'
import Button from '../components/Button.jsx'

const faqs = [
  { q: 'Do I need a prescription to order medicines?', a: 'Prescription-only medicines require a valid prescription, which our pharmacist verifies before your order is processed. Over-the-counter products can be ordered without one.' },
  { q: 'How long does delivery take?', a: 'Standard delivery typically arrives within 2–4 days. Express delivery, where available, arrives within 24 hours.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are packed for shipping. Once shipped, cancellation may not be possible.' },
  { q: 'Is my payment information secure?', a: 'This demo does not process real payments. In production, POPULAR MEDI would use secure, PCI-compliant payment gateways.' },
  { q: 'How do I track my order?', a: 'Visit "My Orders" from your profile and select an order to see its live status on the tracking timeline.' },
]

function AboutContent() {
  return (
    <>
      <h1 className="text-2xl font-display font-bold mb-3">About POPULAR MEDI</h1>
      <p className="text-sm text-navy-900/60 leading-relaxed mb-4">
        POPULAR MEDI is an online healthcare platform built to make ordering medicines, booking lab tests and
        consulting doctors simple and trustworthy for Indian households. This experience is currently a
        product demo showcasing what a modern pharmacy platform can look and feel like.
      </p>
      <p className="text-sm text-navy-900/60 leading-relaxed">
        Our goal is to combine the reliability of a neighbourhood pharmacy with the convenience of e-commerce —
        without compromising on the care healthcare deserves.
      </p>
    </>
  )
}

function ContactContent() {
  return (
    <>
      <h1 className="text-2xl font-display font-bold mb-3">Contact Us</h1>
      <p className="text-sm text-navy-900/60 mb-6">We'd love to hear from you. Reach out with any questions or feedback.</p>
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 text-sm text-navy-900/70"><Phone size={16} className="text-teal-600" /> +91 73608 00529</div>
        <div className="flex items-center gap-3 text-sm text-navy-900/70"><Mail size={16} className="text-teal-600" /> support@medicare.demo</div>
        <div className="flex items-center gap-3 text-sm text-navy-900/70"><MapPin size={16} className="text-teal-600" /> Aurangabad, Bihar, India</div>
      </div>
      <form className="space-y-3.5 max-w-md" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Your Name" className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
        <input placeholder="Email Address" className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
        <textarea placeholder="Your Message" rows={4} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
        <Button type="submit">Send Message</Button>
      </form>
    </>
  )
}

function FaqContent() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <h1 className="text-2xl font-display font-bold mb-3">Frequently Asked Questions</h1>
      <p className="text-sm text-navy-900/60 mb-6">Answers to common questions about orders, delivery and prescriptions.</p>
      <div className="divide-y divide-navy-900/10 border-t border-b border-navy-900/10">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="focus-ring w-full flex items-center justify-between py-4 text-left">
              <span className="text-sm font-semibold">{f.q}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="text-sm text-navy-900/60 pb-4 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </>
  )
}

function LegalContent({ title }) {
  return (
    <>
      <h1 className="text-2xl font-display font-bold mb-3">{title}</h1>
      <p className="text-sm text-navy-900/60 leading-relaxed mb-4">
        This is placeholder legal content for demonstration purposes only and does not constitute a binding
        agreement. In a production deployment, this page would contain POPULAR MEDI's complete {title.toLowerCase()},
        reviewed by qualified legal counsel and covering data handling, user responsibilities, prescription
        verification, returns, and platform usage terms.
      </p>
      <p className="text-sm text-navy-900/60 leading-relaxed">
        POPULAR MEDI does not provide medical advice, diagnosis or treatment through this platform. Always consult
        a qualified healthcare professional for medical concerns.
      </p>
    </>
  )
}

export default function StaticPage({ type }) {
  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-8 md:py-12">
      {type === 'about' && <AboutContent />}
      {type === 'contact' && <ContactContent />}
      {type === 'faq' && <FaqContent />}
      {type === 'privacy' && <LegalContent title="Privacy Policy" />}
      {type === 'terms' && <LegalContent title="Terms & Conditions" />}
    </div>
  )
}
