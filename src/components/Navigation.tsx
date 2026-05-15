import { useState } from 'react';
import { Page } from '@/pages/Index';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

const navItems: { id: Page; label: string; emoji: string }[] = [
  { id: 'home',      label: 'Главная',  emoji: '🏠' },
  { id: 'doors',     label: 'Двери',    emoji: '🚪' },
  { id: 'cabinet',   label: 'Кабинет',  emoji: '👤' },
  { id: 'referrals', label: 'Рефералы', emoji: '🌳' },
  { id: 'prizes',    label: 'Призы',    emoji: '🏆' },
  { id: 'faq',       label: 'FAQ',      emoji: '❓' },
  { id: 'contacts',  label: 'Контакты', emoji: '💬' },
];

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: Props) {
  const { isLoggedIn, user, openAuth, logout, openDeposit } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8"
        style={{ background: 'rgba(7,11,18,0.92)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 mr-8 flex-shrink-0"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-neon"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}
          >
            <span className="text-sm">🔑</span>
          </div>
          <span className="font-oswald text-xl font-semibold tracking-widest" style={{ color: '#FFD700' }}>
            KEY<span className="text-white">DOORS</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'text-[#FFD700] bg-[rgba(255,215,0,0.08)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/4'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {isLoggedIn && user ? (
            <>
              <button
                onClick={openDeposit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
              >
                <span>💰</span>
                <span className="font-oswald font-semibold">₽{user.balance.toLocaleString()}</span>
                <Icon name="Plus" size={14} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-white/8"
                >
                  <span>👤</span>
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                  <Icon name="ChevronDown" size={14} />
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 animate-slide-down"
                    style={{ background: '#0C1220', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                  >
                    <button
                      onClick={() => { onNavigate('cabinet'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span>👤</span> Мой кабинет
                    </button>
                    <button
                      onClick={() => { openDeposit(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span>💳</span> Пополнить баланс
                    </button>
                    {user?.isAdmin && (
                      <button
                        onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/5 transition-colors"
                        style={{ color: '#FF006E' }}
                      >
                        <span>🛡️</span> Панель администратора
                      </button>
                    )}
                    <div className="my-1 h-px mx-3" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <Icon name="LogOut" size={14} /> Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuth('login')}
                className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium"
              >
                Войти
              </button>
              <button
                onClick={() => openAuth('register')}
                className="btn-gold px-4 py-2 rounded-lg text-sm"
              >
                Регистрация
              </button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden ml-auto p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'X' : 'Menu'} size={24} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 pt-16 md:hidden"
          style={{ background: 'rgba(7,11,18,0.98)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col p-4 gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                  currentPage === item.id
                    ? 'text-[#FFD700] bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.15)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/4 border border-transparent'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-oswald tracking-wide">{item.label}</span>
              </button>
            ))}

            <div className="mt-4 pt-4 border-t border-white/8 flex flex-col gap-3">
              {isLoggedIn && user ? (
                <>
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}
                  >
                    <span className="text-sm text-gray-300">Баланс</span>
                    <span className="font-oswald text-lg" style={{ color: '#FFD700' }}>₽{user.balance.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => { openDeposit(); setMenuOpen(false); }}
                    className="btn-gold w-full py-3 rounded-xl text-sm"
                  >
                    💳 Пополнить
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="btn-ghost w-full py-3 rounded-xl text-sm text-red-400 border-red-500/20 hover:bg-red-500/5"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { openAuth('login'); setMenuOpen(false); }}
                    className="btn-ghost w-full py-3 rounded-xl text-sm font-semibold"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => { openAuth('register'); setMenuOpen(false); }}
                    className="btn-gold w-full py-3 rounded-xl text-sm"
                  >
                    Регистрация
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Close user dropdown on outside click */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}