import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function DepositModal() {
  const { showDeposit, closeDeposit, addBalance } = useApp();
  const [tab, setTab] = useState<'card' | 'qr'>('card');
  const [amount, setAmount] = useState('');
  const [card, setCard] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showDeposit) return null;

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount);
    if (!num || num < 100) return;
    setLoading(true);
    setTimeout(() => {
      addBalance(num);
      setLoading(false);
      setAmount('');
      setCard('');
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={closeDeposit}>
      <div
        className="w-full max-w-md rounded-3xl p-8 animate-pop"
        style={{ background: '#0C1220', border: '1px solid rgba(255,215,0,0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-oswald text-2xl font-semibold text-white tracking-wide">ПОПОЛНЕНИЕ</h2>
          <button onClick={closeDeposit} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[{ id: 'card', label: '💳 Карта' }, { id: 'qr', label: '📱 QR-код' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'card' | 'qr')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              style={tab === t.id ? { background: 'linear-gradient(135deg, #FFD700, #FF6B00)' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'card' && (
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Сумма пополнения</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {QUICK_AMOUNTS.map(a => (
                  <button
                    key={a} type="button"
                    onClick={() => setAmount(String(a))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${String(a) === amount ? 'text-black' : 'text-gray-300 border border-white/10 hover:border-[#FFD700]/50 hover:text-[#FFD700]'}`}
                    style={String(a) === amount ? { background: 'linear-gradient(135deg, #FFD700, #FF6B00)' } : {}}
                  >
                    ₽{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number" min="100" placeholder="Своя сумма, минимум ₽100"
                value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Номер карты</label>
              <input
                type="text" placeholder="0000 0000 0000 0000"
                value={card} onChange={e => setCard(formatCard(e.target.value))}
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all font-oswald tracking-wider"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <button type="submit" disabled={loading || !amount} className="btn-gold w-full py-4 rounded-xl text-base mt-2 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Обрабатываем...
                </span>
              ) : `Пополнить ${amount ? `₽${parseInt(amount).toLocaleString()}` : ''}`}
            </button>
            <p className="text-xs text-gray-600 text-center">Безопасная оплата через защищённый канал</p>
          </form>
        )}

        {tab === 'qr' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-52 h-52 rounded-2xl flex flex-col items-center justify-center gap-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,215,0,0.25)' }}>
              <span className="text-5xl">📷</span>
              <span className="text-xs text-gray-500">QR-код появится здесь</span>
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-400 mb-2">Сумма</label>
              <input
                type="number" min="100" placeholder="Введите сумму"
                value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 mb-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <button
                onClick={() => { if (amount && parseInt(amount) >= 100) { setLoading(true); setTimeout(() => { addBalance(parseInt(amount)); setLoading(false); }, 800); } }}
                className="btn-gold w-full py-4 rounded-xl text-base"
              >
                {loading ? 'Генерируем QR...' : '📱 Сгенерировать QR-код'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">Отсканируй QR в приложении банка через СБП</p>
          </div>
        )}
      </div>
    </div>
  );
}
