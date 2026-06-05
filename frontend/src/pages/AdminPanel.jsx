import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { ScanFace, CheckCircle, Search, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hc_admin_auth')) {
        navigate('/admin/login');
    }
  }, [navigate]);

  const [scannerEnabled, setScannerEnabled] = useState(false);

  useEffect(() => {
    // Dynamically load html5-qrcode script
    if (!window.Html5QrcodeScanner) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/html5-qrcode";
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        };
    }
  }, []);

  useEffect(() => {
    if (scannerEnabled && window.Html5QrcodeScanner) {
        const html5QrcodeScanner = new window.Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        html5QrcodeScanner.render(
            (decodedText) => {
                // Success callback
                const cleanId = extractBookingId(decodedText);
                setBookingIdInput(cleanId);
                setScannerEnabled(false);
                html5QrcodeScanner.clear();
                // trigger search
                handleSearch(null, cleanId);
            },
            (error) => {
                // Ignore ongoing scanning errors unless critical
            }
        );

        return () => {
            html5QrcodeScanner.clear().catch(e => console.error("Failed to clear scanner", e));
        };
    }
  }, [scannerEnabled]);

  const extractBookingId = (text) => {
    if (!text) return '';
    const cleanText = text.trim();
    if (cleanText.includes('/invoice/')) {
        const parts = cleanText.split('/invoice/');
        return parts[parts.length - 1].trim();
    }
    if (cleanText.startsWith('harveyscafe:booking:')) {
        return cleanText.replace('harveyscafe:booking:', '').trim();
    }
    return cleanText;
  };

  const handleSearch = async (e, idOverride = null) => {
    if (e) e.preventDefault();
    const rawId = idOverride || bookingIdInput;
    const searchId = extractBookingId(rawId);
    if (!searchId) return;

    setLoading(true);
    setError('');
    setBooking(null);

    try {
        const response = await axios.get(`${API_URL}/bookings/${searchId}`);
        setBooking(response.data);
    } catch (err) {
        setError('Booking not found or invalid UUID');
    } finally {
        setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    setLoading(true);
    setError('');
    try {
        const response = await axios.post(`${API_URL}/bookings/${booking.id}/check-in`);
        setBooking(response.data);
    } catch (err) {
        setError('Failed to mark booking as checked in');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h1 className="text-2xl font-bold flex items-center">
                <ScanFace className="mr-3 text-red-500" /> Scanner Terminal
            </h1>
            <button 
                onClick={() => { localStorage.removeItem('hc_admin_auth'); navigate('/admin/login'); }}
                className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest"
            >
                Logout
            </button>
        </div>

        <div className="glass-card p-6 mb-8">
            <div className="flex justify-center mb-6">
                 <button 
                    onClick={() => setScannerEnabled(!scannerEnabled)} 
                    className={`font-bold py-2 px-4 rounded ${scannerEnabled ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-500'} text-white w-full`}
                 >
                    {scannerEnabled ? 'Close Camera Scanner' : 'Open Camera Scanner'}
                 </button>
            </div>
            
            {scannerEnabled && (
                <div id="reader" className="w-full bg-black mb-6 border-2 border-red-900 rounded overflow-hidden"></div>
            )}

            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    className="input-field font-mono text-sm w-full bg-black/40 border border-white/20 p-3 rounded"
                    placeholder="Enter Booking ID (or scan QR)"
                    value={bookingIdInput}
                    onChange={(e) => setBookingIdInput(e.target.value)}
                />
                <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 px-6 rounded-lg text-white font-bold transition-colors">
                    {loading ? '...' : <Search size={20} />}
                </button>
            </form>
        </div>

        {error && (
             <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg flex items-center mb-6">
                 <AlertTriangle size={24} className="mr-3 shrink-0" /> {error}
             </div>
        )}

        {booking && (
            <div className="glass-card overflow-hidden">
                <div className={`p-4 text-center font-bold uppercase tracking-widest ${booking.status === 'CHECKED_IN' ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'}`}>
                    {booking.status === 'CHECKED_IN' ? 'ALREADY SCANNED' : 'VALID ENTRY'}
                </div>
                
                <div className="p-6 space-y-4">
                     <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                         <div>
                             <div className="text-xs text-gray-400 uppercase">Guest Name</div>
                             <div className="font-bold text-white text-lg">{booking.user.name}</div>
                         </div>
                         <div>
                             <div className="text-xs text-gray-400 uppercase">Contact</div>
                             <div className="font-bold text-white text-lg">{booking.user.phone}</div>
                         </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                         <div>
                             <div className="text-xs text-gray-400 uppercase">Match</div>
                             <div className="font-bold text-white">{booking.matchSession.team1} vs {booking.matchSession.team2}</div>
                         </div>
                         <div>
                             <div className="text-xs text-gray-400 uppercase">Tables Reserved</div>
                             <div className="font-bold text-yellow-400 text-2xl">{booking.tables}</div>
                         </div>
                     </div>

                      <div className="flex items-center justify-between pt-2">
                         <div>
                             <div className="text-xs text-gray-400 uppercase">Payment</div>
                             <div className={`font-bold text-lg ${booking.paymentStatus === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>
                                 {booking.paymentStatus}
                             </div>
                         </div>
                         {booking.paymentStatus === 'PENDING' && (
                             <div className="text-right text-xs text-red-400 max-w-[150px]">
                                 Collect ₹{booking.totalPrice} at counter before entry!
                             </div>
                         )}
                     </div>
                </div>

                {booking.status !== 'CHECKED_IN' && (
                    <div className="p-4 bg-white/5">
                        <button 
                            onClick={handleCheckIn}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 font-bold text-white py-4 rounded flex items-center justify-center transition-all"
                        >
                            <CheckCircle size={20} className="mr-2" /> {loading ? 'Processing...' : 'Mark as Checked In'}
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}
