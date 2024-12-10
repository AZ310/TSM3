import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { useAuth } from './AuthContext';

const HomeComponent = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');

  const { isLoggedIn } = useAuth();
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
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search').trim(); // Normalize input

    if (!searchQuery) {
      setSearchError('Please enter a destination');
      return;
    }

    
    try {
      console.log('Search Query:', searchQuery);
      console.log("Table", await supabase .from('schedules').select('*'));

      const { data, error } = await supabase
        .from('schedules') // Ensure the table name matches your database
        .select(`
          schedule_id,
          train_id,
          origin_station,
          destination_station,
          departure_time,
          arrival_time
        `)
        .ilike('destination_station', `%${searchQuery}%`); // Case-insensitive search

      console.log('Database response:', { data, error });

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('Found matches:', data);
        setSearchResults(data);
        setSearchError('');
        navigate('/tickets', { state: { searchResults: data } });
      } else {
        setSearchError('No tickets available for the entered destination.');
      }
    } catch (error) {
      console.error('Error searching tickets:', error);
      setSearchError(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between px-3 items-center border-b-2 border-gray-300">
        <Link to="/" className="flex items-center cursor-pointer">
          <img className="w-6" src="img/train.jpg" alt="website-logo" />
          <span className="font-bold px-0">TSM</span>
        </Link>
        <div>
          <h1 className="font-bold">Welcome to TSM</h1>
        </div>
        <nav className="flex justify-start items-center">
          <div className="mr-3 pr-3 border-r border-gray-800">
            <a
              className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
              href="recent"
            >
              Recent Tickets
            </a>
          </div>
          <a
            href="login"
            className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
          >
            Sign in
          </a>
          <a
            href="signup"
            className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
          >
            Sign up
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="relative">
        <div className="w-[1700px] h-[700px] relative overflow-hidden">
          <div className="container mx-auto px-4 h-full relative">
            <div className="w-[80%] h-full mx-auto relative">
              <img
                src="img/Train background.webp"
                alt="High-speed train"
                className="w-full h-full object-cover rounded-lg"
                style={{
                  objectPosition: 'center 50%',
                  maxWidth: '1200px',
                  margin: '0 auto',
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-center">
                <h1 className="text-6xl font-bold text-[#D9E3F0] mb-4 ml-8">
                  Travel Anywhere
                </h1>
                <p className="text-white text-xl mb-8 ml-8 px-2">
                  Anytime!
                </p>

                {/* Search Form */}
                <div className="px-8">
                  <form onSubmit={handleSearchFlights} className="max-w-2xl">
                    <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
                      <input
                        type="text"
                        name="search"
                        placeholder="Where do you want to go?"
                        className="flex-grow px-4 py-2 text-lg focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#0057B8] text-white px-6 py-2 text-lg font-semibold hover:bg-[#004494] transition-colors"
                      >
                        Find tickets
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="fixed bottom-4 right-4 max-w-md animate-fade-in">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
              {searchError}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeComponent;
