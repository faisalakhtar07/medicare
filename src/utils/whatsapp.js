// Central WhatsApp order notification helper.
// NOTE: wa.me links can only pre-fill TEXT. Photos/files can never be attached
// automatically by a website for security reasons — the customer has to tap
// the paperclip in WhatsApp and attach the photo themselves. We keep the
// text message as complete as possible so the pharmacist has full context
// even before any photo arrives.

export const WHATSAPP_NUMBER = '917360800529'

export function openWhatsApp(message, number = WHATSAPP_NUMBER) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function buildOrderMessage({ orderId, items, address, total, deliveryMethod, payment }) {
  const lines = [
    `🧾 *New POPULAR MEDI Order*`,
    `Order ID: ${orderId}`,
    ``,
    `*Items:*`,
    ...items.map((i) => `• ${i.name} × ${i.qty} — ₹${i.price * i.qty}`),
    ``,
    `*Total: ₹${total}*`,
    payment ? `Payment: ${payment}` : null,
    deliveryMethod ? `Delivery: ${deliveryMethod === 'express' ? 'Express (24 hrs)' : 'Standard (2-4 days)'}` : null,
    ``,
    `*Deliver to:*`,
    address ? `${address.name}, ${address.mobile}` : null,
    address ? `${address.house}, ${address.street}, ${address.area}, ${address.city}, ${address.state} - ${address.pin}` : null,
  ].filter(Boolean)
  return lines.join('\n')
}

export function buildLabTestMessage({ test }) {
  return [
    `🧪 *New Lab Test Booking*`,
    `Test: ${test.name}`,
    `Category: ${test.category}`,
    `Sample: ${test.sample}`,
    `Price: ₹${test.price}`,
    ``,
    `Please share your name, address and preferred time for sample collection.`,
  ].join('\n')
}

export function buildDoctorMessage({ doctor, slot }) {
  return [
    `🩺 *New Doctor Consultation Booking*`,
    `Doctor: ${doctor.name}`,
    `Specialization: ${doctor.specialization}`,
    `Slot: ${slot}`,
    `Fee: ₹${doctor.fee}`,
    ``,
    `Please share your name and mobile number to confirm.`,
  ].join('\n')
}

export function buildPrescriptionMessage({ fileName }) {
  return [
    `📋 *Prescription Order*`,
    fileName ? `File: ${fileName}` : null,
    ``,
    `I've uploaded a prescription on the POPULAR MEDI app.`,
    `👉 Please attach the prescription photo here (tap 📎 to attach).`,
  ].filter(Boolean).join('\n')
}
