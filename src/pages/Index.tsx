import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import HomePage from '@/components/pages/HomePage';
import DoorsPage from '@/components/pages/DoorsPage';
import CabinetPage from '@/components/pages/CabinetPage';
import ReferralsPage from '@/components/pages/ReferralsPage';
import PrizesPage from '@/components/pages/PrizesPage';
import FaqPage from '@/components/pages/FaqPage';
import ContactsPage from '@/components/pages/ContactsPage';
import AdminPage from '@/components/pages/AdminPage';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/modals/AuthModal';
import DepositModal from '@/components/modals/DepositModal';
import ToastContainer from '@/components/ToastContainer';

export type Page = 'home' | 'doors' | 'cabinet' | 'referrals' | 'prizes' | 'faq' | 'contacts' | 'admin';

function AppInner() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, isLoading } = useApp();

  // Redirect admin to admin page after login
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070B12] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-rubik text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    // Admins auto see admin panel from cabinet
    if (currentPage === 'admin') {
      if (!user?.isAdmin) return <HomePage onNavigate={handleNavigate} />;
      return <AdminPage />;
    }
    switch (currentPage) {
      case 'home':      return <HomePage onNavigate={handleNavigate} />;
      case 'doors':     return <DoorsPage />;
      case 'cabinet':   return <CabinetPage onNavigate={handleNavigate} />;
      case 'referrals': return <ReferralsPage />;
      case 'prizes':    return <PrizesPage />;
      case 'faq':       return <FaqPage />;
      case 'contacts':  return <ContactsPage />;
      default:          return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-white font-rubik">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
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
