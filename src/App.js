import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import TicketList from "./pages/recent";
import AddTicketAdmin from "./pages/addTicket";
import PaymentPage from "./pages/payment";
import { AuthProvider } from './pages/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Wrap all routes within AuthProvider */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recent" element={<TicketList />} />
          <Route path="/addticketadmin" element={<AddTicketAdmin />} />
          <Route path="/paymentpage" element={<PaymentPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
