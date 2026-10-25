import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'General Enquiry',
    city: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact & Support</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Get in Touch with Parametric Play
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          Have an enquiry about school sports management, residential society batches, or home personal training? Our team responds within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Details Card */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-8 space-y-6">
          <h3 className="font-heading font-bold text-xl text-white">Company Information</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Phone & WhatsApp:</span>
                <a href="tel:8102140650" className="text-white font-bold text-sm hover:text-lime-400 transition-colors">
                  +91 8102140650
                </a>
                <span className="text-[10px] text-slate-500 block">Mon - Sat: 7:00 AM - 8:00 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Official Support Email:</span>
                <a href="mailto:playparametric@gmail.com" className="text-white font-bold text-sm hover:text-lime-400 transition-colors">
                  playparametric@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block">Headquarters & Coverage:</span>
                <p className="text-slate-200 mt-0.5">
                  Parametric Play Sports Management Pvt. Ltd.<br />
                  Operating in Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, and expanding Pan-India.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-forest-950 rounded-2xl border border-forest-850 text-[11px] text-slate-400 space-y-1">
            <strong className="text-slate-300 block">Priority Escalations:</strong>
            <p>For urgent school curriculum coordination or payment verification support, message our official WhatsApp line directly at 8102140650.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-forest-900 border border-forest-800 rounded-3xl p-8 shadow-2xl">
          {submitted ? (
            <div className="bg-forest-950 border border-emerald-500/50 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle className="w-5 h-5" />
                <span>Message Received</span>
              </div>
              <p className="text-xs text-slate-300">
                Thank you, {formData.name}. Our team has received your message regarding "{formData.category}" and will contact you shortly via phone or email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-forest-800 text-slate-200 rounded-lg text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-white mb-2">Send Us a Direct Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">10-Digit Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enquiry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                  >
                    <option value="School Partnership">School Sports Management</option>
                    <option value="Residential Society">Residential Society Programme</option>
                    <option value="Personal Training">Personal Training (Home / Online)</option>
                    <option value="Coach Application">Coach Onboarding Enquiry</option>
                    <option value="Location Expansion Request">Location Launch Request</option>
                    <option value="Other">General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Requirements *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your requirements, student count, society size, or preferred sports..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-lime-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
