import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, DollarSign, Users, School, Building2, Dumbbell, 
  QrCode, Package, Settings, CheckCircle, XCircle, Clock, 
  ArrowUpRight, Printer, AlertTriangle, Eye, Upload, RefreshCw 
} from 'lucide-react';
import { 
  FinancialSummary, FinancialTransaction, SchoolEnquiry, 
  ResidentialSociety, Booking, CoachProfile, QRCodeItem, EquipmentItem 
} from '../types';

interface AdminDashboardProps {
  onViewSchoolProposal: (school: SchoolEnquiry) => void;
  onOpenQR: (title: string, amount: number, bookingCode: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewSchoolProposal,
  onOpenQR
}) => {
  const [activeTab, setActiveTab] = useState<'financials' | 'coaches' | 'schools' | 'societies' | 'bookings' | 'qr' | 'equipment' | 'settings'>('financials');
  
  // Data states
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [verticalData, setVerticalData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [schools, setSchools] = useState<SchoolEnquiry[]>([]);
  const [societies, setSocieties] = useState<ResidentialSociety[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Load all admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [finRes, coachesRes, schoolsRes, societiesRes, bookingsRes, qrRes, equipRes, settingsRes] = await Promise.all([
        fetch('/api/financials/summary').then(r => r.json()),
        fetch('/api/coaches/admin/all').then(r => r.json()),
        fetch('/api/schools').then(r => r.json()),
        fetch('/api/societies').then(r => r.json()),
        fetch('/api/bookings?role=admin').then(r => r.json()),
        fetch('/api/qr').then(r => r.json()),
        fetch('/api/equipment').then(r => r.json()),
        fetch('/api/settings').then(r => r.json())
      ]);

      if (finRes.success) {
        setFinancialSummary(finRes.summary);
        setVerticalData(finRes.byVertical || []);
        setTransactions(finRes.recentTransactions || []);
      }
      if (coachesRes.success) setCoaches(coachesRes.coaches || []);
      if (schoolsRes.success) setSchools(schoolsRes.schools || []);
      if (societiesRes.success) setSocieties(societiesRes.societies || []);
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
      if (qrRes.success) setQrCodes(qrRes.qrs || []);
      if (equipRes.success) setEquipment(equipRes.items || []);
      if (settingsRes.success) setSystemSettings(settingsRes.settings || {});
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Admin Actions
  const handleVerifyCoach = async (coachId: number, status: string) => {
    try {
      const res = await fetch(`/api/coaches/${coachId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Coach status updated to ${status}`);
        loadAdminData();
      }
    } catch (e) {}
  };

  const handleVerifyPayment = async (bookingId: number, verified: boolean) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/verify-payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        loadAdminData();
      }
    } catch (e) {}
  };

  const handleAssignCoachToBooking = async (bookingId: number, coachId: number) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/assign-coach`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        loadAdminData();
      }
    } catch (e) {}
  };

  const handleUpdateSchoolPricing = async (schoolId: number, proposedPriceMonthly: number) => {
    try {
      const res = await fetch(`/api/schools/${schoolId}/pricing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          proposedPriceMonthly, 
          contractValueAnnual: proposedPriceMonthly * 12 
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('School pricing updated successfully');
        loadAdminData();
      }
    } catch (e) {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: systemSettings })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('System settings saved successfully');
      }
    } catch (e) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-900 border border-lime-500/40 text-lime-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Company Administrator Control Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete executive oversight across School Sports, Residential Societies, Personal Training, and Finances.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3.5 py-2 bg-forest-900 hover:bg-forest-850 text-slate-200 border border-forest-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400 font-bold ml-2">×</button>
        </div>
      )}

      {/* EXECUTIVE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Collections</span>
          <div className="text-2xl font-heading font-black text-white mt-1">
            ₹{(financialSummary?.totalGrossCollections || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Across all 3 verticals</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-[10px] uppercase font-bold text-lime-400 block">Coach Payouts</span>
          <div className="text-2xl font-heading font-black text-lime-400 mt-1">
            ₹{(financialSummary?.totalCoachPayouts || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Direct coach compensation</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">Company Gross Share</span>
          <div className="text-2xl font-heading font-black text-white mt-1">
            ₹{(financialSummary?.totalCompanyGross || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Before overhead & expenses</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-forest-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Operating Expenses</span>
          <div className="text-2xl font-heading font-black text-amber-400 mt-1">
            ₹{(financialSummary?.totalOperatingExpenses || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Equipment & operations</span>
        </div>

        <div className="bg-forest-900 p-5 rounded-2xl border border-lime-500/30 col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Net Result</span>
          <div className="text-2xl font-heading font-black text-emerald-400 mt-1">
            ₹{(financialSummary?.totalNetProfit || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Audited net margin</span>
        </div>
      </div>

      {/* DASHBOARD TAB CONTROLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-forest-800 text-xs">
        {[
          { id: 'financials', label: 'Financial Ledger & Splits', icon: DollarSign },
          { id: 'coaches', label: `Coaches (${coaches.length})`, icon: Users },
          { id: 'schools', label: `School Partnerships (${schools.length})`, icon: School },
          { id: 'societies', label: `Residential Societies (${societies.length})`, icon: Building2 },
          { id: 'bookings', label: `Personal Bookings (${bookings.length})`, icon: Dumbbell },
          { id: 'qr', label: `QR Management (${qrCodes.length})`, icon: QrCode },
          { id: 'equipment', label: `Equipment (${equipment.length})`, icon: Package },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-lime-500 text-forest-950 shadow-md font-bold'
                  : 'bg-forest-900 text-slate-300 hover:bg-forest-850 hover:text-white border border-forest-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. FINANCIAL LEDGER */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6">
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Revenue Breakdown by Business Model
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {verticalData.map((v, i) => (
                <div key={i} className="p-4 bg-forest-950 rounded-2xl border border-forest-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-sm">{v.vertical}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{v.transactionCount} entries</span>
                  </div>
                  <div className="pt-2 border-t border-forest-850 space-y-1">
                    <p className="flex justify-between text-slate-300">
                      <span>Gross Revenue:</span>
                      <strong className="text-white font-mono">₹{v.grossRevenue?.toLocaleString('en-IN')}</strong>
                    </p>
                    <p className="flex justify-between text-lime-400">
                      <span>Coach Allocation:</span>
                      <strong className="font-mono">₹{v.coachAllocation?.toLocaleString('en-IN')}</strong>
                    </p>
                    <p className="flex justify-between text-slate-400">
                      <span>Company Gross Share:</span>
                      <strong className="text-slate-200 font-mono">₹{v.companyAllocation?.toLocaleString('en-IN')}</strong>
                    </p>
                    <p className="flex justify-between text-amber-400">
                      <span>Recorded Expenses:</span>
                      <strong className="font-mono">₹{v.expenses?.toLocaleString('en-IN')}</strong>
                    </p>
                    <p className="flex justify-between text-emerald-400 pt-1 border-t border-forest-850 font-bold">
                      <span>Net Contribution:</span>
                      <strong className="font-mono">₹{v.netResult?.toLocaleString('en-IN')}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 overflow-hidden">
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Real Financial Ledger & Audit Trail
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
                <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Vertical</th>
                    <th className="p-3">Reference / Client</th>
                    <th className="p-3 text-right">Gross Inflow</th>
                    <th className="p-3 text-right">Coach Payout</th>
                    <th className="p-3 text-right">Company Gross</th>
                    <th className="p-3 text-right">Net Margin</th>
                    <th className="p-3 text-center">Payout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-850">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-forest-850/50">
                      <td className="p-3 text-slate-400 font-mono">{tx.date}</td>
                      <td className="p-3 font-semibold text-white">{tx.vertical}</td>
                      <td className="p-3 text-slate-300">
                        <span className="font-bold text-white block">{tx.client_name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{tx.reference_id} • {tx.payment_mode}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white">₹{tx.gross_amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono text-lime-400 font-semibold">₹{tx.coach_payout.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono text-slate-300">₹{tx.company_gross.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold">₹{tx.net_result.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.payout_status === 'Paid Out'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {tx.payout_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. COACHES */}
      {activeTab === 'coaches' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Coach Verification & Staff Management</h3>
              <p className="text-xs text-slate-400">Coaches cannot be booked by the public until marked as 'Verified'.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
              <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Coach Name</th>
                  <th className="p-3">Contact & Location</th>
                  <th className="p-3">Qualifications & Sports</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Monthly Earnings</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-850">
                {coaches.map((c) => (
                  <tr key={c.id} className="hover:bg-forest-850/50">
                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{c.full_name}</div>
                      <span className="text-[10px] text-slate-500 font-mono">ID: PP-COACH-{c.id}</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{c.phone}</div>
                      <div className="text-[11px] text-slate-400">{c.city}, {c.state}</div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div className="line-clamp-1">{c.qualifications}</div>
                      <div className="text-[10px] text-lime-400">{c.sports_specialisations}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.verification_status === 'Verified'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : c.verification_status === 'Under Review'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {c.verification_status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-lime-400">
                      ₹{c.monthly_earnings.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {c.verification_status !== 'Verified' && (
                        <button
                          onClick={() => handleVerifyCoach(c.id, 'Verified')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold"
                        >
                          Approve
                        </button>
                      )}
                      {c.verification_status !== 'Rejected' && (
                        <button
                          onClick={() => handleVerifyCoach(c.id, 'Rejected')}
                          className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded-lg text-[11px]"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. SCHOOL PARTNERSHIPS */}
      {activeTab === 'schools' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">School Partnerships & Proposals</h3>
            <p className="text-xs text-slate-400">
              Rule: 800-student minimum eligibility threshold. Ratio formula: Ceiling(Students ÷ 400).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
              <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">School Name</th>
                  <th className="p-3">Location & Board</th>
                  <th className="p-3 text-center">Students (≥800)</th>
                  <th className="p-3 text-center">Proposed Coaches</th>
                  <th className="p-3 text-right">Monthly Fee</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-850">
                {schools.map((s) => (
                  <tr key={s.id} className="hover:bg-forest-850/50">
                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{s.school_name}</div>
                      <span className="text-[10px] text-slate-500">{s.contact_name} ({s.phone})</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{s.city}, {s.state}</div>
                      <span className="text-[10px] text-slate-500">Board: {s.school_board}</span>
                    </td>
                    <td className="p-3 text-center font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.total_students >= 800 ? 'text-emerald-400 bg-emerald-950/80' : 'text-amber-400 bg-amber-950/80'
                      }`}>
                        {s.total_students} {s.total_students < 800 && '(Under 800)'}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-lime-400">
                      {s.proposed_coach_count} Coaches
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      ₹{s.proposed_price_monthly.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-950 text-slate-300 border border-forest-800">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewSchoolProposal(s)}
                        className="px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-forest-950 rounded-xl font-bold text-xs flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Proposal PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. RESIDENTIAL SOCIETIES */}
      {activeTab === 'societies' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Residential Society Batches</h3>
            <p className="text-xs text-slate-400">
              Rule: 10 participating children minimum required for batch launch. Rate: ₹2,000 / child / month.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
              <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Society Name</th>
                  <th className="p-3">City & Address</th>
                  <th className="p-3 text-center">Enrolled (≥10)</th>
                  <th className="p-3">Programme</th>
                  <th className="p-3 text-right">Gross Monthly Fee</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Assigned Coach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-850">
                {societies.map((soc) => (
                  <tr key={soc.id} className="hover:bg-forest-850/50">
                    <td className="p-3 font-bold text-white">
                      {soc.society_name}
                      <span className="block text-[10px] text-slate-500 font-normal">{soc.contact_name} ({soc.phone})</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{soc.city}, {soc.state}</div>
                      <span className="text-[10px] text-slate-500">{soc.address}</span>
                    </td>
                    <td className="p-3 text-center font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        soc.child_count >= 10 ? 'text-emerald-400 bg-emerald-950/80' : 'text-amber-400 bg-amber-950/80'
                      }`}>
                        {soc.child_count} Kids {soc.child_count < 10 && '(Below 10)'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200">
                      <div>{soc.selected_programme}</div>
                      <span className="text-[10px] text-slate-400">{soc.session_duration} • {soc.sessions_per_week}x/week</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-lime-400">
                      ₹{soc.gross_monthly_fee.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        soc.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {soc.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-300">
                      {soc.coach_name || 'Not assigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. BOOKINGS & PAYMENT VERIFICATION */}
      {activeTab === 'bookings' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Personal Training Bookings & Payment Reconciliation</h3>
            <p className="text-xs text-slate-400">
              Audit UTR transaction numbers submitted by customers. Confirm bank receipts before confirming bookings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
              <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Customer Details</th>
                  <th className="p-3">Category & Mode</th>
                  <th className="p-3 text-center">UTR / Ref</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Coach</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-850">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-forest-850/50">
                    <td className="p-3 font-mono font-bold text-lime-400">
                      {b.booking_code}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{b.customer_name}</div>
                      <span className="text-[10px] text-slate-400">{b.customer_phone} • {b.city}</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div className="font-medium">{b.category_name}</div>
                      <span className="text-[10px] text-lime-400">{b.training_mode}</span>
                    </td>
                    <td className="p-3 text-center font-mono text-[11px]">
                      {b.utr_transaction_ref ? (
                        <span className="bg-forest-950 px-2 py-1 rounded border border-forest-800 text-slate-200">
                          {b.utr_transaction_ref}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">No UTR yet</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'Payment Pending Verification'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-forest-950 text-slate-400 border border-forest-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">
                      {b.coach_name || (
                        <select
                          onChange={(e) => handleAssignCoachToBooking(b.id, Number(e.target.value))}
                          className="bg-forest-950 border border-forest-750 rounded p-1 text-[11px] text-white"
                        >
                          <option value="">Assign Coach</option>
                          {coaches.filter(c => c.verification_status === 'Verified').map(c => (
                            <option key={c.id} value={c.id}>{c.full_name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {b.status === 'Payment Pending Verification' && (
                        <>
                          <button
                            onClick={() => handleVerifyPayment(b.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold"
                          >
                            Verify & Confirm
                          </button>
                          <button
                            onClick={() => handleVerifyPayment(b.id, false)}
                            className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded-lg text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. QR CODE MANAGEMENT */}
      {activeTab === 'qr' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">QR Code Management & Official UPI Setup</h3>
              <p className="text-xs text-slate-400">
                Official payment QR image, campaign destination QRs, and scan tracking.
              </p>
            </div>
            
            <button
              onClick={() => onOpenQR('Parametric Play Official Payment QR', 2000, 'PP-OFFICIAL')}
              className="px-4 py-2 bg-lime-500 text-forest-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-lime-500/20"
            >
              <QrCode className="w-4 h-4" />
              <span>Preview Live Payment QR</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="p-5 bg-forest-950 rounded-2xl border border-forest-800 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{qr.title}</span>
                    {qr.is_official_payment === 1 && (
                      <span className="text-[10px] bg-lime-500/20 text-lime-400 border border-lime-500/40 px-2 py-0.5 rounded-full font-bold">
                        Official Payment QR
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 font-mono text-[11px] truncate max-w-sm">{qr.destination_url}</p>
                  <p className="text-slate-500 text-[10px]">{qr.notes}</p>
                  <p className="text-lime-400 font-semibold pt-1">Total Scans: {qr.scan_count}</p>
                </div>

                <button
                  onClick={() => onOpenQR(qr.title, 2000, `PP-CAMPAIGN-${qr.id}`)}
                  className="px-3 py-1.5 bg-forest-800 hover:bg-forest-750 text-slate-200 rounded-lg text-xs font-semibold shrink-0"
                >
                  View QR
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. EQUIPMENT INVENTORY */}
      {activeTab === 'equipment' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Sports Equipment & Gear Inventory</h3>
            <p className="text-xs text-slate-400">
              Track balls, agility ladders, cones, and safety gear assigned to societies and coaches.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-forest-800 rounded-2xl overflow-hidden">
              <thead className="bg-forest-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Total Qty</th>
                  <th className="p-3 text-center">Available</th>
                  <th className="p-3">Assigned Location</th>
                  <th className="p-3 text-center">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-850">
                {equipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-forest-850/50">
                    <td className="p-3 font-bold text-white">{eq.item_name}</td>
                    <td className="p-3 text-slate-300">{eq.category}</td>
                    <td className="p-3 text-center font-mono font-bold text-white">{eq.total_quantity}</td>
                    <td className="p-3 text-center font-mono text-lime-400">{eq.available_quantity}</td>
                    <td className="p-3 text-slate-300">{eq.society_name || 'Central Warehouse'}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        {eq.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-forest-900 border border-forest-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">System Settings & Company Defaults</h3>
            <p className="text-xs text-slate-400">
              These details are dynamically populated throughout the app and not hardcoded.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Company Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  value={systemSettings.contact_phone || '8102140650'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, contact_phone: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={systemSettings.contact_email || 'playparametric@gmail.com'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, contact_email: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Personal Training Monthly Price (₹)</label>
                <input
                  type="number"
                  value={systemSettings.pt_monthly_price || '2000'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, pt_monthly_price: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Coach Share Allocation (₹)</label>
                <input
                  type="number"
                  value={systemSettings.pt_coach_share || '1000'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, pt_coach_share: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">School Minimum Student Threshold</label>
                <input
                  type="number"
                  value={systemSettings.school_min_students || '800'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, school_min_students: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Society Minimum Child Requirement</label>
                <input
                  type="number"
                  value={systemSettings.society_min_children || '10'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, society_min_children: e.target.value })}
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-xs shadow-md shadow-lime-500/20"
            >
              Save Configuration Settings
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
