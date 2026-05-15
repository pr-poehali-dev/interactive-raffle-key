import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authApi, userApi, getToken, setToken, clearToken } from '@/lib/api';

export interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  emoji?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  totalWon: number;
  referralIncome: number;
  level: number;
  isVip: boolean;
  isAdmin: boolean;
  referralCode: string;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  openDoor: (doorName: string, keyPrice: number, minPrize: number, maxPrize: number) => Promise<number | null>;
  deposit: (amount: number) => Promise<boolean>;

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
let toastId = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDeposit, setShowDeposit] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastItem['type'], message: string, emoji?: string) => {
    const id = ++toastId;
    setToasts(p => [...p, { id, type, message, emoji }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  // Восстановление сессии при загрузке
  useEffect(() => {
    const tok = getToken();
    if (!tok) { setIsLoading(false); return; }
    authApi.me().then(data => {
      if (data?.user) setUser(data.user);
      else clearToken();
    }).catch(() => clearToken()).finally(() => setIsLoading(false));
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await authApi.me();
    if (data?.user) setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    if (data.error) throw new Error(data.error);
    setToken(data.token);
    setUser(data.user);
    setShowAuth(false);
    toast('success', `Добро пожаловать, ${data.user.name.split(' ')[0]}!`, '👋');
  }, [toast]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    if (data.error) throw new Error(data.error);
    setToken(data.token);
    setUser(data.user);
    setShowAuth(false);
    toast('success', 'Аккаунт создан! На баланс зачислено ₽100 🎁', '🎉');
  }, [toast]);

  const logout = useCallback(async () => {
    await authApi.logout();
    clearToken();
    setUser(null);
    toast('info', 'Вы вышли из аккаунта', '👋');
  }, [toast]);

  const deposit = useCallback(async (amount: number): Promise<boolean> => {
    const data = await userApi.deposit(amount);
    if (data.error) {
      toast('error', data.error, '❌');
      return false;
    }
    setUser(p => p ? { ...p, balance: data.balance } : p);
    toast('success', `Баланс пополнен на ₽${amount.toLocaleString()}`, '💰');
    setShowDeposit(false);
    return true;
  }, [toast]);

  const openDoor = useCallback(async (doorName: string, keyPrice: number, minPrize: number, maxPrize: number): Promise<number | null> => {
    if (!user) return null;
    if (user.balance < keyPrice) {
      toast('error', 'Недостаточно средств на балансе', '❌');
      return null;
    }
    const data = await userApi.openDoor(doorName, keyPrice, minPrize, maxPrize);
    if (data.error) {
      toast('error', data.error, '❌');
      return null;
    }
    setUser(p => p ? { ...p, balance: data.balance, totalWon: data.totalWon } : p);
    return data.prize;
  }, [user, toast]);

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
      user, isLoggedIn: !!user, isLoading,
      login, register, logout, refreshUser,
      openDoor, deposit,
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
