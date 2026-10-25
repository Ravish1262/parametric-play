import React, { useState } from 'react';
import { 
  Building2, Users, Clock, Dumbbell, CheckCircle, 
  AlertTriangle, Calculator, Sparkles, Send, ShieldCheck, ArrowRight 
} from 'lucide-react';

export const ResidentialSocietiesPage: React.FC = () => {
  // Calculator state
  const [calcKids, setCalcKids] = useState<number>(14);
  const [sessionDuration, setSessionDuration] = useState<'1-hour' | '2-hour'>('1-hour');

  // Form state
  const [formData, setFormData] = useState({
    societyName: '',
    address: '',
    state: 'Delhi NCR',
    city: 'Gurugram',
    pincode: '122011',
    contactName: '',
    phone: '',
    email: '',
    selectedProgramme: 'Football Coaching Batch',
    childCount: 12,
    ageRange: '6-14 Years',
    sessionDuration: '1-hour',
    sessionsPerWeek: 3
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Business calculations
  const feePerChild = 2000;
  const grossMonthlyFee = calcKids * feePerChild;
  const meetsMin10 = calcKids >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.societyName || !formData.phone || !formData.email) {
      setError('Please provide residential society name, contact phone, and email.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/societies/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedResult(data);
      } else {
        setError(data.error || 'Failed to submit registration');
      }
    } catch (err: any) {
      setError('Error submitting form: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Title */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <Building2 className="w-3.5 h-3.5" />
          <span>Business Model 2: Residential Societies & RWAs</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Active Sports & Kids Fitness Coaching Inside Your Gated Society
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          Parametric Play brings company-managed sports coaches, safety gear, and structured batch curriculums right to your society's clubhouse, lawn, or sports court.
        </p>
      </div>

      {/* MINIMUM 10 PARTICIPANTS & PRICING CALCULATOR */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 p-6 sm:p-10 rounded-3xl border border-forest-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Programme Pricing & Threshold Calculator
            </span>
            <h2 className="font-heading font-bold text-2xl text-white">
              Standard Fee: ₹2,000 / Child / Month
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard residential society programmes require a minimum enrolment of <strong>10 participating children</strong> to launch.
            </p>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Simulate Enrolled Children: <strong className="text-lime-400 text-sm font-mono">{calcKids} Children</strong>
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={calcKids}
                onChange={(e) => setCalcKids(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer h-2 bg-forest-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 Kids</span>
                <span className="text-amber-400 font-bold">10 Kids (Launch Minimum)</span>
                <span>25 Kids</span>
                <span>40 Kids</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-400">Session Duration:</span>
              <button
                type="button"
                onClick={() => setSessionDuration('1-hour')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sessionDuration === '1-hour'
                    ? 'bg-lime-500 text-forest-950 shadow-sm'
                    : 'bg-forest-950 text-slate-300 border border-forest-700'
                }`}
              >
                1-Hour Sessions
              </button>
              <button
                type="button"
                onClick={() => setSessionDuration('2-hour')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sessionDuration === '2-hour'
                    ? 'bg-lime-500 text-forest-950 shadow-sm'
                    : 'bg-forest-950 text-slate-300 border border-forest-700'
                }`}
              >
                2-Hour Sessions
              </button>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-forest-950 p-6 sm:p-8 rounded-2xl border border-lime-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Monthly Gross Programme Revenue</span>
                <span className="text-xs font-mono text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full border border-lime-500/30">
                  {sessionDuration} Batch
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-heading font-black text-lime-400">
                  ₹{grossMonthlyFee.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {calcKids} Children × ₹2,000 = ₹{grossMonthlyFee.toLocaleString('en-IN')} gross monthly collection
                </p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  * Gross programme revenue before coach payout, equipment logistics, operating expenses, and statutory taxes.
                </p>
              </div>

              {/* Threshold Status */}
              {meetsMin10 ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Ready for Batch Launch Review</strong>
                    <span>With {calcKids} children registered (≥ 10 threshold), Parametric Play will assign a dedicated coach and equipment kit.</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-950/60 border border-amber-600/50 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Minimum Enrolment Not Reached ({calcKids}/10 Kids)</strong>
                    <span>The standard programme requires at least 10 registered participants to launch. Requires {10 - calcKids} more child signups or manual administrator approval.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SPORTS-SPECIFIC VS KIDS FITNESS PROGRAMME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Sports Specific Batches */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            Sports-Specific Coaching Batches
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            When at least 10 children register for a single sport, we launch a dedicated sport batch with specialized drills and match simulation:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
            <span className="p-2 bg-forest-950 rounded-lg border border-forest-800">• Football Coaching</span>
            <span className="p-2 bg-forest-950 rounded-lg border border-forest-800">• Basketball Academy</span>
            <span className="p-2 bg-forest-950 rounded-lg border border-forest-800">• Cricket Skills</span>
            <span className="p-2 bg-forest-950 rounded-lg border border-forest-800">• Badminton Training</span>
            <span className="p-2 bg-forest-950 rounded-lg border border-forest-800">• Martial Arts / Karate</span>
            <span className="p-2 bg-forest-950 rounded-lg border border-forest-800">• Skating & Athletics</span>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * Batches operate 3 to 5 days weekly based on society RWA approvals.
          </p>
        </div>

        {/* Kids Fitness Programme */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            General Kids Fitness Programme
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If a single sport does not meet the 10-child threshold, societies can combine children into an energetic multi-activity fitness program:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Age-appropriate agility ladders, coordination discs, and hurdles.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Flexibility exercises, core balance, and motor-skill progression.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Fun interactive team games fostering sportsmanship and active screen-free habits.</span>
            </li>
          </ul>
          <p className="text-[11px] text-slate-400">
            * Note: General fitness is non-medical physical play and does not represent therapeutic treatment.
          </p>
        </div>

      </div>

      {/* FORM: REGISTER RESIDENTIAL SOCIETY */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Society RWA Registration</span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Register Your Society & Request Batch Launch
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Submit your society details. If you meet the 10-child threshold, our operations team will inspect your court/lawn and assign a coach.
          </p>
        </div>

        {submittedResult ? (
          <div className="bg-forest-950 border border-emerald-500/50 p-6 sm:p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-7 h-7 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Society Registered Successfully!</h3>
                <p className="text-xs text-slate-300">Reference: SOC-{submittedResult.societyId}</p>
              </div>
            </div>

            <div className="p-4 bg-forest-900 rounded-xl border border-forest-800 space-y-2 text-xs">
              <p className="text-slate-200">
                <strong>Registered Strength:</strong> {submittedResult.calculation.childCount} Children
              </p>
              <p className="text-slate-200">
                <strong>Gross Monthly Fee:</strong> ₹{submittedResult.calculation.grossMonthlyFee.toLocaleString('en-IN')} (₹2,000 / child)
              </p>
              <div className={`p-3 rounded-lg text-xs font-semibold ${
                submittedResult.calculation.meetsMinEnrolment
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
                  : 'bg-amber-900/40 text-amber-300 border border-amber-700/50'
              }`}>
                {submittedResult.calculation.statusMessage}
              </div>
            </div>

            <button
              onClick={() => setSubmittedResult(null)}
              className="px-5 py-2.5 bg-forest-800 hover:bg-forest-750 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Register Another Society Batch
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Society / Apartment Complex Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Greens Residency RWA"
                  value={formData.societyName}
                  onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Locality & Address *</label>
                <input
                  type="text"
                  placeholder="Sector / Road, Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">RWA / Committee Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. S. Kapoor"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">10-Digit Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9822334455"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="manager@palmgreens.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Children * <span className="text-[10px] text-lime-400">(Min: 10)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.childCount}
                  onChange={(e) => setFormData({ ...formData, childCount: Number(e.target.value) })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Sports Programme</label>
                <select
                  value={formData.selectedProgramme}
                  onChange={(e) => setFormData({ ...formData, selectedProgramme: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value="Football Coaching Batch">Football Coaching Batch</option>
                  <option value="Basketball Coaching Batch">Basketball Coaching Batch</option>
                  <option value="Cricket Academy Batch">Cricket Academy Batch</option>
                  <option value="Kids Fitness Programme">Kids Fitness Programme (Multi-sport)</option>
                  <option value="Badminton Coaching">Badminton Coaching</option>
                  <option value="Martial Arts / Karate">Martial Arts / Karate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Duration</label>
                <select
                  value={formData.sessionDuration}
                  onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value="1-hour">1-Hour Session (Standard)</option>
                  <option value="2-hour">2-Hour Intensive Session</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Frequency</label>
                <select
                  value={formData.sessionsPerWeek}
                  onChange={(e) => setFormData({ ...formData, sessionsPerWeek: Number(e.target.value) })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value={3}>3 Days / Week (Mon/Wed/Fri or Tue/Thu/Sat)</option>
                  <option value={4}>4 Days / Week</option>
                  <option value={5}>5 Days / Week</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div className="p-4 bg-forest-950 rounded-2xl border border-forest-750 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400">Monthly Revenue Preview:</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {formData.childCount} Children × ₹2,000 = <strong className="text-lime-400 font-mono">₹{(formData.childCount * 2000).toLocaleString('en-IN')} / month gross</strong>
                </p>
                {formData.childCount < 10 ? (
                  <span className="text-[11px] text-amber-400 block mt-0.5">
                    * Minimum enrolment threshold is 10 children. Programme will be marked as "Minimum Enrolment Pending".
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 block mt-0.5">
                    ✓ Meets minimum 10 children requirement to qualify for batch launch.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm shadow-xl shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Registering...' : 'Register Society Batch'}</span>
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800">
                {error}
              </p>
            )}

          </form>
        )}
      </div>

    </div>
  );
};
