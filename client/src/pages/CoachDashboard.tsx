import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { 
  UserCheck, Calendar, Clock, DollarSign, ShieldCheck, 
  MapPin, CheckCircle, Video, Home 
} from 'lucide-react';

export const CoachDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [assignedBookings, setAssignedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.bookings) {
          // Coach Rajesh Sharma demo
          setAssignedBookings(data.bookings.filter((b: Booking) => b.coach_id === 1 || b.coach_id === 2 || b.status === 'Confirmed'));
        }
      })
      .catch(() => {});
  }, []);

  const totalEarnings = assignedBookings.length * 1000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Profile Banner */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-950 border border-lime-500/40 text-lime-400">
              <UserCheck className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Coach Portal</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-2">
            {currentUser?.name || 'Coach Rajesh Sharma'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            B.P.Ed (LNIPE), NSNIS Fitness Specialist • Assigned Region: Delhi NCR
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Profile Status: Verified</span>
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Assigned Active Clients</span>
          <div className="text-3xl font-heading font-black text-white mt-1">
            {assignedBookings.length} Clients
          </div>
          <span className="text-[10px] text-lime-400 mt-0.5 block">12 Sessions / Month Cadence</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-lime-400 block font-semibold">Monthly Earned Allocation</span>
          <div className="text-3xl font-heading font-black text-lime-400 mt-1">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">₹1,000 per confirmed client-month</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Performance Rating</span>
          <div className="text-3xl font-heading font-black text-white mt-1">
            4.95 ★
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">100% On-time Arrival Rate</span>
        </div>
      </div>

      {/* Scheduled Sessions */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-4">
        <h2 className="font-heading font-bold text-xl text-white">Your Assigned Clients & Training Schedule</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
            <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Client Name</th>
                <th className="p-3">Category & Mode</th>
                <th className="p-3">Time Slot</th>
                <th className="p-3">Service Address</th>
                <th className="p-3 text-right">Coach Share</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850">
              {assignedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-forest-850/50">
                  <td className="p-3">
                    <div className="font-bold text-white text-sm">{b.customer_name}</div>
                    <span className="text-[10px] text-slate-400">{b.customer_phone}</span>
                  </td>
                  <td className="p-3 text-slate-200">
                    <div className="font-semibold">{b.category_name}</div>
                    <span className="text-[10px] text-lime-400">{b.training_mode}</span>
                  </td>
                  <td className="p-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.preferred_slot}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] max-w-xs">
                    {b.address || 'Online Session Link'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-lime-400">
                    ₹1,000 / mo
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
