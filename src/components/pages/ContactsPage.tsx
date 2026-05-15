import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

const contacts = [
  { emoji: '💬', label: 'Telegram',  value: '@keydoors_support', desc: 'Самый быстрый способ', href: 'https://t.me/keydoors_support', color: '#2AABEE' },
  { emoji: '📧', label: 'Email',     value: 'support@keydoors.ru', desc: 'Ответим за 2 часа', href: 'mailto:support@keydoors.ru', color: '#9B5DE5' },
  { emoji: '📱', label: 'WhatsApp',  value: '+7 (800) 555-35-35',   desc: 'Пн-Вс с 9:00 до 23:00', href: 'https://wa.me/78005553535', color: '#25D366' },
  { emoji: '📸', label: 'Instagram', value: '@keydoors_game',       desc: 'Новости и розыгрыши', href: 'https://instagram.com/keydoors_game', color: '#E1306C' },
];

const offices = [
  { city: 'Москва', address: 'ул. Тверская, 24', phone: '+7 (495) 123-45-67', emoji: '🏙️' },
  { city: 'Санкт-Петербург', address: 'Невский пр., 88', phone: '+7 (812) 987-65-43', emoji: '🌉' },
];

export default function ContactsPage() {
  const { toast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast('success', 'Сообщение отправлено! Ответим в течение 2 часов', '✅');
    }, 800);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(255,215,0,0.45)';
    e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.06)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-oswald text-4xl md:text-5xl font-semibold text-white tracking-wide mb-2">💬 КОНТАКТЫ</h1>
          <p className="text-gray-400 text-sm">Мы всегда на связи — выбери удобный способ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left */}
          <div>
            <h2 className="font-oswald text-xl font-semibold text-white mb-5 tracking-wide">Способы связи</h2>
            <div className="space-y-3 mb-8">
              {contacts.map((c, i) => (
                <a
                  key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] game-card cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${c.color}14`, border: `1px solid ${c.color}28` }}
                  >
                    {c.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">{c.label}</div>
                    <div className="font-semibold text-white text-sm">{c.value}</div>
                    <div className="text-xs text-gray-500">{c.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={15} className="text-gray-600" />
                </a>
              ))}
            </div>

            <h2 className="font-oswald text-xl font-semibold text-white mb-4 tracking-wide">Офисы</h2>
            <div className="space-y-3 mb-6">
              {offices.map((o, i) => (
                <div key={i} className="game-card rounded-2xl p-5 flex gap-4">
                  <span className="text-3xl">{o.emoji}</span>
                  <div>
                    <div className="font-oswald text-base font-semibold text-white mb-0.5 tracking-wide">{o.city}</div>
                    <div className="text-sm text-gray-400">{o.address}</div>
                    <div className="text-sm font-medium" style={{ color: '#FFD700' }}>{o.phone}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Support hours */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(0,245,160,0.07)', border: '1px solid rgba(0,245,160,0.18)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
                <span className="text-sm font-semibold" style={{ color: '#00F5A0' }}>Онлайн поддержка</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ежедневно с <span className="text-white font-semibold">9:00 до 23:00</span> МСК.
                Среднее время ответа — <span className="text-white font-semibold">15 минут</span>.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <h2 className="font-oswald text-xl font-semibold text-white mb-5 tracking-wide">Написать нам</h2>
            <div className="game-card rounded-2xl p-6">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-bounce-in">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-oswald text-xl font-semibold text-white mb-2 tracking-wide">Сообщение отправлено!</h3>
                  <p className="text-gray-400 text-sm mb-5">Ответим в течение 2 часов на ваш email</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name:'', email:'', category:'', message:'' }); }}
                    className="btn-ghost px-5 py-2.5 rounded-xl text-sm"
                  >
                    Написать ещё раз
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Ваше имя</label>
                    <input
                      type="text" required placeholder="Иван Иванов"
                      value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email" required placeholder="ivan@example.com"
                      value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Категория</label>
                    <select
                      value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all appearance-none"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                    >
                      <option value="" className="bg-[#0C1220]">Выберите тему</option>
                      <option value="payment" className="bg-[#0C1220]">💳 Платежи</option>
                      <option value="game"    className="bg-[#0C1220]">🎮 Игровые вопросы</option>
                      <option value="prize"   className="bg-[#0C1220]">🏆 Получение приза</option>
                      <option value="other"   className="bg-[#0C1220]">💬 Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Сообщение</label>
                    <textarea
                      rows={5} required placeholder="Опишите ваш вопрос..."
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 transition-all resize-none"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full py-4 rounded-xl font-oswald text-base tracking-wider disabled:opacity-60"
                    style={{ boxShadow: '0 0 20px rgba(255,215,0,0.2)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Отправляем...
                      </span>
                    ) : 'Отправить сообщение 📨'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
