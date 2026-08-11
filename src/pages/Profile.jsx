import { Link } from 'react-router-dom'
import { User, MapPin, FileText, Bell, LogOut, ChevronRight, Package, Heart } from 'lucide-react'

const menu = [
  { icon: Package, label: 'My Orders', to: '/orders', desc: 'Track and manage your orders' },
  { icon: FileText, label: 'Prescriptions', to: '/prescription', desc: 'Uploaded prescriptions & status' },
  { icon: Heart, label: 'Wishlist', to: '/wishlist', desc: 'Your saved products' },
  { icon: MapPin, label: 'Saved Addresses', to: '/profile', desc: 'Manage delivery addresses' },
  { icon: Bell, label: 'Notifications', to: '/profile', desc: 'Order & platform updates' },
]

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold">Faisal Akhtar</h1>
          <p className="text-xs text-navy-900/50">+91 73608 00529</p>
          <p className="text-xs text-navy-900/50">faisal@example.com</p>
        </div>
      </div>

      <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card divide-y divide-navy-900/5">
        {menu.map((m) => (
          <Link key={m.label} to={m.to} className="focus-ring flex items-center gap-3.5 p-4 hover:bg-skyfaint transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <m.icon size={17} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-navy-900/40">{m.desc}</p>
            </div>
            <ChevronRight size={16} className="text-navy-900/30" />
          </Link>
        ))}
      </div>

      <button className="focus-ring flex items-center gap-2 text-sm font-semibold text-coral mt-6 px-1">
        <LogOut size={16} /> Log Out
      </button>
    </div>
  )
}
