interface Props {
  query: string;
  onChange: (q: string) => void;
}

export function SearchBar({ query, onChange }: Props) {
  return (
    <div className="search-wrap">
      <svg className="search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
        <line x1="21" y1="21" x2="16.2" y2="16.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <input
        className="search-input"
        placeholder="이름, 학년, 부서, ID 검색 (초성 가능)"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className={`search-x ${query ? 'show' : ''}`} onClick={() => onChange('')} aria-label="검색어 지우기">
        ✕
      </button>
    </div>
  );
}
