import { useState } from 'react';
import Icon from '@/components/ui/icon';

const contacts = [
  { emoji: '💬', label: 'Telegram', value: '@keydoors_support', desc: 'Самый быстрый способ', href: '#', color: '#2AABEE' },
  { emoji: '📧', label: 'Email', value: 'support@keydoors.ru', desc: 'Ответим за 2 часа', href: 'mailto:support@keydoors.ru', color: '#9B5DE5' },
  { emoji: '📱', label: 'WhatsApp', value: '+7 (800) 555-35-35', desc: 'Пн-Вс с 9:00 до 23:00', href: '#', color: '#25D366' },
  { emoji: '📸', label: 'Instagram', value: '@keydoors_game', desc: 'Новости и розыгрыши', href: '#', color: '#E1306C' },
];

const offices = [
  { city: 'Москва', address: 'ул. Тверская, 24', phone: '+7 (495) 123-45-67', emoji: '🏙️' },
  { city: 'Санкт-Петербург', address: 'Невский пр., 88', phone: '+7 (812) 987-65-43', emoji: '🌉' },
];

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-russo text-4xl md:text-5xl text-white mb-2">💬 КОНТАКТЫ</h1>
          <p className="text-gray-400">Мы всегда на связи — выбери удобный способ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: contacts */}
          <div>
            <h2 className="font-russo text-xl text-white mb-5">Способы связи</h2>
            <div className="space-y-3 mb-8">
              {contacts.map((c, i) => (
                <a key={i} href={c.href}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer game-card">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                    {c.emoji}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{c.label}</div>
                    <div className="font-semibold text-white text-sm">{c.value}</div>
                    <div className="text-xs text-gray-500">{c.desc}</div>
                  </div>
                  <div className="ml-auto">
                    <Icon name="ChevronRight" size={16} className="text-gray-600" />
                  </div>
                </a>
              ))}
            </div>

            <h2 className="font-russo text-xl text-white mb-4">Офисы</h2>
            <div className="space-y-3">
              {offices.map((o, i) => (
                <div key={i} className="game-card rounded-2xl p-5 flex gap-4">
                  <span className="text-3xl">{o.emoji}</span>
                  <div>
                    <div className="font-russo text-base text-white mb-1">{o.city}</div>
                    <div className="text-sm text-gray-400">{o.address}</div>
                    <div className="text-sm" style={{ color: '#FFD700' }}>{o.phone}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Support hours */}
            <div className="mt-6 p-5 rounded-2xl" style={{ background: 'rgba(0,245,160,0.08)', border: '1px solid rgba(0,245,160,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
                <span className="text-sm font-semibold text-[#00F5A0]">Онлайн поддержка</span>
              </div>
              <div className="text-sm text-gray-400">
                Поддержка в чате доступна ежедневно с <span className="text-white font-semibold">9:00 до 23:00</span> по московскому времени.
                Среднее время ответа — <span className="text-white font-semibold">15 минут</span>.
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <h2 className="font-russo text-xl text-white mb-5">Написать нам</h2>
            <div className="game-card rounded-2xl p-6">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-russo text-xl text-white mb-2">Сообщение отправлено!</h3>
                  <p className="text-gray-400 text-sm">Мы ответим в течение 2 часов на ваш email</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Ваше имя</label>
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="ivan@example.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Категория</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-colors appearance-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <option value="" className="bg-[#0D1421]">Выберите тему</option>
                      <option value="payment" className="bg-[#0D1421]">💳 Платежи</option>
                      <option value="game" className="bg-[#0D1421]">🎮 Игровые вопросы</option>
                      <option value="prize" className="bg-[#0D1421]">🏆 Получение приза</option>
                      <option value="other" className="bg-[#0D1421]">💬 Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Сообщение</label>
                    <textarea
                      rows={5}
                      placeholder="Опишите ваш вопрос..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-russo text-base text-black hover:scale-[1.02] transition-transform"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
                    Отправить сообщение 📨
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
