
const API_BASE = `${import.meta.env.VITE_API_URL || 'https://medicare-backend-1-drec.onrender.com'}/api`

function getToken() {
  return localStorage.getItem('medicare_token')
}

export function setToken(token) {
  if (token) localStorage.setItem('medicare_token', token)
  else localStorage.removeItem('medicare_token')
}

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (!isForm) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`)
  }
  return data
}

// MongoDB returns `_id`, the rest of the app was written expecting `id`.
// Normalize here once so every page/component can just use `.id`.
function withId(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(withId)
  return obj._id ? { ...obj, id: obj._id } : obj
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  addAddress: (payload) => request('/auth/addresses', { method: 'POST', body: payload }),
  getAddresses: () => request('/auth/addresses'),
  updateAddress: (id, payload) => request(`/auth/addresses/${id}`, { method: 'PUT', body: payload }),
  deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }),
  setDefaultAddress: (id) => request(`/auth/addresses/${id}/default`, { method: 'PUT' }),

  // Staff (owner/delivery) auth
  staffLogin: (payload) => request('/staff/login', { method: 'POST', body: payload }),
  staffRegister: (payload) => request('/staff/register', { method: 'POST', body: payload }),
  getDeliveryStaff: () => request('/staff/delivery-list').then(withId),
  setStaffActive: (id, active) => request(`/staff/${id}/active`, { method: 'PUT', body: { active } }),

  // Owner dashboard
  ownerOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/owner/orders${qs ? `?${qs}` : ''}`).then(withId)
  },
  ownerOrder: (id) => request(`/owner/orders/${id}`).then(withId),
  ownerUpdateStatus: (id, status) => request(`/owner/orders/${id}/status`, { method: 'PUT', body: { status } }).then(withId),
  ownerAssignDelivery: (id, deliveryBoyId) => request(`/owner/orders/${id}/assign`, { method: 'PUT', body: { deliveryBoyId } }).then(withId),
  ownerStats: () => request('/owner/stats'),
  ownerCustomers: () => request('/owner/customers').then(withId),
  ownerPrescriptions: () => request('/prescriptions').then(withId),
  updatePrescriptionStatus: (id, status) => request(`/prescriptions/${id}/status`, { method: 'PUT', body: { status } }),

  // Delivery dashboard
  deliveryOrders: () => request('/delivery/orders').then(withId),
  deliveryOrder: (id) => request(`/delivery/orders/${id}`).then(withId),
  deliveryUpdateStatus: (id, status) => request(`/delivery/orders/${id}/status`, { method: 'PUT', body: { status } }).then(withId),

  // Notifications
  myNotifications: () => request('/notifications/mine').then((d) => ({ ...d, notifications: withId(d.notifications) })),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/products${qs ? `?${qs}` : ''}`).then(withId)
  },
  getProduct: (id) => request(`/products/${id}`).then(withId),

  // Orders
  placeOrder: (payload) => request('/orders', { method: 'POST', body: payload }).then(withId),
  myOrders: () => request('/orders/mine').then(withId),
  getOrder: (id) => request(`/orders/${id}`).then(withId),

  // Doctors & consultations
  getDoctors: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/doctors${qs ? `?${qs}` : ''}`).then(withId)
  },
  getDoctor: (id) => request(`/doctors/${id}`).then(withId),
  bookConsultation: (payload) => request('/consultations', { method: 'POST', body: payload }),
  myConsultations: () => request('/consultations/mine').then(withId),

  // Lab tests
  getLabTests: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/labtests${qs ? `?${qs}` : ''}`).then(withId)
  },
  getLabTest: (id) => request(`/labtests/${id}`).then(withId),
  bookLabTest: (payload) => request('/labbookings', { method: 'POST', body: payload }),
  myLabBookings: () => request('/labbookings/mine').then(withId),

  // Prescriptions
  uploadPrescription: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request('/prescriptions', { method: 'POST', body: form, isForm: true })
  },
  myPrescriptions: () => request('/prescriptions/mine').then(withId),

  // Admin
  adminCustomers: () => request('/admin/customers').then(withId),
  adminCustomer: (id) => request(`/admin/customers/${id}`),
  adminStats: () => request('/admin/stats'),
  adminAllOrders: () => request('/orders').then(withId),

  // Payments (Razorpay test mode)
  getRazorpayKey: () => request('/payments/key'),
  createRazorpayOrder: (orderId) => request('/payments/create-order', { method: 'POST', body: { orderId } }),
  verifyPayment: (payload) => request('/payments/verify', { method: 'POST', body: payload }),
}

export const FILE_BASE = import.meta.env.VITE_API_URL || 'https://medicare-backend-1-drec.onrender.com'
