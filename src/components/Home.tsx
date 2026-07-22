import { EVENT_NAME, EVENT_SUBTITLE } from '../constants';

interface Props {
  onCheckIn: () => void;
  onCueSheet: () => void;
}

export function Home({ onCheckIn, onCueSheet }: Props) {
  return (
    <div className="home-wrap">
      <div className="login-logo">
        <div className="h-title">{EVENT_NAME}</div>
        <div className="h-sub">{EVENT_SUBTITLE}</div>
      </div>
      <div className="home-actions">
        <button className="home-btn home-btn-cuesheet" onClick={onCueSheet}>
          <span className="home-btn-icon">📋</span>
          <span className="home-btn-label">수련회 일정표</span>
          <span className="home-btn-desc">시간별 진행 순서</span>
        </button>
        <button className="home-btn home-btn-checkin" onClick={onCheckIn}>
          <span className="home-btn-icon">✅</span>
          <span className="home-btn-label">체크인</span>
          <span className="home-btn-desc">담당자 로그인이 필요합니다</span>
        </button>
      </div>
    </div>
  );
}
