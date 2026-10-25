import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { User, Calendar, Clock, Video, Home, ShieldCheck, QrCode, ArrowRight } from 'lucide-react';

interface CustomerDashboardProps {
  onOpenQR: (title: string, amount: number, bookingCode: string, bookingId?: number) => void;
  onNavigate: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onOpenQR, onNavigate }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Welcome */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Customer & Parent Portal</span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Welcome, {currentUser?.name || 'Customer'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Track your personal training bookings, coach assignments, and online video meeting links.
          </p>
        </div>

        <button
          onClick={() => onNavigate('personal-training')}
          className="px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-lime-500/15 shrink-0 self-start sm:self-auto"
        >
          <span>Book New Training Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-white">Your Active & Past Bookings</h2>

        {bookings.length === 0 ? (
          <div className="bg-forest-900 border border-forest-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            No bookings found yet. Click "Book New Training Session" to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className="bg-forest-900 border border-forest-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-lime-400 bg-forest-950 px-2.5 py-1 rounded-lg border border-forest-800">
                      {b.booking_code}
                    </span>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.status === 'Confirmed' || b.status === 'Coach Assigned'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : b.status === 'Payment Pending Verification'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-forest-950 text-slate-400 border border-forest-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">{b.category_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      {b.training_mode === 'Online' ? <Video className="w-3.5 h-3.5 text-lime-400" /> : <Home className="w-3.5 h-3.5 text-lime-400" />}
                      <span>{b.training_mode} Coaching • {b.city}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-forest-950 rounded-xl border border-forest-850 space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.preferred_slot || 'Morning 7:00 AM - 8:00 AM'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Assigned Coach: <strong className="text-white">{b.coach_name || 'Coach to be assigned shortly'}</strong></span>
                    </p>
                    {b.utr_transaction_ref && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        UTR Ref: {b.utr_transaction_ref}
                      </p>
                    )}
                  </div>

                  {/* Video Link if Online and confirmed */}
                  {b.video_meeting_link && (
                    <a
                      href={b.video_meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live Video Coaching Room</span>
                    </a>
                  )}
                </div>

                {/* Bottom status & action */}
                <div className="pt-4 border-t border-forest-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">₹{b.monthly_price} / month</span>
                  {b.payment_status === 'pending' && (
                    <button
                      onClick={() => onOpenQR(`Payment for ${b.booking_code}`, b.monthly_price, b.booking_code, b.id)}
                      className="px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pay via UPI QR</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
