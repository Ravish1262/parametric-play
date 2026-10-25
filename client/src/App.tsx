import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QRModal } from './components/QRModal';
import { SchoolProposalModal } from './components/SchoolProposalModal';

// Pages
import { HomePage } from './pages/HomePage';
import { SchoolSportsPage } from './pages/SchoolSportsPage';
import { ResidentialSocietiesPage } from './pages/ResidentialSocietiesPage';
import { PersonalTrainingPage } from './pages/PersonalTrainingPage';
import { FindCoachPage } from './pages/FindCoachPage';
import { BecomeCoachPage } from './pages/BecomeCoachPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from './pages/LegalPages';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CoachDashboard } from './pages/CoachDashboard';
import { SchoolPortalPage } from './pages/SchoolPortalPage';
import { SocietyPortalPage } from './pages/SocietyPortalPage';

import { CoachProfile, SchoolEnquiry } from './types';

const MainApp: React.FC = () => {
  const { role } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);

  // QR Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<{
    title: string;
    amount: number;
    bookingCode: string;
    bookingId?: number;
  }>({
    title: 'Parametric Play Official Payment QR',
    amount: 2000,
    bookingCode: 'PP-OFFICIAL',
  });

  // Proposal Modal State
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedSchoolProposal, setSelectedSchoolProposal] = useState<SchoolEnquiry | null>(null);

  // Load public verified coaches
  useEffect(() => {
    fetch('/api/coaches')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.coaches) {
          setCoaches(data.coaches);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenQR = (title: string, amount: number, bookingCode = 'PP-OFFICIAL', bookingId?: number) => {
    setQrModalData({ title, amount, bookingCode, bookingId });
    setQrModalOpen(true);
  };

  const handleViewSchoolProposal = (school: SchoolEnquiry) => {
    setSelectedSchoolProposal(school);
    setProposalModalOpen(true);
  };

  const handleNavigateToDashboard = () => {
    switch (role) {
      case 'admin': setCurrentTab('dashboard-admin'); break;
      case 'coach': setCurrentTab('dashboard-coach'); break;
      case 'school_admin': setCurrentTab('dashboard-school'); break;
      case 'society_manager': setCurrentTab('dashboard-society'); break;
      case 'customer': setCurrentTab('dashboard-customer'); break;
      default: setCurrentTab('home'); break;
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-between text-slate-100 selection:bg-lime-400 selection:text-forest-950">
      
      <div>
        {/* Floating Persona Switcher */}
        <RoleSwitcherBar onNavigateToDashboard={handleNavigateToDashboard} />

        {/* Global Navigation Bar */}
        <Navbar currentTab={currentTab} onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />

        {/* Main Content Area */}
        <main>
          {currentTab === 'home' && (
            <HomePage 
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQR={handleOpenQR}
              coaches={coaches}
            />
          )}

          {currentTab === 'schools' && (
            <SchoolSportsPage onViewProposal={handleViewSchoolProposal} />
          )}

          {currentTab === 'societies' && (
            <ResidentialSocietiesPage />
          )}

          {currentTab === 'personal-training' && (
            <PersonalTrainingPage onOpenQR={handleOpenQR} coaches={coaches} />
          )}

          {currentTab === 'find-coach' && (
            <FindCoachPage 
              coaches={coaches} 
              onBookCoach={() => {
                setCurrentTab('personal-training');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          )}

          {currentTab === 'become-coach' && (
            <BecomeCoachPage />
          )}

          {currentTab === 'pricing' && (
            <PricingPage 
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQR={handleOpenQR}
            />
          )}

          {currentTab === 'about' && <AboutPage />}
          {currentTab === 'contact' && <ContactPage />}
          {currentTab === 'faq' && <FAQPage />}
          {currentTab === 'privacy-policy' && <PrivacyPolicyPage />}
          {currentTab === 'terms' && <TermsPage />}
          {currentTab === 'refund-policy' && <RefundPolicyPage />}

          {/* Role-Based Portals */}
          {currentTab === 'dashboard-admin' && (
            <AdminDashboard 
              onViewSchoolProposal={handleViewSchoolProposal} 
              onOpenQR={handleOpenQR} 
            />
          )}

          {currentTab === 'dashboard-customer' && (
            <CustomerDashboard 
              onOpenQR={handleOpenQR} 
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          )}

          {currentTab === 'dashboard-coach' && (
            <CoachDashboard />
          )}

          {currentTab === 'dashboard-school' && (
            <SchoolPortalPage onViewProposal={handleViewSchoolProposal} />
          )}

          {currentTab === 'dashboard-society' && (
            <SocietyPortalPage />
          )}
        </main>
      </div>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* QR Code & UPI Payment Modal */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={qrModalData.title}
        amount={qrModalData.amount}
        bookingCode={qrModalData.bookingCode}
        bookingId={qrModalData.bookingId}
      />

      {/* Official School Proposal Modal (Printable to PDF) */}
      <SchoolProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        school={selectedSchoolProposal}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};
