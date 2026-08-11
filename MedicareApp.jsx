import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, MapPin, User, Menu, X, ChevronRight, ChevronLeft,
  Star, Plus, Minus, Trash2, Upload, FileText, Camera, Check, CheckCircle2,
  Stethoscope, FlaskConical, Pill, Package, ShieldCheck, Truck, Clock, Home as HomeIcon,
  Grid3x3, ListOrdered, Bell, ArrowRight, Tag, CreditCard, Wallet, Building2,
  Banknote, Baby, HeartPulse, Sparkles, Bone, Activity, Sun, Loader2
} from "lucide-react";

/* ============================== FONTS ============================== */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Newsreader', serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
    .label-tag { position: relative; }
    .label-tag::before {
      content: '';
      position: absolute; left: -6px; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 9999px; background: currentColor; opacity: 0.5;
    }
    .dot-grid {
      background-image: radial-gradient(rgba(15,110,110,0.16) 1px, transparent 1px);
      background-size: 16px 16px;
    }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
  `}</style>
);

/* ============================== MOCK DATA ============================== */
const CATEGORIES = [
  { id: "medicines", name: "Medicines", icon: Pill, count: 1240 },
  { id: "vitamins", name: "Vitamins & Supplements", icon: Sparkles, count: 386 },
  { id: "personal-care", name: "Personal Care", icon: HeartPulse, count: 512 },
  { id: "baby-care", name: "Baby Care", icon: Baby, count: 214 },
  { id: "diabetes", name: "Diabetes Care", icon: Activity, count: 98 },
  { id: "womens-care", name: "Women's Care", icon: Sun, count: 176 },
  { id: "oral-care", name: "Oral Care", icon: Sparkles, count: 143 },
  { id: "devices", name: "Health Devices", icon: Stethoscope, count: 88 },
  { id: "ayurveda", name: "Ayurveda", icon: Bone, count: 231 },
];

const PRODUCTS = [
  { id: "p1", name: "Dolo 650 Tablet", brand: "Micro Labs", pack: "Strip of 15 tablets", category: "medicines", rx: false, rating: 4.6, reviews: 2840, mrp: 32, price: 28, img: "💊", desc: "Paracetamol 650mg tablets, commonly used for fever and mild to moderate pain relief.", manufacturer: "Micro Labs Ltd.", origin: "India" },
  { id: "p2", name: "Crocin Advance Tablet", brand: "GSK", pack: "Strip of 15 tablets", category: "medicines", rx: false, rating: 4.5, reviews: 1932, mrp: 30, price: 26, img: "💊", desc: "Fast-acting paracetamol formulation for effective fever and headache relief.", manufacturer: "GlaxoSmithKline", origin: "India" },
  { id: "p3", name: "Azithral 500 Tablet", brand: "Alembic Pharma", pack: "Strip of 5 tablets", category: "medicines", rx: true, rating: 4.4, reviews: 610, mrp: 128, price: 112, img: "💊", desc: "Azithromycin 500mg antibiotic tablets for bacterial infections.", manufacturer: "Alembic Pharmaceuticals", origin: "India" },
  { id: "p4", name: "Shelcal 500 Tablet", brand: "Torrent Pharma", pack: "Strip of 15 tablets", category: "vitamins", rx: false, rating: 4.5, reviews: 3400, mrp: 118, price: 99, img: "🧴", desc: "Calcium and Vitamin D3 supplement for bone health.", manufacturer: "Torrent Pharmaceuticals", origin: "India" },
  { id: "p5", name: "Limcee Vitamin C Tablet", brand: "Abbott", pack: "Strip of 15 tablets", category: "vitamins", rx: false, rating: 4.6, reviews: 5210, mrp: 40, price: 33, img: "🍊", desc: "Chewable Vitamin C tablets to support immunity.", manufacturer: "Abbott India", origin: "India" },
  { id: "p6", name: "Nivea Soft Light Moisturizer", brand: "Nivea", pack: "100ml jar", category: "personal-care", rx: false, rating: 4.7, reviews: 8760, mrp: 199, price: 169, img: "🧴", desc: "Lightweight, fast-absorbing moisturizer for face, hands and body.", manufacturer: "Nivea India", origin: "India" },
  { id: "p7", name: "Himalaya Baby Lotion", brand: "Himalaya", pack: "200ml bottle", category: "baby-care", rx: false, rating: 4.8, reviews: 4120, mrp: 175, price: 149, img: "🍼", desc: "Gentle, hypoallergenic lotion for delicate baby skin.", manufacturer: "Himalaya Wellness", origin: "India" },
  { id: "p8", name: "Accu-Chek Active Glucometer", brand: "Roche", pack: "1 device kit", category: "devices", rx: false, rating: 4.5, reviews: 2210, mrp: 1200, price: 899, img: "🩺", desc: "Blood glucose monitoring device with 10 free test strips.", manufacturer: "Roche Diabetes Care", origin: "Germany" },
  { id: "p9", name: "Sensodyne Rapid Relief Toothpaste", brand: "GSK", pack: "70g tube", category: "oral-care", rx: false, rating: 4.6, reviews: 3980, mrp: 110, price: 92, img: "🪥", desc: "Clinically proven sensitivity relief toothpaste.", manufacturer: "GlaxoSmithKline", origin: "India" },
  { id: "p10", name: "Glucon-D Instant Energy", brand: "Zydus Wellness", pack: "500g jar", category: "diabetes", rx: false, rating: 4.4, reviews: 1540, mrp: 175, price: 152, img: "🥤", desc: "Instant glucose energy drink powder, orange flavour.", manufacturer: "Zydus Wellness", origin: "India" },
  { id: "p11", name: "Metformin 500 Tablet", brand: "Sun Pharma", pack: "Strip of 20 tablets", category: "diabetes", rx: true, rating: 4.3, reviews: 890, mrp: 45, price: 38, img: "💊", desc: "Metformin hydrochloride tablets for blood sugar management.", manufacturer: "Sun Pharmaceutical", origin: "India" },
  { id: "p12", name: "Ashwagandha Capsules", brand: "Himalaya Wellness", pack: "60 capsules", category: "ayurveda", rx: false, rating: 4.5, reviews: 2670, mrp: 260, price: 219, img: "🌿", desc: "Ayurvedic adaptogen supplement to help manage stress.", manufacturer: "Himalaya Wellness", origin: "India" },
];

const LAB_TESTS = [
  { id: "l1", name: "Full Body Checkup — Essential", category: "Full Body Checkup", includes: "72 parameters incl. CBC, Lipid, Liver, Kidney, Thyroid", sample: "Blood", reportTime: "24 hours", mrp: 1999, price: 899 },
  { id: "l2", name: "Diabetes Screening Panel", category: "Diabetes", includes: "Fasting Glucose, PP Glucose, HbA1c", sample: "Blood", reportTime: "12 hours", mrp: 899, price: 499 },
  { id: "l3", name: "Thyroid Profile (T3, T4, TSH)", category: "Thyroid", includes: "T3, T4, TSH", sample: "Blood", reportTime: "24 hours", mrp: 799, price: 399 },
  { id: "l4", name: "Liver Function Test (LFT)", category: "Liver", includes: "Bilirubin, SGOT, SGPT, Proteins", sample: "Blood", reportTime: "24 hours", mrp: 899, price: 549 },
  { id: "l5", name: "Vitamin D + B12 Combo", category: "Vitamin Tests", includes: "25-OH Vitamin D, Vitamin B12", sample: "Blood", reportTime: "48 hours", mrp: 1799, price: 999 },
  { id: "l6", name: "Women's Health Panel", category: "Women's Health", includes: "CBC, Thyroid, Vitamin D, Iron studies", sample: "Blood", reportTime: "24 hours", mrp: 2199, price: 1299 },
];

const DOCTORS = [
  { id: "d1", name: "Dr. Anjali Mehra", spec: "General Physician", exp: 12, rating: 4.8, fee: 299, available: "Available Today, 4:00 PM" },
  { id: "d2", name: "Dr. Rohan Kapoor", spec: "Dermatologist", exp: 9, rating: 4.7, fee: 399, available: "Available Today, 6:30 PM" },
  { id: "d3", name: "Dr. Sneha Iyer", spec: "Pediatrician", exp: 15, rating: 4.9, fee: 349, available: "Available Tomorrow, 10:00 AM" },
  { id: "d4", name: "Dr. Farhan Ali", spec: "Cardiologist", exp: 18, rating: 4.8, fee: 599, available: "Available Today, 8:00 PM" },
  { id: "d5", name: "Dr. Priya Nair", spec: "Gynecologist", exp: 11, rating: 4.7, fee: 449, available: "Available Tomorrow, 11:30 AM" },
  { id: "d6", name: "Dr. Vikram Rathi", spec: "Dentist", exp: 8, rating: 4.6, fee: 299, available: "Available Today, 5:15 PM" },
];

const OFFERS = [
  { id: "o1", title: "First Order Discount", desc: "Flat 25% off on your first medicine order", code: "WELCOME25", validity: "Valid till 31 Aug", tag: "First Order" },
  { id: "o2", title: "Lab Test Special", desc: "Extra ₹200 off on full body checkups above ₹999", code: "HEALTH200", validity: "Valid till 20 Aug", tag: "Lab Tests" },
  { id: "o3", title: "Vitamins & Supplements", desc: "Buy 2 Get 1 Free on select supplement brands", code: "VITAMIN3", validity: "Valid till 25 Aug", tag: "Medicine Discounts" },
  { id: "o4", title: "Monsoon Wellness", desc: "15% off on immunity & first-aid essentials", code: "MONSOON15", validity: "Valid till 15 Sep", tag: "Seasonal" },
];

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const pct = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

/* ============================== SMALL UI PRIMITIVES ============================== */
const Rating = ({ value, count, size = "text-xs" }) => (
  <div className={`flex items-center gap-1 ${size}`}>
    <span className="flex items-center gap-0.5 bg-teal-700 text-white px-1.5 py-0.5 rounded font-body font-medium">
      {value} <Star className="w-3 h-3 fill-white" />
    </span>
    {count && <span className="text-slate-500 font-body">({count.toLocaleString("en-IN")})</span>}
  </div>
);

const RxBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
    <FileText className="w-3 h-3" /> Rx REQUIRED
  </span>
);

const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: 30, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 20, x: "-50%" }}
        className="fixed bottom-20 md:bottom-6 left-1/2 z-[100] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-body text-sm"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        {toast}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ============================== PRODUCT CARD ============================== */
const ProductCard = ({ product, onOpen, cart, addToCart, wishlist, toggleWishlist }) => {
  const inCart = cart.find((c) => c.id === product.id);
  const isWishlisted = wishlist.has(product.id);
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all overflow-hidden flex flex-col group"
    >
      <div className="relative bg-teal-50/60 h-32 flex items-center justify-center text-5xl cursor-pointer" onClick={() => onOpen(product.id)}>
        {product.img}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
        </button>
        {product.rx && <div className="absolute top-2 left-2"><RxBadge /></div>}
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[11px] text-teal-700 font-body font-medium uppercase tracking-wide">{product.brand}</p>
        <h3 onClick={() => onOpen(product.id)} className="font-body font-semibold text-slate-800 text-sm leading-snug cursor-pointer line-clamp-2 min-h-[2.2em]">{product.name}</h3>
        <p className="text-xs text-slate-500 font-body">{product.pack}</p>
        <Rating value={product.rating} count={product.reviews} />
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display font-semibold text-slate-900 text-lg">{fmt(product.price)}</span>
          <span className="text-xs text-slate-400 line-through font-body">{fmt(product.mrp)}</span>
          <span className="text-xs text-emerald-600 font-body font-medium">{pct(product.mrp, product.price)}% off</span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className={`mt-2 w-full py-2 rounded-lg text-sm font-body font-semibold transition-colors ${inCart ? "bg-teal-50 text-teal-700 border border-teal-300" : "bg-teal-700 text-white hover:bg-teal-800"}`}
        >
          {inCart ? `In Cart · ${inCart.qty}` : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
};

/* ============================== NAVBAR ============================== */
const NAV_LINKS = [
  { id: "medicines", label: "Medicines" },
  { id: "healthcare", label: "Healthcare" },
  { id: "labtests", label: "Lab Tests" },
  { id: "doctors", label: "Consult Doctors" },
  { id: "offers", label: "Offers" },
];

const Navbar = ({ go, cartCount, wishlistCount, search, setSearch, onSearchSubmit, mobileMenu, setMobileMenu }) => {
  const [focused, setFocused] = useState(false);
  const suggestions = search.length > 1 ? PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : [];
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center gap-4">
          <button className="md:hidden" onClick={() => setMobileMenu(true)}><Menu className="w-6 h-6 text-slate-700" /></button>
          <button onClick={() => go("home")} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="font-display font-semibold text-xl text-slate-900 tracking-tight hidden sm:block">MEDICARE</span>
          </button>

          <div className="hidden md:block relative flex-1 max-w-xl mx-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
              placeholder="Search medicines, health products & more"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border border-transparent focus:border-teal-400 focus:bg-white outline-none text-sm font-body transition-colors"
            />
            <AnimatePresence>
              {focused && suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                  {suggestions.map(s => (
                    <button key={s.id} onMouseDown={() => { setSearch(s.name); onSearchSubmit(s.name); }} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-teal-50 text-left text-sm font-body text-slate-700">
                      <Search className="w-3.5 h-3.5 text-slate-400" /> {s.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="hidden lg:flex items-center gap-5 font-body text-sm text-slate-600 shrink-0">
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => go(l.id)} className="hover:text-teal-700 transition-colors">{l.label}</button>
            ))}
          </nav>

          <div className="flex items-center gap-1 ml-auto md:ml-0 shrink-0">
            <button className="hidden sm:flex items-center gap-1 text-xs font-body text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-100">
              <MapPin className="w-3.5 h-3.5 text-teal-700" /> 824101
            </button>
            <button onClick={() => go("login")} className="hidden sm:block p-2 rounded-lg hover:bg-slate-100"><User className="w-5 h-5 text-slate-700" /></button>
            <button onClick={() => go("wishlist")} className="relative p-2 rounded-lg hover:bg-slate-100">
              <Heart className="w-5 h-5 text-slate-700" />
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">{wishlistCount}</span>}
            </button>
            <button onClick={() => go("cart")} className="relative p-2 rounded-lg hover:bg-slate-100">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="md:hidden pb-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
            placeholder="Search medicines & health products"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 outline-none text-sm font-body"
          />
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setMobileMenu(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 28 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[70] p-5 flex flex-col gap-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-semibold text-lg text-slate-900">MEDICARE</span>
                <button onClick={() => setMobileMenu(false)}><X className="w-5 h-5" /></button>
              </div>
              {NAV_LINKS.map(l => (
                <button key={l.id} onClick={() => { go(l.id); setMobileMenu(false); }} className="text-left px-3 py-3 rounded-lg hover:bg-teal-50 font-body text-slate-700 font-medium">{l.label}</button>
              ))}
              <div className="h-px bg-slate-200 my-2" />
              <button onClick={() => { go("profile"); setMobileMenu(false); }} className="text-left px-3 py-3 rounded-lg hover:bg-teal-50 font-body text-slate-700">My Profile</button>
              <button onClick={() => { go("orders"); setMobileMenu(false); }} className="text-left px-3 py-3 rounded-lg hover:bg-teal-50 font-body text-slate-700">My Orders</button>
              <button onClick={() => { go("prescription"); setMobileMenu(false); }} className="text-left px-3 py-3 rounded-lg hover:bg-teal-50 font-body text-slate-700">Upload Prescription</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ============================== BOTTOM NAV (mobile) ============================== */
const BottomNav = ({ page, go, cartCount }) => {
  const items = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "medicines", icon: Grid3x3, label: "Categories" },
    { id: "orders", icon: Package, label: "Orders" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-around py-1.5">
      {items.map(it => (
        <button key={it.id} onClick={() => go(it.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 relative ${page === it.id ? "text-teal-700" : "text-slate-400"}`}>
          <it.icon className="w-5 h-5" />
          <span className="text-[10px] font-body">{it.label}</span>
          {it.id === "wishlist" && cartCount > 0 && false}
        </button>
      ))}
    </div>
  );
};

/* ============================== FOOTER ============================== */
const Footer = ({ go }) => (
  <footer className="bg-slate-900 text-slate-300 mt-16 pb-20 md:pb-0">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center"><Plus className="w-4 h-4 text-white" strokeWidth={3} /></div>
          <span className="font-display font-semibold text-lg text-white">MEDICARE</span>
        </div>
        <p className="text-sm text-slate-400 font-body">Healthcare made simple. Demo pharmacy platform for illustrative purposes.</p>
      </div>
      {[
        { h: "Company", items: ["About Us", "Contact Us", "Careers", "Blog"] },
        { h: "Customer Support", items: ["Help Center", "FAQs", "Shipping Policy", "Return Policy"] },
        { h: "Legal", items: ["Privacy Policy", "Terms & Conditions", "Disclaimer"] },
        { h: "Healthcare", items: ["Medicines", "Lab Tests", "Doctor Consultation", "Healthcare Products"] },
      ].map(col => (
        <div key={col.h}>
          <h4 className="text-white font-body font-semibold text-sm mb-3">{col.h}</h4>
          <ul className="space-y-2">
            {col.items.map(i => <li key={i} className="text-sm text-slate-400 font-body hover:text-teal-400 cursor-pointer">{i}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-xs text-slate-500 font-mono">© 2026 MEDICARE — Demo build. Not a real pharmacy.</p>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-body"><ShieldCheck className="w-4 h-4 text-teal-500" /> 100% Genuine Products</div>
    </div>
  </footer>
);

/* ============================== DISCLAIMER STRIP ============================== */
const Disclaimer = ({ children }) => (
  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 text-xs text-amber-800 font-body">
    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
    <p>{children}</p>
  </div>
);

/* ============================== HOME PAGE ============================== */
const HomePage = ({ go, openProduct, cart, addToCart, wishlist, toggleWishlist }) => (
  <div>
    <section className="dot-grid bg-teal-50/70 border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="label-tag pl-3 text-xs font-mono text-teal-700 uppercase tracking-widest">MEDICARE · Rx</span>
          <h1 className="font-display text-4xl md:text-5xl text-slate-900 leading-tight mt-3">Your Health,<br />Our Priority.</h1>
          <p className="font-body text-slate-600 mt-4 text-base max-w-md">Order medicines, book lab tests and get trusted healthcare products delivered to your doorstep.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button onClick={() => go("medicines")} className="px-6 py-3 rounded-full bg-teal-700 text-white font-body font-semibold text-sm hover:bg-teal-800 transition-colors flex items-center gap-2">
              Order Medicines <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => go("labtests")} className="px-6 py-3 rounded-full bg-white text-teal-700 border border-teal-300 font-body font-semibold text-sm hover:bg-teal-50 transition-colors">
              Book Lab Test
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white border border-teal-100 shadow-xl flex items-center justify-center text-8xl">🩺</div>
          <div className="absolute -bottom-2 left-4 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 font-body text-xs text-slate-700"><Truck className="w-4 h-4 text-teal-700" /> Delivery in 2 hours</div>
          <div className="absolute top-4 right-0 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 font-body text-xs text-slate-700"><ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Genuine</div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: Pill, title: "Order Medicines", desc: "Upload prescription and order medicines easily.", page: "medicines" },
        { icon: FlaskConical, title: "Lab Tests", desc: "Book diagnostic tests from home.", page: "labtests" },
        { icon: Stethoscope, title: "Consult Doctor", desc: "Connect with qualified doctors online.", page: "doctors" },
        { icon: HeartPulse, title: "Healthcare Products", desc: "Shop wellness and healthcare essentials.", page: "healthcare" },
      ].map(a => (
        <motion.button whileHover={{ y: -3 }} key={a.title} onClick={() => go(a.page)} className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-lg transition-all group">
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors"><a.icon className="w-5.5 h-5.5 text-teal-700" /></div>
          <h3 className="font-body font-semibold text-slate-900 text-sm">{a.title}</h3>
          <p className="text-xs text-slate-500 font-body mt-1">{a.desc}</p>
          <ChevronRight className="w-4 h-4 text-teal-600 mt-2 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      ))}
    </section>

    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-slate-900">Shop by Category</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => go("medicines", c.id)} className="shrink-0 w-32 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-teal-300 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center"><c.icon className="w-5 h-5 text-teal-700" /></div>
            <span className="text-xs font-body font-medium text-slate-800 text-center leading-tight">{c.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">{c.count} items</span>
          </button>
        ))}
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-slate-900">Popular Products</h2>
        <button onClick={() => go("medicines")} className="text-sm font-body text-teal-700 font-medium flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PRODUCTS.slice(0, 8).map(p => (
          <ProductCard key={p.id} product={p} onOpen={openProduct} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
        ))}
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-4">
      <Disclaimer>MEDICARE is a demo frontend. It does not provide medical advice, diagnosis, or dosage recommendations — always consult a qualified healthcare professional and read product packaging before use.</Disclaimer>
    </section>
  </div>
);

/* ============================== MEDICINES / LISTING PAGE ============================== */
const FilterSidebar = ({ filters, setFilters }) => {
  const toggle = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? null : val }));
  return (
    <div className="space-y-6 font-body text-sm">
      <div>
        <h4 className="font-semibold text-slate-800 mb-2">Category</h4>
        {CATEGORIES.map(c => (
          <label key={c.id} className="flex items-center gap-2 py-1 text-slate-600 cursor-pointer">
            <input type="checkbox" checked={filters.category === c.id} onChange={() => toggle("category", c.id)} className="accent-teal-700" /> {c.name}
          </label>
        ))}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 mb-2">Prescription</h4>
        {[{ v: true, l: "Rx Required" }, { v: false, l: "No Prescription Needed" }].map(o => (
          <label key={String(o.v)} className="flex items-center gap-2 py-1 text-slate-600 cursor-pointer">
            <input type="checkbox" checked={filters.rx === o.v} onChange={() => toggle("rx", o.v)} className="accent-teal-700" /> {o.l}
          </label>
        ))}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 mb-2">Rating</h4>
        {[4.5, 4, 3.5].map(r => (
          <label key={r} className="flex items-center gap-2 py-1 text-slate-600 cursor-pointer">
            <input type="checkbox" checked={filters.rating === r} onChange={() => toggle("rating", r)} className="accent-teal-700" /> {r}★ & above
          </label>
        ))}
      </div>
    </div>
  );
};

const MedicinesPage = ({ go, openProduct, cart, addToCart, wishlist, toggleWishlist, initialCategory, searchQuery }) => {
  const [filters, setFilters] = useState({ category: initialCategory || null, rx: null, rating: null });
  const [sort, setSort] = useState("popular");
  const [mobileFilters, setMobileFilters] = useState(false);
  useEffect(() => setFilters(f => ({ ...f, category: initialCategory || null })), [initialCategory]);

  const results = useMemo(() => {
    let r = [...PRODUCTS];
    if (searchQuery) r = r.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filters.category) r = r.filter(p => p.category === filters.category);
    if (filters.rx !== null) r = r.filter(p => p.rx === filters.rx);
    if (filters.rating) r = r.filter(p => p.rating >= filters.rating);
    if (sort === "priceLow") r.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") r.sort((a, b) => b.price - a.price);
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [filters, sort, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center gap-2 text-xs text-slate-400 font-body mb-4">
        <button onClick={() => go("home")} className="hover:text-teal-700">Home</button> <ChevronRight className="w-3 h-3" /> <span className="text-slate-600">Medicines</span>
      </div>
      <h1 className="font-display text-2xl text-slate-900 mb-4">{searchQuery ? `Results for "${searchQuery}"` : "Medicines & Healthcare Products"}</h1>
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="hidden md:block"><FilterSidebar filters={filters} setFilters={setFilters} /></aside>
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 font-body">{results.length} products found</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileFilters(true)} className="md:hidden text-xs font-body border border-slate-300 rounded-full px-3 py-1.5">Filters</button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs font-body border border-slate-300 rounded-full px-3 py-1.5 outline-none">
                <option value="popular">Sort: Popularity</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          {results.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-body text-slate-500">No products found.</p>
              <button onClick={() => setFilters({ category: null, rx: null, rating: null })} className="mt-3 text-teal-700 text-sm font-body font-medium">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(p => <ProductCard key={p.id} product={p} onOpen={openProduct} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setMobileFilters(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] p-5 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4"><h3 className="font-display text-lg">Filters</h3><button onClick={() => setMobileFilters(false)}><X className="w-5 h-5" /></button></div>
              <FilterSidebar filters={filters} setFilters={setFilters} />
              <button onClick={() => setMobileFilters(false)} className="w-full mt-5 bg-teal-700 text-white py-3 rounded-xl font-body font-semibold">Apply Filters</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================== PRODUCT DETAIL PAGE ============================== */
const ProductDetailPage = ({ productId, go, cart, addToCart, wishlist, toggleWishlist }) => {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const [qty, setQty] = useState(1);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inCart = cart.find(c => c.id === product.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center gap-2 text-xs text-slate-400 font-body mb-4">
        <button onClick={() => go("home")} className="hover:text-teal-700">Home</button> <ChevronRight className="w-3 h-3" />
        <button onClick={() => go("medicines")} className="hover:text-teal-700">Medicines</button> <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 line-clamp-1">{product.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-teal-50/60 rounded-2xl h-80 flex items-center justify-center text-9xl relative">
          {product.img}
          {product.rx && <div className="absolute top-4 left-4"><RxBadge /></div>}
        </div>
        <div>
          <p className="text-xs text-teal-700 font-body font-medium uppercase tracking-wide">{product.brand}</p>
          <h1 className="font-display text-3xl text-slate-900 mt-1">{product.name}</h1>
          <p className="text-sm text-slate-500 font-body mt-1">{product.pack}</p>
          <div className="mt-2"><Rating value={product.rating} count={product.reviews} size="text-sm" /></div>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-3xl font-semibold text-slate-900">{fmt(product.price)}</span>
            <span className="text-slate-400 line-through font-body">{fmt(product.mrp)}</span>
            <span className="text-emerald-600 font-body font-medium text-sm">{pct(product.mrp, product.price)}% off</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-body"><Truck className="w-4 h-4 text-teal-700" /> Delivery by tomorrow, 10 AM</div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-slate-300 rounded-full">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2.5"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center font-body font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-2.5"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => addToCart(product, qty)} className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full font-body font-semibold text-sm transition-colors">
              {inCart ? "Update Cart" : "Add to Cart"}
            </button>
            <button onClick={() => { addToCart(product, qty); go("checkout"); }} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-full font-body font-semibold text-sm transition-colors">Buy Now</button>
            <button onClick={() => toggleWishlist(product.id)} className="p-3 rounded-full border border-slate-300"><Heart className={`w-5 h-5 ${wishlist.has(product.id) ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} /></button>
          </div>

          {product.rx && (
            <div className="mt-4">
              <Disclaimer>This is a prescription medicine. Our pharmacist may verify your uploaded prescription before your order is processed.</Disclaimer>
            </div>
          )}

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-body font-semibold text-slate-900 mb-2">Product Information</h3>
            <p className="text-sm text-slate-600 font-body leading-relaxed">{product.desc}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm font-body">
              <div><span className="text-slate-400">Manufacturer</span><p className="text-slate-700">{product.manufacturer}</p></div>
              <div><span className="text-slate-400">Country of Origin</span><p className="text-slate-700">{product.origin}</p></div>
            </div>
          </div>
          <div className="mt-6"><Disclaimer>Please read the product packaging and consult a qualified healthcare professional when necessary. This information does not constitute medical advice.</Disclaimer></div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl text-slate-900 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} onOpen={(id) => go("product", id)} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================== CART PAGE ============================== */
const CartPage = ({ go, cart, updateQty, removeItem }) => {
  const itemTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const mrpTotal = cart.reduce((s, c) => s + c.mrp * c.qty, 0);
  const discount = mrpTotal - itemTotal;
  const delivery = itemTotal >= 499 || itemTotal === 0 ? 0 : 40;
  const total = itemTotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl text-slate-900">Your cart is waiting for some healthcare essentials.</h2>
        <button onClick={() => go("medicines")} className="mt-6 bg-teal-700 text-white px-6 py-3 rounded-full font-body font-semibold text-sm">Browse Medicines</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl text-slate-900 mb-6">Your Cart ({cart.length})</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4">
              <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center text-3xl shrink-0">{item.img}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body font-semibold text-sm text-slate-900 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-slate-500 font-body">{item.pack}</p>
                <p className="font-display font-semibold text-slate-900 mt-1">{fmt(item.price)}</p>
              </div>
              <div className="flex items-center border border-slate-300 rounded-full">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2"><Minus className="w-3.5 h-3.5" /></button>
                <span className="w-6 text-center text-sm font-body">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-24">
          <h3 className="font-body font-semibold text-slate-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm font-body text-slate-600">
            <div className="flex justify-between"><span>Item Total</span><span>{fmt(itemTotal)}</span></div>
            <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{fmt(discount)}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>{delivery === 0 ? "FREE" : fmt(delivery)}</span></div>
          </div>
          <div className="h-px bg-slate-200 my-3" />
          <div className="flex justify-between font-body font-semibold text-slate-900"><span>Total Amount</span><span>{fmt(total)}</span></div>
          {delivery > 0 && <p className="text-[11px] text-teal-700 font-body mt-2">Free delivery above ₹499</p>}
          <button onClick={() => go("checkout")} className="w-full mt-4 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full font-body font-semibold text-sm transition-colors">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

/* ============================== CHECKOUT PAGE ============================== */
const CheckoutPage = ({ go, cart, placeOrder }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", mobile: "", house: "", street: "", area: "", city: "Aurangabad", state: "Bihar", pin: "" });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const itemTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = deliveryMethod === "express" ? 60 : (itemTotal >= 499 ? 0 : 40);
  const total = itemTotal + delivery;

  const steps = ["Address", "Delivery", "Payment"];
  const canContinue = step === 1 ? address.name && address.mobile && address.pin : true;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl text-slate-900 mb-6">Checkout</h1>
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-sm font-body ${step === i + 1 ? "text-teal-700 font-semibold" : step > i + 1 ? "text-emerald-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step > i + 1 ? "bg-emerald-600 text-white border-emerald-600" : step === i + 1 ? "border-teal-700" : "border-slate-300"}`}>
                {step > i + 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span> {s}
            </div>
            {i < 2 && <div className="flex-1 h-px bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 font-body">
          <h3 className="font-semibold text-slate-900">Delivery Address</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="Mobile Number" value={address.mobile} onChange={e => setAddress({ ...address, mobile: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="House / Flat No." value={address.house} onChange={e => setAddress({ ...address, house: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="Area" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            <input placeholder="PIN Code" value={address.pin} onChange={e => setAddress({ ...address, pin: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 font-body">
          <h3 className="font-semibold text-slate-900 mb-2">Delivery Method</h3>
          {[
            { id: "standard", label: "Standard Delivery", sub: "2-3 business days", price: itemTotal >= 499 ? "FREE" : "₹40" },
            { id: "express", label: "Express Delivery", sub: "Within 2 hours", price: "₹60" },
          ].map(o => (
            <label key={o.id} className={`flex items-center justify-between border rounded-xl px-4 py-3.5 cursor-pointer ${deliveryMethod === o.id ? "border-teal-500 bg-teal-50/50" : "border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <input type="radio" checked={deliveryMethod === o.id} onChange={() => setDeliveryMethod(o.id)} className="accent-teal-700" />
                <div><p className="text-sm font-medium text-slate-900">{o.label}</p><p className="text-xs text-slate-500">{o.sub}</p></div>
              </div>
              <span className="text-sm font-semibold text-slate-700">{o.price}</span>
            </label>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 font-body">
          <h3 className="font-semibold text-slate-900 mb-2">Payment Method</h3>
          {[
            { id: "upi", label: "UPI", icon: Wallet },
            { id: "card", label: "Credit / Debit Card", icon: CreditCard },
            { id: "netbanking", label: "Net Banking", icon: Building2 },
            { id: "cod", label: "Cash on Delivery", icon: Banknote },
          ].map(o => (
            <label key={o.id} className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer ${payment === o.id ? "border-teal-500 bg-teal-50/50" : "border-slate-200"}`}>
              <input type="radio" checked={payment === o.id} onChange={() => setPayment(o.id)} className="accent-teal-700" />
              <o.icon className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">{o.label}</span>
            </label>
          ))}
          <p className="text-[11px] text-slate-400 font-mono mt-2">Demo payment UI — no real transaction is processed.</p>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-4 mt-4 flex justify-between text-sm font-body">
        <span className="text-slate-500">Total Payable</span>
        <span className="font-semibold text-slate-900">{fmt(total)}</span>
      </div>

      <div className="flex gap-3 mt-6">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-full border border-slate-300 font-body font-semibold text-sm text-slate-700">Back</button>}
        {step < 3 ? (
          <button disabled={!canContinue} onClick={() => setStep(step + 1)} className="flex-1 bg-teal-700 disabled:bg-slate-300 hover:bg-teal-800 text-white py-3 rounded-full font-body font-semibold text-sm transition-colors">Continue</button>
        ) : (
          <button onClick={() => { placeOrder({ address, deliveryMethod, payment, total }); go("order-success"); }} className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full font-body font-semibold text-sm transition-colors">Place Order</button>
        )}
      </div>
    </div>
  );
};

/* ============================== ORDER SUCCESS PAGE ============================== */
const OrderSuccessPage = ({ go, lastOrder }) => {
  if (!lastOrder) return <div className="max-w-xl mx-auto px-6 py-24 text-center font-body text-slate-500">No recent order found. <button onClick={() => go("home")} className="text-teal-700 font-medium">Go home</button></div>;
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }} className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-11 h-11 text-emerald-600" />
      </motion.div>
      <h1 className="font-display text-2xl text-slate-900">Order Placed Successfully!</h1>
      <p className="text-sm text-slate-500 font-body mt-2">A confirmation has been sent for your reference.</p>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-6 text-left space-y-2 font-body text-sm">
        <div className="flex justify-between"><span className="text-slate-400">Order ID</span><span className="font-mono text-slate-800">{lastOrder.id}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Estimated Delivery</span><span className="text-slate-800">{lastOrder.eta}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Delivery Address</span><span className="text-slate-800 text-right max-w-[60%]">{lastOrder.address.house}, {lastOrder.address.city}</span></div>
        <div className="flex justify-between font-semibold"><span className="text-slate-500 font-normal">Total Amount</span><span>{fmt(lastOrder.total)}</span></div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-7">
        <button onClick={() => go("track", lastOrder.id)} className="bg-teal-700 text-white px-5 py-2.5 rounded-full font-body font-semibold text-sm">Track Order</button>
        <button onClick={() => go("medicines")} className="border border-slate-300 px-5 py-2.5 rounded-full font-body font-semibold text-sm text-slate-700">Continue Shopping</button>
        <button onClick={() => go("orders")} className="border border-slate-300 px-5 py-2.5 rounded-full font-body font-semibold text-sm text-slate-700">View Orders</button>
      </div>
    </div>
  );
};

/* ============================== ORDER TRACKING ============================== */
const TrackOrderPage = ({ go, orders, orderId }) => {
  const order = orders.find(o => o.id === orderId) || orders[0];
  const stages = ["Order Placed", "Order Confirmed", "Prescription Verified", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const current = 3;
  if (!order) return <div className="max-w-xl mx-auto px-6 py-24 text-center font-body text-slate-500">No orders yet.</div>;
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl text-slate-900 mb-1">Track Order</h1>
      <p className="text-sm text-slate-500 font-mono mb-8">{order.id}</p>
      <div className="space-y-0">
        {stages.map((s, i) => (
          <div key={s} className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${i < current ? "bg-teal-700" : i === current ? "bg-teal-700 ring-4 ring-teal-100" : "bg-slate-200"}`}>
                {i < current ? <Check className="w-4 h-4 text-white" /> : <span className="w-2 h-2 rounded-full bg-white" />}
              </motion.div>
              {i < stages.length - 1 && <div className={`w-0.5 h-10 ${i < current ? "bg-teal-700" : "bg-slate-200"}`} />}
            </div>
            <div className="pb-8">
              <p className={`font-body text-sm ${i <= current ? "text-slate-900 font-semibold" : "text-slate-400"}`}>{s}</p>
              {i === current && <p className="text-xs text-teal-700 font-body mt-0.5">In progress</p>}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => go("orders")} className="text-teal-700 text-sm font-body font-medium">Back to Orders</button>
    </div>
  );
};

/* ============================== PRESCRIPTION UPLOAD ============================== */
const PrescriptionPage = ({ go }) => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => { if (f) { setFile(f.name); setUploaded(false); } };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-slate-900 mb-1">Upload Prescription</h1>
      <p className="text-sm text-slate-500 font-body mb-6">Upload a valid prescription when required. Our pharmacist may verify prescription-only medicines before processing the order.</p>

      {!uploaded ? (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-teal-300 bg-teal-50/40 rounded-2xl p-10 text-center cursor-pointer hover:bg-teal-50 transition-colors"
          >
            <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            <Upload className="w-9 h-9 text-teal-700 mx-auto mb-3" />
            <p className="font-body font-medium text-slate-800 text-sm">Drag & drop your prescription here</p>
            <p className="text-xs text-slate-500 font-body mt-1">or click to browse — JPG, PNG or PDF</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => inputRef.current?.click()} className="flex-1 border border-slate-300 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-body font-medium text-slate-700"><Camera className="w-4 h-4" /> Use Camera</button>
            <button onClick={() => inputRef.current?.click()} className="flex-1 border border-slate-300 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-body font-medium text-slate-700"><FileText className="w-4 h-4" /> Upload PDF</button>
          </div>
          {file && (
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 mt-4">
              <div className="flex items-center gap-2 text-sm font-body text-slate-700"><FileText className="w-4 h-4 text-teal-700" /> {file}</div>
              <button onClick={() => setFile(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
          )}
          <button disabled={!file} onClick={() => setUploaded(true)} className="w-full mt-6 bg-teal-700 disabled:bg-slate-300 text-white py-3 rounded-full font-body font-semibold text-sm">Continue</button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-display text-xl text-slate-900">Prescription uploaded successfully</h3>
          <p className="text-sm text-slate-500 font-body mt-1">Our pharmacist will verify it shortly.</p>
          <button onClick={() => go("medicines")} className="mt-6 bg-teal-700 text-white px-6 py-2.5 rounded-full font-body font-semibold text-sm">Continue Shopping</button>
        </motion.div>
      )}
    </div>
  );
};

/* ============================== LAB TESTS PAGE ============================== */
const LabTestsPage = ({ go, addToast }) => (
  <div className="max-w-7xl mx-auto px-6 py-8">
    <h1 className="font-display text-2xl text-slate-900 mb-1">Lab Tests</h1>
    <p className="text-sm text-slate-500 font-body mb-6">Book diagnostic tests with home sample collection.</p>
    <div className="grid md:grid-cols-2 gap-4">
      {LAB_TESTS.map(t => (
        <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-body font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{t.category}</span>
              <h3 className="font-body font-semibold text-slate-900 mt-2">{t.name}</h3>
            </div>
            <FlaskConical className="w-5 h-5 text-teal-600 shrink-0" />
          </div>
          <p className="text-xs text-slate-500 font-body mt-2">{t.includes}</p>
          <div className="flex gap-4 mt-3 text-xs text-slate-500 font-body">
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {t.sample}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.reportTime}</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-semibold text-lg text-slate-900">{fmt(t.price)}</span>
              <span className="text-xs text-slate-400 line-through font-body">{fmt(t.mrp)}</span>
            </div>
            <button onClick={() => addToast(`${t.name} booked for tomorrow, 8:00 AM`)} className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-xs font-body font-semibold">Book Now</button>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-6"><Disclaimer>Lab test booking is a demo flow. Sample collection, reports and diagnosis require a real accredited lab partner and qualified professionals.</Disclaimer></div>
  </div>
);

/* ============================== DOCTORS PAGE ============================== */
const DoctorsPage = ({ addToast }) => (
  <div className="max-w-7xl mx-auto px-6 py-8">
    <h1 className="font-display text-2xl text-slate-900 mb-1">Consult Doctors</h1>
    <p className="text-sm text-slate-500 font-body mb-6">Connect with qualified doctors online, from home.</p>
    <div className="grid md:grid-cols-3 gap-4">
      {DOCTORS.map(d => (
        <div key={d.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-2xl mb-3">🩺</div>
          <h3 className="font-body font-semibold text-slate-900">{d.name}</h3>
          <p className="text-xs text-teal-700 font-body font-medium">{d.spec}</p>
          <p className="text-xs text-slate-500 font-body mt-1">{d.exp} yrs experience</p>
          <div className="mt-2"><Rating value={d.rating} /></div>
          <p className="text-xs text-emerald-600 font-body mt-2 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {d.available}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-body font-semibold text-slate-900 text-sm">{fmt(d.fee)} <span className="text-slate-400 font-normal">/ consult</span></span>
            <button onClick={() => addToast(`Consultation requested with ${d.name}`)} className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-xs font-body font-semibold">Consult</button>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-6"><Disclaimer>Doctor consultation is a demo frontend flow only. Real medical consultation requires backend verification, licensed professionals, and appropriate regulatory compliance.</Disclaimer></div>
  </div>
);

/* ============================== OFFERS PAGE ============================== */
const OffersPage = ({ addToast }) => (
  <div className="max-w-7xl mx-auto px-6 py-8">
    <h1 className="font-display text-2xl text-slate-900 mb-1">Offers & Coupons</h1>
    <p className="text-sm text-slate-500 font-body mb-6">Save more on medicines, lab tests and health products.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {OFFERS.map(o => (
        <div key={o.id} className="relative bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl p-5 overflow-hidden">
          <Tag className="w-5 h-5 text-teal-200 mb-2" />
          <span className="text-[11px] font-body bg-white/15 px-2 py-0.5 rounded-full">{o.tag}</span>
          <h3 className="font-display text-lg mt-2">{o.title}</h3>
          <p className="text-sm text-teal-100 font-body mt-1">{o.desc}</p>
          <p className="text-[11px] text-teal-200 font-body mt-2">{o.validity}</p>
          <div className="flex items-center justify-between mt-4 bg-white/10 rounded-xl px-3 py-2">
            <span className="font-mono text-sm tracking-widest">{o.code}</span>
            <button onClick={() => { navigator.clipboard?.writeText(o.code); addToast(`Copied code ${o.code}`); }} className="text-xs font-body font-semibold bg-white text-teal-800 px-3 py-1 rounded-full">Copy Code</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ============================== WISHLIST PAGE ============================== */
const WishlistPage = ({ go, openProduct, wishlist, cart, addToCart, toggleWishlist }) => {
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  if (items.length === 0) return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h2 className="font-display text-xl text-slate-900">Your wishlist is empty</h2>
      <button onClick={() => go("medicines")} className="mt-5 bg-teal-700 text-white px-6 py-2.5 rounded-full font-body font-semibold text-sm">Browse Products</button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl text-slate-900 mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} onOpen={openProduct} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
      </div>
    </div>
  );
};

/* ============================== ORDERS PAGE ============================== */
const OrdersPage = ({ go, orders }) => (
  <div className="max-w-3xl mx-auto px-6 py-8">
    <h1 className="font-display text-2xl text-slate-900 mb-6">My Orders</h1>
    {orders.length === 0 ? (
      <div className="text-center py-16">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="font-body text-slate-500">You haven't placed any orders yet.</p>
        <button onClick={() => go("medicines")} className="mt-5 bg-teal-700 text-white px-6 py-2.5 rounded-full font-body font-semibold text-sm">Start Shopping</button>
      </div>
    ) : (
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-slate-400">{o.id}</p>
              <p className="font-body font-semibold text-slate-900 text-sm mt-0.5">{o.items.length} items · {fmt(o.total)}</p>
              <p className="text-xs text-emerald-600 font-body mt-0.5">In Progress</p>
            </div>
            <button onClick={() => go("track", o.id)} className="text-teal-700 text-sm font-body font-medium flex items-center gap-1">Track <ChevronRight className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ============================== PROFILE PAGE ============================== */
const ProfilePage = ({ go }) => (
  <div className="max-w-2xl mx-auto px-6 py-8">
    <h1 className="font-display text-2xl text-slate-900 mb-6">My Profile</h1>
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-display text-teal-800">F</div>
      <div>
        <p className="font-body font-semibold text-slate-900">Faisal</p>
        <p className="text-xs text-slate-500 font-body">+91 98XXX XXXXX · faisal@example.com</p>
      </div>
    </div>
    <div className="grid sm:grid-cols-2 gap-3 mt-6">
      {[
        { icon: Package, label: "My Orders", page: "orders" },
        { icon: FileText, label: "Prescriptions", page: "prescription" },
        { icon: Heart, label: "Wishlist", page: "wishlist" },
        { icon: Bell, label: "Notifications", page: "home" },
        { icon: MapPin, label: "Saved Addresses", page: "home" },
      ].map(i => (
        <button key={i.label} onClick={() => go(i.page)} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 text-left">
          <i.icon className="w-4.5 h-4.5 text-teal-700" />
          <span className="text-sm font-body font-medium text-slate-800">{i.label}</span>
        </button>
      ))}
    </div>
  </div>
);

/* ============================== AUTH PAGES ============================== */
const LoginPage = ({ go }) => {
  const [mode, setMode] = useState("mobile");
  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900 text-center">Welcome back</h1>
      <p className="text-sm text-slate-500 font-body text-center mt-1">Login to manage your orders and prescriptions.</p>
      <div className="flex gap-2 mt-6 bg-slate-100 p-1 rounded-full">
        {["mobile", "email"].map(m => (
          <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-full text-sm font-body font-medium capitalize transition-colors ${mode === m ? "bg-white shadow text-teal-700" : "text-slate-500"}`}>{m}</button>
        ))}
      </div>
      <input placeholder={mode === "mobile" ? "Mobile Number" : "Email Address"} className="w-full mt-4 border border-slate-300 rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-teal-500" />
      <button className="w-full mt-3 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full font-body font-semibold text-sm">Send OTP</button>
      <div className="flex items-center gap-2 my-5"><div className="flex-1 h-px bg-slate-200" /><span className="text-xs text-slate-400 font-body">or</span><div className="flex-1 h-px bg-slate-200" /></div>
      <button className="w-full border border-slate-300 py-3 rounded-full font-body font-medium text-sm text-slate-700">Continue with Google</button>
      <p className="text-center text-sm font-body text-slate-500 mt-5">New here? <button onClick={() => go("signup")} className="text-teal-700 font-medium">Create account</button></p>
      <p className="text-[11px] text-slate-400 font-body text-center mt-4">By continuing, you agree to our Terms & Privacy Policy. Authentication is a frontend demo only.</p>
    </div>
  );
};

const SignupPage = ({ go }) => (
  <div className="max-w-sm mx-auto px-6 py-16">
    <h1 className="font-display text-2xl text-slate-900 text-center">Create your account</h1>
    <div className="space-y-3 mt-6">
      {["Full Name", "Mobile Number", "Email", "Password"].map(f => (
        <input key={f} type={f === "Password" ? "password" : "text"} placeholder={f} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-teal-500" />
      ))}
    </div>
    <label className="flex items-center gap-2 mt-4 text-xs font-body text-slate-500"><input type="checkbox" className="accent-teal-700" /> I agree to the Terms & Privacy Policy</label>
    <button className="w-full mt-4 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full font-body font-semibold text-sm">Create Account</button>
    <p className="text-center text-sm font-body text-slate-500 mt-5">Already have an account? <button onClick={() => go("login")} className="text-teal-700 font-medium">Log in</button></p>
  </div>
);

/* ============================== 404 ============================== */
const NotFoundPage = ({ go }) => (
  <div className="max-w-md mx-auto px-6 py-24 text-center">
    <p className="font-mono text-6xl text-teal-700">404</p>
    <h2 className="font-display text-xl text-slate-900 mt-3">Page not found</h2>
    <button onClick={() => go("home")} className="mt-6 bg-teal-700 text-white px-6 py-2.5 rounded-full font-body font-semibold text-sm">Back to Home</button>
  </div>
);

/* ============================== APP ROOT ============================== */
export default function MedicareApp() {
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [orderIdParam, setOrderIdParam] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const addToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  const go = (p, param) => {
    if (p === "medicines") setCategoryFilter(param || null);
    if (p === "product") setProductId(param);
    if (p === "track") setOrderIdParam(param);
    if (p !== "medicines") setActiveSearch("");
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openProduct = (id) => go("product", id);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { ...product, qty }];
    });
    addToast(`${product.name} added to cart`);
  };
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };
  const removeItem = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      addToast(next.has(id) ? "Added to wishlist" : "Removed from wishlist");
      return next;
    });
  };

  const placeOrder = ({ address, total }) => {
    const order = {
      id: `MC${Math.floor(100000 + Math.random() * 899999)}`,
      items: cart,
      total,
      address,
      eta: new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    };
    setOrders(prev => [order, ...prev]);
    setLastOrder(order);
    setCart([]);
  };

  const onSearchSubmit = (val) => {
    const q = val || search;
    setActiveSearch(q);
    setCategoryFilter(null);
    setPage("medicines");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  let content;
  switch (page) {
    case "home": content = <HomePage go={go} openProduct={openProduct} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />; break;
    case "medicines": case "healthcare":
      content = <MedicinesPage go={go} openProduct={openProduct} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} initialCategory={categoryFilter} searchQuery={activeSearch} />; break;
    case "product": content = <ProductDetailPage productId={productId} go={go} cart={cart} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />; break;
    case "cart": content = <CartPage go={go} cart={cart} updateQty={updateQty} removeItem={removeItem} />; break;
    case "checkout": content = cart.length ? <CheckoutPage go={go} cart={cart} placeOrder={placeOrder} /> : <CartPage go={go} cart={cart} updateQty={updateQty} removeItem={removeItem} />; break;
    case "order-success": content = <OrderSuccessPage go={go} lastOrder={lastOrder} />; break;
    case "track": content = <TrackOrderPage go={go} orders={orders} orderId={orderIdParam} />; break;
    case "prescription": content = <PrescriptionPage go={go} />; break;
    case "labtests": content = <LabTestsPage go={go} addToast={addToast} />; break;
    case "doctors": content = <DoctorsPage addToast={addToast} />; break;
    case "offers": content = <OffersPage addToast={addToast} />; break;
    case "wishlist": content = <WishlistPage go={go} openProduct={openProduct} wishlist={wishlist} cart={cart} addToCart={addToCart} toggleWishlist={toggleWishlist} />; break;
    case "orders": content = <OrdersPage go={go} orders={orders} />; break;
    case "profile": content = <ProfilePage go={go} />; break;
    case "login": content = <LoginPage go={go} />; break;
    case "signup": content = <SignupPage go={go} />; break;
    default: content = <NotFoundPage go={go} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <FontImport />
      <Navbar go={go} cartCount={cartCount} wishlistCount={wishlist.size} search={search} setSearch={setSearch} onSearchSubmit={onSearchSubmit} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      <AnimatePresence mode="wait">
        <motion.main key={page + productId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {content}
        </motion.main>
      </AnimatePresence>
      <Footer go={go} />
      <BottomNav page={page} go={go} cartCount={cartCount} />
      <Toast toast={toast} />
    </div>
  );
}
