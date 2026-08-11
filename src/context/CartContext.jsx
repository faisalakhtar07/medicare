import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { ...product, qty }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const clearCart = () => setItems([])

  const itemTotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const mrpTotal = useMemo(() => items.reduce((sum, i) => sum + i.mrp * i.qty, 0), [items])
  const discount = mrpTotal - itemTotal
  const deliveryFee = itemTotal >= 499 || items.length === 0 ? 0 : 40
  const total = itemTotal + deliveryFee
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = { items, addToCart, updateQty, removeFromCart, clearCart, itemTotal, mrpTotal, discount, deliveryFee, total, count }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
