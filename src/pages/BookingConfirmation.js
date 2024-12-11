import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Clock, Train, CreditCard, MapPin } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentDetails } = location.state || {};

  useEffect(() => {
    if (!paymentDetails) {
      navigate('/');
    }
  }, [paymentDetails, navigate]);

  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    window.print();
  };

  const handleViewBookings = () => {
    navigate('/profile');
  };

  if (!paymentDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 p-6 flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
              <p className="text-sm text-gray-600">
                Booking reference: #{paymentDetails.operationId}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Journey Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Train className="w-5 h-5 mr-2" />
                Journey Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Train</p>
                  <p className="font-medium">Train {paymentDetails.trainId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure Time</p>
                  <p className="font-medium">{paymentDetails.departureTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seat(s)</p>
                  <p className="font-medium">{paymentDetails.seats.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium">SAR {paymentDetails.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">Credit Card (**** {paymentDetails.cardHolder})</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Important Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please arrive at least 15 minutes before departure</li>
                <li>• Keep this confirmation for your records</li>
                <li>• Valid ID is required for travel</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadTicket}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Ticket
              </button>
              <button
                onClick={handleViewBookings}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;