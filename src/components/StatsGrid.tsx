import type { Stats } from '../api/types';

interface Props {
  stats: Stats;
  activeFilters: Set<string>;
  hasQuery: boolean;
  onSelect: (key: string) => void;
}

function StatCard({
  num,
  label,
  color,
  on,
  onClick,
}: {
  num: number;
  label: string;
  color: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`card stat ${on ? 'on' : ''}`} onClick={onClick}>
      <div className="stat-num" style={{ color }}>
        {num}
      </div>
      <div className="stat-label">{label}</div>
    </button>
  );
}

export function StatsGrid({ stats: s, activeFilters, hasQuery, onSelect }: Props) {
  return (
    <div className="stats">
      <StatCard num={s.total} label="전체 참가자" color="var(--text-0)" on={activeFilters.size === 0 && !hasQuery} onClick={() => onSelect('ALL')} />
      <StatCard num={s.paid} label="입금 완료" color="var(--green)" on={activeFilters.has('PAID')} onClick={() => onSelect('PAID')} />
      <StatCard num={s.unpaid} label="미입금" color="var(--red)" on={activeFilters.has('UNPAID')} onClick={() => onSelect('UNPAID')} />
      <StatCard num={s.badgeIssued} label="명찰 배부" color="var(--cyan)" on={activeFilters.has('ISSUED')} onClick={() => onSelect('ISSUED')} />
      <StatCard num={s.badgeNotIssued} label="명찰 미배부" color="var(--gray)" on={activeFilters.has('NOT_ISSUED')} onClick={() => onSelect('NOT_ISSUED')} />
      <StatCard num={s.newFriend} label="새친구" color="var(--violet)" on={false} onClick={() => onSelect('NEWFRIEND')} />
    </div>
  );
}
