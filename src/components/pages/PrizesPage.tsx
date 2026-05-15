import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const myPrizes = [
  { id: 1, name: 'iPhone 15 Pro',   value: 120000, door: 'Алмазная дверь',     date: '10.04.2026', emoji: '📱', status: 'delivered', statusLabel: 'Получен' },
  { id: 2, name: 'Денежный приз',   value: 15400,  door: 'Золотая дверь',      date: '22.03.2026', emoji: '💰', status: 'paid',      statusLabel: 'Выплачен' },
  { id: 3, name: 'MacBook Air M3',  value: 145000, door: 'Легендарная дверь',  date: '05.02.2026', emoji: '💻', status: 'delivered', statusLabel: 'Получен' },
  { id: 4, name: 'Денежный приз',   value: 8500,   door: 'Золотая дверь',      date: '18.01.2026', emoji: '💵', status: 'paid',      statusLabel: 'Выплачен' },
];

const recentDraws = [
  { id: 1, winner: 'Анна С.',     city: 'Москва',    prize: 'PlayStation 5',    value: 55000,  door: 'Платиновая', date: '15.05.2026', emoji: '🎮', we: '👩' },
  { id: 2, winner: 'Игорь М.',    city: 'СПб',       prize: 'Денежный приз',    value: 42000,  door: 'Золотая',    date: '14.05.2026', emoji: '💰', we: '👨' },
  { id: 3, winner: 'Елена В.',    city: 'Казань',    prize: 'iPhone 15 Pro',    value: 120000, door: 'Алмазная',   date: '13.05.2026', emoji: '📱', we: '👩' },
  { id: 4, winner: 'Сергей Д.',   city: 'Новосиб',   prize: 'Тур в Дубай',      value: 180000, door: 'Легендарная',date: '12.05.2026', emoji: '✈️', we: '👨' },
  { id: 5, winner: 'Мария К.',    city: 'Ростов',    prize: 'Денежный приз',    value: 28000,  door: 'Платиновая', date: '11.05.2026', emoji: '💵', we: '👩' },
  { id: 6, winner: 'Алексей Н.',  city: 'Уфа',       prize: 'Samsung S24 Ultra',value: 95000,  door: 'Алмазная',   date: '10.05.2026', emoji: '📲', we: '👨' },
];

const cats = [
  { emoji: '📱', name: 'Техника',      count: 247,  total: '₽12.4М' },
  { emoji: '💰', name: 'Деньги',       count: 1840, total: '₽38.2М' },
  { emoji: '✈️', name: 'Путешествия', count: 63,   total: '₽8.9М'  },
  { emoji: '🎮', name: 'Игры',         count: 412,  total: '₽5.1М'  },
];

export default function PrizesPage() {
  const { isLoggedIn, openAuth } = useApp();
  const [activeTab, setActiveTab] = useState<'my' | 'recent'>('my');

  const totalWon = myPrizes.reduce((s, p) => s + p.value, 0);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-oswald text-4xl md:text-5xl font-semibold text-white tracking-wide mb-2">🏆 ПРИЗЫ</h1>
          <p className="text-gray-400 text-sm">Ваши победы и история розыгрышей</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {cats.map((c, i) => (
            <div key={i} className="game-card rounded-2xl p-5 text-center hover:scale-105 cursor-pointer">
              <div className="text-4xl mb-2">{c.emoji}</div>
              <div className="font-oswald text-sm font-semibold text-white mb-0.5 tracking-wide">{c.name}</div>
              <div className="text-xs text-gray-500">{c.count} призов</div>
              <div className="text-xs font-oswald font-semibold mt-1" style={{ color: '#FFD700' }}>{c.total}</div>
            </div>
          ))}
        </div>

        {/* Total won */}
        <div
          className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.12), rgba(255,215,0,0.07))', border: '1px solid rgba(155,93,229,0.25)' }}
        >
          <div className="text-6xl">🏆</div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-gray-400 text-sm mb-1">Всего выиграно</div>
            <div className="font-oswald text-4xl md:text-5xl font-bold text-glow-gold" style={{ color: '#FFD700' }}>
              ₽{totalWon.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-center">
              <div className="font-oswald text-2xl font-bold text-white">{myPrizes.length}</div>
              <div className="text-xs text-gray-400">Призов</div>
            </div>
            <div className="text-center">
              <div className="font-oswald text-2xl font-bold" style={{ color: '#00F5A0' }}>100%</div>
              <div className="text-xs text-gray-400">Получено</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'my',     label: '🏅 Мои призы' },
            { id: 'recent', label: '🎲 Недавние розыгрыши' },
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

        {activeTab === 'my' && (
          isLoggedIn ? (
            <div className="grid md:grid-cols-2 gap-5">
              {myPrizes.map(p => (
                <div key={p.id} className="game-card rounded-2xl p-5 flex gap-4 items-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.18)' }}
                  >
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-oswald text-base font-semibold text-white mb-0.5 tracking-wide">{p.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{p.door} · {p.date}</div>
                    <div className="flex items-center gap-3">
                      <span className="font-oswald text-lg font-bold" style={{ color: '#FFD700' }}>₽{p.value.toLocaleString()}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'paid' ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'}`}
                      >
                        {p.status === 'paid' ? '✅' : '📦'} {p.statusLabel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-gray-400 mb-5">Войдите, чтобы увидеть свои призы</p>
              <button onClick={() => openAuth('login')} className="btn-gold px-6 py-3 rounded-xl font-oswald tracking-wide">
                🔑 Войти
              </button>
            </div>
          )
        )}

        {activeTab === 'recent' && (
          <div className="game-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {recentDraws.map(d => (
                <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                  <div className="text-3xl flex-shrink-0">{d.we}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{d.winner}</span>
                      <span className="text-xs text-gray-500">· {d.city}</span>
                    </div>
                    <div className="text-xs text-gray-500">{d.door} дверь · {d.date}</div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-xl mb-0.5">{d.emoji}</div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">{d.prize}</div>
                  </div>
                  <div className="font-oswald text-base font-bold flex-shrink-0" style={{ color: '#FFD700' }}>
                    ₽{d.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
