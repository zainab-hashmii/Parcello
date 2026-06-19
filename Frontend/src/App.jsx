import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import PageBackground from './components/PageBackground'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/ToastContainer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import Couriers from './pages/Couriers'
import Help from './pages/Help'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import BookParcel from './pages/customer/BookParcel'
import TrackParcel from './pages/customer/TrackParcel'
import RiderDashboard from './pages/rider/RiderDashboard'
import RegisterVehicle from './pages/rider/RegisterVehicle'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageLocations from './pages/admin/ManageLocations'
import ManageRoutes from './pages/admin/ManageRoutes'
import PricingSettings from './pages/admin/PricingSettings'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      {!isHome && <PageBackground />}
      {!isHome && <Navbar />}
      <ToastContainer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/couriers" element={<PageTransition><Couriers /></PageTransition>} />
          <Route path="/help" element={<PageTransition><Help /></PageTransition>} />

          <Route
            path="/customer"
            element={
              <ProtectedRoute role="Customer">
                <PageTransition><CustomerDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/book"
            element={
              <ProtectedRoute role="Customer">
                <PageTransition><BookParcel /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/track/:parcelId"
            element={
              <ProtectedRoute role="Customer">
                <PageTransition><TrackParcel /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/rider"
            element={
              <ProtectedRoute role="Rider">
                <PageTransition><RiderDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rider/vehicle"
            element={
              <ProtectedRoute role="Rider">
                <PageTransition><RegisterVehicle /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <PageTransition><AdminDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/locations"
            element={
              <ProtectedRoute role="Admin">
                <PageTransition><ManageLocations /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/routes"
            element={
              <ProtectedRoute role="Admin">
                <PageTransition><ManageRoutes /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pricing"
            element={
              <ProtectedRoute role="Admin">
                <PageTransition><PricingSettings /></PageTransition>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
