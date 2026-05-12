import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

const STORAGE_KEY = 'knets_brew_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        const maxStock = product.stock ?? 999
        const newQty = Math.min(existing.quantity + quantity, maxStock)
        return prev.map(i => i.id === product.id ? { ...i, quantity: newQty, stock: maxStock } : i)
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: product.stock ?? 999,
        quantity
      }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItem(id)
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      const maxStock = i.stock ?? 999
      return { ...i, quantity: Math.min(quantity, maxStock) }
    }))
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clearCart = () => setItems([])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}
