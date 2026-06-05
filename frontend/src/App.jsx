import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import UserDashboard from './pages/UserDashboard'; // ← 1. Import it here

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/owner" element={<OwnerDashboard />} /> 
        <Route path="/dashboard" element={<UserDashboard />} /> {/* ← 2. Update this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;