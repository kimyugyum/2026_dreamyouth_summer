import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../api/client';
import type { ApiError, Participant, ParticipantEditData } from '../../api/types';
import { getStaff, getToken } from '../../hooks/useAuth';
import { GRADES, DEPARTMENTS } from '../../constants';

interface Props {
  p: Participant;
  busy: boolean;
  setBusy: (b: boolean) => void;
  toast: (type: 'success' | 'error', msg: string) => void;
  onCancel: () => void;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export function EditForm({ p, busy, setBusy, toast, onCancel, onClose, onSaved }: Props) {
  const [nameErr, setNameErr] = useState('');
  const [birthErr, setBirthErr] = useState('');

  const gradeOpts = [...new Set([p.grade, ...GRADES])].filter(Boolean);
  const deptOpts = [...new Set([p.departmentRaw, ...DEPARTMENTS])].filter(Boolean);

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
    const data: ParticipantEditData = {
      name,
      gender: String(fd.get('gender')),
      grade: String(fd.get('grade')),
      department: String(fd.get('department')),
      payment: fd.get('payment') as ParticipantEditData['payment'],
      prayer: String(fd.get('prayer') ?? ''),
      comment: String(fd.get('comment') ?? ''),
    };
    if (birth && birth !== p.birthDate) data.rrn = birth.replace(/-/g, '');

    setBusy(true);
    try {
      await api({ action: 'updateParticipant', token: getToken(), participantId: p.id, data, staffName: getStaff() });
      toast('success', '참가자 정보가 저장되었습니다.');
      await onSaved();
    } catch (err) {
      toast('error', (err as ApiError).message || '저장에 실패했습니다.');
    }
    setBusy(false);
  };

  return (
    <>
      <div className="m-head">
        <div className="m-title">정보 수정</div>
        <button className="m-x" onClick={onClose}>
          ✕
        </button>
      </div>
      <form onSubmit={submit}>
        <div className="f-grid">
          <div className="f-field full">
            <label className="f-label">이름 *</label>
            <input name="name" defaultValue={p.name} />
            <span className="f-err">{nameErr}</span>
          </div>
          <div className="f-field">
            <label className="f-label">성별</label>
            <select name="gender" defaultValue={p.gender}>
              <option>남</option>
              <option>여</option>
            </select>
          </div>
          <div className="f-field">
            <label className="f-label">학년</label>
            <select name="grade" defaultValue={p.grade}>
              {gradeOpts.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="f-field full">
            <label className="f-label">부서</label>
            <select name="department" defaultValue={p.departmentRaw}>
              {deptOpts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="f-field">
            <label className="f-label">생년월일</label>
            <input name="birthDate" placeholder="YYYY-MM-DD" defaultValue={p.birthDate} />
            <span className="f-err">{birthErr}</span>
          </div>
          <div className="f-field">
            <label className="f-label">입금 상태</label>
            <select name="payment" defaultValue={p.paymentStatus}>
              <option value="PAID">입금 완료</option>
              <option value="UNPAID">미입금</option>
            </select>
          </div>
          <div className="f-field full">
            <label className="f-label">기도제목</label>
            <textarea name="prayer" rows={2} defaultValue={p.prayer} />
          </div>
          <div className="f-field full">
            <label className="f-label">한 마디</label>
            <textarea name="comment" rows={2} defaultValue={p.comment} />
          </div>
        </div>
        <div className="f-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? <span className="spin">◌</span> : null} 저장
          </button>
        </div>
      </form>
    </>
  );
}
