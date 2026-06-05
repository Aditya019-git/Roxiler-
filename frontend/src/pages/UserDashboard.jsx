import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      const res = await api.get(`/user/stores?name=${search}`);
      setStores(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const submitRating = async (storeId, score) => {
    try {
      await api.post('/user/ratings', { storeId, score });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating.');
    }
  };

  const updateRating = async (ratingId, score) => {
    try {
      await api.put(`/user/ratings/${ratingId}`, { score });
      setEditingStoreId(null);
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update rating.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
            Store Explorer
          </h1>
          
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search stores..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all w-64"
            />
            <button
              onClick={() => navigate('/update-password')}
              className="px-6 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500 hover:text-white transition-all font-semibold"
            >
              Change Password
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:-translate-y-1 shadow-xl flex flex-col justify-between h-full">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{store.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{store.address}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Avg Rating:</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {store.averageRating ? store.averageRating.toFixed(1) : 'None'} ⭐
                  </span>
                </div>

                {store.myRating ? (
                  <div className="bg-green-500/20 border border-green-500/30 text-green-300 p-3 rounded-lg text-center font-medium">
                    You rated this: {store.myRating} ⭐
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-gray-400 text-sm pl-2">Rate:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => submitRating(store.id, star, false)}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 text-gray-500 transition-colors flex items-center justify-center font-bold"
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {stores.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No stores found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;