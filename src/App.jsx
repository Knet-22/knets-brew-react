import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AdminLayout from './components/AdminLayout.jsx'

// Public
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Order from './pages/Order.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Track from './pages/Track.jsx'
import NotFound from './pages/NotFound.jsx'

// Admin
import AdminLogin from './pages/admin/Login.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import AdminStaff from './pages/admin/Staff.jsx'
import AdminProfile from './pages/admin/Profile.jsx'

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order-success/:code" element={<OrderSuccess />} />
        <Route path="/track" element={<Track />} />
        <Route path="/track/:code" element={<Track />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout requireAdmin />}>
          <Route path="products" element={<AdminProducts />} />
          <Route path="staff" element={<AdminStaff />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}
