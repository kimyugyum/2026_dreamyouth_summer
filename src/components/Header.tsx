import { EVENT_NAME, EVENT_SUBTITLE } from '../constants';

interface Props {
  staffName: string;
  syncedAt: string;
  onRefresh: () => void;
  onChangeStaff: () => void;
}

export function Header({ staffName, syncedAt, onRefresh, onChangeStaff }: Props) {
  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <header className="header">
      <div>
        <div className="h-title">{EVENT_NAME}</div>
        <div className="h-sub">{EVENT_SUBTITLE}</div>
      </div>
      <div className="h-meta">
        <button className="staff-chip" onClick={onChangeStaff}>
          👤 {staffName || '담당자'}
        </button>
        <div className="sync-row">
          <span>{today}</span>
          <button title="새로고침" style={{ padding: 6 }} onClick={onRefresh}>
            ⟳
          </button>
        </div>
        {syncedAt ? <div className="sync-row">동기화 {syncedAt.slice(11, 16)}</div> : null}
      </div>
    </header>
  );
}
