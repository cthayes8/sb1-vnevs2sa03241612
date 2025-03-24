import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';

const DEMO_CREDENTIALS = {
  username: 'demo',
  password: '$4R-ln4u47[?'
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simple local authentication
      if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Store auth state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        // Use a slight delay to ensure localStorage is set before navigation
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#16162a] p-8 rounded-xl shadow-xl border border-tlco-purple/20">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-tlco-purple/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-tlco-purple" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Agent Portal Login
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Sign in to access your TLCO dashboard
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-tlco-purple/30 rounded-lg p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-tlco-purple focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-tlco-purple/30 rounded-lg p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-tlco-purple focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-tlco-purple text-white py-3 rounded-lg hover:bg-tlco-purple/90 transition-colors font-semibold disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            <p className="text-sm text-gray-400 text-center mt-4">
              Demo credentials: username: demo / password: $4R-ln4u47[?
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;