import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import TicketList from "./pages/recent";
import AddTicketAdmin from "./pages/addTicket";
import PaymentPage from "./pages/payment";
import Tickets from "./pages/Tickets";
import UserProfile from "./pages/UserProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/AdminDashboard"; // Import the AdminDashboard

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tickets" element={<Tickets />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addticketadmin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AddTicketAdmin />
              </ProtectedRoute>
            } 
          />

          {/* Protected User Routes */}
          <Route 
            path="/recent" 
            element={
              <ProtectedRoute>
                <TicketList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/paymentpage" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-confirmation" 
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;