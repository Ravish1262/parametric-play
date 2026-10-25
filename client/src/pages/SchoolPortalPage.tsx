import React, { useState, useEffect } from 'react';
import { SchoolEnquiry } from '../types';
import { School, Users, Award, Calendar, Printer, CheckCircle } from 'lucide-react';

interface SchoolPortalPageProps {
  onViewProposal: (school: SchoolEnquiry) => void;
}

export const SchoolPortalPage: React.FC<SchoolPortalPageProps> = ({ onViewProposal }) => {
  const [schools, setSchools] = useState<SchoolEnquiry[]>([]);

  useEffect(() => {
    fetch('/api/schools')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.schools) {
          setSchools(data.schools);
        }
      })
      .catch(() => {});
  }, []);

  const school = schools[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-950 border border-lime-500/40 text-lime-400">
              <School className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Institutional School Portal</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-2">
            {school?.school_name || 'St. Xavier Global Academy'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Affiliated Board: {school?.school_board || 'CBSE'} • Campus: {school?.city || 'Noida'}, {school?.state || 'Delhi NCR'}
          </p>
        </div>

        {school && (
          <button
            onClick={() => onViewProposal(school)}
            className="px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-lime-500/15"
          >
            <Printer className="w-4 h-4" />
            <span>Download Official Proposal PDF</span>
          </button>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Total Enrolled Strength</span>
          <div className="text-3xl font-heading font-black text-white mt-1">
            {school?.total_students || 1600}
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">✓ Meets 800+ Threshold</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Staffing Allocation</span>
          <div className="text-3xl font-heading font-black text-lime-400 mt-1">
            {school?.proposed_coach_count || 4} Coaches
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Ratio: 1 Coach per 400 Students</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Curriculum Span</span>
          <div className="text-3xl font-heading font-black text-white mt-1">
            Classes 1 - 8
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Periods 1 through 8</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-xs text-slate-400 block">Partnership Status</span>
          <div className="text-2xl font-heading font-bold text-emerald-400 mt-1">
            {school?.status || 'Active'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Contract Active</span>
        </div>
      </div>

      {/* Curriculum & Weekly Schedule Details */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-xl text-white">Curriculum Plan & Sports Timetable Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-4 bg-forest-950 rounded-2xl border border-forest-850 space-y-2">
            <h4 className="font-bold text-lime-400 text-sm">Primary Wing (Classes 1 to 4)</h4>
            <p>• Fundamental Movement Skills (FMS), Hand-eye motor coordination, Agility runs.</p>
            <p>• Posture conditioning, rhythmic aerobics, cooperative team games, and warm-up habits.</p>
            <p>• Term-wise participation and motor skill progression records.</p>
          </div>

          <div className="p-4 bg-forest-950 rounded-2xl border border-forest-850 space-y-2">
            <h4 className="font-bold text-lime-400 text-sm">Middle Wing (Classes 5 to 8)</h4>
            <p>• Tactical coaching: Football, Basketball, Cricket, Athletics, Kho-Kho, Kabaddi, and Yoga.</p>
            <p>• Inter-house sports tournament readiness and athletic stamina conditioning.</p>
            <p>• Annual sports day event planning and student performance reports.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
