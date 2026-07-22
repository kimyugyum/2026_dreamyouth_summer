import type { Participant } from '../../api/types';

interface Props {
  p: Participant;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSetBadge: (p: Participant, issue: boolean) => void;
}

function DItem({ label, value, full, muted }: { label: string; value: string; full?: boolean; muted?: boolean }) {
  return (
    <div className={`d-item${full ? ' full' : ''}`}>
      <div className="d-label">{label}</div>
      <div className={`d-value${muted ? ' muted' : ''}`}>{value}</div>
    </div>
  );
}

export function ParticipantDetail({ p, busy, onClose, onEdit, onSetBadge }: Props) {
  const dept = p.department === '기타' && p.departmentRaw ? p.departmentRaw : p.department;

  return (
    <>
      <div className="m-head">
        <div>
          <div className="m-title">{p.name}</div>
        </div>
        <button className="m-x" onClick={onClose}>
          ✕
        </button>
      </div>

      {p.badgeStatus === 'ISSUED' ? (
        <div className="issued-box">
          <div className="issued-title">
            <span className="checkmark">✓</span> 명찰 배부 완료
          </div>
          {p.badgeTime || p.badgeStaff ? (
            <div className="issued-meta">
              {p.badgeTime ? (
                <>
                  배부 시간: {p.badgeTime}
                  <br />
                </>
              ) : null}
              {p.badgeStaff ? <>담당자: {p.badgeStaff}</> : null}
            </div>
          ) : null}
          <div style={{ marginTop: 14 }}>
            <button
              className="btn btn-danger"
              style={{ width: '100%' }}
              disabled={busy}
              onClick={() => {
                if (confirm('명찰 배부 처리를 취소하시겠습니까?')) onSetBadge(p, false);
              }}
            >
              {busy ? <span className="spin">◌</span> : null} 명찰 배부 취소
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn-issue" style={{ marginBottom: 22 }} disabled={busy} onClick={() => onSetBadge(p, true)}>
          {busy ? <span className="spin">◌</span> : '🏷️'} 명찰 배부 완료
        </button>
      )}

      <div className="d-grid">
        <DItem label="부서" value={dept} />
        <DItem label="학년" value={p.grade} />
        <DItem label="성별" value={p.gender} />
        <DItem
          label="생년월일 / 나이"
          value={p.birthDate ? p.birthDate + (p.age !== null ? ' (만 ' + p.age + '세)' : '') : '확인 필요'}
          muted={!p.birthDate}
        />
        <DItem label="입금 상태" value={p.paymentStatus === 'PAID' ? '입금 완료' : '미입금'} />
        <DItem label="신청 일시" value={p.timestamp || '-'} muted={!p.timestamp} />
        {p.newFriendPath && p.newFriendPath !== '없음' ? <DItem label="새친구 경로" value={p.newFriendPath} full /> : null}
        {p.prayer ? <DItem label="기도제목" value={p.prayer} full /> : null}
        {p.comment ? <DItem label="한 마디" value={p.comment} full /> : null}
        {p.updatedAt || p.updatedBy ? (
          <DItem label="마지막 수정" value={(p.updatedAt || '') + (p.updatedBy ? ' · ' + p.updatedBy : '')} full muted />
        ) : null}
      </div>
      <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={onEdit}>
        ✏️ 정보 수정
      </button>
    </>
  );
}
