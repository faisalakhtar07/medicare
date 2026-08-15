import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UploadCloud, FileCheck2, X, Camera, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button.jsx'
import { api } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function PrescriptionUpload() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
  }

  const confirm = async () => {
    if (!isAuthenticated) {
      showToast('Please login to upload a prescription')
      navigate('/login')
      return
    }
    setUploading(true)
    try {
      await api.uploadPrescription(file)
      setUploaded(true)
    } catch (err) {
      showToast(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 rounded-full bg-mint-500/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-mint-600" />
        </motion.div>
        <h1 className="text-xl font-display font-bold mb-2">Prescription Uploaded</h1>
        <p className="text-sm text-navy-900/50 mb-8">
          Saved to your account. Our pharmacist will review it and verify prescription-only medicines before processing your order.
        </p>
        <Button onClick={() => navigate('/medicines')}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-5 lg:px-6 py-8 md:py-12">
      <h1 className="text-xl md:text-2xl font-display font-bold mb-1.5">Upload Prescription</h1>
      <p className="text-sm text-navy-900/50 mb-6">Upload a valid prescription when required. Our pharmacist may verify prescription-only medicines before processing the order.</p>

      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3.5 text-xs text-amber-900/80 mb-6">
          You'll need to <Link to="/login" className="font-semibold underline">login</Link> before we can save your prescription to your account.
        </div>
      )}

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl2 flex flex-col items-center justify-center text-center py-14 px-6 transition-colors ${dragging ? 'border-teal-600 bg-teal-50' : 'border-navy-900/15 hover:border-teal-400'}`}
        >
          <UploadCloud size={34} className="text-teal-600 mb-3" />
          <p className="text-sm font-semibold mb-1">Drag & drop your prescription here</p>
          <p className="text-xs text-navy-900/40 mb-4">Supports JPG, PNG, PDF up to 10MB</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" type="button">Browse File</Button>
            <Button size="sm" variant="ghost" type="button" className="md:hidden"><Camera size={14} /> Camera</Button>
          </div>
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white rounded-xl2 border border-navy-900/5 shadow-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <FileCheck2 size={20} className="text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-navy-900/40">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => setFile(null)} className="focus-ring text-navy-900/30 hover:text-coral" aria-label="Remove file"><X size={18} /></button>
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="outline" className="flex-1" onClick={() => inputRef.current.click()}>Replace File</Button>
            <Button className="flex-1" onClick={confirm} disabled={uploading}>{uploading ? 'Uploading...' : 'Continue'}</Button>
          </div>
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      )}

      <div className="bg-skyfaint rounded-xl p-4 mt-6 text-xs text-navy-900/50 leading-relaxed">
        Prescription medicines require a valid prescription. Our pharmacist may contact you to verify details before your order is processed.
      </div>
    </div>
  )
}
