import type { ApiError } from './types';

const API_URL = import.meta.env.VITE_API_URL as string;

let onTokenExpired: (() => void) | null = null;
export function setTokenExpiredHandler(fn: () => void): void {
  onTokenExpired = fn;
}

export async function api<T>(body: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
  } catch {
    throw { success: false, message: '네트워크 연결을 확인해주세요.', errorCode: 'NETWORK_ERROR' } satisfies ApiError;
  }
  let json: { success: boolean; data?: T } & ApiError;
  try {
    json = await res.json();
  } catch {
    throw { success: false, message: '서버 응답을 해석할 수 없습니다.', errorCode: 'BAD_RESPONSE' } satisfies ApiError;
  }
  if (!json.success) {
    if (json.errorCode === 'TOKEN_EXPIRED') onTokenExpired?.();
    throw json;
  }
  return json.data as T;
}
