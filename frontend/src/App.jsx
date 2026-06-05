import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UpdatePassword from './pages/UpdatePassword';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected: Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected: Store Owner only */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={['STORE_OWNER']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected: Normal User only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['NORMAL_USER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER']}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-password"
          element={
            <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER']}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;