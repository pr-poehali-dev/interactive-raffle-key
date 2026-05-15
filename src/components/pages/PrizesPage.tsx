import { useState } from 'react';

const myPrizes = [
  { id: 1, name: 'iPhone 15 Pro', value: '₽120,000', door: 'Алмазная дверь', date: '10.04.2026', emoji: '📱', status: 'delivered', statusLabel: 'Получен' },
  { id: 2, name: 'Денежный приз', value: '₽15,400', door: 'Золотая дверь', date: '22.03.2026', emoji: '💰', status: 'paid', statusLabel: 'Выплачен' },
  { id: 3, name: 'MacBook Air M3', value: '₽145,000', door: 'Легендарная дверь', date: '05.02.2026', emoji: '💻', status: 'delivered', statusLabel: 'Получен' },
  { id: 4, name: 'Денежный приз', value: '₽8,500', door: 'Золотая дверь', date: '18.01.2026', emoji: '💵', status: 'paid', statusLabel: 'Выплачен' },
];

const recentDraws = [
  { id: 1, winner: 'Анна С.', city: 'Москва', prize: 'PlayStation 5', value: '₽55,000', door: 'Платиновая', date: '15.05.2026', emoji: '🎮', winnerEmoji: '👩' },
  { id: 2, winner: 'Игорь М.', city: 'СПб', prize: 'Денежный приз', value: '₽42,000', door: 'Золотая', date: '14.05.2026', emoji: '💰', winnerEmoji: '👨' },
  { id: 3, winner: 'Елена В.', city: 'Казань', prize: 'iPhone 15 Pro', value: '₽120,000', door: 'Алмазная', date: '13.05.2026', emoji: '📱', winnerEmoji: '👩' },
  { id: 4, winner: 'Сергей Д.', city: 'Новосиб', prize: 'Тур в Дубай', value: '₽180,000', door: 'Легендарная', date: '12.05.2026', emoji: '✈️', winnerEmoji: '👨' },
  { id: 5, winner: 'Мария К.', city: 'Ростов', prize: 'Денежный приз', value: '₽28,000', door: 'Платиновая', date: '11.05.2026', emoji: '💵', winnerEmoji: '👩' },
  { id: 6, winner: 'Алексей Н.', city: 'Уфа', prize: 'Samsung S24 Ultra', value: '₽95,000', door: 'Алмазная', date: '10.05.2026', emoji: '📲', winnerEmoji: '👨' },
];

const prizeCategories = [
  { emoji: '📱', name: 'Техника', count: 247, total: '₽12.4М' },
  { emoji: '💰', name: 'Деньги', count: 1840, total: '₽38.2М' },
  { emoji: '✈️', name: 'Путешествия', count: 63, total: '₽8.9М' },
  { emoji: '🎮', name: 'Игры', count: 412, total: '₽5.1М' },
];

export default function PrizesPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'recent'>('my');

  const totalWon = myPrizes.reduce((sum, p) => {
    const val = parseInt(p.value.replace(/[₽\s,]/g, ''));
    return sum + val;
  }, 0);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-russo text-4xl md:text-5xl text-white mb-2">🏆 ПРИЗЫ</h1>
          <p className="text-gray-400">Ваши победы и история розыгрышей</p>
        </div>

        {/* Prize categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {prizeCategories.map((cat, i) => (
            <div key={i} className="game-card rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="font-russo text-sm text-white mb-1">{cat.name}</div>
              <div className="text-xs text-gray-400">{cat.count} призов</div>
              <div className="text-xs font-semibold mt-1" style={{ color: '#FFD700' }}>{cat.total}</div>
            </div>
          ))}
        </div>

        {/* My total */}
        <div className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.15), rgba(255,215,0,0.08))', border: '1px solid rgba(155,93,229,0.3)' }}>
          <div className="text-6xl">🏆</div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-gray-400 text-sm mb-1">Всего выиграно</div>
            <div className="font-russo text-4xl md:text-5xl text-glow-yellow" style={{ color: '#FFD700' }}>
              ₽{totalWon.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center px-4">
              <div className="font-russo text-2xl text-white">{myPrizes.length}</div>
              <div className="text-xs text-gray-400">Призов</div>
            </div>
            <div className="text-center px-4">
              <div className="font-russo text-2xl" style={{ color: '#00F5A0' }}>100%</div>
              <div className="text-xs text-gray-400">Получено</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'my', label: '🏅 Мои призы' },
            { id: 'recent', label: '🎲 Недавние розыгрыши' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'text-[#080C14]' : 'text-gray-400 hover:text-white'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #FFD700, #FF6B00)' } : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'my' && (
          <div className="grid md:grid-cols-2 gap-5">
            {myPrizes.map((prize) => (
              <div key={prize.id} className="game-card rounded-2xl p-6 flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
                  {prize.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-russo text-base text-white mb-1">{prize.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{prize.door} · {prize.date}</div>
                  <div className="flex items-center gap-3">
                    <span className="font-russo text-lg" style={{ color: '#FFD700' }}>{prize.value}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      prize.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {prize.status === 'paid' ? '✅' : '📦'} {prize.statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="game-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {recentDraws.map((draw) => (
                <div key={draw.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                  <div className="text-3xl">{draw.winnerEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{draw.winner}</span>
                      <span className="text-xs text-gray-500">· {draw.city}</span>
                    </div>
                    <div className="text-xs text-gray-500">{draw.door} дверь · {draw.date}</div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-xl mb-0.5">{draw.emoji}</div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">{draw.prize}</div>
                  </div>
                  <div className="font-russo text-base text-right flex-shrink-0" style={{ color: '#FFD700' }}>
                    {draw.value}
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
