import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { userApi } from '@/lib/api';
import { Page } from '@/pages/Index';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  doorName?: string;
  createdAt: string;
}

const TX_META: Record<string, { emoji: string; color: string; sign: string }> = {
  win:      { emoji: '🏆', color: '#FFD700', sign: '+' },
  deposit:  { emoji: '💳', color: '#00F5A0', sign: '+' },
  key:      { emoji: '🔑', color: '#9B5DE5', sign: '−' },
  referral: { emoji: '🌳', color: '#00F5A0', sign: '+' },
  withdraw: { emoji: '📤', color: '#FF6B00', sign: '−' },
  admin:    { emoji: '🛡️', color: '#FF006E', sign: '' },
  bonus:    { emoji: '🎁', color: '#00F5A0', sign: '+' },
};

interface Props {
  onNavigate: (page: Page) => void;
}

export default function CabinetPage({ onNavigate }: Props) {
  const { user, isLoggedIn, openAuth, openDeposit, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'payment'>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'history' && isLoggedIn) {
      setTxLoading(true);
      userApi.transactions().then(data => {
        if (data.transactions) setTransactions(data.transactions);
      }).finally(() => setTxLoading(false));
    }
  }, [activeTab, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-6">🔒</div>
          <h2 className="font-oswald text-3xl font-semibold text-white mb-3 tracking-wide">ЛИЧНЫЙ КАБИНЕТ</h2>
          <p className="text-gray-400 text-sm mb-8">Войдите в аккаунт, чтобы увидеть свой баланс, историю игр и настройки</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => openAuth('login')} className="btn-gold px-6 py-3 rounded-xl text-base font-oswald tracking-wide">
              🔑 Войти
            </button>
            <button onClick={() => openAuth('register')} className="btn-ghost px-6 py-3 rounded-xl text-sm">
              Регистрация
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.25), rgba(255,215,0,0.15))', border: '2px solid rgba(255,215,0,0.25)' }}
            >
              👤
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 border-2 border-[#070B12] flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-oswald text-3xl font-semibold text-white tracking-wide">{user!.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-sm text-gray-400">📧 {user!.email}</span>
              <span className="text-sm text-gray-400">📅 В игре с января 2026</span>
              {user!.isVip && (
                <span
                  className="px-2 py-0.5 rounded-md text-xs font-bold font-oswald"
                  style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
                >
                  🥇 VIP игрок
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {user!.isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-transform"
                style={{ background: 'rgba(255,0,110,0.15)', border: '1px solid rgba(255,0,110,0.3)', color: '#FF006E' }}
              >
                🛡️ Админ
              </button>
            )}
            <button
              onClick={openDeposit}
              className="btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
            >
              <Icon name="Plus" size={15} />
              Пополнить
            </button>
            <button
              onClick={logout}
              className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 border-red-500/20 hover:bg-red-500/5"
            >
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </div>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Основной баланс',  value: `₽${user!.balance.toLocaleString()}`, emoji: '💰', color: '#FFD700', desc: 'Доступно для игры', onClick: openDeposit },
            { label: 'Выигрыш всего',    value: `₽${user!.totalWon.toLocaleString()}`, emoji: '🏆', color: '#9B5DE5', desc: 'За всё время', onClick: () => onNavigate('prizes') },
            { label: 'Реферальный доход',value: `₽${user!.referralIncome.toLocaleString()}`, emoji: '🌳', color: '#00F5A0', desc: 'От команды', onClick: () => onNavigate('referrals') },
          ].map((c, i) => (
            <div
              key={i}
              className="game-card rounded-2xl p-6 cursor-pointer"
              onClick={c.onClick}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
              <div className="font-oswald text-2xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-sm text-gray-400">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'overview', label: '📊 Обзор' },
            { id: 'history',  label: '📜 История' },
            { id: 'payment',  label: '💳 Пополнение' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              style={activeTab === t.id ? { background: 'linear-gradient(135deg, #FFD700, #FF6B00)' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-oswald text-lg font-semibold text-white mb-4 tracking-wide">📈 Активность</h3>
              <div className="space-y-3">
                {[
                  { label: 'Открыто дверей', value: '47', emoji: '🚪' },
                  { label: 'Куплено ключей', value: '52', emoji: '🔑' },
                  { label: 'Лучший выигрыш', value: '₽15,400', emoji: '🎯' },
                  { label: 'Уровень игрока', value: String(user!.level), emoji: '⭐' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 flex items-center gap-2 text-sm">
                      <span>{item.emoji}</span>{item.label}
                    </span>
                    <span className="font-oswald font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-oswald text-lg font-semibold text-white mb-4 tracking-wide">🎖️ Достижения</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: '🥇', name: 'Первое золото', unlocked: true },
                  { emoji: '🔥', name: '10 побед',      unlocked: true },
                  { emoji: '🌟', name: '50 дверей',     unlocked: false },
                  { emoji: '💎', name: 'Алмазный',      unlocked: false },
                  { emoji: '👑', name: 'Легенда',        unlocked: false },
                  { emoji: '🚀', name: 'Ракета',         unlocked: false },
                ].map((a, i) => (
                  <div
                    key={i}
                    className={`text-center p-3 rounded-xl transition-all ${a.unlocked ? 'hover:scale-105' : 'opacity-30'}`}
                    style={{
                      background: a.unlocked ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${a.unlocked ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <div className="text-2xl mb-1">{a.emoji}</div>
                    <div className="text-xs text-gray-400 leading-tight">{a.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="game-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h3 className="font-oswald text-lg font-semibold text-white tracking-wide">История операций</h3>
            </div>
            {txLoading ? (
              <div className="p-10 flex justify-center">
                <div className="w-7 h-7 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-sm">Операций пока нет</div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map(tx => {
                  const meta = TX_META[tx.type] || { emoji: '💫', color: '#9B5DE5', sign: '' };
                  const date = new Date(tx.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  const isPositive = tx.amount > 0;
                  return (
                    <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `${meta.color}14` }}
                      >
                        {meta.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{tx.description || tx.doorName || tx.type}</div>
                        <div className="text-xs text-gray-500">{date}</div>
                      </div>
                      <div className={`font-oswald text-base font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}₽{Math.abs(tx.amount).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Payment */}
        {activeTab === 'payment' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="font-oswald text-xl text-white mb-3 tracking-wide">Пополнение баланса</h3>
            <p className="text-gray-400 text-sm mb-6">Выберите удобный способ пополнения</p>
            <button
              onClick={openDeposit}
              className="btn-gold px-8 py-4 rounded-xl font-oswald text-base tracking-wider"
              style={{ boxShadow: '0 0 25px rgba(255,215,0,0.3)' }}
            >
              Открыть форму пополнения
            </button>
          </div>
        )}
      </div>
    </div>
  );
}