import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, User } from 'lucide-react';
import supabase from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Get booking details from location state
  const bookingDetails = location.state || {};
  const subtotal = bookingDetails.totalAmount || 100;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Insert into Payments table
      const { error: paymentError } = await supabase
        .from('Payments')
        .insert([{
          payment_id: Math.floor(Math.random() * 1000000).toString(),
          amount_paid: parseFloat(total),
          payment_date: new Date().toISOString(),
          reservation_id: bookingDetails.ticket?.schedule_id
        }]);

      if (paymentError) {
        console.error('Payment error:', paymentError);
        throw new Error('Payment failed');
      }

      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          paymentDetails: {
            amount: total,
            cardHolder: formData.cardHolder,
            seats: bookingDetails.seats,
            trainId: bookingDetails.ticket?.train_id,
            departureTime: bookingDetails.ticket?.departure_time,
            origin: bookingDetails.ticket?.origin_station,
            destination: bookingDetails.ticket?.destination_station
          }
        }
      });

    } catch (error) {
      console.error('Error details:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
            <p className="text-sm text-gray-600">Secure payment processing for your train tickets</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <div className="mt-1 relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="4444 4444 4444 4444"
                        maxLength="19"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <div className="mt-1 relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CVV</label>
                      <div className="mt-1 relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          type="password"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {loading ? 'Processing...' : `Pay SAR ${total.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Train {bookingDetails.ticket?.train_id}</span>
                  <span>{bookingDetails.ticket?.departure_time}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Selected Seats</span>
                  <span>{bookingDetails.seats?.join(', ')}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>SAR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>VAT (15%)</span>
                  <span>SAR {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>SAR {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;