import { useState } from 'react';
import Icon from '@/components/ui/icon';

const history = [
  { id: 1, type: 'win', door: 'Золотая дверь', amount: '+₽8,500', date: '15.05.2026 14:22', emoji: '🥇', color: '#FFD700' },
  { id: 2, type: 'deposit', door: 'Пополнение', amount: '+₽5,000', date: '15.05.2026 12:10', emoji: '💳', color: '#00F5A0' },
  { id: 3, type: 'key', door: 'Серебряная дверь', amount: '−₽1,000', date: '14.05.2026 20:44', emoji: '🔑', color: '#9B5DE5' },
  { id: 4, type: 'win', door: 'Серебряная дверь', amount: '+₽2,200', date: '14.05.2026 20:44', emoji: '🥈', color: '#C0C0C0' },
  { id: 5, type: 'key', door: 'Железная дверь', amount: '−₽500', date: '13.05.2026 11:05', emoji: '🔑', color: '#9B5DE5' },
  { id: 6, type: 'win', door: 'Железная дверь', amount: '+₽1,850', date: '13.05.2026 11:05', emoji: '🔩', color: '#6B7280' },
  { id: 7, type: 'referral', door: 'Реферальный бонус', amount: '+₽320', date: '12.05.2026 16:30', emoji: '🌳', color: '#00F5A0' },
  { id: 8, type: 'withdraw', door: 'Вывод средств', amount: '−₽10,000', date: '10.05.2026 09:00', emoji: '📤', color: '#FF6B00' },
];

export default function CabinetPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'payment'>('overview');

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.3), rgba(255,215,0,0.2))', border: '2px solid rgba(255,215,0,0.3)' }}>
              👤
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs bg-green-500 border-2 border-[#080C14]">✓</div>
          </div>
          <div className="flex-1">
            <h1 className="font-russo text-3xl text-white">Алексей К.</h1>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-sm text-gray-400">📧 alex@example.com</span>
              <span className="text-sm text-gray-400">📅 В игре с января 2026</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}>
                🥇 VIP игрок
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors border border-white/10 hover:border-white/20">
            <Icon name="Settings" size={16} />
            Настройки
          </button>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Основной баланс', value: '₽1,250', icon: '💰', color: '#FFD700', desc: 'Доступно для игры' },
            { label: 'Выигрыш всего', value: '₽24,370', icon: '🏆', color: '#9B5DE5', desc: 'За всё время' },
            { label: 'Реферальный доход', value: '₽3,840', icon: '🌳', color: '#00F5A0', desc: 'От команды' },
          ].map((card, i) => (
            <div key={i} className="game-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs text-gray-500">{card.desc}</span>
              </div>
              <div className="font-russo text-2xl mb-1" style={{ color: card.color }}>{card.value}</div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'overview', label: '📊 Обзор' },
            { id: 'history', label: '📜 История' },
            { id: 'payment', label: '💳 Пополнение' },
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

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-russo text-lg text-white mb-4">📈 Активность</h3>
              <div className="space-y-3">
                {[
                  { label: 'Открыто дверей', value: '47', emoji: '🚪' },
                  { label: 'Куплено ключей', value: '52', emoji: '🔑' },
                  { label: 'Лучший выигрыш', value: '₽15,400', emoji: '🎯' },
                  { label: 'Уровень игрока', value: '14', emoji: '⭐' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400 flex items-center gap-2 text-sm">
                      <span>{item.emoji}</span>{item.label}
                    </span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-russo text-lg text-white mb-4">🎖️ Достижения</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: '🥇', name: 'Первое золото', unlocked: true },
                  { emoji: '🔥', name: '10 побед', unlocked: true },
                  { emoji: '🌟', name: '50 дверей', unlocked: false },
                  { emoji: '💎', name: 'Алмазный', unlocked: false },
                  { emoji: '👑', name: 'Легенда', unlocked: false },
                  { emoji: '🚀', name: 'Ракета', unlocked: false },
                ].map((ach, i) => (
                  <div key={i} className={`text-center p-3 rounded-xl ${ach.unlocked ? '' : 'opacity-30'}`}
                    style={{ background: ach.unlocked ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${ach.unlocked ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                    <div className="text-2xl mb-1">{ach.emoji}</div>
                    <div className="text-xs text-gray-400">{ach.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="game-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h3 className="font-russo text-lg text-white">История операций</h3>
            </div>
            <div className="divide-y divide-white/5">
              {history.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${item.color}15` }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{item.door}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </div>
                  <div className={`font-russo text-base ${item.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-russo text-lg text-white mb-5">💳 Пополнение картой</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Сумма пополнения</label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {['500', '1 000', '2 500', '5 000'].map(amt => (
                      <button key={amt} className="px-3 py-1.5 rounded-lg text-sm border border-white/10 text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors">
                        ₽{amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Своя сумма, ₽"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Номер карты</label>
                  <input
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                </div>
                <button className="w-full py-3 rounded-xl font-russo text-black hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
                  Пополнить
                </button>
              </div>
            </div>
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-russo text-lg text-white mb-5">📱 Пополнение QR-кодом</h3>
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,215,0,0.3)' }}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">📷</div>
                    <div className="text-xs text-gray-400">QR-код</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 text-center mb-4">Отсканируй QR-код в приложении банка для быстрого пополнения</p>
                <button className="px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/15 hover:border-[#9B5DE5] hover:bg-[rgba(155,93,229,0.1)] transition-all">
                  Сгенерировать QR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
