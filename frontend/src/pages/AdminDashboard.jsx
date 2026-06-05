import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login'); // Not authorized, kick to login
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            System Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all transform hover:-translate-y-2 shadow-xl">
            <h3 className="text-gray-400 text-lg font-medium mb-2">Total Users</h3>
            <p className="text-5xl font-black text-blue-400">{stats.totalUsers}</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all transform hover:-translate-y-2 shadow-xl">
            <h3 className="text-gray-400 text-lg font-medium mb-2">Total Stores</h3>
            <p className="text-5xl font-black text-purple-400">{stats.totalStores}</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all transform hover:-translate-y-2 shadow-xl">
            <h3 className="text-gray-400 text-lg font-medium mb-2">Total Ratings</h3>
            <p className="text-5xl font-black text-emerald-400">{stats.totalRatings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;