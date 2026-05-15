import { useState } from 'react';
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
  prize?: string;
}

const doorsData: Door[] = [
  { id: 1, level: 1, name: 'Деревянная', keyPrice: 100, minPrize: 150, maxPrize: 500, emoji: '🚪', color: '#8B5E3C', glowColor: '#C4843A', status: 'available' },
  { id: 2, level: 2, name: 'Железная', keyPrice: 500, minPrize: 700, maxPrize: 2500, emoji: '🔩', color: '#6B7280', glowColor: '#9CA3AF', status: 'available' },
  { id: 3, level: 3, name: 'Серебряная', keyPrice: 1000, minPrize: 1500, maxPrize: 6000, emoji: '🥈', color: '#C0C0C0', glowColor: '#E5E7EB', status: 'locked' },
  { id: 4, level: 4, name: 'Золотая', keyPrice: 2500, minPrize: 3500, maxPrize: 15000, emoji: '🥇', color: '#FFD700', glowColor: '#FDE047', status: 'locked' },
  { id: 5, level: 5, name: 'Платиновая', keyPrice: 5000, minPrize: 7500, maxPrize: 35000, emoji: '💎', color: '#9B5DE5', glowColor: '#C084FC', status: 'locked' },
  { id: 6, level: 6, name: 'Алмазная', keyPrice: 10000, minPrize: 15000, maxPrize: 80000, emoji: '💠', color: '#00F5A0', glowColor: '#34D399', status: 'locked' },
  { id: 7, level: 7, name: 'Легендарная', keyPrice: 25000, minPrize: 40000, maxPrize: 250000, emoji: '⚡', color: '#FF006E', glowColor: '#F472B6', status: 'locked' },
  { id: 8, level: 8, name: 'Мифическая', keyPrice: 50000, minPrize: 80000, maxPrize: 1000000, emoji: '🌟', color: '#FF6B00', glowColor: '#FBBF24', status: 'locked' },
];

export default function DoorsPage() {
  const [doors, setDoors] = useState<Door[]>(doorsData);
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const balance = 1250;

  const handleOpen = (door: Door) => {
    if (door.status !== 'available') return;
    setOpeningId(door.id);
    setTimeout(() => {
      const prize = Math.floor(Math.random() * (door.maxPrize - door.minPrize) + door.minPrize);
      setDoors(prev => prev.map(d => d.id === door.id ? { ...d, status: 'opened', prize: `₽${prize.toLocaleString()}` } : d));
      setOpeningId(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-russo text-4xl md:text-5xl text-white mb-2">
              🚪 ДВЕРИ
            </h1>
            <p className="text-gray-400">Выбери дверь, купи ключ, выиграй приз</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
              style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
              <span className="text-xl">💰</span>
              <div>
                <div className="text-xs text-gray-400">Баланс</div>
                <div className="font-russo text-lg" style={{ color: '#FFD700' }}>₽{balance.toLocaleString()}</div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-black text-sm hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
              <Icon name="Plus" size={16} />
              Пополнить
            </button>
          </div>
        </div>

        {/* Doors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doors.map((door) => (
            <div key={door.id}
              className="game-card rounded-2xl overflow-hidden cursor-pointer"
              style={{ opacity: door.status === 'locked' ? 0.6 : 1 }}
              onClick={() => door.status === 'available' && setSelectedDoor(door)}>

              {/* Door visual */}
              <div className="relative h-40 flex items-center justify-center"
                style={{ background: `radial-gradient(circle at 50% 60%, ${door.glowColor}20, transparent 70%)` }}>

                {/* Level badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold"
                  style={{ background: `${door.color}30`, color: door.color, border: `1px solid ${door.color}50` }}>
                  LVL {door.level}
                </div>

                {door.status === 'locked' && (
                  <div className="absolute top-3 right-3">
                    <Icon name="Lock" size={16} className="text-gray-500" />
                  </div>
                )}

                {door.status === 'opened' && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    ✅ Открыта
                  </div>
                )}

                <div className={`text-7xl transition-all duration-300 ${openingId === door.id ? 'animate-door-shake scale-125' : 'hover:scale-110'}`}
                  style={{ filter: door.status === 'locked' ? 'grayscale(1)' : `drop-shadow(0 0 15px ${door.glowColor}60)` }}>
                  {door.status === 'opened' ? '🎁' : door.emoji}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-russo text-base text-white mb-1">{door.name} дверь</h3>

                {door.status === 'opened' ? (
                  <div className="text-center py-2">
                    <div className="text-xs text-gray-400 mb-1">Выигрыш</div>
                    <div className="font-russo text-xl text-glow-green" style={{ color: '#00F5A0' }}>{door.prize}</div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-xs text-gray-400 mb-3">
                      <span>Приз: ₽{door.minPrize.toLocaleString()}–{door.maxPrize.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs" style={{ color: door.color }}>
                        🔑 ₽{door.keyPrice.toLocaleString()}
                      </div>
                      {door.status === 'available' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpen(door); }}
                          disabled={openingId === door.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-black hover:scale-105 transition-transform disabled:opacity-50"
                          style={{ background: `linear-gradient(135deg, ${door.color}, ${door.glowColor})` }}>
                          {openingId === door.id ? '...' : 'Открыть'}
                        </button>
                      ) : (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Icon name="Lock" size={12} />
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

        {/* Info block */}
        <div className="mt-10 p-6 rounded-2xl" style={{ background: 'rgba(155,93,229,0.08)', border: '1px solid rgba(155,93,229,0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h3 className="font-russo text-lg text-white">Как открыть дверь?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">1️⃣</span>
              <p>Пополни баланс картой или QR-кодом</p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">2️⃣</span>
              <p>Выбери дверь и купи ключ по нужной цене</p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">3️⃣</span>
              <p>Получи приз мгновенно на свой счёт</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
