import React, { useState } from 'react';
import { 
  School, CheckCircle, AlertTriangle, Calculator, FileText, 
  Send, Sparkles, Award, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { SchoolEnquiry } from '../types';

interface SchoolSportsPageProps {
  onViewProposal?: (school: SchoolEnquiry) => void;
}

export const SchoolSportsPage: React.FC<SchoolSportsPageProps> = ({ onViewProposal }) => {
  // Calculator state
  const [calcStudents, setCalcStudents] = useState<number>(1200);

  // Form state
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolBoard: 'CBSE',
    schoolAddress: '',
    state: 'Delhi NCR',
    city: 'New Delhi',
    pincode: '110001',
    principalName: '',
    contactName: '',
    phone: '',
    email: '',
    totalStudents: 1000,
    numClasses: 8,
    existingPtiStaff: '',
    sportsFacilities: 'Open playground, Basketball court',
    sportsOffered: 'Cricket, Football',
    sportsWanted: 'Athletics, Basketball, Kho-Kho, Yoga, Aerobics',
    availableEquipment: 'Basic balls and cones',
    preferredMeetingDate: '',
    additionalRequirements: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Formula: Ceiling(calcStudents / 400)
  const calcCoaches = Math.ceil(calcStudents / 400);
  const meetsMin800 = calcStudents >= 800;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName || !formData.phone || !formData.email) {
      setError('Please provide school name, phone number, and email address.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/schools/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedResult(data);
      } else {
        setError(data.error || 'Failed to submit enquiry');
      }
    } catch (err: any) {
      setError('Error submitting form: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <School className="w-3.5 h-3.5" />
          <span>Business Model 1: School Sports Management</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Comprehensive Sports Coaching & Physical Education for Schools
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          Parametric Play provides company-managed PTIs, structured Classes 1 to 8 curriculum, equipment logistics, and sports day coordination. We transform campus athletics into a systematic physical literacy program.
        </p>
      </div>

      {/* STAFFING MODEL & ELIGIBILITY CALCULATOR */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 p-6 sm:p-10 rounded-3xl border border-forest-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Proposed Staffing Calculator
            </span>
            <h2 className="font-heading font-bold text-2xl text-white">
              Formula: 1 PTI / Coach for Every 400 Students
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We determine coach requirements using our upward ceiling ratio: <code className="bg-forest-950 px-2 py-0.5 rounded text-lime-400 font-mono">Ceiling(Total Students ÷ 400)</code>.
            </p>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Simulate School Student Strength: <strong className="text-lime-400 text-sm font-mono">{calcStudents.toLocaleString()} Students</strong>
              </label>
              <input
                type="range"
                min="400"
                max="3600"
                step="50"
                value={calcStudents}
                onChange={(e) => setCalcStudents(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer h-2 bg-forest-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>400 Students</span>
                <span>800 (Eligibility Threshold)</span>
                <span>2,000 Students</span>
                <span>3,600 Students</span>
              </div>
            </div>

            <div className="p-3.5 bg-forest-950/80 rounded-xl border border-forest-800 text-[11px] text-slate-400 space-y-1">
              <p className="text-slate-300 font-medium">Representative Staffing Examples:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>• 800 students = 2 coaches</span>
                <span>• 1,000 students = 3 coaches</span>
                <span>• 1,200 students = 3 coaches</span>
                <span>• 1,600 students = 4 coaches</span>
                <span>• 2,000 students = 5 coaches</span>
                <span>• 2,400 students = 6 coaches</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 italic">
                * Labelled as Parametric Play's proposed business staffing model, not an official regulatory rule. Final staffing can be adjusted by the administrator.
              </p>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-forest-950 p-6 sm:p-8 rounded-2xl border border-lime-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Calculated Allocation</span>
                <span className="text-xs font-mono text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full border border-lime-500/30">
                  Ratio: 1 : 400
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-heading font-black text-white">
                  {calcCoaches} <span className="text-lime-400 text-2xl font-bold">PTI / Coaches</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ceiling({calcStudents} ÷ 400) = {calcCoaches} coaches
                </p>
              </div>

              {/* 800 Student Minimum Requirement Alert */}
              {meetsMin800 ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Standard Eligibility Met (800+ Students)</strong>
                    <span>Your institution qualifies for standard Parametric Play sports department deployment.</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-950/60 border border-amber-600/50 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Under 800 Minimum Student Requirement</strong>
                    <span>Standard school partnerships require at least 800 students. Smaller schools may submit a special enquiry for manual administrator review.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 pt-3 border-t border-forest-850">
              <p>Estimated monthly investment: <strong className="text-lime-400 font-mono">₹{(calcCoaches * 22000).toLocaleString('en-IN')}</strong> (Configurable by Admin)</p>
            </div>

          </div>

        </div>
      </div>

      {/* CURRICULUM & SERVICES DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Classes 1-8 Curriculum & Timetable */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            Classes 1 to 8 Curriculum & Period 1-8 Timetable
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our progressive curriculum provides structured physical training tailored to each age group across daily periods:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span><strong>Classes 1-4:</strong> Fundamental motor skills, agility, and balance games.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span><strong>Classes 5-8:</strong> Sport-specific tactical coaching, rules, and fitness conditioning.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span><strong>Timetable Integration:</strong> Configurable across school periods (Period 1 to 8).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span><strong>Assessment:</strong> Term-wise student physical report cards & attendance logs.</span>
            </li>
          </ul>
        </div>

        {/* School Services & Important Conditions */}
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-7 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-lime-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            10 Key Services & Contractual Conditions
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            What is included in the Parametric Play school management agreement:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <span>1. Sports Coaches & PTI</span>
            <span>2. Structured Curriculum</span>
            <span>3. Lesson Activity Planning</span>
            <span>4. Agreed Equipment Support</span>
            <span>5. Attendance & Participation</span>
            <span>6. Sports Day Management</span>
            <span>7. Annual Sports Calendar</span>
            <span>8. Performance Reports</span>
            <span>9. Coach Coordination</span>
            <span>10. Quarterly Reviews</span>
          </div>

          <div className="p-3 bg-forest-950 rounded-xl border border-lime-500/30 text-[11px] text-amber-200 mt-2">
            <strong>Important Contract Condition:</strong> Parametric Play organises and directs agreed school sports functions and sports days, but <strong>the standard service does not include financing those events</strong>. Any event sponsorship or funding must be contracted separately.
          </div>
        </div>

      </div>

      {/* FORM: SCHOOL PARTNERSHIP ENQUIRY */}
      <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Official Institutional Onboarding</span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Submit School Partnership Enquiry
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Fill out your school parameters. Our system will immediately calculate the proposed coach staffing and generate a formal proposal.
          </p>
        </div>

        {submittedResult ? (
          <div className="bg-forest-950 border border-emerald-500/50 p-6 sm:p-8 rounded-2xl space-y-5">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-7 h-7 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Enquiry Submitted Successfully!</h3>
                <p className="text-xs text-slate-300">Reference Enquiry ID: PP-ENQ-{submittedResult.enquiryId}</p>
              </div>
            </div>

            <div className="p-4 bg-forest-900 rounded-xl border border-forest-800 space-y-2 text-xs">
              <p className="text-slate-200"><strong>Calculated Staffing Plan:</strong> {submittedResult.calculation.proposedCoachCount} Dedicated Coaches</p>
              <p className="text-slate-400">{submittedResult.calculation.ratioExplanation}</p>
              <div className={`p-3 rounded-lg mt-2 text-xs font-semibold ${
                submittedResult.calculation.meetsMinRequirement 
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50' 
                  : 'bg-amber-900/40 text-amber-300 border border-amber-700/50'
              }`}>
                {submittedResult.calculation.eligibilityMessage}
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Our institutional sports director will reach out within 24 hours to schedule a demonstration meeting.
            </p>

            <button
              onClick={() => setSubmittedResult(null)}
              className="px-5 py-2.5 bg-forest-800 hover:bg-forest-750 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Submit Another School Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* School Profile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Public School"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Affiliated Board *</label>
                <select
                  value={formData.schoolBoard}
                  onChange={(e) => setFormData({ ...formData, schoolBoard: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB / Cambridge">IB / Cambridge</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">School Address *</label>
                <input
                  type="text"
                  placeholder="Plot/Sector, Area"
                  value={formData.schoolAddress}
                  onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            {/* Location & Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Student Count * <span className="text-[10px] text-lime-400">(Min: 800)</span>
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={formData.totalStudents}
                  onChange={(e) => setFormData({ ...formData, totalStudents: Number(e.target.value) })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principal's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. R. Sharma"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sports Coordinator / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. K. Verma"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
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
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official School Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sports@school.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            {/* Sports & Facilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Existing Sports Facilities</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Football Ground, 2 Basketball Courts"
                  value={formData.sportsFacilities}
                  onChange={(e) => setFormData({ ...formData, sportsFacilities: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sports School Wants to Introduce</label>
                <input
                  type="text"
                  placeholder="e.g. Athletics, Kho-Kho, Kabaddi, Football, Yoga"
                  value={formData.sportsWanted}
                  onChange={(e) => setFormData({ ...formData, sportsWanted: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            {/* Live Formula Preview */}
            <div className="p-4 bg-forest-950 rounded-2xl border border-forest-750 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400">Preliminary Staffing Formula:</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  Ceiling({formData.totalStudents} students ÷ 400) = <strong className="text-lime-400 font-mono">{Math.ceil(formData.totalStudents / 400)} PTI / Coaches Proposed</strong>
                </p>
                {formData.totalStudents < 800 ? (
                  <span className="text-[11px] text-amber-400 block mt-0.5">
                    * Strength is below the standard 800-student minimum threshold. Will be reviewed manually.
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 block mt-0.5">
                    ✓ Meets standard 800+ student eligibility requirement.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm shadow-xl shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Calculating...' : 'Submit Partnership Enquiry'}</span>
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
