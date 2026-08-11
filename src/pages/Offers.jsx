import { useState } from 'react'
import { Copy, Check, Tag } from 'lucide-react'
import { offers } from '../data/offers.js'
import { useToast } from '../context/ToastContext.jsx'

const sections = ["Today's Deals", 'First Order Offer', 'Medicine Discounts', 'Lab Test Offers', 'Healthcare Products', 'Seasonal Offers']

export default function Offers() {
  const [copiedId, setCopiedId] = useState(null)
  const { showToast } = useToast()

  const copyCode = (offer) => {
    navigator.clipboard?.writeText(offer.code).catch(() => {})
    setCopiedId(offer.id)
    showToast(`Code ${offer.code} copied`)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Offers & Coupons</h1>
      <p className="text-sm text-navy-900/50 mb-8">Save more on medicines, lab tests and healthcare products.</p>

      {sections.map((section) => {
        const sectionOffers = offers.filter((o) => o.section === section)
        if (sectionOffers.length === 0) return null
        return (
          <div key={section} className="mb-8">
            <h2 className="text-sm font-semibold mb-3">{section}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {sectionOffers.map((o) => (
                <div key={o.id} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-coral/10 flex items-center justify-center text-coral shrink-0">
                    <Tag size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{o.title}</h3>
                      <span className="text-[10px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded">{o.discount}</span>
                    </div>
                    <p className="text-xs text-navy-900/50 mt-0.5">{o.description}</p>
                    <p className="text-[10px] text-navy-900/35 mt-1">{o.validity}</p>
                  </div>
                  <button
                    onClick={() => copyCode(o)}
                    className="focus-ring shrink-0 flex items-center gap-1 text-xs font-semibold border border-dashed border-teal-600 text-teal-700 px-2.5 py-1.5 rounded-lg"
                  >
                    {copiedId === o.id ? <Check size={13} /> : <Copy size={13} />} {o.code}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
