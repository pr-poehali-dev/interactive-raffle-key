import { Page } from '@/pages/Index';
import { useApp } from '@/context/AppContext';

interface Props {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '48 291', label: 'Игроков',       emoji: '👥' },
  { value: '₽12.4M', label: 'Выплачено',     emoji: '💰' },
  { value: '1 847',  label: 'Призов сегодня', emoji: '🎁' },
  { value: '99.7%',  label: 'Честных исходов',emoji: '✅' },
];

const features = [
  { emoji: '🚪', title: 'Двери с ключами',    desc: 'Покупай ключи, открывай двери, выигрывай призы. Каждая дверь — это шанс!' },
  { emoji: '🌳', title: 'Реферальное дерево', desc: 'Приглашай друзей и зарабатывай с каждого их успеха. Доход растёт вместе с командой.' },
  { emoji: '💳', title: 'Быстрые платежи',    desc: 'Пополнение картой и QR-кодом. Мгновенный вывод выигрышей на счёт.' },
  { emoji: '🏆', title: 'Реальные призы',     desc: 'Техника, деньги, путешествия. Честные розыгрыши с проверяемыми результатами.' },
];

export default function HomePage({ onNavigate }: Props) {
  const { openAuth, openDeposit, isLoggedIn } = useApp();

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center hex-pattern px-4">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://cdn.poehali.dev/projects/4c55a585-db61-40df-9e90-b68bac7e8b78/files/29c6db98-0645-4f11-afc8-f19877e97c05.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            style={{ filter: 'blur(2px)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,11,18,0.35) 0%, rgba(7,11,18,0.65) 55%, rgba(7,11,18,1) 100%)' }} />
          <div className="absolute top-24 left-12 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #9B5DE5, transparent)' }} />
          <div className="absolute bottom-24 right-12 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 animate-fade-in-up"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', animationDelay: '0.1s' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            🔥 Сейчас онлайн: 2 847 игроков
          </div>

          {/* Main heading */}
          <h1
            className="font-oswald text-5xl md:text-7xl lg:text-8xl mb-5 animate-fade-in-up leading-none tracking-wide"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-white">ОТКРОЙ</span>
            <br />
            <span className="text-glow-gold" style={{ color: '#FFD700' }}>СВОЮ ДВЕРЬ</span>
          </h1>

          <p
            className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto animate-fade-in-up leading-relaxed"
            style={{ animationDelay: '0.35s' }}
          >
            Покупай ключи, открывай двери и выигрывай реальные призы.<br className="hidden md:block" />
            Реферальная программа — доход с каждого уровня команды.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => onNavigate('doors')}
              className="btn-gold px-8 py-4 rounded-xl font-oswald text-lg tracking-wider"
              style={{ boxShadow: '0 0 35px rgba(255,215,0,0.3)' }}
            >
              🚪 Начать игру
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => openAuth('register')}
                className="px-8 py-4 rounded-xl font-oswald text-lg tracking-wider text-white transition-all hover:scale-105"
                style={{ border: '1px solid rgba(155,93,229,0.45)', background: 'rgba(155,93,229,0.08)' }}
              >
                🚀 Регистрация
              </button>
            ) : (
              <button
                onClick={openDeposit}
                className="px-8 py-4 rounded-xl font-oswald text-lg tracking-wider text-white transition-all hover:scale-105"
                style={{ border: '1px solid rgba(155,93,229,0.45)', background: 'rgba(155,93,229,0.08)' }}
              >
                💳 Пополнить
              </button>
            )}
          </div>

          {/* Floating door */}
          <div className="animate-float">
            <div className="relative inline-block">
              <div className="text-[110px] md:text-[140px] leading-none select-none" style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.45))' }}>🚪</div>
              <div className="absolute -top-3 -right-8 text-5xl animate-key-spin" style={{ animationDuration: '4s' }}>🔑</div>
              <div className="absolute -bottom-2 -left-4 text-3xl animate-pulse">✨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div key={i} className="game-card rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="font-oswald text-2xl md:text-3xl text-glow-gold mb-1" style={{ color: '#FFD700' }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-oswald text-3xl md:text-5xl font-semibold text-white tracking-wide mb-3">КАК ЭТО РАБОТАЕТ</h2>
            <p className="text-gray-400">Простая механика — реальные деньги</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className="game-card rounded-2xl p-7 flex gap-5 items-start">
                <div className="text-4xl flex-shrink-0">{f.emoji}</div>
                <div>
                  <h3 className="font-oswald text-lg font-semibold text-white mb-2 tracking-wide">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div
            className="p-10 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.1), rgba(255,215,0,0.06))', border: '1px solid rgba(155,93,229,0.2)' }}
          >
            <div className="text-5xl mb-5">🎯</div>
            <h2 className="font-oswald text-3xl md:text-4xl font-semibold text-white mb-3 tracking-wide">ГОТОВ К ИГРЕ?</h2>
            <p className="text-gray-400 text-sm mb-7">Зарегистрируйся бесплатно и получи первый ключ в подарок</p>
            <button
              onClick={() => isLoggedIn ? onNavigate('doors') : openAuth('register')}
              className="btn-gold px-10 py-4 rounded-xl font-oswald text-lg tracking-wider"
              style={{ boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}
            >
              {isLoggedIn ? '🚪 К дверям' : '🔑 Получить ключ бесплатно'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
