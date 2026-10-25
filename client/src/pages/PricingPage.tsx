import React from 'react';
import { Check, ShieldCheck, AlertCircle, ArrowRight, School, Building2, Dumbbell } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (tab: string) => void;
  onOpenQR: (title: string, amount: number) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onOpenQR }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Clear & Transparent Investment</span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight mt-2">
          Pricing for All Three Business Models
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          No hidden fees or unexpected surge charges. Transparent coach allocation and company operational margins across India.
        </p>
      </div>

      {/* 3 PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Model 1: School Sports */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 flex flex-col justify-between hover:border-lime-500/40 transition-all shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Institutional</span>
              <School className="w-5 h-5 text-lime-400" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-white">School Sports Management</h3>
              <p className="text-xs text-slate-300 mt-1">Full sports department outsourcing for schools.</p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400">Proposed Formula:</span>
              <div className="text-3xl font-heading font-black text-white mt-0.5">
                1 Coach / 400 <span className="text-xs text-slate-400 font-normal">Students</span>
              </div>
              <p className="text-[11px] text-lime-400 font-mono mt-1">Ceiling(Students ÷ 400)</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-forest-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span><strong>Min Eligibility:</strong> 800 students</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Classes 1-8 curriculum included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>8-Period timetable integration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Equipment tracking & supply support</span>
              </li>
            </ul>

            <div className="p-3 bg-forest-950 rounded-xl border border-forest-850 text-[10px] text-slate-400 leading-snug">
              * Event management is provided, but <strong>standard fee does not include event financing</strong>. Custom monthly contract pricing configured by Admin.
            </div>
          </div>

          <button
            onClick={() => onNavigate('schools')}
            className="w-full mt-6 py-3 bg-forest-800 hover:bg-lime-500 hover:text-forest-950 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Request School Proposal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Model 2: Residential Societies */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 flex flex-col justify-between hover:border-lime-500/40 transition-all shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Residential RWA</span>
              <Building2 className="w-5 h-5 text-lime-400" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-white">Residential Societies</h3>
              <p className="text-xs text-slate-300 mt-1">Clubhouse & lawn coaching batches for kids.</p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400">Standard Monthly Fee:</span>
              <div className="text-4xl font-heading font-black text-lime-400 mt-0.5">
                ₹2,000 <span className="text-xs text-slate-400 font-normal">/ child / month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">e.g. 10 kids = ₹20,000 gross monthly revenue</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-forest-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span><strong>Min Requirement:</strong> 10 children</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>1-Hour or 2-Hour session options</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Sport-specific batches (Football, Cricket)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>General Kids Fitness fallback</span>
              </li>
            </ul>

            <div className="p-3 bg-forest-950 rounded-xl border border-forest-850 text-[10px] text-slate-400 leading-snug">
              * Gross revenue before coach payouts, gear replenishment, taxes, and refunds. Unconfirmed batches are not charged.
            </div>
          </div>

          <button
            onClick={() => onNavigate('societies')}
            className="w-full mt-6 py-3 bg-forest-800 hover:bg-lime-500 hover:text-forest-950 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Register Society Batch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Model 3: Personal Training */}
        <div className="bg-forest-900 border-2 border-lime-500/60 rounded-3xl p-7 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-500 text-forest-950 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-md">
            Most Popular 1-on-1
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">1-on-1 Personal</span>
              <Dumbbell className="w-5 h-5 text-lime-400" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-white">Personal Training</h3>
              <p className="text-xs text-slate-300 mt-1">Home visits or live interactive online training.</p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400">Standard Monthly Fee:</span>
              <div className="text-4xl font-heading font-black text-lime-400 mt-0.5">
                ₹2,000 <span className="text-xs text-slate-400 font-normal">/ client / month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Split: ₹1,000 Coach / ₹1,000 Company Share</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-forest-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>10 Specialized categories (Yoga, Martial Arts)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Home Visit in serviced cities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Online HD Live Coaching across India</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Overlapping bookings blocked</span>
              </li>
            </ul>

            <div className="p-3 bg-forest-950 rounded-xl border border-forest-850 text-[10px] text-slate-400 leading-snug">
              * Company share of ₹1,000 is gross revenue before operational overhead, insurance, taxes, and transaction fees.
            </div>
          </div>

          <button
            onClick={() => onOpenQR('Personal Training Package', 2000)}
            className="w-full mt-6 py-3 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-lime-500/20"
          >
            <span>Book & Pay ₹2,000 via UPI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
