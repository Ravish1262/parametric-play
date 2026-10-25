import React, { useState, useEffect } from 'react';
import { ResidentialSociety } from '../types';
import { Building2, Users, Dumbbell, Clock, CheckCircle, Package } from 'lucide-react';

export const SocietyPortalPage: React.FC = () => {
  const [societies, setSocieties] = useState<ResidentialSociety[]>([]);

  useEffect(() => {
    fetch('/api/societies')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.societies) {
          setSocieties(data.societies);
        }
      })
      .catch(() => {});
  }, []);

  const soc = societies[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-950 border border-lime-500/40 text-lime-400">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Residential Society Portal</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-2">
            {soc?.society_name || 'Palm Greens Residency RWA'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {soc?.address || 'Golf Course Extension Road'}, {soc?.city || 'Gurugram'}, {soc?.state || 'Delhi NCR'}
          </p>
        </div>

        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 self-start">
          <CheckCircle className="w-4 h-4" />
          <span>Batch Status: Active</span>
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Enrolled Children</span>
          <div className="text-3xl font-heading font-black text-white mt-1">
            {soc?.child_count || 18} Kids
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">✓ Threshold Met (≥ 10 Kids)</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Active Programme</span>
          <div className="text-2xl font-heading font-black text-lime-400 mt-1">
            {soc?.selected_programme || 'Football Coaching'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{soc?.session_duration || '1-hour'} • 3x weekly</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Gross Monthly Billing</span>
          <div className="text-3xl font-heading font-black text-white font-mono mt-1">
            ₹{(soc?.gross_monthly_fee || 36000).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">₹2,000 / child / month</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Assigned Lead Coach</span>
          <div className="text-2xl font-heading font-bold text-white mt-1">
            {soc?.coach_name || 'Rajesh Sharma'}
          </div>
          <span className="text-[10px] text-lime-400 mt-0.5 block">B.P.Ed Verified Coach</span>
        </div>
      </div>

      {/* Equipment Kit Included */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-lime-400" />
          <span>Dedicated Society Sports Equipment Kit</span>
        </h2>
        <p className="text-xs text-slate-300">
          Parametric Play supplies and maintains the following equipment for your society's batch:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-200">
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-850">
            • 15 Training Footballs (Size 4)
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-850">
            • 40 Space Marker Cones
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-850">
            • 2 Portable Mini Goalposts
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-850">
            • First Aid Emergency Kit
          </div>
        </div>
      </div>

    </div>
  );
};
