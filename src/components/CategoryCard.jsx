import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CategoryCard({ category }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="shrink-0">
      <Link
        to={`/category/${category.slug}`}
        className="focus-ring flex flex-col items-center gap-2 w-24 group"
      >
        <div className="w-16 h-16 rounded-2xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-2xl transition-colors">
          {category.icon}
        </div>
        <span className="text-xs font-medium text-center leading-tight text-navy-900/80">{category.name}</span>
        <span className="text-[10px] text-navy-900/40">{category.count}+ items</span>
      </Link>
    </motion.div>
  )
}
