import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

const faqs = [
  {
    category: '🔑 Игровая механика',
    items: [
      { q: 'Как работает открытие дверей?', a: 'Вы покупаете ключ за фиксированную цену, затем открываете выбранную дверь. Система честно определяет ваш приз из заявленного диапазона. Каждое открытие независимо и проверяемо.' },
      { q: 'Гарантирован ли выигрыш при покупке ключа?', a: 'Да! При покупке ключа вы гарантированно получаете приз. Сумма определяется случайным образом в пределах диапазона, указанного для каждой двери.' },
      { q: 'Почему некоторые двери закрыты?', a: 'Высокоуровневые двери открываются по мере игровой активности. Открывайте доступные двери и накапливайте опыт — и более ценные двери станут доступны.' },
      { q: 'Можно ли открыть несколько дверей сразу?', a: 'Да, вы можете купить несколько ключей и открывать двери по одной. Одновременное открытие в разработке.' },
    ]
  },
  {
    category: '💳 Платежи и вывод',
    items: [
      { q: 'Какие способы пополнения доступны?', a: 'Банковские карты (Visa, Mastercard, МИР) и QR-код через СБП. Минимальное пополнение — ₽100.' },
      { q: 'Как быстро приходят деньги?', a: 'Пополнение через карту — мгновенно. QR-код — до 5 минут. Выплата выигрышей — от 5 минут до 24 часов.' },
      { q: 'Какая минимальная сумма вывода?', a: 'Минимальная сумма вывода — ₽500. Комиссия на вывод отсутствует.' },
      { q: 'Нужна ли верификация для вывода?', a: 'Для выводов до ₽15 000 верификация не нужна. Свыше — требуется подтверждение личности через Госуслуги.' },
    ]
  },
  {
    category: '🌳 Реферальная программа',
    items: [
      { q: 'Сколько уровней в реферальной программе?', a: '3 уровня: 10% от активности 1-го уровня, 5% — 2-го, 2% — 3-го.' },
      { q: 'Когда начисляются реферальные бонусы?', a: 'В реальном времени — как только ваш реферал открывает дверь, вы получаете начисление на счёт.' },
      { q: 'Есть ли ограничение на количество рефералов?', a: 'Нет никаких ограничений! Чем больше активных рефералов, тем выше ваш пассивный доход.' },
    ]
  },
  {
    category: '🛡️ Честность и безопасность',
    items: [
      { q: 'Как проверить честность розыгрыша?', a: 'Мы используем технологию Provably Fair — каждый розыгрыш имеет уникальный хеш для самостоятельной проверки. Инструмент доступен в Кабинете.' },
      { q: 'Безопасны ли мои данные?', a: 'Все данные шифруются по AES-256. Платёжные данные не хранятся на наших серверах — используется сертифицированный провайдер.' },
    ]
  },
];

export default function FaqPage() {
  const { openAuth } = useApp();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) =>
    setOpenItems(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-oswald text-4xl md:text-5xl font-semibold text-white tracking-wide mb-3">❓ FAQ</h1>
          <p className="text-gray-400">Ответы на частые вопросы о механике игры</p>
        </div>

        <div className="space-y-7">
          {faqs.map((section, si) => (
            <div key={si}>
              <h2 className="font-oswald text-base font-semibold text-gray-300 mb-3 tracking-wide">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const isOpen = openItems.includes(key);
                  return (
                    <div
                      key={ii}
                      className="rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        background: isOpen ? 'rgba(155,93,229,0.07)' : 'rgba(12,18,32,0.9)',
                        border: `1px solid ${isOpen ? 'rgba(155,93,229,0.28)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-5 text-left group"
                      >
                        <span className={`font-medium text-sm leading-relaxed pr-4 ${isOpen ? 'text-white' : 'text-gray-200 group-hover:text-white'} transition-colors`}>
                          {item.q}
                        </span>
                        <div
                          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: isOpen ? 'rgba(155,93,229,0.25)' : 'rgba(255,255,255,0.05)',
                            color: isOpen ? '#9B5DE5' : '#6B7280',
                          }}
                        >
                          <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={15} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div className="h-px mb-4" style={{ background: 'rgba(155,93,229,0.18)' }} />
                          <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div
          className="mt-14 p-8 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.06), rgba(155,93,229,0.06))', border: '1px solid rgba(255,215,0,0.15)' }}
        >
          <div className="text-5xl mb-4">💬</div>
          <h3 className="font-oswald text-xl font-semibold text-white mb-2 tracking-wide">Не нашли ответ?</h3>
          <p className="text-gray-400 text-sm mb-6">Служба поддержки ответит в течение 30 минут</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.open('https://t.me/keydoors_support', '_blank')}
              className="btn-gold px-6 py-3 rounded-xl text-sm font-oswald tracking-wide"
            >
              💬 Написать в Telegram
            </button>
            <button
              onClick={() => openAuth('login')}
              className="btn-ghost px-6 py-3 rounded-xl text-sm"
            >
              📧 Через личный кабинет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
