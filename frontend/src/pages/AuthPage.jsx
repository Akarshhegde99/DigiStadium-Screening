import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Lock, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      if (email.trim() === '' || password.trim() === '') {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setError(result.message);
      }
    } else {
      if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || password.trim() === '') {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      if (phone.length < 10) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }

      const result = await register(name, email, phone, password);
      setLoading(false);
      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center py-10 md:py-20">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hcRed to-hcGold"></div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            type="button"
            className={`flex-1 pb-3 text-lg font-bold transition-all ${isLogin ? 'border-b-2 border-hcRed text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 pb-3 text-lg font-bold transition-all ${!isLogin ? 'border-b-2 border-hcRed text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {isLogin ? 'Log in to manage and secure your bookings' : 'Sign up to reserve your cafe table seats'}
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sign Up Fields */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Virat Kohli"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Common Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="virat@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Sign Up Phone Field */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  className="input-field pl-10"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength="10"
                />
              </div>
            </div>
          )}

          {/* Common Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="input-field pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex justify-center items-center h-12">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              isLogin ? 'Sign In' : 'Sign Up & Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
