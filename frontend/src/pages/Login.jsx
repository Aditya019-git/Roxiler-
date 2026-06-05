import {useState} from 'react';
import {Link,useNavigate } from 'react-router-dom';
import api from '../api';

const Login=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const[error,setError]=useState('');
    const navigate=useNavigate();


    const handleLogin=async (e)=>{
        e.preventDefault();

        try{
            const res=await api.post('/auth/login',{email,password});

            localStorage.setItem('token',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));


            const role=res.data.user.role;
            if(role==="SYSTEM_ADMIN"){
                navigate('/admin');
            }
            else if(role==="STORE_OWNER"){
                navigate('/owner');
            }
            else {
                navigate('/dashboard');
            }

        }catch(err){
            setError(err.response?.data?.error||'Login Failed.Please try again.');
        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl transition-transform transform hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-300 text-center mb-8">Sign in to Roxiler Store Ratings</p>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;