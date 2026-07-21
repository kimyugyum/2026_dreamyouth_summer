import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../api/client';
import type { AddParticipantResult, ApiError, ParticipantEditData } from '../../api/types';
import { getStaff, getToken } from '../../hooks/useAuth';
import { GRADES, DEPARTMENTS } from '../../constants';

interface Props {
  busy: boolean;
  setBusy: (b: boolean) => void;
  toast: (type: 'success' | 'error', msg: string) => void;
  onCancel: () => void;
  onAdded: () => Promise<void>;
}

export function AddForm({ busy, setBusy, toast, onCancel, onAdded }: Props) {
  const [nameErr, setNameErr] = useState('');
  const [birthErr, setBirthErr] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name')).trim();
    const birth = String(fd.get('birthDate')).trim();
    setNameErr('');
    setBirthErr('');
    if (!name) {
      setNameErr('이름은 필수입니다.');
      return;
    }
    if (birth && !/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
      setBirthErr('YYYY-MM-DD 형식으로 입력해주세요.');
      return;
    }
    const data: Omit<ParticipantEditData, 'comment'> & { rrn?: string } = {
      name,
      gender: String(fd.get('gender')),
      grade: String(fd.get('grade')),
      department: String(fd.get('department')),
      payment: fd.get('payment') as ParticipantEditData['payment'],
      prayer: String(fd.get('prayer') ?? ''),
    };
    if (birth) data.rrn = birth.replace(/-/g, '');

    setBusy(true);
    try {
      const d = await api<AddParticipantResult>({ action: 'addParticipant', token: getToken(), data, staffName: getStaff() });
      toast('success', name + ' 참가자가 등록되었습니다. (' + d.id + ')');
      await onAdded();
    } catch (err) {
      toast('error', (err as ApiError).message || '등록에 실패했습니다.');
    }
    setBusy(false);
  };

  return (
    <>
      <div className="m-head">
        <div className="m-title">신규 참가자 추가</div>
        <button className="m-x" onClick={onCancel}>
          ✕
        </button>
      </div>
      <form onSubmit={submit}>
        <div className="f-grid">
          <div className="f-field full">
            <label className="f-label">이름 *</label>
            <input name="name" placeholder="참가자 이름" ref={nameInputRef} autoFocus />
            <span className="f-err">{nameErr}</span>
          </div>
          <div className="f-field">
            <label className="f-label">성별</label>
            <select name="gender">
              <option>남</option>
              <option>여</option>
            </select>
          </div>
          <div className="f-field">
            <label className="f-label">학년</label>
            <select name="grade" defaultValue="중1">
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="f-field full">
            <label className="f-label">부서</label>
            <select name="department" defaultValue={DEPARTMENTS[2]}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="f-field">
            <label className="f-label">생년월일 (선택)</label>
            <input name="birthDate" placeholder="YYYY-MM-DD" />
            <span className="f-err">{birthErr}</span>
          </div>
          <div className="f-field">
            <label className="f-label">입금 상태</label>
            <select name="payment" defaultValue="UNPAID">
              <option value="UNPAID">미입금</option>
              <option value="PAID">입금 완료</option>
            </select>
          </div>
          <div className="f-field full">
            <label className="f-label">기도제목 (선택)</label>
            <textarea name="prayer" rows={2} />
          </div>
        </div>
        <div className="f-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? <span className="spin">◌</span> : null} 등록하기
          </button>
        </div>
      </form>
    </>
  );
}
