import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/ui/icon';

interface TreeNode {
  id: number;
  name: string;
  emoji: string;
  level: number;
  income: string;
  isYou?: boolean;
  children?: TreeNode[];
}

const tree: TreeNode = {
  id: 0, name: 'Вы', emoji: '👤', level: 1, income: '₽3 840', isYou: true,
  children: [
    { id: 1, name: 'Михаил Р.', emoji: '👨', level: 2, income: '₽1 200', children: [
      { id: 4, name: 'Анна С.',    emoji: '👩', level: 3, income: '₽340' },
      { id: 5, name: 'Дмитрий В.',emoji: '👨', level: 3, income: '₽510' },
      { id: 6, name: 'Ольга Н.',  emoji: '👩', level: 3, income: '₽180' },
    ]},
    { id: 2, name: 'Светлана К.', emoji: '👩', level: 2, income: '₽890', children: [
      { id: 7, name: 'Игорь М.',   emoji: '👨', level: 3, income: '₽220' },
      { id: 8, name: 'Татьяна П.',emoji: '👩', level: 3, income: '₽400' },
    ]},
    { id: 3, name: 'Андрей Л.', emoji: '👨', level: 2, income: '₽650', children: [
      { id: 9, name: 'Наталья О.',emoji: '👩', level: 3, income: '₽160' },
    ]},
  ],
};

const lvlColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: 'rgba(255,215,0,0.12)',  border: 'rgba(255,215,0,0.45)',  text: '#FFD700' },
  2: { bg: 'rgba(155,93,229,0.12)', border: 'rgba(155,93,229,0.45)', text: '#9B5DE5' },
  3: { bg: 'rgba(0,245,160,0.08)',  border: 'rgba(0,245,160,0.3)',   text: '#00F5A0' },
};

function TreeNodeCard({ node }: { node: TreeNode }) {
  const c = lvlColors[node.level] || lvlColors[3];
  return (
    <div className="flex flex-col items-center">
      <div className="relative p-3 rounded-2xl text-center min-w-[100px] transition-all hover:scale-105 cursor-pointer"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        {node.isYou && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold font-oswald tracking-wide text-black"
            style={{ background: '#FFD700' }}>
            ВЫ
          </div>
        )}
        <div className="text-2xl mb-1 mt-1">{node.emoji}</div>
        <div className="text-xs font-semibold text-white whitespace-nowrap leading-tight">{node.name}</div>
        <div className="text-xs mt-0.5 font-oswald font-semibold" style={{ color: c.text }}>{node.income}</div>
      </div>
      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-5" style={{ background: c.border }} />
          <div className="flex items-start gap-5 md:gap-8">
            {node.children.map(child => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4" style={{ background: lvlColors[child.level]?.border || '#9B5DE5' }} />
                <TreeNodeCard node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ReferralsPage() {
  const { isLoggedIn, openAuth, toast } = useApp();
  const [copied, setCopied] = useState(false);
  const refLink = 'https://keydoors.ru/ref/alex_k_99';

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink).then(() => {
      setCopied(true);
      toast('success', 'Ссылка скопирована!', '🔗');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (platform: string) => {
    const msg = `Присоединяйся к KeyDoors! Открывай двери и выигрывай призы: ${refLink}`;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(msg)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('Присоединяйся к KeyDoors!')}`,
      vk: `https://vk.com/share.php?url=${encodeURIComponent(refLink)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-6">🌳</div>
          <h2 className="font-oswald text-3xl font-semibold text-white mb-3 tracking-wide">РЕФЕРАЛЫ</h2>
          <p className="text-gray-400 text-sm mb-8">Войдите, чтобы увидеть своё реферальное дерево и доход от команды</p>
          <button onClick={() => openAuth('login')} className="btn-gold px-6 py-3 rounded-xl font-oswald tracking-wide">
            🔑 Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-oswald text-4xl md:text-5xl font-semibold text-white tracking-wide mb-2">🌳 РЕФЕРАЛЫ</h1>
          <p className="text-gray-400 text-sm">Ваше родовое дерево и статистика команды</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { emoji: '👥', value: '21',      label: 'В команде',     color: '#FFD700' },
            { emoji: '💰', value: '₽3 840',  label: 'Ваш доход',     color: '#00F5A0' },
            { emoji: '🔗', value: '3',        label: 'Уровня дерева', color: '#9B5DE5' },
            { emoji: '📈', value: '+₽320',   label: 'За сегодня',    color: '#FF6B00' },
          ].map((s, i) => (
            <div key={i} className="game-card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="font-oswald text-xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ref link */}
        <div className="game-card rounded-2xl p-6 mb-8" style={{ border: '1px solid rgba(255,215,0,0.15)' }}>
          <h3 className="font-oswald text-lg font-semibold text-white mb-4 tracking-wide">🔗 Ваша реферальная ссылка</h3>
          <div className="flex gap-3 mb-4">
            <div
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap font-mono"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {refLink}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold flex-shrink-0 transition-all hover:scale-105 ${copied ? 'text-[#00F5A0]' : 'text-black'}`}
              style={{ background: copied ? 'rgba(0,245,160,0.15)' : 'linear-gradient(135deg, #FFD700, #FF6B00)', border: copied ? '1px solid rgba(0,245,160,0.4)' : 'none' }}
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={16} />
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleShare('whatsapp')} className="btn-ghost px-4 py-2 rounded-lg text-sm hover:border-green-500/40 hover:text-green-400">
              📱 WhatsApp
            </button>
            <button onClick={() => handleShare('telegram')} className="btn-ghost px-4 py-2 rounded-lg text-sm hover:border-blue-500/40 hover:text-blue-400">
              💬 Telegram
            </button>
            <button onClick={() => handleShare('vk')} className="btn-ghost px-4 py-2 rounded-lg text-sm hover:border-blue-400/40 hover:text-blue-300">
              📘 ВКонтакте
            </button>
          </div>
        </div>

        {/* Tree */}
        <div className="game-card rounded-2xl p-6 md:p-10 mb-8 overflow-x-auto">
          <h3 className="font-oswald text-lg font-semibold text-white mb-8 tracking-wide">🌳 Структура команды</h3>
          <div className="flex justify-center min-w-[580px]">
            <TreeNodeCard node={tree} />
          </div>
        </div>

        {/* Level breakdown */}
        <div className="game-card rounded-2xl p-6">
          <h3 className="font-oswald text-lg font-semibold text-white mb-5 tracking-wide">📊 Доход по уровням</h3>
          <div className="space-y-4">
            {[
              { level: 1, pct: 65, income: '₽2 740', percent: '10%', count: 3,  color: '#FFD700' },
              { level: 2, pct: 40, income: '₽820',   percent: '5%',  count: 6,  color: '#9B5DE5' },
              { level: 3, pct: 20, income: '₽280',   percent: '2%',  count: 12, color: '#00F5A0' },
            ].map(s => (
              <div key={s.level} className="flex items-center gap-4">
                <div className="w-14 text-sm font-oswald font-semibold" style={{ color: s.color }}>Ур. {s.level}</div>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
                <div className="w-16 text-right text-sm font-oswald font-semibold text-white">{s.income}</div>
                <div className="w-10 text-right text-xs text-gray-500">{s.percent}</div>
                <div className="w-12 text-right text-xs text-gray-500">{s.count} чел</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
