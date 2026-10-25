import React, { useState } from 'react';
import { 
  School, Building2, Dumbbell, ShieldCheck, MapPin, 
  Users, Calendar, ChevronRight, Award, CheckCircle, 
  Search, ArrowRight, Sparkles, QrCode 
} from 'lucide-react';
import { CoachProfile } from '../types';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenQR: (title: string, amount: number) => void;
  coaches: CoachProfile[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenQR,
  coaches
}) => {
  const [searchPincode, setSearchPincode] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckCoverage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPincode.trim()) return;
    setIsChecking(true);
    try {
      const res = await fetch('/api/city-coverage/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: searchPincode.trim() })
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setSearchResult({
        isAvailable: false,
        message: 'Could not verify coverage at this moment.'
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-6 shadow-lg shadow-lime-500/10">
            <Sparkles className="w-4 h-4 text-lime-400 animate-spin-slow" />
            <span>Pan-India Sports Management Enterprise</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Professional Sports Coaching.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-200 mt-2">
              One Platform. Three Solutions.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Parametric Play manages company-trained coaches for premier schools, gated residential societies, and individual home & online personal fitness clients across India.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('personal-training')}
              className="px-6 py-3.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-lime-500/20 hover:scale-105 transition-all"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Book Personal Training (₹2,000/mo)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('schools')}
              className="px-6 py-3.5 bg-forest-900 hover:bg-forest-850 text-white border border-forest-700 hover:border-lime-500/50 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              <School className="w-4 h-4 text-lime-400" />
              <span>School Partnership Enquiry</span>
            </button>

            <button
              onClick={() => onNavigate('societies')}
              className="px-6 py-3.5 bg-forest-900 hover:bg-forest-850 text-white border border-forest-700 hover:border-lime-500/50 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4 text-lime-400" />
              <span>Register Residential Society</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-forest-900/60 p-4 rounded-2xl border border-forest-800">
              <span className="text-2xl sm:text-3xl font-heading font-black text-lime-400">1:400</span>
              <p className="text-xs text-slate-400 mt-1">Proposed Coach Ratio for Schools (Ceiling Formula)</p>
            </div>
            <div className="bg-forest-900/60 p-4 rounded-2xl border border-forest-800">
              <span className="text-2xl sm:text-3xl font-heading font-black text-lime-400">₹2,000</span>
              <p className="text-xs text-slate-400 mt-1">Monthly Personal Training & Society Fee (Transparent)</p>
            </div>
            <div className="bg-forest-900/60 p-4 rounded-2xl border border-forest-800">
              <span className="text-2xl sm:text-3xl font-heading font-black text-white">100%</span>
              <p className="text-xs text-slate-400 mt-1">Company-Managed & Verified Coaches (No Unvetted Staff)</p>
            </div>
            <div className="bg-forest-900/60 p-4 rounded-2xl border border-forest-800">
              <span className="text-2xl sm:text-3xl font-heading font-black text-white">Pan-India</span>
              <p className="text-xs text-slate-400 mt-1">Expanding across Tier 1 & 2 cities with real coverage checks</p>
            </div>
          </div>

        </div>
      </section>

      {/* THREE INTEGRATED SOLUTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Our Core Business Models</span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-2">
            Three Solutions. One Seamless Sports Ecosystem.
          </h2>
          <p className="text-sm text-slate-300 mt-3">
            Parametric Play owns coach deployment, structured physical curricula, scheduling, equipment, and quality control under one unified standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Vertical 1: School Sports */}
          <div className="bg-forest-900/70 border border-forest-800 rounded-3xl p-7 flex flex-col justify-between hover:border-lime-500/40 transition-all shadow-xl group">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform">
                <School className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Business Model 1</span>
                <h3 className="font-heading font-extrabold text-2xl text-white mt-1">School Sports Management</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-service physical education and sports department outsourcing. Includes PTI coaches, structured Classes 1-8 curriculum, 8-period timetable integration, and inter-house events.
              </p>
              
              <div className="space-y-2 pt-2 text-xs border-t border-forest-800">
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Eligibility Requirement:</strong> Minimum 800 students.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Staffing Model:</strong> 1 Coach per 400 students: Ceiling(Students ÷ 400).</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                  <span>* Standard contract excludes event financing; event funding agreed separately.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-forest-800">
              <button
                onClick={() => onNavigate('schools')}
                className="w-full py-3 bg-forest-800 hover:bg-forest-750 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 group-hover:bg-lime-500 group-hover:text-forest-950 transition-colors"
              >
                <span>Calculate Staffing & Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Vertical 2: Residential Societies */}
          <div className="bg-forest-900/70 border border-forest-800 rounded-3xl p-7 flex flex-col justify-between hover:border-lime-500/40 transition-all shadow-xl group">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Business Model 2</span>
                <h3 className="font-heading font-extrabold text-2xl text-white mt-1">Residential Societies Coaching</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Turn your apartment complex clubhouse or playground into an active sports coaching hub. Conducted after school hours with company-provided coaches and gear.
              </p>

              <div className="space-y-2 pt-2 text-xs border-t border-forest-800">
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Batch Threshold:</strong> Minimum 10 participating children.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Proposed Fee:</strong> ₹2,000 per child / month gross.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Programmes:</strong> Football, Cricket, Badminton, or Kids Fitness.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-forest-800">
              <button
                onClick={() => onNavigate('societies')}
                className="w-full py-3 bg-forest-800 hover:bg-forest-750 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 group-hover:bg-lime-500 group-hover:text-forest-950 transition-colors"
              >
                <span>Register Society Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Vertical 3: Personal Training */}
          <div className="bg-forest-900/70 border border-forest-800 rounded-3xl p-7 flex flex-col justify-between hover:border-lime-500/40 transition-all shadow-xl group">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Business Model 3</span>
                <h3 className="font-heading font-extrabold text-2xl text-white mt-1">Personal Training (Home & Online)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                One-on-one professional fitness coaching delivered at your home or live online. 10 specialized categories including Yoga, Martial Arts, Aerobics, Boxing, and Conditioning.
              </p>

              <div className="space-y-2 pt-2 text-xs border-t border-forest-800">
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Monthly Package:</strong> ₹2,000 per client / month.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Transparent Split:</strong> ₹1,000 coach / ₹1,000 company share.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span><strong>Modes:</strong> Home Visit or Live Online Training.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-forest-800">
              <button
                onClick={() => onNavigate('personal-training')}
                className="w-full py-3 bg-forest-800 hover:bg-forest-750 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 group-hover:bg-lime-500 group-hover:text-forest-950 transition-colors"
              >
                <span>Book Personal Trainer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* PAN-INDIA REAL COVERAGE CHECKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-forest-900 to-forest-950 p-8 sm:p-12 rounded-3xl border border-forest-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Pan-India Availability</span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              Check Verified Coach Coverage in Your City or PIN Code
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              We never fabricate coach availability. Enter your 6-digit PIN code to check if our verified coach network is active in your neighbourhood.
            </p>

            <form onSubmit={handleCheckCoverage} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={searchPincode}
                  onChange={(e) => setSearchPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-Digit PIN Code (e.g. 110001, 560034, 400050)"
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isChecking}
                className="px-6 py-3 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50 shrink-0"
              >
                {isChecking ? 'Checking...' : 'Check Coverage'}
              </button>
            </form>

            {searchResult && (
              <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed max-w-md ${
                searchResult.isAvailable 
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
                  : 'bg-forest-950 border-amber-500/40 text-amber-200'
              }`}>
                <p className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{searchResult.status}: {searchResult.city || 'Location'}</span>
                </p>
                <p className="mt-1 text-slate-300">{searchResult.message}</p>
                {searchResult.isAvailable ? (
                  <button
                    onClick={() => onNavigate('personal-training')}
                    className="mt-2 text-lime-400 underline font-semibold text-xs block"
                  >
                    View Available Coaches in this area →
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('contact')}
                    className="mt-2 text-amber-400 underline font-semibold text-xs block"
                  >
                    Submit location request for priority launch →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VERIFIED COACH SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Our Professional Coaches</span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              Vetted. Certified. Company-Managed.
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Coaches undergo identity verification, certificate audits, and pedagogical training before assignment.
            </p>
          </div>
          <button
            onClick={() => onNavigate('find-coach')}
            className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1"
          >
            <span>View All Verified Coaches</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.slice(0, 3).map((coach) => {
            let sports: string[] = [];
            try {
              sports = JSON.parse(coach.sports_specialisations);
            } catch (e) {
              sports = ['Fitness'];
            }

            return (
              <div key={coach.id} className="bg-forest-900 border border-forest-800 rounded-2xl p-6 hover:border-lime-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lime-500/30 flex items-center justify-center font-bold text-lime-400 text-lg">
                        {coach.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-white">{coach.full_name}</h4>
                        <p className="text-xs text-slate-400">{coach.city}, {coach.state}</p>
                      </div>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-4 line-clamp-2 leading-relaxed">
                    {coach.bio || coach.qualifications}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {sports.map((s, i) => (
                      <span key={i} className="text-[10px] bg-forest-950 border border-forest-800 text-lime-400 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-forest-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Experience</span>
                    <strong className="text-white">{coach.experience_years} Years</strong>
                  </div>
                  <button
                    onClick={() => onNavigate('personal-training')}
                    className="px-3.5 py-1.5 bg-lime-500/15 hover:bg-lime-500 text-lime-400 hover:text-forest-950 border border-lime-500/40 font-bold rounded-lg transition-all"
                  >
                    Book Coach
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QUICK OFFICIAL QR PAYMENT HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Direct Payment Instructions</span>
            <h3 className="font-heading font-black text-2xl text-white">
              Instant UPI Booking & Transparent Verification
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pay via any UPI App (GPay, PhonePe, Paytm, BHIM). Submit your 12-digit transaction UTR for automated status updates and instant admin reconciliation.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-lime-400 bg-forest-950 px-3 py-2 rounded-xl border border-forest-800 w-fit">
              <span>UPI VPA:</span>
              <strong className="text-white">parametricplay@upi</strong>
            </div>
          </div>

          <button
            onClick={() => onOpenQR('Parametric Play Official UPI QR', 2000)}
            className="px-8 py-4 bg-lime-500 hover:bg-lime-400 text-forest-950 font-black rounded-2xl text-sm flex items-center gap-2 shadow-xl shadow-lime-500/20 shrink-0 hover:scale-105 transition-all"
          >
            <QrCode className="w-5 h-5" />
            <span>Open Official Payment QR (₹2,000)</span>
          </button>
        </div>
      </section>

    </div>
  );
};
