import Icon from '@/components/ui/icon';

interface TreeNode {
  id: number;
  name: string;
  emoji: string;
  level: number;
  income: string;
  children?: TreeNode[];
  isYou?: boolean;
}

const tree: TreeNode = {
  id: 0,
  name: 'Вы',
  emoji: '👤',
  level: 1,
  income: '₽3,840',
  isYou: true,
  children: [
    {
      id: 1,
      name: 'Михаил Р.',
      emoji: '👨',
      level: 2,
      income: '₽1,200',
      children: [
        { id: 4, name: 'Анна С.', emoji: '👩', level: 3, income: '₽340' },
        { id: 5, name: 'Дмитрий В.', emoji: '👨', level: 3, income: '₽510' },
        { id: 6, name: 'Ольга Н.', emoji: '👩', level: 3, income: '₽180' },
      ]
    },
    {
      id: 2,
      name: 'Светлана К.',
      emoji: '👩',
      level: 2,
      income: '₽890',
      children: [
        { id: 7, name: 'Игорь М.', emoji: '👨', level: 3, income: '₽220' },
        { id: 8, name: 'Татьяна П.', emoji: '👩', level: 3, income: '₽400' },
      ]
    },
    {
      id: 3,
      name: 'Андрей Л.',
      emoji: '👨',
      level: 2,
      income: '₽650',
      children: [
        { id: 9, name: 'Наталья О.', emoji: '👩', level: 3, income: '₽160' },
      ]
    },
  ]
};

const levelColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: 'rgba(255,215,0,0.15)', border: 'rgba(255,215,0,0.5)', text: '#FFD700' },
  2: { bg: 'rgba(155,93,229,0.15)', border: 'rgba(155,93,229,0.5)', text: '#9B5DE5' },
  3: { bg: 'rgba(0,245,160,0.1)', border: 'rgba(0,245,160,0.3)', text: '#00F5A0' },
};

function TreeNodeCard({ node }: { node: TreeNode }) {
  const colors = levelColors[node.level] || levelColors[3];
  return (
    <div className="flex flex-col items-center">
      <div className="relative p-4 rounded-2xl text-center min-w-[110px] transition-all hover:scale-105 cursor-pointer"
        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
        {node.isYou && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-black"
            style={{ background: '#FFD700' }}>
            ВЫ
          </div>
        )}
        <div className="text-3xl mb-1">{node.emoji}</div>
        <div className="text-xs font-semibold text-white whitespace-nowrap">{node.name}</div>
        <div className="text-xs mt-1 font-bold" style={{ color: colors.text }}>{node.income}</div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6" style={{ background: colors.border }} />
          <div className="flex items-start gap-4 md:gap-8">
            {node.children.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center">
                {node.children && i > 0 && <div className="hidden" />}
                <div className="w-0.5 h-4" style={{ background: levelColors[child.level]?.border || '#9B5DE5' }} />
                <TreeNodeCard node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const levelStats = [
  { level: 1, count: 3, income: '₽2,740', percent: '10%', color: '#9B5DE5' },
  { level: 2, count: 6, income: '₽820', percent: '5%', color: '#00F5A0' },
  { level: 3, count: 12, income: '₽280', percent: '2%', color: '#60A5FA' },
];

export default function ReferralsPage() {
  const refLink = 'https://keydoors.ru/ref/alex_k_99';

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-russo text-4xl md:text-5xl text-white mb-2">🌳 РЕФЕРАЛЫ</h1>
          <p className="text-gray-400">Ваше родовое дерево и статистика команды</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { emoji: '👥', value: '21', label: 'В команде', color: '#FFD700' },
            { emoji: '💰', value: '₽3,840', label: 'Ваш доход', color: '#00F5A0' },
            { emoji: '🔗', value: '3', label: 'Уровня дерева', color: '#9B5DE5' },
            { emoji: '📈', value: '+₽320', label: 'За сегодня', color: '#FF6B00' },
          ].map((stat, i) => (
            <div key={i} className="game-card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="font-russo text-xl mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Ref link */}
        <div className="game-card rounded-2xl p-6 mb-8" style={{ border: '1px solid rgba(255,215,0,0.2)' }}>
          <h3 className="font-russo text-lg text-white mb-4">🔗 Ваша реферальная ссылка</h3>
          <div className="flex gap-3">
            <div className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {refLink}
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-black hover:scale-105 transition-transform flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
              <Icon name="Copy" size={16} />
              Скопировать
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {['📱 WhatsApp', '💬 Telegram', '📘 ВКонтакте'].map(btn => (
              <button key={btn} className="px-4 py-2 rounded-lg text-sm text-gray-300 border border-white/10 hover:border-white/25 hover:text-white transition-all">
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Tree */}
        <div className="game-card rounded-2xl p-6 md:p-10 mb-8 overflow-x-auto">
          <h3 className="font-russo text-lg text-white mb-8">🌳 Структура команды</h3>
          <div className="flex justify-center min-w-[600px]">
            <TreeNodeCard node={tree} />
          </div>
        </div>

        {/* Level breakdown */}
        <div className="game-card rounded-2xl p-6">
          <h3 className="font-russo text-lg text-white mb-5">📊 Доход по уровням</h3>
          <div className="space-y-4">
            {levelStats.map((stat) => (
              <div key={stat.level} className="flex items-center gap-5">
                <div className="w-16 text-sm font-semibold" style={{ color: stat.color }}>
                  Ур. {stat.level}
                </div>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${[65, 40, 20][stat.level - 1]}%`, background: stat.color }} />
                </div>
                <div className="w-16 text-right text-sm font-semibold text-white">{stat.income}</div>
                <div className="w-10 text-right text-xs text-gray-500">{stat.percent}</div>
                <div className="w-8 text-center text-xs text-gray-500">{stat.count} чел</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
