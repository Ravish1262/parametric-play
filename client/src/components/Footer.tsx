import React from 'react';
import { Phone, Mail, MapPin, Shield, CheckCircle, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-forest-950 border-t border-forest-800 text-slate-300 pt-16 pb-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-850">
          
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 border border-lime-500/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                PARAMETRIC <span className="text-lime-400">PLAY</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Professional Sports Coaching. One Platform. Three Solutions. Connecting schools, residential societies, and individual clients with verified, company-managed coaches across India.
            </p>

            <div className="space-y-2 text-sm pt-2">
              <div className="flex items-center gap-3 text-slate-200">
                <Phone className="w-4 h-4 text-lime-400 shrink-0" />
                <a href="tel:8102140650" className="hover:text-lime-400 transition-colors">
                  +91 8102140650 (Call / WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <Mail className="w-4 h-4 text-lime-400 shrink-0" />
                <a href="mailto:playparametric@gmail.com" className="hover:text-lime-400 transition-colors">
                  playparametric@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Pan-India Presence: Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, and expanding.</span>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-lime-500 pl-2">
              Three Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('schools')} className="hover:text-lime-400 text-left transition-colors flex items-center gap-1 group">
                  <span>School Sports Management</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('societies')} className="hover:text-lime-400 text-left transition-colors flex items-center gap-1 group">
                  <span>Residential Society Sports</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('personal-training')} className="hover:text-lime-400 text-left transition-colors flex items-center gap-1 group">
                  <span>Home Visit Personal Training</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('personal-training')} className="hover:text-lime-400 text-left transition-colors flex items-center gap-1 group">
                  <span>Online Live Coaching</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('find-coach')} className="hover:text-lime-400 text-left transition-colors flex items-center gap-1 group">
                  <span>Find Verified Coaches</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Coaches & Careers */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-lime-500 pl-2">
              Coaches & Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('become-coach')} className="hover:text-lime-400 text-left transition-colors">
                  Become a Coach (Apply)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-lime-400 text-left transition-colors">
                  Monthly Pricing Models
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-admin')} className="hover:text-lime-400 text-left transition-colors">
                  Administrator Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-coach')} className="hover:text-lime-400 text-left transition-colors">
                  Coach Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-school')} className="hover:text-lime-400 text-left transition-colors">
                  School Proposal Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-society')} className="hover:text-lime-400 text-left transition-colors">
                  Residential Society Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-lime-500 pl-2">
              Compliance & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-lime-400 text-left transition-colors">
                  Privacy Policy (India)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-lime-400 text-left transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund-policy')} className="hover:text-lime-400 text-left transition-colors">
                  Cancellation & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-lime-400 text-left transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-lime-400 text-left transition-colors">
                  Customer Support & Escalations
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Contractual Disclosures (Mandatory compliance) */}
        <div className="py-6 border-b border-forest-900 text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-300">Contractual & Legal Disclosures:</strong> Parametric Play provides company-managed sports coaching and physical education personnel. Outsourced coaching and PTI services do not automatically represent or guarantee official compliance with Central Board of Secondary Education (CBSE), ICSE, or state educational statutory directives. Standard school partnership agreements do not include financing school sports events or functions; any event funding must be contracted separately in writing.
          </p>
          <p>
            Personal training revenue splits (₹1,000 coach allocation / ₹1,000 company share on the standard ₹2,000/month plan) represent gross allocations prior to operational overhead, payment processing, equipment, and statutory taxes.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Parametric Play. All rights reserved. Registered Indian Sports Enterprise.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              Verified Background Checks
            </span>
            <span className="flex items-center gap-1.5 text-lime-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Child Safety Protocol Compliant
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
