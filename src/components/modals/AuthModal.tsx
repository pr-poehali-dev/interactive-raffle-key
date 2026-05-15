import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

export default function AuthModal() {
  const { showAuth, authMode, closeAuth, login, register, openAuth } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAuth) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (authMode === 'login') await login(email, password);
      else await register(name, email, password);
      setEmail(''); setPassword(''); setName('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка. Попробуйте снова');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuth}>
      <div
        className="w-full max-w-md rounded-3xl p-8 animate-pop"
        style={{ background: '#0C1220', border: '1px solid rgba(255,215,0,0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(155,93,229,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-oswald text-2xl font-semibold text-white tracking-wide">
              {authMode === 'login' ? 'ВХОД В АККАУНТ' : 'РЕГИСТРАЦИЯ'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {authMode === 'login' ? 'Введите данные для входа' : 'Создайте новый аккаунт'}
            </p>
          </div>
          <button onClick={closeAuth} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all">
            <Icon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Имя</label>
              <input
                type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.07)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Пароль</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.07)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {authMode === 'register' && (
            <div className="flex items-start gap-3 pt-1">
              <div className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center"
                style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)' }}>
                <Icon name="Check" size={12} className="text-[#FFD700]" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                При регистрации на баланс зачисляется бесплатный бонус <span className="text-[#FFD700]">₽100</span> на первое открытие
              </p>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/25 bg-red-500/8">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 rounded-xl text-base mt-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                {authMode === 'login' ? 'Входим...' : 'Создаём...'}
              </span>
            ) : (
              authMode === 'login' ? '🔑 Войти' : '🚀 Создать аккаунт'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {authMode === 'login' ? (
            <>Нет аккаунта?{' '}
              <button onClick={() => openAuth('register')} className="text-[#FFD700] hover:underline">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>Уже есть аккаунт?{' '}
              <button onClick={() => openAuth('login')} className="text-[#FFD700] hover:underline">
                Войти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}