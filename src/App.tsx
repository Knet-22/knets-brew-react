import { type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Order from './pages/Order'
import OrderSuccess from './pages/OrderSuccess'
import Track from './pages/Track'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminNotifications from './pages/admin/Notifications'
import AdminStaff from './pages/admin/Staff'
import { useAuth } from './context/AuthContext'

// Restricts a route to admin role only — redirects staff to dashboard
function AdminOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user?.role !== 'admin') return <Navigate to="/admin" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* ── Storefront ──────────────────────────────────────────────────── */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/menu" element={<Layout><Menu /></Layout>} />
      <Route path="/order" element={<Layout><Order /></Layout>} />
      <Route path="/order-success/:code" element={<Layout><OrderSuccess /></Layout>} />
      <Route path="/track" element={<Layout><Track /></Layout>} />
      <Route path="/track/:code" element={<Layout><Track /></Layout>} />

      {/* ── Admin / Staff ───────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
      <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <AdminOnly>
              <AdminProducts />
            </AdminOnly>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <AdminLayout>
            <AdminOnly>
              <AdminStaff />
            </AdminOnly>
          </AdminLayout>
        }
      />

      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}
