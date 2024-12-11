import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Users, Train, ArrowRight, CreditCard, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import supabase from '../config/supabaseClient';

const Tickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSeatMap, setShowSeatMap] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get search results and params from location state
  const searchResults = location.state?.searchResults || [];
  const searchParams = location.state?.searchParams || {};

  useEffect(() => {
    if (!location.state?.searchResults) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (selectedTicket) {
      fetchOccupiedSeats(selectedTicket.schedule_id);
    }
  }, [selectedTicket]);

  const fetchOccupiedSeats = async (scheduleId) => {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('seat_number')
        .eq('schedule_id', scheduleId)
        .eq('is_occupied', true);

      if (error) throw error;
      setOccupiedSeats(data.map(seat => seat.seat_number));
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError('Failed to load seat availability');
    }
  };

  const addToWaitlist = async () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: location.pathname,
          searchResults,
          selectedTicket 
        } 
      });
      return;
    }

    try {
      // Check if already on waitlist
      const { data: existingWaitlist } = await supabase
        .from('waitlist')
        .select('*')
        .eq('schedule_id', selectedTicket.schedule_id)
        .eq('user_id', user.id)
        .eq('status', 'waiting')
        .single();

      if (existingWaitlist) {
        alert('You are already on the waitlist for this train.');
        return;
      }

      // Get current waitlist position
      const { data: currentWaitlist } = await supabase
        .from('waitlist')
        .select('position')
        .eq('schedule_id', selectedTicket.schedule_id)
        .eq('status', 'waiting')
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = currentWaitlist && currentWaitlist.length > 0 
        ? currentWaitlist[0].position + 1 
        : 1;

      // Add to waitlist
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert({
          schedule_id: selectedTicket.schedule_id,
          user_id: user.id,
          position: nextPosition,
          status: 'waiting'
        });

      if (waitlistError) throw waitlistError;

      alert('You have been added to the waitlist. You will be notified when a seat becomes available.');
      navigate('/profile');
    } catch (error) {
      console.error('Waitlist error:', error);
      setError('Failed to add to waitlist');
    }
  };

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setSelectedSeats([]);
    setShowSeatMap(true);
    await fetchOccupiedSeats(ticket.schedule_id);
  };

  const handleSeatSelect = async (seatNumber) => {
    if (occupiedSeats.includes(seatNumber.toString())) {
      return;
    }

    // Check if all seats are taken
    if (occupiedSeats.length >= 32) { // Assuming 32 seats per train
      const confirmWaitlist = window.confirm(
        'All seats are currently booked. Would you like to join the waitlist?'
      );
      if (confirmWaitlist) {
        await addToWaitlist();
      }
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < parseInt(searchParams.passengers || 1)) {
      setSelectedSeats([...selectedSeats, seatNumber].sort((a, b) => a - b));
    }
  };

  const calculateTotal = (ticket, seatCount) => {
    const basePrice = 100; // Base price per seat
    return basePrice * seatCount;
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          searchResults,
          ticket: selectedTicket,
          seats: selectedSeats,
          searchParams
        }
      });
      return;
    }

    setLoading(true);
    try {
      // Check if seats are still available
      const { data: currentSeats } = await supabase
        .from('seats')
        .select('seat_number')
        .eq('schedule_id', selectedTicket.schedule_id)
        .eq('is_occupied', true);

      const selectedSeatsOccupied = selectedSeats.some(seat => 
        currentSeats.some(occupied => occupied.seat_number === seat.toString())
      );

      if (selectedSeatsOccupied) {
        throw new Error('Some selected seats have been taken. Please select different seats.');
      }

      // Reserve seats in the database
      const seatPromises = selectedSeats.map(seatNumber => 
        supabase.from('seats').insert({
          schedule_id: selectedTicket.schedule_id,
          seat_number: seatNumber.toString(),
          passenger_id: user.id,
          is_occupied: true,
          booking_reference: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        })
      );

      const results = await Promise.all(seatPromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Failed to reserve one or more seats');
      }

      navigate('/paymentpage', {
        state: {
          ticket: selectedTicket,
          seats: selectedSeats,
          totalAmount: calculateTotal(selectedTicket, selectedSeats.length),
          searchParams
        }
      });
    } catch (error) {
      console.error('Error reserving seats:', error);
      setError(error.message || 'Failed to reserve seats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SeatButton = ({ number }) => {
    const isSelected = selectedSeats.includes(number);
    const isOccupied = occupiedSeats.includes(number.toString());
    
    return (
      <button
        onClick={() => handleSeatSelect(number)}
        disabled={isOccupied || (!isSelected && selectedSeats.length >= parseInt(searchParams.passengers || 1))}
        className={`p-4 text-center rounded-lg transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white'
            : isOccupied
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
        } ${
          (!isSelected && selectedSeats.length >= parseInt(searchParams.passengers || 1))
            ? 'cursor-not-allowed'
            : ''
        }`}
      >
        {number}
      </button>
    );
  };

  if (!searchResults.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">No Results Found</h2>
            <p className="mt-2 text-gray-600">Try searching for a different destination or date.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Available Tickets</h1>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <p>Search Results for: {searchParams.destination || 'All Routes'}</p>
            {searchParams.date && (
              <>
                <span className="mx-2">•</span>
                <p>{searchParams.date}</p>
              </>
            )}
            <span className="mx-2">•</span>
            <p>{searchParams.passengers || 1} Passenger(s)</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {searchResults.map((ticket) => (
                <div 
                  key={ticket.schedule_id}
                  className={`bg-white rounded-lg shadow-sm border p-4 transition-all 
                    ${selectedTicket?.schedule_id === ticket.schedule_id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <Train className="text-blue-600 w-6 h-6" />
                        <div>
                          <p className="font-semibold text-lg">Train {ticket.train_id}</p>
                          <div className="flex items-center text-gray-600">
                            {ticket.origin_station}
                            <ArrowRight className="w-4 h-4 mx-2" />
                            {ticket.destination_station}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Departure: {ticket.departure_time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Arrival: {ticket.arrival_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6">
                      <p className="text-2xl font-bold text-gray-900">SAR 100</p>
                      <button
                        onClick={() => handleSelectTicket(ticket)}
                        className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat Selection Panel */}
          {showSeatMap && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-4">
              <h2 className="text-lg font-semibold mb-4">Select Your Seats</h2>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                {Array.from({ length: 32 }, (_, i) => (
                  <SeatButton key={i + 1} number={i + 1} />
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-medium">{selectedSeats.join(', ') || 'None'}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">
                    SAR {calculateTotal(selectedTicket, selectedSeats.length)}
                  </span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={loading || selectedSeats.length !== parseInt(searchParams.passengers || 1)}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : selectedSeats.length === parseInt(searchParams.passengers || 1)
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;