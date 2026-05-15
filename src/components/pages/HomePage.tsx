import { Page } from '@/pages/Index';
import Icon from '@/components/ui/icon';

interface Props {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '48,291', label: 'Игроков', emoji: '👥' },
  { value: '₽12.4M', label: 'Выплачено', emoji: '💰' },
  { value: '1,847', label: 'Призов сегодня', emoji: '🎁' },
  { value: '99.7%', label: 'Честных исходов', emoji: '✅' },
];

const features = [
  { emoji: '🚪', title: 'Двери с ключами', desc: 'Покупай ключи, открывай двери, выигрывай призы. Каждая дверь — это шанс!' },
  { emoji: '🌳', title: 'Реферальное дерево', desc: 'Приглашай друзей и зарабатывай с каждого их успеха. Ваш доход растёт вместе с командой.' },
  { emoji: '💳', title: 'Быстрые платежи', desc: 'Пополнение картой и QR-кодом. Мгновенный вывод выигрышей на счёт.' },
  { emoji: '🏆', title: 'Реальные призы', desc: 'Техника, деньги, путешествия. Честные розыгрыши с проверяемыми результатами.' },
];

export default function HomePage({ onNavigate }: Props) {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center hex-pattern px-4">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://cdn.poehali.dev/projects/4c55a585-db61-40df-9e90-b68bac7e8b78/files/29c6db98-0645-4f11-afc8-f19877e97c05.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            style={{ filter: 'blur(1px)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,12,20,0.3) 0%, rgba(8,12,20,0.6) 60%, rgba(8,12,20,1) 100%)' }} />
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #9B5DE5, transparent)' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', animationDelay: '0.1s' }}>
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            🔥 Сейчас онлайн: 2,847 игроков
          </div>

          <h1 className="font-russo text-5xl md:text-7xl lg:text-8xl mb-6 animate-fade-in-up leading-tight"
            style={{ animationDelay: '0.2s' }}>
            <span className="text-white">ОТКРОЙ</span>
            <br />
            <span className="text-glow-yellow" style={{ color: '#FFD700' }}>СВОЮ ДВЕРЬ</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.35s' }}>
            Покупай ключи, открывай двери и выигрывай реальные призы. <br className="hidden md:block" />
            Реферальная программа даёт доход с каждого уровня твоей команды.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => onNavigate('doors')}
              className="group relative px-8 py-4 rounded-xl font-russo text-lg text-black transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)', boxShadow: '0 0 30px rgba(255,215,0,0.4)' }}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                🚪 Начать игру
              </span>
            </button>
            <button
              onClick={() => onNavigate('referrals')}
              className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105"
              style={{ border: '1px solid rgba(155,93,229,0.5)', background: 'rgba(155,93,229,0.1)' }}>
              🌳 Реферальная программа
            </button>
          </div>

          <div className="mt-16 animate-float" style={{ animationDelay: '0.6s' }}>
            <div className="relative inline-block">
              <div className="text-[120px] md:text-[160px] leading-none select-none" style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.5))' }}>🚪</div>
              <div className="absolute -top-4 -right-8 text-5xl animate-key-spin" style={{ animationDuration: '4s' }}>🔑</div>
              <div className="absolute -bottom-2 -left-6 text-3xl animate-pulse">✨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="game-card rounded-2xl p-6 text-center" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="font-russo text-2xl md:text-3xl mb-1 text-glow-yellow" style={{ color: '#FFD700' }}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-russo text-3xl md:text-5xl mb-4 text-white">КАК ЭТО РАБОТАЕТ</h2>
            <p className="text-gray-400 text-lg">Простая механика — реальные деньги</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="game-card rounded-2xl p-8 flex gap-6 items-start">
                <div className="text-5xl flex-shrink-0">{f.emoji}</div>
                <div>
                  <h3 className="font-russo text-lg text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block p-10 rounded-3xl border" style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.1), rgba(255,215,0,0.05))', borderColor: 'rgba(155,93,229,0.2)' }}>
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="font-russo text-3xl md:text-4xl text-white mb-4">ГОТОВ К ИГРЕ?</h2>
            <p className="text-gray-400 mb-8">Зарегистрируйся бесплатно и получи первый ключ в подарок</p>
            <button className="px-10 py-4 rounded-xl font-russo text-lg text-black hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)', boxShadow: '0 0 40px rgba(255,215,0,0.4)' }}>
              🔑 Получить ключ бесплатно
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}