import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import BookParcel from './pages/customer/BookParcel'
import TrackParcel from './pages/customer/TrackParcel'
import RiderDashboard from './pages/rider/RiderDashboard'
import RegisterVehicle from './pages/rider/RegisterVehicle'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageLocations from './pages/admin/ManageLocations'
import ManageRoutes from './pages/admin/ManageRoutes'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/customer"
          element={
            <ProtectedRoute role="Customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/book"
          element={
            <ProtectedRoute role="Customer">
              <BookParcel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/track/:parcelId"
          element={
            <ProtectedRoute role="Customer">
              <TrackParcel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rider"
          element={
            <ProtectedRoute role="Rider">
              <RiderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rider/vehicle"
          element={
            <ProtectedRoute role="Rider">
              <RegisterVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations"
          element={
            <ProtectedRoute role="Admin">
              <ManageLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/routes"
          element={
            <ProtectedRoute role="Admin">
              <ManageRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
