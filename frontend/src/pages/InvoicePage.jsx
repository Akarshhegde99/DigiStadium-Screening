import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { ArrowLeft, Printer } from 'lucide-react';

export default function InvoicePage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Failed to fetch booking", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading Invoice...</div>;
  if (!booking) return <div className="text-center py-20 text-red-500">Invoice Not Found</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 text-black print:text-black">
        <div className="flex justify-between items-center mb-6 print:hidden">
            <Link to="/" className="text-gray-400 hover:text-white flex items-center">
                <ArrowLeft size={16} className="mr-1" /> Back
            </Link>
            <button onClick={handlePrint} className="bg-hcRed hover:bg-red-700 text-white px-4 py-2 rounded flex items-center text-sm font-medium transition-colors">
                <Printer size={16} className="mr-2" /> Print Invoice
            </button>
        </div>

        <div className="bg-white rounded-lg p-8 md:p-12 shadow-2xl print:shadow-none print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent">Harvey's Cafe</h1>
                    <p className="text-gray-500 text-sm mt-1">Cricket Screening Pass</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice / Booking ID</div>
                    <div className="font-mono text-gray-800">{booking.id}</div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</div>
                    <div className="font-bold text-gray-800 text-lg">{booking.user.name}</div>
                    <div className="text-gray-600">{booking.user.phone}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Match Details</div>
                    <div className="font-bold text-gray-800 text-lg">{booking.matchSession.team1} vs {booking.matchSession.team2}</div>
                    <div className="text-gray-600">{new Date(booking.matchSession.matchDate).toLocaleDateString()}</div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="py-3 text-left text-sm font-bold text-gray-600 uppercase">Description</th>
                        <th className="py-3 text-center text-sm font-bold text-gray-600 uppercase">Qty</th>
                        <th className="py-3 text-right text-sm font-bold text-gray-600 uppercase">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 text-gray-800 font-medium">Table Combo Reservation</td>
                        <td className="py-4 text-center text-gray-600">{booking.tables}</td>
                        <td className="py-4 text-right text-gray-800 font-medium">₹{booking.totalPrice}</td>
                    </tr>
                </tbody>
            </table>

            {/* Totals & Status */}
            <div className="flex justify-between items-end border-t-2 border-gray-800 pt-4">
                <div>
                     <div className="mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Payment Status:</span>
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.paymentStatus}
                        </span>
                    </div>
                    {/* Add a fake QR if required, or actual QR */}
                    <img src={booking.qrCodeData} alt="QR Code" className="w-24 h-24 print:w-32 print:h-32 mt-4" />
                </div>
                <div className="text-right">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Total Paid</span>
                    <span className="text-4xl font-extrabold text-red-600">₹{booking.totalPrice}</span>
                </div>
            </div>
            
        </div>
    </div>
  );
}
