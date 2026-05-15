import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  emoji?: string;
}

export interface User {
  name: string;
  email: string;
  balance: number;
  totalWon: number;
  referralIncome: number;
  level: number;
  isVip: boolean;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  addWinning: (amount: number) => void;

  showAuth: boolean;
  authMode: 'login' | 'register';
  openAuth: (mode?: 'login' | 'register') => void;
  closeAuth: () => void;

  showDeposit: boolean;
  openDeposit: () => void;
  closeDeposit: () => void;

  toasts: ToastItem[];
  toast: (type: ToastItem['type'], message: string, emoji?: string) => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USER: User = {
  name: 'Алексей К.',
  email: 'alex@example.com',
  balance: 1250,
  totalWon: 24370,
  referralIncome: 3840,
  level: 14,
  isVip: true,
};

let toastId = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDeposit, setShowDeposit] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastItem['type'], message: string, emoji?: string) => {
    const id = ++toastId;
    setToasts(p => [...p, { id, type, message, emoji }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const login = useCallback((email: string, _password: string) => {
    setUser({ ...DEMO_USER, email });
    setShowAuth(false);
    toast('success', 'Добро пожаловать назад!', '👋');
  }, [toast]);

  const register = useCallback((name: string, email: string, _password: string) => {
    setUser({ ...DEMO_USER, name, email, balance: 100, totalWon: 0, referralIncome: 0, level: 1, isVip: false });
    setShowAuth(false);
    toast('success', 'Аккаунт создан! Бонус 100₽ зачислен 🎁', '🎉');
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    toast('info', 'Вы вышли из аккаунта', '👋');
  }, [toast]);

  const addBalance = useCallback((amount: number) => {
    setUser(p => p ? { ...p, balance: p.balance + amount } : p);
    toast('success', `Баланс пополнен на ₽${amount.toLocaleString()}`, '💰');
    setShowDeposit(false);
  }, [toast]);

  const deductBalance = useCallback((amount: number): boolean => {
    if (!user || user.balance < amount) {
      toast('error', 'Недостаточно средств на балансе', '❌');
      return false;
    }
    setUser(p => p ? { ...p, balance: p.balance - amount } : p);
    return true;
  }, [user, toast]);

  const addWinning = useCallback((amount: number) => {
    setUser(p => p ? { ...p, balance: p.balance + amount, totalWon: p.totalWon + amount } : p);
  }, []);

  const openAuth = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  }, []);

  const closeAuth = useCallback(() => setShowAuth(false), []);
  const openDeposit = useCallback(() => {
    if (!user) { openAuth('login'); return; }
    setShowDeposit(true);
  }, [user, openAuth]);
  const closeDeposit = useCallback(() => setShowDeposit(false), []);

  return (
    <AppContext.Provider value={{
      user, isLoggedIn: !!user,
      login, register, logout,
      addBalance, deductBalance, addWinning,
      showAuth, authMode, openAuth, closeAuth,
      showDeposit, openDeposit, closeDeposit,
      toasts, toast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
