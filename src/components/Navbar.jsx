import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, MapPin, User, Heart, ShoppingCart, Cross, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SearchBar from './SearchBar.jsx'
import NotificationBell from './NotificationBell.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const navLinks = [
  { to: '/medicines', label: 'Medicines' },
  { to: '/healthcare', label: 'Healthcare' },
  { to: '/lab-tests', label: 'Lab Tests' },
  { to: '/doctors', label: 'Consult Doctors' },
  { to: '/offers', label: 'Offers' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const { count } = useCart()
  const { wishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-navy-900/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="hidden md:flex items-center gap-6 h-16">
          <Link to="/" className="flex items-center gap-1.5 shrink-0 focus-ring rounded-lg">
            <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Cross size={18} />
            </span>
            <span className="text-xl font-display font-extrabold text-navy-900">MEDICARE</span>
          </Link>

          <SearchBar className="flex-1 max-w-xl" />

          <nav className="flex items-center gap-5 text-sm font-medium">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `focus-ring rounded transition-colors ${isActive ? 'text-teal-700' : 'text-navy-900/70 hover:text-teal-700'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <button className="focus-ring flex items-center gap-1 text-xs font-medium text-navy-900/70 hover:text-teal-700">
              <MapPin size={15} /> Deliver to <span className="font-semibold">824101</span>
            </button>
            <Link to={isAuthenticated ? '/profile' : '/login'} className="focus-ring text-navy-900/70 hover:text-teal-700" aria-label="Account">
              <User size={19} />
            </Link>
            <NotificationBell />
            <Link to="/wishlist" className="focus-ring relative text-navy-900/70 hover:text-teal-700" aria-label="Wishlist">
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="focus-ring relative text-navy-900/70 hover:text-teal-700" aria-label="Cart">
              <ShoppingCart size={19} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-between h-14">
          <button type="button" onClick={() => setMenuOpen((v) => !v)} className="focus-ring p-1 -m-1" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-1 focus-ring rounded-lg">
            <span className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white">
              <Cross size={13} />
            </span>
            <span className="text-base font-display font-extrabold text-navy-900">MEDICARE</span>
          </Link>
          <div className="flex items-center gap-3.5">
            <button onClick={() => setMobileSearch((s) => !s)} className="focus-ring" aria-label="Search">
              <Search size={20} />
            </button>
            <NotificationBell />
            <Link to="/cart" className="focus-ring relative" aria-label="Cart">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {mobileSearch && (
          <div className="md:hidden pb-3">
            <SearchBar autoFocus />
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <div className="md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,51,0.4)', zIndex: 999998 }}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '288px',
                  maxWidth: '85vw',
                  background: '#ffffff',
                  zIndex: 999999,
                  padding: '20px',
                  overflowY: 'auto',
                  boxShadow: '0 0 40px rgba(0,0,0,0.25)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-display font-bold">Menu</span>
                  <button type="button" onClick={() => setMenuOpen(false)} className="focus-ring" aria-label="Close menu">
                    <X size={22} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-900/60 mb-5 bg-skyfaint px-3 py-2 rounded-lg">
                  <MapPin size={15} /> Delivering to <span className="font-semibold text-navy-900">824101</span>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className="focus-ring px-2 py-2.5 rounded-lg hover:bg-skyfaint text-sm font-medium"
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <div className="h-px bg-navy-900/10 my-2" />
                  {isAuthenticated ? (
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="focus-ring px-2 py-2.5 rounded-lg hover:bg-skyfaint text-sm font-medium">My Account</Link>
                  ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="focus-ring px-2 py-2.5 rounded-lg hover:bg-skyfaint text-sm font-medium">Login / Signup</Link>
                  )}
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="focus-ring px-2 py-2.5 rounded-lg hover:bg-skyfaint text-sm font-medium">Wishlist</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="focus-ring px-2 py-2.5 rounded-lg hover:bg-skyfaint text-sm font-medium">My Orders</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="focus-ring px-2 py-2.5 rounded-lg hover:bg-skyfaint text-sm font-medium">Profile</Link>
                </nav>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  )
}
