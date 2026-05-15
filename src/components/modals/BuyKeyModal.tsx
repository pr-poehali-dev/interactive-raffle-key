import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

interface Door {
  id: number;
  name: string;
  emoji: string;
  keyPrice: number;
  minPrize: number;
  maxPrize: number;
  color: string;
  glowColor: string;
}

interface Props {
  door: Door | null;
  onClose: () => void;
  onConfirm: (door: Door) => void;
}

export default function BuyKeyModal({ door, onClose, onConfirm }: Props) {
  const { user, isLoggedIn, openAuth, openDeposit } = useApp();

  if (!door) return null;

  const canAfford = isLoggedIn && user && user.balance >= door.keyPrice;

  const handleConfirm = () => {
    if (!isLoggedIn) { openAuth('login'); return; }
    if (!canAfford) { openDeposit(); return; }
    onConfirm(door);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl p-8 animate-pop"
        style={{ background: '#0C1220', border: `1px solid ${door.color}40`, boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 40px ${door.color}15` }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all" style={{ position: 'absolute' }}>
          <Icon name="X" size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="text-8xl mb-3 animate-float" style={{ filter: `drop-shadow(0 0 20px ${door.glowColor}80)` }}>
            {door.emoji}
          </div>
          <h2 className="font-oswald text-2xl font-semibold text-white tracking-wide mb-1">
            {door.name} дверь
          </h2>
          <p className="text-sm text-gray-400">Купи ключ и открой дверь прямо сейчас</p>
        </div>

        <div className="rounded-2xl p-5 mb-5 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Стоимость ключа</span>
            <span className="font-semibold" style={{ color: door.color }}>₽{door.keyPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Минимальный приз</span>
            <span className="text-white font-semibold">₽{door.minPrize.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Максимальный приз</span>
            <span className="font-semibold text-glow-gold" style={{ color: '#FFD700' }}>₽{door.maxPrize.toLocaleString()}</span>
          </div>
          {isLoggedIn && user && (
            <>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ваш баланс</span>
                <span className={`font-semibold ${canAfford ? 'text-[#00F5A0]' : 'text-red-400'}`}>
                  ₽{user.balance.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {!isLoggedIn && (
          <p className="text-xs text-center text-gray-500 mb-4">Войдите в аккаунт, чтобы купить ключ</p>
        )}
        {isLoggedIn && !canAfford && (
          <p className="text-xs text-center text-red-400 mb-4">Недостаточно средств. Пополните баланс</p>
        )}

        <button
          onClick={handleConfirm}
          className="btn-gold w-full py-4 rounded-xl text-base"
          style={canAfford ? {} : { background: 'linear-gradient(135deg, #9B5DE5, #6B21A8)', color: '#fff' }}
        >
          {!isLoggedIn ? '🔑 Войти и купить' : !canAfford ? '💳 Пополнить баланс' : `🔑 Купить ключ — ₽${door.keyPrice.toLocaleString()}`}
        </button>
        <button onClick={onClose} className="btn-ghost w-full py-3 rounded-xl text-sm mt-3">
          Отмена
        </button>
      </div>
    </div>
  );
}
