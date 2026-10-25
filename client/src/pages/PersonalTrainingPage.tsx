import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Home, Video, MapPin, CheckCircle, Clock, 
  Calendar, ShieldCheck, ArrowRight, UserCheck, AlertCircle, QrCode 
} from 'lucide-react';
import { PersonalTrainingCategory, CoachProfile } from '../types';

interface PersonalTrainingPageProps {
  onOpenQR: (title: string, amount: number, bookingCode: string, bookingId?: number) => void;
  coaches: CoachProfile[];
}

export const PersonalTrainingPage: React.FC<PersonalTrainingPageProps> = ({
  onOpenQR,
  coaches
}) => {
  const [categories, setCategories] = useState<PersonalTrainingCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Fitness Training');
  const [trainingMode, setTrainingMode] = useState<'Home Visit' | 'Online'>('Home Visit');
  
  // Booking modal/form state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [address, setAddress] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Morning 7:00 AM - 8:00 AM');
  const [sessionDate, setSessionDate] = useState('2026-11-01');
  const [bookingNotes, setBookingNotes] = useState('');

  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/personal-training/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !city) {
      setBookingError('Please enter your full name, 10-digit mobile number, and city.');
      return;
    }

    setBookingSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          serviceType: `Personal Training ${trainingMode}`,
          categoryName: selectedCategory,
          trainingMode,
          address: trainingMode === 'Home Visit' ? address : 'Online Video Call',
          city,
          pincode,
          preferredSlot,
          sessionDate,
          notes: bookingNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
        // Automatically open QR modal with the real booking ID and Code
        onOpenQR(
          `Personal Training: ${selectedCategory} (${trainingMode})`,
          data.monthlyPrice || 2000,
          data.bookingCode,
          data.bookingId
        );
      } else {
        setBookingError(data.error || 'Failed to create booking');
      }
    } catch (err: any) {
      setBookingError('Error creating booking: ' + err.message);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Business Model 3: Personal Training at Home & Online</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Elite 1-on-1 Fitness & Sports Coaching
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          Get personal training tailored to your fitness objectives. Choose between home visits by certified company coaches or live interactive online sessions from anywhere in India.
        </p>
      </div>

      {/* TRAINING MODES SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mode 1: Home Visit */}
        <div 
          onClick={() => setTrainingMode('Home Visit')}
          className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
            trainingMode === 'Home Visit'
              ? 'bg-forest-900 border-lime-500 shadow-xl shadow-lime-500/10 ring-2 ring-lime-400/40'
              : 'bg-forest-950/80 border-forest-800 hover:border-forest-700'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
                <Home className="w-6 h-6" />
              </div>
              {trainingMode === 'Home Visit' && (
                <span className="text-xs bg-lime-500 text-forest-950 font-bold px-2.5 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-white">Home Visit Training</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                A verified, background-checked coach travels to your home or society gym. Perfect for posture guidance, hands-on martial arts, and personal accountability.
              </p>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-forest-800">
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Private address collected securely; never published publicly</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Coach assigned based on service area coverage</span>
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-forest-800 flex items-center justify-between text-xs">
            <span className="text-lime-400 font-bold">Standard Fee: ₹2,000 / month</span>
            <span className="text-slate-400">1-Hour Sessions</span>
          </div>
        </div>

        {/* Mode 2: Online Live Training */}
        <div 
          onClick={() => setTrainingMode('Online')}
          className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
            trainingMode === 'Online'
              ? 'bg-forest-900 border-lime-500 shadow-xl shadow-lime-500/10 ring-2 ring-lime-400/40'
              : 'bg-forest-950/80 border-forest-800 hover:border-forest-700'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
                <Video className="w-6 h-6" />
              </div>
              {trainingMode === 'Online' && (
                <span className="text-xs bg-lime-500 text-forest-950 font-bold px-2.5 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-white">Online Live Training</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Connect 1-on-1 with senior coaches across India via live HD video link. Ideal for Yoga, Aerobics, and Conditioning from the comfort of your living room or during travel.
              </p>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-forest-800">
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Dedicated video meeting room generated upon confirmation</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Full Pan-India availability with zero geographic constraints</span>
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-forest-800 flex items-center justify-between text-xs">
            <span className="text-lime-400 font-bold">Standard Fee: ₹2,000 / month</span>
            <span className="text-slate-400">1-Hour Sessions</span>
          </div>
        </div>

      </div>

      {/* 10 PERSONAL TRAINING CATEGORIES */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">10 Coaching Categories</span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              Select Your Fitness or Martial Arts Discipline
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Choose from our 10 standard categories. All packages follow our transparent ₹2,000 monthly rate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setIsBookingOpen(true);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-forest-900 border-lime-400 ring-2 ring-lime-400/40 shadow-lg'
                    : 'bg-forest-950/70 border-forest-800 hover:border-forest-700 hover:bg-forest-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">{cat.duration_minutes} Mins</span>
                    <span className="text-xs font-mono font-bold text-white">₹{cat.monthly_price}</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-white">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-snug">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-forest-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{cat.age_groups}</span>
                  <button
                    type="button"
                    className="text-xs font-bold text-lime-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MONTHLY PRICING & REVENUE SPLIT BREAKDOWN */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Transparent Economics</span>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Standard ₹2,000 Monthly Package & Revenue Allocation
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Parametric Play operates on a clear, ethical 50/50 gross revenue allocation model per paid client-month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
              <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Item Breakdown</th>
                  <th className="p-3 text-right">1 Active Client</th>
                  <th className="p-3 text-right">10 Active Clients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-850">
                <tr>
                  <td className="p-3 font-semibold text-white">Customer Payment</td>
                  <td className="p-3 text-right font-mono font-bold text-white">₹2,000</td>
                  <td className="p-3 text-right font-mono font-bold text-white">₹20,000</td>
                </tr>
                <tr className="bg-forest-850/50">
                  <td className="p-3 font-semibold text-lime-400">Coach Allocation</td>
                  <td className="p-3 text-right font-mono font-bold text-lime-400">₹1,000</td>
                  <td className="p-3 text-right font-mono font-bold text-lime-400">₹10,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-200">Parametric Play Gross Allocation</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-200">₹1,000</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-200">₹10,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal / Financial Note */}
          <div className="p-5 bg-forest-950 rounded-2xl border border-forest-750 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Mandatory Disclosure on Financial Splits:</span>
            </p>
            <p className="text-[11px] text-slate-400">
              The company's ₹1,000 allocation represents the <strong>gross company share before expenses</strong>, not guaranteed net profit. Operating costs such as payment gateway transaction fees, customer support, coach insurance, marketing, and taxes are deducted from the company allocation.
            </p>
            <p className="text-[11px] text-slate-400">
              The ₹2,000 package covers the agreed monthly session cadence (typically 12 sessions/month). Double bookings and overlapping sessions for the same coach are blocked by the system.
            </p>
          </div>

        </div>
      </div>

      {/* BOOKING FORM MODAL / SECTION */}
      {isBookingOpen && (
        <div id="booking-section" className="bg-gradient-to-br from-forest-900 to-forest-950 border-2 border-lime-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-forest-800 pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Step-by-Step Checkout</span>
              <h3 className="font-heading font-black text-2xl text-white mt-0.5">
                Book {selectedCategory} ({trainingMode})
              </h3>
            </div>
            <button
              onClick={() => setIsBookingOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-forest-800 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateBooking} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Singhania"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">10-Digit Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="amit@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time Slot *</label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value="Morning 6:00 AM - 7:00 AM">Morning 6:00 AM - 7:00 AM</option>
                  <option value="Morning 7:00 AM - 8:00 AM">Morning 7:00 AM - 8:00 AM</option>
                  <option value="Morning 8:00 AM - 9:00 AM">Morning 8:00 AM - 9:00 AM</option>
                  <option value="Evening 5:00 PM - 6:00 PM">Evening 5:00 PM - 6:00 PM</option>
                  <option value="Evening 6:00 PM - 7:00 PM">Evening 6:00 PM - 7:00 PM</option>
                  <option value="Evening 7:00 PM - 8:00 PM">Evening 7:00 PM - 8:00 PM</option>
                </select>
              </div>
            </div>

            {trainingMode === 'Home Visit' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Home Visit Address / Apartment Details *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat No, Tower, Society Name, Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  * Address is stored securely and disclosed only to your assigned coach after payment verification.
                </p>
              </div>
            )}

            {/* Total Due & Proceed */}
            <div className="p-4 bg-forest-950 rounded-2xl border border-forest-750 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">Total Monthly Investment:</span>
                <div className="text-3xl font-heading font-black text-lime-400">
                  ₹2,000 <span className="text-xs text-slate-400 font-normal">/ month (All-inclusive)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingSubmitting}
                className="px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm shadow-xl shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                <span>{bookingSubmitting ? 'Creating Booking...' : 'Proceed to UPI Payment QR'}</span>
              </button>
            </div>

            {bookingError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800">
                {bookingError}
              </p>
            )}

          </form>
        </div>
      )}

    </div>
  );
};
