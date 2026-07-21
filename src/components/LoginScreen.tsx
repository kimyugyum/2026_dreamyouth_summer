import { useState } from 'react';
import { api } from '../api/client';
import type { LoginResult, ApiError } from '../api/types';
import { getStaff } from '../hooks/useAuth';
import { EVENT_NAME, EVENT_SUBTITLE } from '../constants';

interface Props {
  onLogin: (token: string, staffName: string, expiresAt: number) => void;
  toast: (type: 'success' | 'error', msg: string) => void;
}

export function LoginScreen({ onLogin, toast }: Props) {
  const [name, setName] = useState(getStaff());
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast('error', '담당자 이름을 입력해주세요.');
      return;
    }
    setBusy(true);
    try {
      const d = await api<LoginResult>({ action: 'login', password, staffName: trimmed });
      onLogin(d.token, d.staffName, d.expiresAt);
      toast('success', trimmed + ' 선생님, 환영합니다!');
    } catch (err) {
      toast('error', (err as ApiError).message || '로그인에 실패했습니다.');
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-logo">
        <div className="h-title">{EVENT_NAME}</div>
        <div className="h-sub">{EVENT_SUBTITLE}</div>
      </div>
      <form className="card login-card" onSubmit={submit}>
        <p className="login-hint">오늘 접수를 담당하는 선생님 정보를 입력해주세요.</p>
        <input
          type="text"
          placeholder="담당자 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <input
          type="password"
          placeholder="접속 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? <span className="spin">◌</span> : null} {busy ? '확인 중...' : '시작하기'}
        </button>
      </form>
    </div>
  );
}
