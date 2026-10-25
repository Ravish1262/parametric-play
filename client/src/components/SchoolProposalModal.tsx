import React from 'react';
import { SchoolEnquiry } from '../types';
import { X, Printer, Shield, CheckCircle, Award, Calendar, Users, Dumbbell, AlertTriangle } from 'lucide-react';

interface SchoolProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolEnquiry | null;
}

export const SchoolProposalModal: React.FC<SchoolProposalModalProps> = ({
  isOpen,
  onClose,
  school
}) => {
  if (!isOpen || !school) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculatedCoaches = Math.ceil(school.total_students / 400);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-forest-950 border border-forest-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Modal Controls (No print) */}
        <div className="bg-forest-900 p-4 border-b border-forest-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-lime-400" />
            <h3 className="font-heading font-bold text-white text-base">
              School Sports Management Proposal Preview & PDF Export
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-lime-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-forest-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-forest-950 text-slate-200 printable-proposal">
          
          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-forest-800 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-tight text-white">PARAMETRIC</span>
                <span className="font-heading font-black text-2xl tracking-tight text-lime-400">PLAY</span>
              </div>
              <p className="text-xs text-lime-400 font-semibold tracking-wide uppercase mt-0.5">
                Professional Sports Coaching. One Platform. Three Solutions.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Ph: +91 8102140650 • Email: playparametric@gmail.com • Web: parametricplay.com
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="inline-block bg-lime-500/10 text-lime-400 border border-lime-500/30 text-xs px-3 py-1 rounded-full font-bold">
                PROPOSAL REF: PP-SCH-{school.id.toString().padStart(4, '0')}
              </span>
              <p className="text-xs text-slate-400 mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Client & School Info */}
          <div className="bg-forest-900/60 p-5 rounded-2xl border border-forest-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Institutional Partner</p>
              <h2 className="text-lg font-heading font-bold text-white mt-0.5">{school.school_name}</h2>
              <p className="text-slate-300 text-xs mt-1">{school.school_address || 'Campus Address'}, {school.city}, {school.state} - {school.pincode}</p>
              <p className="text-slate-300 text-xs mt-0.5">Affiliated Board: <strong>{school.school_board}</strong></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Authorised Representatives</p>
              <p className="text-slate-200 text-xs mt-1">Principal: <strong>{school.principal_name || 'Dr. Principal'}</strong></p>
              <p className="text-slate-200 text-xs mt-0.5">Contact Person: <strong>{school.contact_name || school.principal_name}</strong></p>
              <p className="text-slate-200 text-xs mt-0.5">Phone: {school.phone} | Email: {school.email}</p>
              <p className="text-slate-200 text-xs mt-0.5">Total Enrolled Strength: <strong className="text-lime-400">{school.total_students} Students</strong> ({school.num_classes || 8} Classes)</p>
            </div>
          </div>

          {/* Section 1: Staffing Plan & Formula */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-lg text-white border-l-4 border-lime-500 pl-3">
              1. Proposed Sports Staffing Model
            </h3>
            <div className="bg-forest-900/40 p-4 rounded-xl border border-forest-800 space-y-2 text-xs leading-relaxed">
              <p>
                Parametric Play deploys qualified physical education instructors (PTI) and specialized sports coaches according to our proprietary business staffing formula:
              </p>
              <div className="p-3 bg-forest-950 rounded-xl border border-lime-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-200">
                <div>
                  <span className="font-bold text-lime-400">Proposed Formula:</span> Ceiling(Total Students ÷ 400)
                  <p className="text-[11px] text-slate-400">Ceiling({school.total_students} ÷ 400) = <strong>{calculatedCoaches} Verified Coaches</strong></p>
                </div>
                <div className="bg-lime-500 text-forest-950 font-black px-4 py-2 rounded-lg text-base">
                  {calculatedCoaches} Dedicated Coaches
                </div>
              </div>
              <p className="text-[11px] text-amber-300/90 italic">
                * Note: This coach-to-student allocation represents Parametric Play's recommended operational staffing model and is not represented as a statutory regulatory prescription. The administrator and school principal may adjust final staffing allocation based on class schedules.
              </p>
              {school.total_students < 800 && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <p className="text-[11px]">
                    <strong>Eligibility Note:</strong> Standard school partnerships require a minimum strength of 800 students. This proposal has been customized for {school.school_name} as a special engagement subject to mutual operational approval.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Structured Curriculum (Classes 1 - 8, Periods 1 - 8) */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-lg text-white border-l-4 border-lime-500 pl-3">
              2. Structured Physical Education & Sports Curriculum
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Parametric Play provides an age-appropriate developmental physical literacy framework seamlessly integrated into the school's timetable across Period 1 through Period 8:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-forest-900/60 rounded-xl border border-forest-800 space-y-1.5">
                <h4 className="font-bold text-lime-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Primary Section (Classes 1 to 4)
                </h4>
                <p className="text-slate-300 text-[11px]">
                  Fundamental movement skills (FMS), spatial balance, agility, hand-eye coordination, rhythmics, fun cooperative games, warm-up habits, and sportsmanship.
                </p>
              </div>

              <div className="p-4 bg-forest-900/60 rounded-xl border border-forest-800 space-y-1.5">
                <h4 className="font-bold text-lime-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Middle Section (Classes 5 to 8)
                </h4>
                <p className="text-slate-300 text-[11px]">
                  Sport-specific tactical progression (Football, Basketball, Cricket, Athletics, Kho-Kho, Kabaddi, Badminton, Yoga), inter-house tournaments, stamina testing, and leadership.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Comparative Assessment Chart (Current vs Proposed) */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-lg text-white border-l-4 border-lime-500 pl-3">
              3. Comparative Sports Programme Assessment
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-forest-800 rounded-xl overflow-hidden">
                <thead className="bg-forest-900 text-slate-300 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Programme Dimension</th>
                    <th className="p-3 text-slate-400">Current School Setup (Estimate)</th>
                    <th className="p-3 text-lime-400">Parametric Play Proposed Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-850">
                  <tr>
                    <td className="p-3 font-semibold text-white">Coaching Staff</td>
                    <td className="p-3 text-slate-400">{school.existing_pti_staff || '1 Part-time PTI'}</td>
                    <td className="p-3 text-lime-400 font-bold">{calculatedCoaches} Verified Sports Coaches & PTIs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Curriculum Plan</td>
                    <td className="p-3 text-slate-400">Ad-hoc free play periods</td>
                    <td className="p-3 text-lime-400">Classes 1-8 syllabus with 8-period progression</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Student Assessment</td>
                    <td className="p-3 text-slate-400">Infrequent or unrecorded</td>
                    <td className="p-3 text-lime-400">Term-wise motor skill & fitness report cards</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Equipment Maintenance</td>
                    <td className="p-3 text-slate-400">School sole burden</td>
                    <td className="p-3 text-lime-400">Inventory tracking, safety checks & supplement gear</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Annual Sports Calendar</td>
                    <td className="p-3 text-slate-400">Single annual event</td>
                    <td className="p-3 text-lime-400">Structured inter-house leagues + Sports Day execution</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                * Note: Comparative assessments are based on preliminary enquiry inputs and representative industry baselines.
              </p>
            </div>
          </div>

          {/* Section 4: Commercial Proposal & Important Terms */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-lg text-white border-l-4 border-lime-500 pl-3">
              4. Commercial Investment & Contractual Terms
            </h3>
            <div className="bg-forest-900/50 p-5 rounded-2xl border border-forest-800 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-forest-950 p-4 rounded-xl border border-forest-750">
                  <span className="text-slate-400 text-[11px] block uppercase font-semibold">Monthly Service Fee</span>
                  <span className="text-2xl font-heading font-black text-lime-400">
                    ₹{school.proposed_price_monthly.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">Per month for {calculatedCoaches} dedicated coaches</span>
                </div>
                <div className="bg-forest-950 p-4 rounded-xl border border-forest-750">
                  <span className="text-slate-400 text-[11px] block uppercase font-semibold">Annual Contract Value (12 Months)</span>
                  <span className="text-2xl font-heading font-black text-white">
                    ₹{school.contract_value_annual.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">Invoiced monthly or quarterly in advance</span>
                </div>
              </div>

              {/* Crucial Contract Condition */}
              <div className="p-3.5 bg-forest-950 rounded-xl border border-lime-500/30 text-slate-300 space-y-1.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-lime-400" />
                  Important Contractual Condition Regarding School Events:
                </p>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Parametric Play will organise, manage, and coordinate agreed school sports events, inter-house tournaments, and annual sports days. However, <strong>the standard service does not include financing or funding those school events</strong> (e.g. stage setups, sound systems, chief guest honorariums, medals, catering, or external tenting). Any event financing or specific additional expense must be agreed upon separately in writing.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Authorisation Signatures */}
          <div className="pt-6 border-t border-forest-800 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-12">
              <p className="font-semibold text-slate-400">For Parametric Play:</p>
              <div>
                <div className="border-b border-forest-700 w-48 mb-1"></div>
                <p className="font-bold text-white">Authorised Signatory</p>
                <p className="text-slate-400 text-[10px]">Parametric Play Management</p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="font-semibold text-slate-400">Accepted For {school.school_name}:</p>
              <div>
                <div className="border-b border-forest-700 w-48 mb-1"></div>
                <p className="font-bold text-white">Principal / Manager</p>
                <p className="text-slate-400 text-[10px]">Stamp & Date</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
