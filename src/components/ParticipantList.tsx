import type { Participant } from '../api/types';
import { ParticipantCard } from './ParticipantCard';

interface Props {
  list: Participant[];
  loading: boolean;
  error: boolean;
  onSelect: (id: string) => void;
  onRetry: () => void;
}

export function ParticipantList({ list, loading, error, onSelect, onRetry }: Props) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card retry">
        <p>데이터를 불러오지 못했습니다. 네트워크 연결을 확인해주세요.</p>
        <button className="btn btn-primary" onClick={onRetry}>
          ⟳ 다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="list">
        {list.map((p) => (
          <ParticipantCard key={p.id} p={p} onClick={() => onSelect(p.id)} />
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty">
          <strong>검색 결과가 없습니다</strong>검색어나 필터를 바꿔서 다시 찾아보세요.
        </div>
      ) : null}
    </>
  );
}
