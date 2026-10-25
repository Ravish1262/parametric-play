import React, { useState } from 'react';
import { 
  UserCheck, Upload, ShieldCheck, CheckCircle2, 
  FileText, Award, AlertCircle, Send, Sparkles 
} from 'lucide-react';

export const BecomeCoachPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: 'Delhi NCR',
    city: 'New Delhi',
    pincode: '110001',
    serviceArea: 'South Delhi, Connaught Place',
    sportsSpecialisations: 'Fitness Training, Football',
    qualifications: 'B.P.Ed / NSNIS Certified',
    experienceYears: 4,
    ageGroupsServed: 'Kids, Teens, Adults',
    onlineAvailable: true,
    homeVisitAvailable: true,
    preferredHours: 'Morning 6:00 AM - 10:00 AM, Evening 5:00 PM - 8:00 PM',
    bio: ''
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.city) {
      setError('Please fill in your full name, email, phone, and city.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        data.append(k, String(v));
      });
      if (photoFile) data.append('photo', photoFile);
      if (idFile) data.append('idDocument', idFile);
      if (certFile) data.append('certificates', certFile);

      const res = await fetch('/api/coaches/apply', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Submission failed');
      }
    } catch (err: any) {
      setError('Error submitting application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Coach Recruitment & Onboarding</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Join Parametric Play as a Certified Sports Coach
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          We provide steady income across school contracts, residential society batches, and home personal training. Earn ₹1,000 per active client-month with transparent payouts.
        </p>
      </div>

      {/* VERIFICATION PIPELINE EXPLANATION */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 p-6 sm:p-8 rounded-3xl border border-forest-800 shadow-2xl">
        <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400 flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-4 h-4" /> 6-Stage Rigorous Verification Process
        </span>
        <h3 className="font-heading font-bold text-xl text-white">
          Coach Profiles Become Public Only After Admin Audit
        </h3>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          To maintain strict child safety and institutional trust, every applicant passes through our verification workflow:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 text-xs text-center">
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-800">
            <span className="text-lime-400 font-bold block mb-1">1. Application</span>
            <span className="text-slate-400 text-[11px]">Details Submitted</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-800">
            <span className="text-amber-400 font-bold block mb-1">2. Documents</span>
            <span className="text-slate-400 text-[11px]">ID & Cert Upload</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-800">
            <span className="text-blue-400 font-bold block mb-1">3. Under Review</span>
            <span className="text-slate-400 text-[11px]">Background Audit</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-800">
            <span className="text-purple-400 font-bold block mb-1">4. Interview</span>
            <span className="text-slate-400 text-[11px]">Pedagogy Check</span>
          </div>
          <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/50">
            <span className="text-emerald-400 font-bold block mb-1">5. Verified</span>
            <span className="text-emerald-200 text-[11px]">Profile Published</span>
          </div>
          <div className="p-3 bg-forest-950 rounded-xl border border-forest-800">
            <span className="text-slate-400 font-bold block mb-1">6. Payouts</span>
            <span className="text-slate-400 text-[11px]">Direct Payouts</span>
          </div>
        </div>
      </div>

      {/* APPLICATION FORM */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {submitted ? (
          <div className="bg-forest-950 border border-emerald-500/50 p-6 sm:p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-xl text-white">Application Received for Review</h3>
                <p className="text-xs text-slate-300">Status: <strong className="text-amber-400">Under Review</strong></p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Thank you for applying to Parametric Play. Our sports coaching auditor will verify your identity documents and sports certifications within 48 business hours. Your profile will become active once approved by the administrator.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 bg-forest-800 hover:bg-forest-750 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="max-w-2xl mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Coach Application Form</span>
              <h3 className="font-heading font-black text-2xl text-white mt-0.5">
                Personal Credentials & Specialisations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">10-Digit Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State / UT *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Area / Localities</label>
                <input
                  type="text"
                  placeholder="e.g. South Delhi, Connaught Place"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sports & Disciplines Specialisations</label>
                <input
                  type="text"
                  placeholder="e.g. Fitness Training, Boxing, Football"
                  value={formData.sportsSpecialisations}
                  onChange={(e) => setFormData({ ...formData, sportsSpecialisations: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Coaching Experience</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Qualifications & Certifications *</label>
              <input
                type="text"
                required
                placeholder="e.g. B.P.Ed (LNIPE), NSNIS Diploma in Fitness, 3rd Dan Black Belt"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
              />
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-forest-950 rounded-2xl border border-forest-800 text-xs">
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-lime-400" />
                  <span>Profile Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-800 file:text-slate-200"
                />
              </div>

              <div className="p-4 bg-forest-950 rounded-2xl border border-forest-800 text-xs">
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-lime-400" />
                  <span>Govt ID Proof (Aadhaar / Passport)</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-800 file:text-slate-200"
                />
              </div>

              <div className="p-4 bg-forest-950 rounded-2xl border border-forest-800 text-xs">
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-lime-400" />
                  <span>Degree / Diploma Certificate</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setCertFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-800 file:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Coach Biography</label>
              <textarea
                rows={3}
                placeholder="Describe your coaching philosophy, athletic achievements, and background..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                All records stored securely with access control under Indian privacy directives.
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm shadow-xl shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Coach Application'}</span>
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
