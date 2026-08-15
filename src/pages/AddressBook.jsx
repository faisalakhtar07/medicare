import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, Plus, Pencil, Trash2, Star, X } from 'lucide-react'
import Button from '../components/Button.jsx'
import Modal from '../components/Modal.jsx'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const emptyForm = { label: 'Home', fullName: '', mobile: '', house: '', street: '', area: '', city: '', state: '', pin: '' }

export default function AddressBook() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => api.getAddresses().then(setAddresses).finally(() => setLoading(false))

  useEffect(() => {
    if (isAuthenticated) load()
  }, [isAuthenticated])

  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (addr) => {
    setEditingId(addr._id)
    setForm({ label: addr.label, fullName: addr.fullName, mobile: addr.mobile, house: addr.house, street: addr.street, area: addr.area, city: addr.city, state: addr.state, pin: addr.pin })
    setModalOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await api.updateAddress(editingId, form)
        showToast('Address updated')
      } else {
        await api.addAddress(form)
        showToast('Address added')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      showToast(err.message || 'Could not save address')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    try {
      await api.deleteAddress(id)
      showToast('Address removed')
      load()
    } catch (err) {
      showToast(err.message || 'Could not remove address')
    }
  }

  const makeDefault = async (id) => {
    try {
      await api.setDefaultAddress(id)
      showToast('Default address updated')
      load()
    } catch (err) {
      showToast(err.message || 'Could not update default address')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-6 py-6 md:py-10">
      <Link to="/profile" className="focus-ring inline-flex items-center gap-1 text-xs text-navy-900/50 mb-4">
        <ChevronLeft size={14} /> Back to profile
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-display font-bold">Saved Addresses</h1>
        <Button size="sm" onClick={openAdd}><Plus size={14} /> Add New</Button>
      </div>

      {loading ? (
        <p className="text-sm text-navy-900/40 text-center py-10">Loading...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center py-14">
          <MapPin size={32} className="text-navy-900/20 mx-auto mb-3" />
          <p className="text-sm text-navy-900/50 mb-4">No saved addresses yet.</p>
          <Button onClick={openAdd}>Add Your First Address</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a._id} className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-skyfaint px-2 py-0.5 rounded-full">{a.label}</span>
                  {a.isDefault && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                      <Star size={11} className="fill-teal-700" /> Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(a)} className="focus-ring text-navy-900/40 hover:text-teal-700" aria-label="Edit address">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(a._id)} className="focus-ring text-navy-900/40 hover:text-coral" aria-label="Delete address">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium">{a.fullName} · {a.mobile}</p>
              <p className="text-xs text-navy-900/50 mt-0.5">{a.house}, {a.street}, {a.area}, {a.city}, {a.state} - {a.pin}</p>
              {!a.isDefault && (
                <button onClick={() => makeDefault(a._id)} className="focus-ring text-xs font-semibold text-teal-700 mt-2">
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Address' : 'Add New Address'}>
        <form onSubmit={submit} className="space-y-3">
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setForm({ ...form, label: l })}
                className={`focus-ring text-xs font-semibold px-3 py-1.5 rounded-full border ${form.label === l ? 'bg-teal-600 text-white border-teal-600' : 'border-navy-900/15 text-navy-900/60'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          <input required placeholder="Mobile Number" maxLength={10} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          <input required placeholder="House / Flat No." value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          <input placeholder="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          <input placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
            <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          </div>
          <input required placeholder="PIN Code" maxLength={6} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })} className="focus-ring w-full border border-navy-900/15 rounded-lg px-3.5 py-2.5 text-sm" />
          <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Address'}</Button>
        </form>
      </Modal>
    </div>
  )
}
