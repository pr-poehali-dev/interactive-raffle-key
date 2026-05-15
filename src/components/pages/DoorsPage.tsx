import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import BuyKeyModal from '@/components/modals/BuyKeyModal';
import WinModal from '@/components/modals/WinModal';
import Icon from '@/components/ui/icon';

type DoorStatus = 'locked' | 'available' | 'opening' | 'opened';

interface Door {
  id: number;
  level: number;
  name: string;
  keyPrice: number;
  minPrize: number;
  maxPrize: number;
  emoji: string;
  color: string;
  glowColor: string;
  status: DoorStatus;
  prize?: number;
}

const doorsData: Door[] = [
  { id: 1, level: 1, name: 'Деревянная', keyPrice: 100,   minPrize: 150,   maxPrize: 500,     emoji: '🚪', color: '#C4843A', glowColor: '#D4954A', status: 'available' },
  { id: 2, level: 2, name: 'Железная',   keyPrice: 500,   minPrize: 700,   maxPrize: 2500,    emoji: '🔩', color: '#9CA3AF', glowColor: '#D1D5DB', status: 'available' },
  { id: 3, level: 3, name: 'Серебряная', keyPrice: 1000,  minPrize: 1500,  maxPrize: 6000,    emoji: '🥈', color: '#C0C0C0', glowColor: '#E5E7EB', status: 'locked' },
  { id: 4, level: 4, name: 'Золотая',    keyPrice: 2500,  minPrize: 3500,  maxPrize: 15000,   emoji: '🥇', color: '#FFD700', glowColor: '#FDE047', status: 'locked' },
  { id: 5, level: 5, name: 'Платиновая', keyPrice: 5000,  minPrize: 7500,  maxPrize: 35000,   emoji: '💎', color: '#9B5DE5', glowColor: '#C084FC', status: 'locked' },
  { id: 6, level: 6, name: 'Алмазная',   keyPrice: 10000, minPrize: 15000, maxPrize: 80000,   emoji: '💠', color: '#00F5A0', glowColor: '#34D399', status: 'locked' },
  { id: 7, level: 7, name: 'Легендарная',keyPrice: 25000, minPrize: 40000, maxPrize: 250000,  emoji: '⚡', color: '#FF006E', glowColor: '#F472B6', status: 'locked' },
  { id: 8, level: 8, name: 'Мифическая', keyPrice: 50000, minPrize: 80000, maxPrize: 1000000, emoji: '🌟', color: '#FF6B00', glowColor: '#FBBF24', status: 'locked' },
];

export default function DoorsPage() {
  const { user, isLoggedIn, openDeposit, openAuth, openDoor, toast } = useApp();
  const [doors, setDoors] = useState<Door[]>(doorsData);
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [buyDoor, setBuyDoor] = useState<Door | null>(null);
  const [winData, setWinData] = useState<{ prize: number; door: Door } | null>(null);

  const handleBuyConfirm = async (door: Door) => {
    setBuyDoor(null);
    setOpeningId(door.id);
    toast('info', `Открываем ${door.name.toLowerCase()} дверь...`, door.emoji);
    const prize = await openDoor(door.name, door.keyPrice, door.minPrize, door.maxPrize);
    setOpeningId(null);
    if (prize !== null) {
      setDoors(prev => prev.map(d => d.id === door.id ? { ...d, status: 'opened', prize } : d));
      setWinData({ prize, door });
    }
  };

  const handleCardClick = (door: Door) => {
    if (door.status === 'locked') {
      toast('warning', `Дверь "${door.name}" пока недоступна`, '🔒');
      return;
    }
    if (door.status === 'opened') return;
    if (!isLoggedIn) { openAuth('login'); return; }
    setBuyDoor(door);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-oswald text-4xl md:text-5xl font-semibold text-white tracking-wide mb-1">
              🚪 ДВЕРИ
            </h1>
            <p className="text-gray-400 text-sm">Выбери дверь, купи ключ, выиграй приз</p>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)' }}
                onClick={openDeposit}
              >
                <span className="text-lg">💰</span>
                <div>
                  <div className="text-xs text-gray-400">Баланс</div>
                  <div className="font-oswald text-base font-semibold" style={{ color: '#FFD700' }}>₽{user.balance.toLocaleString()}</div>
                </div>
                <Icon name="Plus" size={14} className="text-gray-400" />
              </div>
            ) : (
              <button
                onClick={() => openAuth('register')}
                className="btn-ghost px-4 py-2.5 rounded-xl text-sm"
              >
                Войти для игры
              </button>
            )}
            <button
              onClick={openDeposit}
              className="btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
            >
              <Icon name="Plus" size={15} />
              Пополнить
            </button>
          </div>
        </div>

        {/* Doors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doors.map(door => (
            <div
              key={door.id}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: '#0C1220',
                border: `1px solid ${door.status === 'opened' ? 'rgba(0,245,160,0.3)' : 'rgba(255,255,255,0.06)'}`,
                opacity: door.status === 'locked' ? 0.55 : 1,
                transform: openingId === door.id ? 'scale(1.02)' : undefined,
                boxShadow: openingId === door.id ? `0 0 30px ${door.glowColor}40` : undefined,
              }}
              onClick={() => handleCardClick(door)}
            >
              {/* Visual area */}
              <div
                className="relative h-44 flex items-center justify-center"
                style={{ background: `radial-gradient(circle at 50% 65%, ${door.glowColor}18, transparent 70%)` }}
              >
                {/* Level badge */}
                <div
                  className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold font-oswald tracking-wide"
                  style={{ background: `${door.color}22`, color: door.color, border: `1px solid ${door.color}44` }}
                >
                  LVL {door.level}
                </div>

                {door.status === 'locked' && (
                  <div className="absolute top-3 right-3 text-gray-600">
                    <Icon name="Lock" size={15} />
                  </div>
                )}
                {door.status === 'opened' && (
                  <div
                    className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold"
                    style={{ background: 'rgba(0,245,160,0.12)', color: '#00F5A0', border: '1px solid rgba(0,245,160,0.3)' }}
                  >
                    ✅ Открыта
                  </div>
                )}

                <div
                  className={`text-7xl select-none transition-all duration-300 ${openingId === door.id ? 'animate-door-shake scale-125' : door.status !== 'locked' ? 'hover:scale-110' : ''}`}
                  style={{
                    filter: door.status === 'locked'
                      ? 'grayscale(1) brightness(0.6)'
                      : door.status === 'opened'
                        ? 'drop-shadow(0 0 12px rgba(0,245,160,0.6))'
                        : `drop-shadow(0 0 18px ${door.glowColor}70)`,
                  }}
                >
                  {door.status === 'opened' ? '🎁' : door.emoji}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 border-t border-white/5">
                <h3 className="font-oswald text-base font-semibold text-white tracking-wide mb-1">{door.name} дверь</h3>
                {door.status === 'opened' && door.prize ? (
                  <div className="text-center py-1">
                    <div className="text-xs text-gray-500 mb-0.5">Выигрыш</div>
                    <div className="font-oswald text-2xl font-bold text-glow-green" style={{ color: '#00F5A0' }}>
                      ₽{door.prize.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-gray-500 mb-3">
                      Приз: ₽{door.minPrize.toLocaleString()} – ₽{door.maxPrize.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold" style={{ color: door.color }}>
                        🔑 ₽{door.keyPrice.toLocaleString()}
                      </div>
                      {door.status === 'available' ? (
                        <button
                          onClick={e => { e.stopPropagation(); handleCardClick(door); }}
                          disabled={openingId === door.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-black transition-all hover:scale-105 disabled:opacity-50"
                          style={{ background: `linear-gradient(135deg, ${door.color}, ${door.glowColor})` }}
                        >
                          {openingId === door.id ? '⏳' : 'Открыть'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Icon name="Lock" size={11} />
                          Недоступно
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div
          className="mt-10 p-6 rounded-2xl"
          style={{ background: 'rgba(155,93,229,0.07)', border: '1px solid rgba(155,93,229,0.18)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h3 className="font-oswald text-lg font-semibold text-white tracking-wide">Как открыть дверь?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-sm text-gray-400">
            {[
              { n: '1️⃣', t: 'Пополни баланс картой или QR-кодом' },
              { n: '2️⃣', t: 'Выбери дверь и купи ключ по нужной цене' },
              { n: '3️⃣', t: 'Получи приз мгновенно на свой счёт' },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">{s.n}</span>
                <p>{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BuyKeyModal door={buyDoor} onClose={() => setBuyDoor(null)} onConfirm={handleBuyConfirm} />
      {winData && (
        <WinModal
          prize={winData.prize}
          doorName={winData.door.name}
          doorEmoji={winData.door.emoji}
          onClose={() => setWinData(null)}
        />
      )}
    </div>
  );
}