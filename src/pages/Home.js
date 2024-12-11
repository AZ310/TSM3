import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Search, AlertCircle, Calendar, Users, Loader } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const HomeComponent = () => {
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchError) {
      const timer = setTimeout(() => {
        setSearchError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchError]);

  const handleSearchFlights = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search').trim();
    const date = formData.get('date');
    const passengers = formData.get('passengers');

    if (!searchQuery) {
      setSearchError('Please enter a destination');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          schedule_id,
          train_id,
          origin_station,
          destination_station,
          departure_time,
          arrival_time
        `)
        .ilike('destination_station', `%${searchQuery}%`);

      if (error) throw error;

      if (data && data.length > 0) {
        navigate('/tickets', { 
          state: { 
            searchResults: data,
            searchParams: {
              destination: searchQuery,
              date: date,
              passengers: passengers || "1"
            }
          } 
        });
      } else {
        setSearchError('No tickets available for the entered destination.');
      }
    } catch (error) {
      console.error('Error searching tickets:', error);
      setSearchError(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative h-[600px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/img/Train background.webp"
              alt="Train station"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>

          {/* Search Container */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Travel Anywhere, Anytime
              </h1>
              <p className="text-xl text-white mb-8">
                Book your train tickets with ease
              </p>

              {/* Search Form */}
              <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <form onSubmit={handleSearchFlights} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Destination Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="search"
                        placeholder="Where to?"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Date Input */}
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Passengers Input */}
                    <div className="relative">
                      <Users className="absolute left-3 top-3 text-gray-400" />
                      <select
                        name="passengers"
                        defaultValue="1"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="1">1 Passenger</option>
                        <option value="2">2 Passengers</option>
                        <option value="3">3 Passengers</option>
                        <option value="4">4 Passengers</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      transition-colors flex items-center justify-center space-x-2 disabled:bg-blue-400 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search Tickets</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
                <p className="text-gray-600">Book your tickets in minutes with our streamlined process</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">Safe and secure payment options for your peace of mind</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support for all your needs</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error Toast */}
      {searchError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="w-5 h-5" />
          <p>{searchError}</p>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;