import { Link } from 'react-router-dom'
import { Cross, Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react'

const columns = [
  {
    title: 'Company',
    links: [
      ['About Us', '/about'],
      ['Contact Us', '/contact'],
      ['Careers', '/about'],
      ['Blog', '/about'],
    ],
  },
  {
    title: 'Customer Support',
    links: [
      ['Help Center', '/faq'],
      ['FAQs', '/faq'],
      ['Shipping Policy', '/terms'],
      ['Return Policy', '/terms'],
      ['Cancellation Policy', '/terms'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy Policy', '/privacy'],
      ['Terms & Conditions', '/terms'],
      ['Disclaimer', '/terms'],
    ],
  },
  {
    title: 'Healthcare',
    links: [
      ['Medicines', '/medicines'],
      ['Lab Tests', '/lab-tests'],
      ['Doctor Consultation', '/doctors'],
      ['Healthcare Products', '/healthcare'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/80 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-5 lg:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Cross size={16} />
              </span>
              <span className="text-lg font-display font-extrabold text-white">MEDICARE</span>
            </div>
            <p className="text-xs leading-relaxed text-white/50 mb-4">Healthcare Made Simple.</p>
            <div className="flex items-center gap-3">
              <Facebook size={16} className="text-white/50 hover:text-white cursor-pointer" />
              <Instagram size={16} className="text-white/50 hover:text-white cursor-pointer" />
              <Twitter size={16} className="text-white/50 hover:text-white cursor-pointer" />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="focus-ring text-xs text-white/50 hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 bg-white/5 rounded-xl2 p-4 mb-8 text-[11px] leading-relaxed text-white/50">
          <ShieldCheck size={16} className="text-teal-400 shrink-0 mt-0.5" />
          <p>
            MEDICARE does not provide medical advice, diagnosis or treatment. Prescription medicines are dispensed
            only against a valid prescription verified by our pharmacist. Product and pricing information shown here
            is for demonstration purposes. Payments and login on this demo are mock implementations pending backend integration.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10 text-[11px] text-white/40">
          <p>© 2026 MEDICARE. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-white/5 rounded">🔒 Secure Payments</span>
            <span className="px-2 py-1 bg-white/5 rounded">✓ Verified Pharmacy Partners</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
