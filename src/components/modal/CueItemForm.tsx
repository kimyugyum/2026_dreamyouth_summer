import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../api/client';
import type { ApiError, CueItem, CueItemData } from '../../api/types';
import { getToken } from '../../hooks/useAuth';
import { CUE_DAYS } from '../../cuesheet-data';

interface Props {
  item: CueItem | null;
  defaultDay: string;
  busy: boolean;
  setBusy: (b: boolean) => void;
  toast: (type: 'success' | 'error', msg: string) => void;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}

function toLines(s: string): string[] {
  return s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
}

export function CueItemForm({ item, defaultDay, busy, setBusy, toast, onCancel, onSaved }: Props) {
  const [nameErr, setNameErr] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const time = String(fd.get('time') ?? '').trim();
    const title = String(fd.get('title') ?? '').trim();
    setNameErr('');
    if (!time || !title) {
      setNameErr('시간과 제목은 필수입니다.');
      return;
    }

    const data: CueItemData = {
      day: String(fd.get('day') ?? defaultDay),
      order: Number(fd.get('order') ?? 0) || 0,
      time,
      title,
      subtitle: String(fd.get('subtitle') ?? '').trim(),
      place: String(fd.get('place') ?? '').trim(),
      owner: String(fd.get('owner') ?? '').trim(),
      notes: toLines(String(fd.get('notes') ?? '')),
      nextPrep: toLines(String(fd.get('nextPrep') ?? '')),
      remark: toLines(String(fd.get('remark') ?? '')),
    };

    setBusy(true);
    try {
      if (item) {
        await api({ action: 'updateCueItem', token: getToken(), id: item.id, data });
        toast('success', '일정이 수정되었습니다.');
      } else {
        await api({ action: 'addCueItem', token: getToken(), data });
        toast('success', '일정이 추가되었습니다.');
      }
      await onSaved();
    } catch (err) {
      toast('error', (err as ApiError).message || '저장에 실패했습니다.');
    }
    setBusy(false);
  };

  return (
    <>
      <div className="m-head">
        <div className="m-title">{item ? '일정 수정' : '새 일정 추가'}</div>
        <button className="m-x" onClick={onCancel} type="button">
          ✕
        </button>
      </div>
      <form onSubmit={submit}>
        <div className="f-grid">
          <div className="f-field">
            <label className="f-label">요일 *</label>
            <select name="day" defaultValue={item?.day ?? defaultDay}>
              {CUE_DAYS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="f-field">
            <label className="f-label">정렬순서</label>
            <input name="order" type="number" defaultValue={item?.order ?? 0} />
          </div>
          <div className="f-field full">
            <label className="f-label">시간 *</label>
            <input name="time" placeholder="예: 09:00~10:00" defaultValue={item?.time ?? ''} />
          </div>
          <div className="f-field full">
            <label className="f-label">제목 *</label>
            <input name="title" defaultValue={item?.title ?? ''} />
            <span className="f-err">{nameErr}</span>
          </div>
          <div className="f-field full">
            <label className="f-label">부제 (선택)</label>
            <input name="subtitle" placeholder="예: 찬양팀: ... · 말씀: ..." defaultValue={item?.subtitle ?? ''} />
          </div>
          <div className="f-field">
            <label className="f-label">장소</label>
            <input name="place" defaultValue={item?.place ?? ''} />
          </div>
          <div className="f-field">
            <label className="f-label">담당</label>
            <input name="owner" defaultValue={item?.owner ?? ''} />
          </div>
          <div className="f-field full">
            <label className="f-label">진행사항 (한 줄에 하나씩)</label>
            <textarea name="notes" rows={4} defaultValue={item?.notes.join('\n') ?? ''} />
          </div>
          <div className="f-field full">
            <label className="f-label">다음일정 준비사항 (한 줄에 하나씩)</label>
            <textarea name="nextPrep" rows={3} defaultValue={item?.nextPrep.join('\n') ?? ''} />
          </div>
          <div className="f-field full">
            <label className="f-label">비고 (한 줄에 하나씩)</label>
            <textarea name="remark" rows={2} defaultValue={item?.remark.join('\n') ?? ''} />
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
