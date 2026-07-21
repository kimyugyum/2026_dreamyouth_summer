import type { Participant } from '../api/types';

interface Props {
  p: Participant;
  onClick: () => void;
}

export function ParticipantCard({ p, onClick }: Props) {
  const dept = p.department === '기타' && p.departmentRaw ? p.departmentRaw : p.department;

  return (
    <button className="card p-card" onClick={onClick}>
      <div style={{ minWidth: 0 }}>
        <div>
          <span className="p-name">{p.name}</span>
          <span className="p-sub">
            {p.grade}
            {p.gender ? ' · ' + p.gender : ''}
            {p.birthDate ? ' · ' + p.birthDate.slice(2) : ''}
          </span>
        </div>
        <div className="p-badges">
          {p.department ? <span className="badge b-dept">{dept}</span> : null}
          <span className={`badge ${p.paymentStatus === 'PAID' ? 'b-paid' : 'b-unpaid'}`}>
            {p.paymentStatus === 'PAID' ? '입금 완료' : '미입금'}
          </span>
          <span className={`badge ${p.badgeStatus === 'ISSUED' ? 'b-issued' : 'b-not'}`}>
            {p.badgeStatus === 'ISSUED' ? '명찰 배부 완료' : '명찰 미배부'}
          </span>
        </div>
      </div>
      <span className="p-id">{p.id.replace('DY-2026-', '#')}</span>
    </button>
  );
}
