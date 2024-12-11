import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Train, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Train className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">TSM</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <User className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">{user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;