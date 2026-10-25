import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does Parametric Play provide its own coaches or is it a marketplace?',
      a: 'Parametric Play provides its own company-managed coaches for all three business verticals (schools, residential societies, and personal training). We handle coach vetting, background audits, curriculum training, scheduling, and payments.'
    },
    {
      q: 'What is the eligibility requirement and staffing ratio for schools?',
      a: 'Standard school sports partnerships require a minimum eligibility of 800 enrolled students. Our recommended staffing formula is 1 PTI / Sports Coach for every 400 students, calculated as Ceiling(Total Students ÷ 400). For example, 1,000 students = 3 coaches; 1,600 students = 4 coaches.'
    },
    {
      q: 'Does the school agreement include financing school sports day events?',
      a: 'No. Parametric Play plans, coordinates, and directs school sports functions and sports days, but our standard service does not include financing or funding those events. Any event funding must be contracted separately in writing.'
    },
    {
      q: 'What is the minimum enrolment requirement for residential societies?',
      a: 'Residential society sports and kids fitness batches require a minimum enrolment of 10 participating children to launch. If fewer than 10 children register, the programme is marked as "Minimum Enrolment Pending".'
    },
    {
      q: 'What is the pricing and revenue split for personal training?',
      a: 'The standard personal training package is ₹2,000 per client per month. The revenue split allocates ₹1,000 to the coach for the paid client-month, and ₹1,000 to Parametric Play as gross company share before operating overhead, insurance, taxes, and transaction costs.'
    },
    {
      q: 'How does payment verification work when paying via UPI QR?',
      a: 'When you scan our official UPI QR or generated booking QR, you pay directly through GPay, PhonePe, Paytm, or BHIM. After paying, you submit your 12-digit UPI UTR reference number. To prevent spoofing, bookings are confirmed only after bank verification.'
    },
    {
      q: 'What sports categories are available for 1-on-1 personal training?',
      a: 'We offer 10 standard categories: Aerobics, Yoga, Fitness Training, Gym Training, Strength and Conditioning, Karate, Judo, Taekwondo, Boxing, and Martial Arts. Clients can select either Home Visit or live Online video training.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Frequently Asked Questions</span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mt-2">
          Everything You Need to Know About Parametric Play
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-3">
          Find clear, transparent answers regarding our business models, ratios, pricing, and operations.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-forest-900 border border-forest-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-lime-400 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-lime-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-forest-850 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
