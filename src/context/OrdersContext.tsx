import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { adminOrders, type AdminOrder, type OrderStatus } from '../data/admin'

const STORAGE_KEY = 'knets_brew_orders_v1'

interface OrdersContextValue {
  orders: AdminOrder[]
  addOrder: (order: AdminOrder) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    return adminOrders
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const addOrder = (order: AdminOrder) => {
    setOrders((prev) => [order, ...prev])
  }

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be inside OrdersProvider')
  return ctx
}
