import { useState } from 'react';
import HomePage from '@/components/pages/HomePage';
import DoorsPage from '@/components/pages/DoorsPage';
import CabinetPage from '@/components/pages/CabinetPage';
import ReferralsPage from '@/components/pages/ReferralsPage';
import PrizesPage from '@/components/pages/PrizesPage';
import FaqPage from '@/components/pages/FaqPage';
import ContactsPage from '@/components/pages/ContactsPage';
import Navigation from '@/components/Navigation';

export type Page = 'home' | 'doors' | 'cabinet' | 'referrals' | 'prizes' | 'faq' | 'contacts';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'doors': return <DoorsPage />;
      case 'cabinet': return <CabinetPage />;
      case 'referrals': return <ReferralsPage />;
      case 'prizes': return <PrizesPage />;
      case 'faq': return <FaqPage />;
      case 'contacts': return <ContactsPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white font-golos">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}
