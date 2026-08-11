import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, FlaskConical, Stethoscope, ShoppingBag, ArrowRight, ShieldCheck, Truck, BadgePercent } from 'lucide-react'
import Button from '../components/Button.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { categories } from '../data/categories.js'
import { products } from '../data/products.js'

const quickActions = [
  { icon: FileText, title: 'Order Medicines', desc: 'Upload prescription and order medicines easily.', to: '/prescription', color: 'bg-teal-50 text-teal-700' },
  { icon: FlaskConical, title: 'Lab Tests', desc: 'Book diagnostic tests from home.', to: '/lab-tests', color: 'bg-mint-500/10 text-mint-600' },
  { icon: Stethoscope, title: 'Consult Doctor', desc: 'Connect with qualified doctors online.', to: '/doctors', color: 'bg-navy-900/5 text-navy-900' },
  { icon: ShoppingBag, title: 'Healthcare Products', desc: 'Shop wellness and healthcare essentials.', to: '/healthcare', color: 'bg-coral/10 text-coral' },
]

const trust = [
  { icon: ShieldCheck, label: 'Verified Pharmacists' },
  { icon: Truck, label: 'Fast, Reliable Delivery' },
  { icon: BadgePercent, label: 'Genuine Products Only' },
]

export default function Home() {
  const featured = products.slice(0, 8)
  const vitamins = products.filter((p) => p.category === 'vitamins' || p.category === 'ayurveda').slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-6 pt-10 pb-12 md:pt-16 md:pb-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full mb-4">Healthcare Made Simple.</span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight text-navy-900 mb-4">
              Your Health,<br /> Our Priority.
            </h1>
            <p className="text-sm md:text-base text-navy-900/60 max-w-md mb-7">
              Order medicines, book lab tests and get trusted healthcare products delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Button as={Link} to="/prescription" size="lg">Order Medicines</Button>
              <Button as={Link} to="/lab-tests" size="lg" variant="outline">Book Lab Test</Button>
            </div>
            <div className="flex flex-wrap gap-5">
              {trust.map((t) => (
                <div key={t.label} className="flex items-center gap-1.5 text-xs font-medium text-navy-900/60">
                  <t.icon size={15} className="text-teal-600" /> {t.label}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-square max-w-sm mx-auto rounded-xl2 bg-white shadow-cardHover border border-teal-100 flex items-center justify-center text-8xl">
              🩺
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 bg-white shadow-cardHover rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" /> 30-min delivery in select cities
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6 -mt-2 md:mt-0 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-4">
          {quickActions.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={a.to} className="focus-ring group block bg-white rounded-xl2 border border-navy-900/5 shadow-card hover:shadow-cardHover p-4 h-full transition-shadow">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${a.color}`}>
                  <a.icon size={19} />
                </div>
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                  {a.title}
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-navy-900/50 leading-relaxed">{a.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold">Shop by Category</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold">Popular Medicines</h2>
          <Link to="/medicines" className="focus-ring text-xs font-semibold text-teal-700 flex items-center gap-1">View All <ArrowRight size={13} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Vitamins rail */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold">Vitamins & Wellness</h2>
          <Link to="/category/vitamins" className="focus-ring text-xs font-semibold text-teal-700 flex items-center gap-1">View All <ArrowRight size={13} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {vitamins.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-5 lg:px-6 pb-14">
        <div className="rounded-xl2 bg-navy-950 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10 max-w-md">
            <h3 className="text-2xl font-display font-bold mb-2">Talk to a doctor in minutes</h3>
            <p className="text-sm text-white/60 mb-5">Qualified doctors available for online consultation, any time.</p>
            <Button as={Link} to="/doctors" variant="primary">Consult Now</Button>
          </div>
          <div className="text-7xl relative z-10">🧑‍⚕️</div>
        </div>
      </section>
    </div>
  )
}
