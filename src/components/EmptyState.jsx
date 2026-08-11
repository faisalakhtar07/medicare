import Button from './Button.jsx'
import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, message, ctaLabel, ctaTo }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-navy-900/50 max-w-xs mb-5">{message}</p>
      {ctaLabel && (
        <Button as={Link} to={ctaTo}>
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
