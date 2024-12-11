import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, User, AlertCircle, Loader, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const bookingDetails = location.state || {};
  const subtotal = bookingDetails.totalAmount || 100;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const validateForm = () => {
    const newErrors = {};
    
    // Card Number Validation
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Expiry Date Validation
    const [month, year] = formData.expiryDate.split('/');
    const now = new Date();
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (!month || !year || expiry < now) {
      newErrors.expiryDate = 'Please enter a valid future date (MM/YY)';
    }

    // CVV Validation
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    // Cardholder Name Validation
    if (!/^[a-zA-Z\s]{2,}$/.test(formData.cardHolder)) {
      newErrors.cardHolder = 'Please enter the full name on your card';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    }

    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [name]: formattedValue });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/booking-confirmation', {
        state: {
          paymentDetails: {
            amount: total,
            cardHolder: formData.cardHolder,
            seats: bookingDetails.seats,
            trainId: bookingDetails.ticket?.train_id,
            departureTime: bookingDetails.ticket?.departure_time,
            origin: bookingDetails.ticket?.origin_station,
            destination: bookingDetails.ticket?.destination_station,
            operationId: Math.random().toString(36).substr(2, 9).toUpperCase()
          }
        }
      });
    } catch (error) {
      setErrors({ submit: 'Payment processing failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-sm text-gray-600">Secure payment processing for your train tickets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.cardHolder && (
                      <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>
                    )}
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
                      className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="4444 4444 4444 4444"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                    )}
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
                        className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                      )}
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
                        className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay SAR {total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit lg:sticky lg:top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="pb-4 border-b">
                <div className="flex justify-between text-sm mb-2">
                  <span>Train {bookingDetails.ticket?.train_id}</span>
                  <span>{bookingDetails.ticket?.departure_time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Selected Seats</span>
                  <span>{bookingDetails.seats?.join(', ')}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>SAR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (15%)</span>
                  <span>SAR {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
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