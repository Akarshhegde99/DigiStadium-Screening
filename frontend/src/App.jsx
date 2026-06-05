import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MatchBookingPage from './pages/MatchBookingPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import InvoicePage from './pages/InvoicePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

import logo from './assets/logo.png';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="p-4 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logo} alt="Harvey's Cafe Logo" className="w-12 h-12 rounded-full object-cover shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Harvey's Cafe
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold hidden md:block">
            Cricket Screenings
          </div>

          {!isAdminRoute && (
            user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  Hi, <span className="text-hcRed font-bold">{user.name}</span>
                </span>
                <Link 
                  to="/bookings" 
                  className="text-sm font-semibold hover:text-hcRed text-gray-300 transition-colors"
                >
                  My Bookings
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-xs font-bold text-gray-400 hover:text-white uppercase bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="btn-primary px-4 py-2 text-sm font-bold rounded-lg shadow-lg hover:shadow-hcRed/20 transition-all"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen flex flex-col font-sans bg-hcDark text-gray-100">
            <Navbar />

            <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/book/:matchId" element={
                  <ProtectedRoute>
                    <MatchBookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/invoice/:id" element={<InvoicePage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
