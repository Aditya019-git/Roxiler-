import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleBack = () => {
    if (!user) return navigate('/login');
    if (user.role === 'SYSTEM_ADMIN') navigate('/admin');
    else if (user.role === 'STORE_OWNER') navigate('/owner');
    else navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      await api.put('/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
        
        <button
          onClick={handleBack}
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Update Password</h2>
        <p className="text-gray-300 mb-8 text-sm">Your new password must be 8–16 characters with at least 1 uppercase letter and 1 special character.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;