# Popular Medi — Online Pharmacy Platform (Frontend Demo)

A production-quality React + Vite + Tailwind frontend for an online pharmacy platform,
inspired by the UX of leading Indian pharmacy apps. Mock data only — no backend included.

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

- Full routing (React Router) across Home, Medicines, Product Detail, Cart, 3-step Checkout,
  Order Success/Tracking, Prescription Upload, Lab Tests, Doctor Consultation, Offers,
  Login/Signup, Profile, Orders, Wishlist, Search, and static pages.
- Cart, Wishlist and Toast notification state via React Context.
- Mock data in `src/data/` (products, categories, doctors, lab tests, offers, orders) —
  swap these for real API calls when you connect a backend.
- Reusable components in `src/components/`.
- Tailwind design system tuned to a blue/teal medical palette (see `tailwind.config.js`).
- Framer Motion micro-animations, skeleton loaders, empty states, and a sticky mobile
  bottom nav for an app-like feel.

## Connecting a real backend later

Data fetching is centralized in `src/data/*.js`. Replace the static arrays with API calls
(e.g. React Query / fetch) and the rest of the UI — filters, cart, checkout — will keep working
since components already consume this shape of data.

## Disclaimers baked into the UI

Per the brief, the app avoids giving medical advice or dosage guidance, shows prescription
requirements clearly, and includes disclaimers on the doctor-consultation and footer sections
noting that payments/auth are mock and consultations require real backend + licensed
professionals in production.
