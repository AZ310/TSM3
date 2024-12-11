import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, Clock, Train, Settings, LogOut } from 'lucide-react';
import supabase from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment')
        .select(`
          *,
          schedules:ticket_id (
            train_id,
            origin_station,
            destination_station,
            departure_time,
            arrival_time
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-3 text-sm font-medium flex items-center space-x-2
                  ${activeTab === 'bookings' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`px-4 py-3 text-sm font-medium flex items-center space-x-2
                  ${activeTab === 'payment' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payment Methods</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 text-sm font-medium flex items-center space-x-2
                  ${activeTab === 'settings' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {activeTab === 'bookings' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
              {loading ? (
                <div className="text-center py-4">
                  <Clock className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.operation_id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Train className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">
                              Train {booking.schedules.train_id}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.schedules.origin_station} → {booking.schedules.destination_station}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.schedules.departure_time).toLocaleString()}
                          </p>
                          <div className="mt-2">
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Seats: {booking.seats.join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">SAR {booking.amount}</p>
                          <p className="text-sm text-gray-500">
                            Booking ID: {booking.operation_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No bookings found
                </p>
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
              {/* Payment methods content */}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;