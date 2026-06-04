import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Calendar, Clock, Coffee, QrCode, ArrowRight, Loader2 } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings/my-bookings`);
        // Sort bookings by createdAt descending (most recent first)
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sorted);
      } catch (err) {
        console.error("Error fetching bookings", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="animate-spin text-hcRed" size={48} />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Screening Passes</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and view your cafe bookings</p>
        </div>
        <Link to="/" className="btn-primary flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-md">
          Book New Match <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="glass-card text-center py-20 px-4 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-white/5 text-gray-400">
            <Coffee size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No screening passes found</h2>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">
              You haven't reserved any tables for upcoming cricket matches yet. Grab your seats before they fill up!
            </p>
          </div>
          <Link to="/" className="btn-primary inline-flex px-6 py-3 rounded-lg font-bold shadow-lg">
            Browse Matches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const match = booking.matchSession;
            return (
              <div 
                key={booking.id} 
                className="glass-card flex flex-col md:flex-row overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl"
              >
                {/* Poster / Side Panel */}
                <div className="h-40 md:h-auto md:w-64 relative bg-black/50 overflow-hidden flex-shrink-0">
                  <img 
                    src={match.posterUrl || '/rcb-poster.jpg'}
                    alt="Match Poster" 
                    onError={(e) => { e.currentTarget.src = `https://fakeimg.pl/600x400/990000/fff/?text=${match.team1}+vs+${match.team2}`; }}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-2xl font-black tracking-wider text-white">
                      {match.team1} <span className="text-hcGold text-sm">VS</span> {match.team2}
                    </span>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6 md:space-y-0 md:flex-row md:items-center">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:flex md:items-center md:gap-6 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-hcRed" />
                        {new Date(match.matchDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-hcRed" />
                        {match.matchTime && match.matchTime.substring(0, 5)}
                      </div>
                      <div className="flex items-center col-span-2 md:col-span-1 mt-2 md:mt-0 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold">
                        <Coffee size={12} className="mr-1.5 text-hcGold" />
                        {booking.tables} {booking.tables === 1 ? 'Table' : 'Tables'} Reserved
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Booking ID</div>
                        <div className="font-mono text-xs text-gray-300 mt-0.5">{booking.id}</div>
                      </div>
                      <div className="border-l border-white/10 pl-4">
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Price Paid</div>
                        <div className="font-extrabold text-lg text-hcRed mt-0.5">₹{booking.totalPrice}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Badges & Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:flex-col md:items-end justify-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        booking.paymentStatus === 'PAID' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        booking.status === 'BOOKED' 
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <Link 
                      to={`/invoice/${booking.id}`} 
                      className="btn-primary w-full sm:w-auto flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-hcRed/15"
                    >
                      <QrCode size={16} className="mr-2" /> View Digital Pass
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
