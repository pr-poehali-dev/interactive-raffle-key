import { useState } from 'react';
import { Page } from '@/pages/Index';
import Icon from '@/components/ui/icon';

const navItems: { id: Page; label: string; icon: string; emoji: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home', emoji: '🏠' },
  { id: 'doors', label: 'Двери', icon: 'DoorOpen', emoji: '🚪' },
  { id: 'cabinet', label: 'Кабинет', icon: 'User', emoji: '👤' },
  { id: 'referrals', label: 'Рефералы', icon: 'GitBranch', emoji: '🌳' },
  { id: 'prizes', label: 'Призы', icon: 'Trophy', emoji: '🏆' },
  { id: 'faq', label: 'FAQ', icon: 'HelpCircle', emoji: '❓' },
  { id: 'contacts', label: 'Контакты', icon: 'MessageCircle', emoji: '💬' },
];

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8"
        style={{ background: 'rgba(8, 12, 20, 0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
        <div className="flex items-center gap-3 mr-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-neon"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
            <span className="text-base">🔑</span>
          </div>
          <span className="font-russo text-xl" style={{ color: '#FFD700' }}>
            KEY<span className="text-white">DOORS</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'text-[#FFD700] bg-[rgba(255,215,0,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-white/20">
            Войти
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
            Регистрация
          </button>
        </div>

        <button className="md:hidden ml-auto p-2 text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? 'X' : 'Menu'} size={24} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-16 md:hidden"
          style={{ background: 'rgba(8, 12, 20, 0.98)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all ${
                  currentPage === item.id
                    ? 'text-[#FFD700] bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                {item.label}
              </button>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10">
                Войти
              </button>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-black"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
                Регистрация
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
