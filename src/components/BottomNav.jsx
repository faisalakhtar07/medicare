import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Package, Heart, User } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/medicines', label: 'Categories', icon: LayoutGrid },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-navy-900/10 flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `focus-ring flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium ${
              isActive ? 'text-teal-600' : 'text-navy-900/45'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
