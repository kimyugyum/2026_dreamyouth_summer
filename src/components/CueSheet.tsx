interface Props {
  onBack: () => void;
}

export function CueSheet({ onBack }: Props) {
  return (
    <div className="cuesheet-wrap">
      <button className="btn btn-ghost cuesheet-back" onClick={onBack}>
        ← 홈으로
      </button>
      <div className="card cuesheet-empty">
        <div className="cuesheet-empty-icon">📋</div>
        <strong>큐시트 준비 중입니다</strong>
        <p>행사 진행 순서가 곧 이곳에 공개됩니다.</p>
      </div>
    </div>
  );
}
