import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { orderTimelineSteps } from '../data/orders.js'

export default function OrderTimeline({ currentStep = 1 }) {
  return (
    <div>
      {orderTimelineSteps.map((step, i) => {
        const idx = i + 1
        const done = idx <= currentStep
        const isLast = i === orderTimelineSteps.length - 1
        return (
          <div key={step} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${
                  done ? 'bg-teal-600' : 'bg-navy-900/10'
                }`}
              >
                {done && <Check size={14} />}
              </motion.div>
              {!isLast && <div className={`w-0.5 flex-1 min-h-[28px] ${idx < currentStep ? 'bg-teal-600' : 'bg-navy-900/10'}`} />}
            </div>
            <div className="pb-7">
              <p className={`text-sm font-semibold ${done ? 'text-navy-900' : 'text-navy-900/40'}`}>{step}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
