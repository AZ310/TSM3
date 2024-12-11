import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Users, Train, ArrowRight, CreditCard, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';

const Tickets = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatMap, setShowSeatMap] = useState(false);

  // Get search results and params from location state
  const searchResults = location.state?.searchResults || [];
  const searchParams = location.state?.searchParams || {};

  useEffect(() => {
    if (!location.state?.searchResults) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowSeatMap(true);
    setSelectedSeats([]);
  };

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < parseInt(searchParams.passengers || 1)) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const calculateTotal = (ticket, seatCount) => {
    const basePrice = 100;
    return basePrice * seatCount;
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === parseInt(searchParams.passengers || 1)) {
      setLoading(true);
      try {
        if (!user) {
          navigate('/login', {
            state: {
              from: '/tickets',
              searchResults,
              selectedTicket,
              seats: selectedSeats,
              searchParams
            }
          });
          return;
        }

        navigate('/paymentpage', {
          state: {
            ticket: selectedTicket,
            seats: selectedSeats,
            totalAmount: calculateTotal(selectedTicket, selectedSeats.length),
            searchParams
          }
        });
      } finally {
        setLoading(false);
      }
    }
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
                {[...Array(32)].map((_, index) => {
                  const seatNumber = index + 1;
                  const isSelected = selectedSeats.includes(seatNumber);
                  const isDisabled = !isSelected && 
                    selectedSeats.length >= parseInt(searchParams.passengers || 1);
                  
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatSelect(seatNumber)}
                      disabled={isDisabled}
                      className={`p-2 text-center rounded ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : isDisabled 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span>Selected Seats:</span>
                  <span>{selectedSeats.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Total Amount:</span>
                  <span className="font-bold">
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
                    <Loader className="w-5 h-5 animate-spin" />
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