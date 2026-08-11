export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Comp = 'button',
  ...props
}) {
  const base = 'focus-ring inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] shadow-sm',
    secondary: 'bg-navy-900 text-white hover:bg-navy-800 active:scale-[0.98]',
    outline: 'border border-teal-600 text-teal-700 hover:bg-teal-50 active:scale-[0.98]',
    ghost: 'text-navy-900 hover:bg-skyfaint',
    coral: 'bg-coral text-white hover:brightness-95 active:scale-[0.98] shadow-sm',
  }
  const sizes = {
    sm: 'text-sm px-3.5 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3.5',
  }
  return (
    <Comp className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Comp>
  )
}
