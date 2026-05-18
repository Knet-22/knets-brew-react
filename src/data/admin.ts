import { products } from './products'

export type OrderStatus = 'Ready' | 'Preparing' | 'Confirmed'

export interface AdminOrder {
  id: string
  customer: string
  contact: string
  items: string[]
  amount: number
  status: OrderStatus
  date: string
  paymentMethod: string
}

export const adminOrders: AdminOrder[] = [
  {
    id: 'KB-A9X2M1',
    customer: 'Maria Santos',
    contact: '0966 364 0516',
    items: ['Black Ivory', 'House Espresso'],
    amount: 680,
    status: 'Ready',
    date: '2026-05-16',
    paymentMethod: 'Cash',
  },
  {
    id: 'KB-F3K8L2',
    customer: 'Juan Dela Cruz',
    contact: 'juan@email.com',
    items: ['Kopi Luwak'],
    amount: 540,
    status: 'Preparing',
    date: '2026-05-16',
    paymentMethod: 'GCash',
  },
  {
    id: 'KB-R7P5V9',
    customer: 'Rosa Garcia',
    contact: '0917 555 2841',
    items: ['Panama Geisha', 'Gold Cold Brew'],
    amount: 360,
    status: 'Confirmed',
    date: '2026-05-15',
    paymentMethod: 'Card',
  },
  {
    id: 'KB-Q2W8T4',
    customer: 'Michael Lee',
    contact: 'michael.lee@work.com',
    items: ['Blue Mountain'],
    amount: 280,
    status: 'Ready',
    date: '2026-05-15',
    paymentMethod: 'Cash',
  },
  {
    id: 'KB-Z5L9M3',
    customer: 'Ana Rodriguez',
    contact: '0908 777 1234',
    items: ['Boholano Special', 'House Espresso'],
    amount: 320,
    status: 'Confirmed',
    date: '2026-05-14',
    paymentMethod: 'GCash',
  },
]

export interface NotificationItem {
  id: string
  type: 'order' | 'low-stock'
  title: string
  description: string
  date: string
}

const formatLowStockNotification = (product: typeof products[number]): NotificationItem => ({
  id: `low-stock-${product.id}`,
  type: 'low-stock',
  title: `Low stock: ${product.name}`,
  description: `${product.stock} left in inventory`,
  date: '2026-05-17',
})

const formatOrderNotification = (order: AdminOrder): NotificationItem => ({
  id: `order-${order.id}`,
  type: 'order',
  title: `New order ${order.id}`,
  description: `${order.customer} placed an order for ${order.items.length} item(s)`,
  date: order.date,
})

export function getNotifications(role: 'admin' | 'staff'): NotificationItem[] {
  const orderNotifications = adminOrders.map(formatOrderNotification)
  const lowStockNotifications = products
    .filter((product) => product.stock < 10)
    .map(formatLowStockNotification)

  return role === 'admin'
    ? [...orderNotifications, ...lowStockNotifications].sort((a, b) => (a.date < b.date ? 1 : -1))
    : orderNotifications.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const lowStockCount = products.filter((product) => product.stock < 10).length
