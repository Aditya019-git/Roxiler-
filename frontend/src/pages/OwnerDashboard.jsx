import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const OwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get('/owner/store');
        setStoreData(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
        if (err.response?.status === 404) setError('You do not have a store assigned yet.');
        else setError('Failed to load store data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Store Owner Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold shadow-lg"
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center backdrop-blur-md">
            <h2 className="text-2xl text-gray-300 font-semibold">{error}</h2>
            <p className="text-gray-500 mt-2">Contact the System Admin to add a store under your account.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Store Stats Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center transform hover:scale-[1.01] transition-all">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{storeData.name}</h2>
                <p className="text-gray-400">{storeData.address} • {storeData.email}</p>
              </div>
              <div className="mt-6 md:mt-0 text-center bg-white/10 px-8 py-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-300 uppercase tracking-wider mb-1 font-semibold">Average Rating</p>
                <p className="text-4xl font-black text-yellow-400">
                  {storeData.averageRating ? storeData.averageRating.toFixed(1) : 'No ratings yet'} 
                  <span className="text-2xl"> ⭐</span>
                </p>
              </div>
            </div>

            {/* Ratings Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white">Recent Customer Ratings</h3>
              </div>
              
              {storeData.ratings.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No customers have rated your store yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-gray-300 text-sm tracking-wide border-b border-white/10">
                        <th className="p-4 font-medium">Customer Name</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Rating Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {storeData.ratings.map((rating) => (
                        <tr key={rating.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-white font-medium">{rating.user.name}</td>
                          <td className="p-4 text-gray-400">{rating.user.email}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                              {rating.score} ⭐
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;