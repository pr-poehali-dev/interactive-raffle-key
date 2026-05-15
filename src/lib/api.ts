const AUTH_URL  = 'https://functions.poehali.dev/f097dc0c-87b7-4179-9eda-fe9a0c780642';
const USER_URL  = 'https://functions.poehali.dev/284a8729-c1d8-46a7-a9b0-7189fcd16c87';
const ADMIN_URL = 'https://functions.poehali.dev/8755ad79-25ce-46fd-b3df-e748cc2cfa44';

const TOKEN_KEY = 'kd_session_token';

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function headers(extra: Record<string, string> = {}) {
  const tok = getToken();
  return {
    'Content-Type': 'application/json',
    ...(tok ? { 'X-Session-Token': tok } : {}),
    ...extra,
  };
}

async function post(url: string, path: string, body: unknown) {
  const r = await fetch(`${url}/${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  return r.json();
}

async function get(url: string, path: string) {
  const r = await fetch(`${url}/${path}`, {
    method: 'GET',
    headers: headers(),
  });
  return r.json();
}

// Auth
export const authApi = {
  register: (name: string, email: string, password: string, referralCode?: string) =>
    post(AUTH_URL, 'register', { name, email, password, referralCode }),
  login: (email: string, password: string) =>
    post(AUTH_URL, 'login', { email, password }),
  logout: () =>
    post(AUTH_URL, 'logout', {}),
  me: () =>
    get(AUTH_URL, 'me'),
};

// User
export const userApi = {
  deposit: (amount: number) =>
    post(USER_URL, 'deposit', { amount }),
  openDoor: (doorName: string, keyPrice: number, minPrize: number, maxPrize: number) =>
    post(USER_URL, 'open_door', { doorName, keyPrice, minPrize, maxPrize }),
  transactions: () =>
    get(USER_URL, 'transactions'),
};

// Admin
export const adminApi = {
  stats: () => get(ADMIN_URL, 'stats'),
  users: () => get(ADMIN_URL, 'users'),
  adjustBalance: (userId: number, amount: number, reason: string) =>
    post(ADMIN_URL, 'adjust_balance', { userId, amount, reason }),
  setVip: (userId: number, isVip: boolean) =>
    post(ADMIN_URL, 'set_vip', { userId, isVip }),
};
