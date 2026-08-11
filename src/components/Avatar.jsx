function getInitials(name) {
  return name
    .replace('Dr.', '')
    .trim()
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Avatar({ name, color = '#0E9C90', size = 56, className = '' }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-display font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {getInitials(name)}
    </div>
  )
}
