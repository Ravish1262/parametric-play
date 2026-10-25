import React from 'react';
import { Shield, Target, Users, Award, MapPin, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>About Parametric Play</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Pioneering Sports Technology & Company-Managed Coaching Across India
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          Parametric Play is founded on a singular conviction: structured physical education and athletic development in India should be professional, certified, transparently priced, and accessible to everyone.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Our Mission</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To provide unified athletic management that integrates school physical education curricula, residential society sports hubs, and personalized 1-on-1 coaching under one rigorous company quality standard.
          </p>
        </div>

        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Vetted Coaches Only</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We do not operate an open marketplace for unvetted gig workers. Every Parametric Play coach is interviewed, background-audited, qualified in physical education or martial arts, and continuously evaluated.
          </p>
        </div>

        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Transparent Economics</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We ensure our coaches earn fair, dignified compensations (₹1,000 per active client-month in personal training) while institutional clients receive accountable, audited operational reporting.
          </p>
        </div>
      </div>

      {/* Child Safety Commitment */}
      <div className="bg-forest-900/60 border border-forest-800 rounded-3xl p-8 space-y-4">
        <h3 className="font-heading font-bold text-2xl text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-lime-400" />
          Child Safety, Parent Consent & Safeguarding Standards
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Because our coaches interact closely with school students and residential society children, Parametric Play adheres to strict child safeguarding protocols:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
          <div className="p-4 bg-forest-950 rounded-xl border border-forest-850">
            <strong className="text-white block mb-1">Police & Identity Verification:</strong>
            Govt ID proofs, permanent address verification, and qualification audits for all coaches.
          </div>
          <div className="p-4 bg-forest-950 rounded-xl border border-forest-850">
            <strong className="text-white block mb-1">Parental Consent Workflows:</strong>
            Explicit guardian consent required for children under 18 participating in society batches or personal training.
          </div>
          <div className="p-4 bg-forest-950 rounded-xl border border-forest-850">
            <strong className="text-white block mb-1">No Unsupervised Closed Sessions:</strong>
            Residential society batches operate in community-visible lawns/clubhouses; home visits require a parent/guardian present on premises.
          </div>
          <div className="p-4 bg-forest-950 rounded-xl border border-forest-850">
            <strong className="text-white block mb-1">First Aid & Injury Response:</strong>
            Standard emergency medical kits, incident logging, and designated hospital escalation contacts.
          </div>
        </div>
      </div>

    </div>
  );
};
