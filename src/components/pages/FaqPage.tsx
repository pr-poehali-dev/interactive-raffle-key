import { useState } from 'react';
import Icon from '@/components/ui/icon';

const faqs = [
  {
    category: '🔑 Игровая механика',
    items: [
      { q: 'Как работает открытие дверей?', a: 'Вы покупаете ключ за фиксированную цену, затем открываете выбранную дверь. Система честно определяет ваш приз из заявленного диапазона. Каждое открытие независимо и проверяемо.' },
      { q: 'Гарантирован ли выигрыш при покупке ключа?', a: 'Да! При покупке ключа вы гарантированно получаете приз. Сумма определяется случайным образом в пределах диапазона, указанного для каждой двери. Минимальный приз всегда превышает стоимость ключа на деревянной двери.' },
      { q: 'Почему некоторые двери закрыты?', a: 'Высокоуровневые двери открываются по мере игровой активности. Открывайте доступные двери и накапливайте опыт — и более ценные двери станут доступны.' },
      { q: 'Можно ли открыть несколько дверей сразу?', a: 'Да, вы можете купить несколько ключей и открывать двери по одной. Одновременное открытие пока не доступно, но мы работаем над этой функцией.' },
    ]
  },
  {
    category: '💳 Платежи и вывод',
    items: [
      { q: 'Какие способы пополнения доступны?', a: 'Мы принимаем банковские карты (Visa, Mastercard, МИР) и оплату по QR-коду через систему быстрых платежей. Минимальное пополнение — ₽100.' },
      { q: 'Как быстро приходят деньги?', a: 'Пополнение через карту — мгновенно. QR-код — до 5 минут. Выплата выигрышей на карту — от 5 минут до 24 часов.' },
      { q: 'Какая минимальная сумма вывода?', a: 'Минимальная сумма вывода составляет ₽500. Комиссия на вывод отсутствует.' },
      { q: 'Нужна ли верификация для вывода?', a: 'Для выводов до ₽15,000 верификация не требуется. При превышении этой суммы попросим подтвердить личность через Госуслуги.' },
    ]
  },
  {
    category: '🌳 Реферальная программа',
    items: [
      { q: 'Сколько уровней в реферальной программе?', a: 'Программа работает на 3 уровня. Вы получаете 10% от активности рефералов 1-го уровня, 5% — 2-го, и 2% — 3-го уровня.' },
      { q: 'Когда начисляются реферальные бонусы?', a: 'Бонусы начисляются в реальном времени — как только ваш реферал открывает дверь, вы получаете начисление на счёт.' },
      { q: 'Есть ли ограничение на количество рефералов?', a: 'Нет никаких ограничений! Чем больше активных рефералов вы приведёте, тем выше ваш пассивный доход.' },
    ]
  },
  {
    category: '🛡️ Честность и безопасность',
    items: [
      { q: 'Как проверить честность розыгрыша?', a: 'Мы используем технологию Provably Fair — каждый розыгрыш имеет уникальный хеш, который можно проверить самостоятельно. Инструмент проверки доступен в разделе "Кабинет".' },
      { q: 'Безопасны ли мои данные?', a: 'Все данные шифруются по стандарту AES-256. Платёжные данные не хранятся на наших серверах — мы используем сертифицированного платёжного провайдера.' },
    ]
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) => {
    setOpenItems(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="font-russo text-4xl md:text-5xl text-white mb-3">❓ FAQ</h1>
          <p className="text-gray-400">Ответы на частые вопросы о механике игры</p>
        </div>

        <div className="space-y-6">
          {faqs.map((section, si) => (
            <div key={si}>
              <h2 className="font-russo text-lg text-white mb-3">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const isOpen = openItems.includes(key);
                  return (
                    <div key={ii} className="rounded-2xl overflow-hidden transition-all"
                      style={{ background: isOpen ? 'rgba(155,93,229,0.08)' : 'rgba(13,20,33,0.8)', border: `1px solid ${isOpen ? 'rgba(155,93,229,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-5 text-left group">
                        <span className={`font-semibold text-sm leading-relaxed ${isOpen ? 'text-white' : 'text-gray-200'} group-hover:text-white transition-colors`}>
                          {item.q}
                        </span>
                        <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? '' : ''}`}
                          style={{ background: isOpen ? 'rgba(155,93,229,0.3)' : 'rgba(255,255,255,0.06)', color: isOpen ? '#9B5DE5' : '#9CA3AF' }}>
                          <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div className="h-px mb-4" style={{ background: 'rgba(155,93,229,0.2)' }} />
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

        {/* Still have questions */}
        <div className="mt-12 p-8 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(155,93,229,0.08))', border: '1px solid rgba(255,215,0,0.2)' }}>
          <div className="text-5xl mb-4">💬</div>
          <h3 className="font-russo text-xl text-white mb-2">Не нашли ответ?</h3>
          <p className="text-gray-400 text-sm mb-5">Наша служба поддержки ответит в течение 30 минут</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 rounded-xl font-semibold text-sm text-black hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
              💬 Написать в чат
            </button>
            <button className="px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/15 hover:border-white/30 transition-all">
              📱 Telegram-поддержка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
