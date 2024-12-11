import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Save all the necessary booking information in state
    return <Navigate 
      to="/login" 
      state={{ 
        from: location.pathname,
        searchResults: location.state?.searchResults,
        selectedTicket: location.state?.ticket,
        seats: location.state?.seats,
        bookingData: location.state
      }} 
    />;
  }

  return children;
};

export default ProtectedRoute;