import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-20 text-center">
      <p className="text-6xl mb-4">🩹</p>
      <h1 className="text-2xl font-display font-bold mb-2">Page Not Found</h1>
      <p className="text-sm text-navy-900/50 mb-8">The page you're looking for doesn't exist or may have moved.</p>
      <Button as={Link} to="/">Back to Home</Button>
    </div>
  )
}
