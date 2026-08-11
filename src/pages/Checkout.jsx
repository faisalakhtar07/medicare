import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Truck, Zap, Wallet, CreditCard, Landmark, Banknote, Check } from 'lucide-react'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { openWhatsApp, buildOrderMessage } from '../utils/whatsapp.js'

const steps = ['Delivery Address', 'Delivery Method', 'Payment']

const paymentOptions = [
  { id: 'upi', label: 'UPI', icon: Wallet, hint: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, hint: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark, hint: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, hint: 'Pay when delivered' },
]

export default function Checkout() {
  const { items, itemTotal, discount, deliveryFee, total, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState({ name: '', mobile: '', house: '', street: '', area: '', city: '', state: '', pin: '' })
  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [payment, setPayment] = useState('upi')
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-6 py-6">
        <EmptyState icon="🛒" title="Your cart is empty" message="Add items to your cart before checking out." ctaLabel="Browse Medicines" ctaTo="/medicines" />
      </div>
    )
  }

  const addressValid = address.name && address.mobile.length === 10 && address.house && address.city && address.pin.length === 6

  const placeOrder = () => {
    const orderId = 'MC' + Math.floor(200000 + Math.random() * 90000)
    const paymentLabel = paymentOptions.find((p) => p.id === payment)?.label
    const finalTotal = total + (deliveryMethod === 'express' ? 49 : 0)
    openWhatsApp(buildOrderMessage({ orderId, items, address, total: finalTotal, deliveryMethod, payment: paymentLabel }))
    const orderedItems = items
    clearCart()
    navigate('/order-success', { state: { orderId, address, total: finalTotal, deliveryMethod, items: orderedItems } })
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-teal-600 text-white' : 'bg-navy-900/10 text-navy-900/40'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium text-center hidden sm:block ${i <= step ? 'text-navy-900' : 'text-navy-900/40'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-teal-600' : 'bg-navy-900/10'}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5 md:p-6">
          {step === 0 && (
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-1.5 mb-4"><MapPin size={16} className="text-teal-600" /> Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <input placeholder="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm sm:col-span-2" />
                <input placeholder="Mobile Number" maxLength={10} value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value.replace(/\D/g, '') })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
                <input placeholder="PIN Code" maxLength={6} value={address.pin} onChange={(e) => setAddress({ ...address, pin: e.target.value.replace(/\D/g, '') })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
                <input placeholder="House / Flat No." value={address.house} onChange={(e) => setAddress({ ...address, house: e.target.value })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm sm:col-span-2" />
                <input placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
                <input placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
                <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
                <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="focus-ring border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
              </div>
              <Button className="mt-6 w-full sm:w-auto" disabled={!addressValid} onClick={() => setStep(1)}>Continue to Delivery</Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-sm font-semibold mb-4">Delivery Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard Delivery', desc: 'Arrives in 2-4 days', icon: Truck, price: 'Free' },
                  { id: 'express', label: 'Express Delivery', desc: 'Arrives in 24 hours', icon: Zap, price: '₹49' },
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer ${deliveryMethod === opt.id ? 'border-teal-600 bg-teal-50/50' : 'border-navy-900/10'}`}>
                    <input type="radio" name="delivery" checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} className="accent-teal-600 w-4 h-4" />
                    <opt.icon size={18} className="text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-navy-900/40">{opt.desc}</p>
                    </div>
                    <span className="text-sm font-semibold">{opt.price}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-sm font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer ${payment === opt.id ? 'border-teal-600 bg-teal-50/50' : 'border-navy-900/10'}`}>
                    <input type="radio" name="payment" checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-teal-600 w-4 h-4" />
                    <opt.icon size={18} className="text-teal-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-navy-900/40">{opt.hint}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-navy-900/40 mt-4">This is a demo checkout. No real payment will be processed.</p>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={placeOrder}>Place Order</Button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5 h-fit sticky top-20">
          <h3 className="text-sm font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3 pr-1">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-xs text-navy-900/60">
                <span className="line-clamp-1">{i.name} × {i.qty}</span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-navy-900/10 my-2" />
          <div className="space-y-2 text-sm text-navy-900/60">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{itemTotal}</span></div>
            <div className="flex justify-between text-mint-600"><span>Discount</span><span>−₹{discount}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
            <div className="h-px bg-navy-900/10 my-2" />
            <div className="flex justify-between text-navy-900 font-bold text-base"><span>Total</span><span>₹{total + (deliveryMethod === 'express' ? 49 : 0)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
