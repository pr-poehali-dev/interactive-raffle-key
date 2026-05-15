import Icon from '@/components/ui/icon';

interface Props {
  prize: number;
  doorName: string;
  doorEmoji: string;
  onClose: () => void;
}

export default function WinModal({ prize, doorName, doorEmoji, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center animate-bounce-in"
        style={{ background: '#0C1220', border: '1px solid rgba(255,215,0,0.4)', boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,215,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all" style={{ position: 'absolute' }}>
          <Icon name="X" size={18} />
        </button>

        <div className="text-7xl mb-2">🎊</div>
        <h2 className="font-oswald text-3xl font-bold text-white mb-1 tracking-wide">ПОЗДРАВЛЯЕМ!</h2>
        <p className="text-gray-400 text-sm mb-6">Ты открыл {doorName.toLowerCase()} дверь {doorEmoji}</p>

        <div className="rounded-2xl py-6 px-4 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,0,0.1))', border: '1px solid rgba(255,215,0,0.3)' }}>
          <div className="text-sm text-gray-400 mb-2">Твой выигрыш</div>
          <div className="font-oswald text-5xl font-bold text-glow-gold" style={{ color: '#FFD700' }}>
            ₽{prize.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-2">Зачислено на баланс</div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-gold flex-1 py-3 rounded-xl text-sm">
            🎮 Играть ещё
          </button>
        </div>
      </div>
    </div>
  );
}
