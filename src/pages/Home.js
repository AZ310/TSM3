import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { useAuth } from './AuthContext';

const HomeComponent = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const { isLoggedIn } = useAuth(); // Use the useAuth hook to get isLoggedIn
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = supabase.auth.user();
        setSearchResults(user !== null); // Update setSearchResults instead of setIsLoggedIn
      } catch (error) {
        console.error('Error checking user session:', error.message);
      }
    };

    checkUserSession();
  }, []); // Remove the extra semicolon at the end of the useEffect

  const handleSearchFlights = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const leavingFrom = formData.get('Leaving_from');
    const target = formData.get('target');
    const departureDate = formData.get('leaving_date');
    const returnDate = formData.get('return_date');

    try {
      const { data, error } = await supabase
        .from('flight')
        .select('*')
        .eq('leaving_from', leavingFrom)
        .eq('target', target)
        .eq('leaving_date', departureDate)
        .eq('return_date', returnDate);

      if (error) {
        throw error;
      }

      if (data) {
        setSearchResults(data);
        setSearchError(''); // Clear search error if successful
      }
    } catch (error) {
      console.error('Error searching flights:', error.message);
      setSearchError('Please fill in the required fields correctly');
    }
  };

  const handleBookFlight = () => {
    if (isLoggedIn) {
      navigate('/payment');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Content Wrapper */}
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
            <a className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white" href="recent">Recent Tickets</a>
          </div>
          <a href="login" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign in</a>
          <a href="signup" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign up</a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="py-8 flex flex-col justify-center items-center text-center mx-auto w-4/5">
        <div className="flex flex-col justify-start items-center">
          <div>
            <img className="rounded-3xl " src="img/Train background.webp" alt="" />
          </div>
          <div className="absolute left-52 top-40">
            <h1 className="font-bold text-6xl object-left text-gray-800 mb-2">Travel Anywhere </h1>
            <h1 className="text-black text-xl">Anytime!</h1>
          </div>
          {/* Search Form */}
          <form onSubmit={handleSearchFlights} className="bg-white w-11/12 rounded-3xl px-6 py-4 mt-4 border border-gray-300 overflow-hidden">
            <div className="text-left flex">
              <div className="mr-4">
                <p className="text-gray">Where from?</p>
                <input type="text" placeholder="Leaving from" name="Leaving_from" className="border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <p className="text-gray">Where to?</p>
                <input type="text" placeholder="Target" name="target" className="border border-gray-300 rounded-md p-2" />
              </div>
              <div className="ml-4">
                <p className="text-gray">Departure?</p>
                <input type="date" name="leaving_date" className="h-10 border border-gray-300 rounded p-2" />
              </div>
              <div className="ml-4"> 
                <p className="text-gray">Return?</p> 
                <input type="date" name="return_date" className="h-10 border border-gray-300 rounded p-2" />
              </div>
              <div className="flex justify-center items-center mt-6">
                <button type="submit" className="text-white bg-gray-600 h-10 rounded-lg ml-6 w-36 shadow-md">Search</button>
              </div>
            </div>
          </form>

          {/* Display Search Results */}
          {searchResults.length > 0 && (
            <div className="w-11/12 border border-gray-300 mt-6 rounded-3xl p-3">
              {searchResults.map((flight) => (
                <div key={flight.id} className="p-8 flex border border-gray-400 rounded">
                  <p>Leaving from: {flight.leaving_from}</p>
                  <p>Target: {flight.target}</p>
                  <p>Departure Date: {flight.leaving_date}</p>
                  <p>Departure Time: {flight.leaving_time}</p>
                  <p>Return Date: {flight.return_date}</p>
                  <p>Return Time: {flight.return_time}</p>
                  <button className='text-white bg-gray-600 w-32 mt-2 rounded' onClick={handleBookFlight}>{isLoggedIn ? 'Book Flight' : 'Login to Book'}</button>
                  {/* Add more flight details as needed */}
                </div>
              ))}
            </div>
          )}

          {/* Display search error if exists */}
          {searchError && (
            <div className="w-11/12 border border-red-500 mt-6 rounded-3xl p-4 bg-red-100 text-red-500">
              {searchError}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeComponent;
