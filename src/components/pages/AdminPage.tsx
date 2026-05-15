import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { adminApi } from '@/lib/api';
import Icon from '@/components/ui/icon';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  balance: number;
  totalWon: number;
  referralIncome: number;
  level: number;
  isVip: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalPaid: number;
  prizesToday: number;
  depositsToday: number;
}

export default function AdminPage() {
  const { user, toast } = useApp();
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState<{ user: AdminUser } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const loadStats = async () => {
    const data = await adminApi.stats();
    if (!data.error) setStats(data);
    setLoading(false);
  };

  const loadUsers = async () => {
    const data = await adminApi.users();
    if (!data.error) setUsers(data.users || []);
  };

  const handleAdjust = async () => {
    if (!adjustModal) return;
    const amt = parseInt(adjustAmount);
    if (!amt) return;
    const res = await adminApi.adjustBalance(adjustModal.user.id, amt, adjustReason || 'Корректировка');
    if (res.ok) {
      toast('success', `Баланс пользователя изменён на ${amt > 0 ? '+' : ''}₽${amt.toLocaleString()}`, '💰');
      setAdjustModal(null);
      setAdjustAmount('');
      setAdjustReason('');
      loadUsers();
    } else {
      toast('error', res.error || 'Ошибка', '❌');
    }
  };

  const handleSetVip = async (u: AdminUser) => {
    const res = await adminApi.setVip(u.id, !u.isVip);
    if (res.ok) {
      toast('success', `${u.name}: VIP ${!u.isVip ? 'включён' : 'отключён'}`, '🥇');
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(255,0,110,0.2), rgba(155,93,229,0.2))', border: '1px solid rgba(255,0,110,0.3)' }}>
            🛡️
          </div>
          <div>
            <h1 className="font-oswald text-3xl md:text-4xl font-semibold text-white tracking-wide">
              ПАНЕЛЬ АДМИНИСТРАТОРА
            </h1>
            <p className="text-sm text-gray-400">Добро пожаловать, {user?.name}</p>
          </div>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Пользователей', value: stats.totalUsers.toLocaleString(), emoji: '👥', color: '#9B5DE5' },
              { label: 'Всего выплачено', value: `₽${stats.totalPaid.toLocaleString()}`, emoji: '💰', color: '#FFD700' },
              { label: 'Призов сегодня', value: stats.prizesToday.toString(), emoji: '🎁', color: '#00F5A0' },
              { label: 'Депозитов сегодня', value: `₽${stats.depositsToday.toLocaleString()}`, emoji: '💳', color: '#FF6B00' },
            ].map((s, i) => (
              <div key={i} className="game-card rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-oswald text-xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'stats', label: '📊 Статистика' },
            { id: 'users', label: '👥 Пользователи' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              style={activeTab === t.id ? { background: 'linear-gradient(135deg, #FFD700, #FF6B00)' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-oswald text-lg font-semibold text-white mb-4 tracking-wide">📈 Общая статистика</h3>
              <div className="space-y-3">
                {[
                  { label: 'Всего пользователей',    value: stats.totalUsers.toLocaleString(),           icon: '👥' },
                  { label: 'Суммарные выплаты',       value: `₽${stats.totalPaid.toLocaleString()}`,      icon: '💰' },
                  { label: 'Призов за сегодня',       value: stats.prizesToday.toString(),                icon: '🎁' },
                  { label: 'Депозитов за сегодня',    value: `₽${stats.depositsToday.toLocaleString()}`,  icon: '💳' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <span>{item.icon}</span>{item.label}
                    </span>
                    <span className="font-oswald font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="game-card rounded-2xl p-6">
              <h3 className="font-oswald text-lg font-semibold text-white mb-4 tracking-wide">⚡ Быстрые действия</h3>
              <div className="space-y-3">
                <button
                  onClick={() => { setActiveTab('users'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white transition-all text-left"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span>👥</span>
                  <span>Управление пользователями</span>
                  <Icon name="ChevronRight" size={14} className="ml-auto text-gray-600" />
                </button>
                <button
                  onClick={loadStats}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white transition-all text-left"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span>🔄</span>
                  <span>Обновить статистику</span>
                  <Icon name="ChevronRight" size={14} className="ml-auto text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            {/* Search */}
            <div className="mb-5">
              <input
                type="text" placeholder="🔍 Поиск по имени или email..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="game-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-oswald text-base font-semibold text-white tracking-wide">
                  Пользователи ({filteredUsers.length})
                </h3>
                <button onClick={loadUsers} className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  <Icon name="RefreshCw" size={12} /> Обновить
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm">Нет пользователей</div>
                )}
                {filteredUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: u.isAdmin ? 'rgba(255,0,110,0.15)' : 'rgba(155,93,229,0.12)' }}>
                      {u.isAdmin ? '🛡️' : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{u.name}</span>
                        {u.isVip && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>VIP</span>
                        )}
                        {u.isAdmin && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{ background: 'rgba(255,0,110,0.15)', color: '#FF006E' }}>ADMIN</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    <div className="hidden md:block text-center">
                      <div className="text-sm font-oswald font-bold" style={{ color: '#FFD700' }}>₽{u.balance.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">баланс</div>
                    </div>
                    <div className="hidden md:block text-center">
                      <div className="text-sm font-oswald font-bold text-[#00F5A0]">₽{u.totalWon.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">выиграно</div>
                    </div>
                    {!u.isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setAdjustModal({ user: u }); setAdjustAmount(''); setAdjustReason(''); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black hover:scale-105 transition-transform"
                          style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}
                          title="Изменить баланс"
                        >
                          💰
                        </button>
                        <button
                          onClick={() => handleSetVip(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 ${u.isVip ? 'text-yellow-400 bg-yellow-500/15 border border-yellow-500/25' : 'text-gray-400 border border-white/10 hover:border-yellow-500/30'}`}
                          title={u.isVip ? 'Убрать VIP' : 'Сделать VIP'}
                        >
                          {u.isVip ? '⭐' : '☆'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adjust balance modal */}
      {adjustModal && (
        <div className="modal-backdrop" onClick={() => setAdjustModal(null)}>
          <div
            className="w-full max-w-sm rounded-3xl p-7 animate-pop"
            style={{ background: '#0C1220', border: '1px solid rgba(255,215,0,0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-oswald text-xl font-semibold text-white mb-1 tracking-wide">Изменить баланс</h3>
            <p className="text-sm text-gray-400 mb-5">{adjustModal.user.name} · текущий: ₽{adjustModal.user.balance.toLocaleString()}</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Сумма (+ добавить, − вычесть)</label>
                <input
                  type="number" placeholder="например 500 или -200"
                  value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Причина</label>
                <input
                  type="text" placeholder="Корректировка администратором"
                  value={adjustReason} onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAdjust} className="btn-gold flex-1 py-3 rounded-xl text-sm font-oswald">
                Применить
              </button>
              <button onClick={() => setAdjustModal(null)} className="btn-ghost flex-1 py-3 rounded-xl text-sm">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
