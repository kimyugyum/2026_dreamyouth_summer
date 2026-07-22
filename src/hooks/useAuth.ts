import { useCallback, useState } from 'react';

const TOKEN_KEY = 'dy_token';
const STAFF_KEY = 'dy_staff_name';
const EXP_KEY = 'dy_token_exp';

export function getToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) || '';
}

export function getStaff(): string {
  return sessionStorage.getItem(STAFF_KEY) || '';
}

export function tokenValid(): boolean {
  return !!getToken() && Date.now() < Number(sessionStorage.getItem(EXP_KEY) || 0);
}

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(tokenValid());

  const login = useCallback((token: string, staffName: string, expiresAt: number) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(STAFF_KEY, staffName);
    sessionStorage.setItem(EXP_KEY, String(expiresAt));
    setLoggedIn(true);
  }, []);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXP_KEY);
    setLoggedIn(false);
  }, []);

  return { loggedIn, login, clearSession, staffName: getStaff() };
}
