import React from 'react';
import { Shield, FileText, RefreshCw } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-300 text-xs leading-relaxed">
    <div className="border-b border-forest-800 pb-4">
      <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Indian Privacy Compliance</span>
      <h1 className="font-heading font-black text-3xl text-white mt-1">Privacy Policy</h1>
      <p className="text-[11px] text-slate-400">Last updated: October 2026</p>
    </div>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">1. Scope and Information Collection</h3>
      <p>Parametric Play ("we", "our") collects necessary personal data to deliver sports coaching services across India. This includes customer names, contact numbers, email addresses, service locations, and child participant age ranges.</p>
      <p>We do not collect unnecessary personal information from children. Child enrolments must be initiated and authorized by a parent or legal guardian.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">2. Address Privacy & Access Control</h3>
      <p>Private residential addresses provided for home visit personal training are confidential. They are never published publicly on the platform and are disclosed only to the specifically assigned coach through an authorized, secure booking workflow.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">3. Payments and Banking References</h3>
      <p>We do not store credit card credentials or bank passwords. UPI transaction references (UTRs) and payment receipts are retained strictly for audit, invoice reconciliation, and tax compliance under Indian fiscal statutes.</p>
    </section>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-300 text-xs leading-relaxed">
    <div className="border-b border-forest-800 pb-4">
      <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Terms of Service</span>
      <h1 className="font-heading font-black text-3xl text-white mt-1">Terms and Conditions</h1>
      <p className="text-[11px] text-slate-400">Applicable to all users, schools, societies, and coaches across India</p>
    </div>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">1. Business Operations & Company Coaches</h3>
      <p>Parametric Play provides company-managed sports coaches for school sports departments, residential societies, and individual clients. Customers book directly through Parametric Play, and we manage assignments, schedules, and operations.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">2. Institutional School Contracts & Exclusions</h3>
      <p>Standard school partnerships require a minimum strength of 800 students, with coach staffing calculated as Ceiling(Students ÷ 400). Parametric Play will organize agreed sports functions; however, standard service contracts exclude financing or funding those events. Any event funding must be contracted separately in writing.</p>
      <p>Outsourced staffing does not automatically constitute or guarantee regulatory compliance with CBSE, ICSE, or state educational board requirements.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">3. Residential Societies Minimum Enrolment</h3>
      <p>Society programmes require a minimum of 10 enrolled children at the standard rate of ₹2,000/child/month. Batches with fewer than 10 children remain pending enrolment and are not automatically charged.</p>
    </section>
  </div>
);

export const RefundPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-300 text-xs leading-relaxed">
    <div className="border-b border-forest-800 pb-4">
      <span className="text-xs uppercase font-extrabold tracking-wider text-lime-400">Customer Protections</span>
      <h1 className="font-heading font-black text-3xl text-white mt-1">Cancellation & Refund Policy</h1>
      <p className="text-[11px] text-slate-400">Transparent and fair policies for clients and coaches</p>
    </div>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">1. Personal Training Cancellations</h3>
      <p>Clients may request cancellation of their monthly package prior to coach assignment or within 48 hours of their first delivered session. Pro-rata refunds are calculated after adjusting for delivered sessions and payment gateway administrative costs.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">2. Residential Society Batch Dissolution</h3>
      <p>If a residential society batch fails to sustain the minimum 10 participating children, parents are offered either a transfer to a general kids fitness batch or a full 100% refund of unutilized advance fees.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-heading font-bold text-base text-white">3. Unverified Payments</h3>
      <p>Payments that cannot be matched against valid bank UTR records within 7 business days will be flagged for investigation and refunded to the remitting source account.</p>
    </section>
  </div>
);
