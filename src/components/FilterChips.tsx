import { FILTER_DEFS } from '../constants';

interface Props {
  filters: Set<string>;
  onToggle: (key: string) => void;
}

export function FilterChips({ filters, onToggle }: Props) {
  return (
    <div className="filters">
      <button className={`chip ${filters.size === 0 ? 'on' : ''}`} onClick={() => onToggle('CLEAR')}>
        전체
      </button>
      {FILTER_DEFS.map(([k, l]) => (
        <button key={k} className={`chip ${filters.has(k) ? 'on' : ''}`} onClick={() => onToggle(k)}>
          {l}
        </button>
      ))}
    </div>
  );
}
