import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import HomePage from '@/components/pages/HomePage';
import DoorsPage from '@/components/pages/DoorsPage';
import CabinetPage from '@/components/pages/CabinetPage';
import ReferralsPage from '@/components/pages/ReferralsPage';
import PrizesPage from '@/components/pages/PrizesPage';
import FaqPage from '@/components/pages/FaqPage';
import ContactsPage from '@/components/pages/ContactsPage';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/modals/AuthModal';
import DepositModal from '@/components/modals/DepositModal';
import ToastContainer from '@/components/ToastContainer';

export type Page = 'home' | 'doors' | 'cabinet' | 'referrals' | 'prizes' | 'faq' | 'contacts';

function AppInner() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':      return <HomePage onNavigate={setCurrentPage} />;
      case 'doors':     return <DoorsPage />;
      case 'cabinet':   return <CabinetPage onNavigate={setCurrentPage} />;
      case 'referrals': return <ReferralsPage />;
      case 'prizes':    return <PrizesPage />;
      case 'faq':       return <FaqPage />;
      case 'contacts':  return <ContactsPage />;
      default:          return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-white font-rubik">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-16">{renderPage()}</main>
      <AuthModal />
      <DepositModal />
      <ToastContainer />
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
