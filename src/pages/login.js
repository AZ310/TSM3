import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import supabase from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import bcrypt from 'bcryptjs';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Query the users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Database error:', userError);
        throw new Error('Error finding user account.');
      }

      if (!user) {
        throw new Error('No user found with this email.');
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        throw new Error('Invalid password.');
      }

      // Store user data in context
      login({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });

      // Navigate based on role and previous location
      if (user.role.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        // For passengers
        if (location.state?.from === '/paymentpage') {
          // If they were trying to make a payment, send them back to tickets
          navigate('/tickets', { 
            state: {
              searchResults: location.state.searchResults,
              searchParams: location.state.bookingData?.searchParams
            }
          });
        } else if (location.state?.from) {
          // If they were trying to access a specific page, send them there
          navigate(location.state.from);
        } else {
          // Default: send passengers to home page
          navigate('/');
        }
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-6">
          <img className="h-12 w-auto" src="/img/train.jpg" alt="TSM" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {location.state?.message && (
          <div className="mt-2 text-center text-sm text-blue-600">
            {location.state.message}
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;