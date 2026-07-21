interface Props {
  query: string;
  onChange: (q: string) => void;
}

export function SearchBar({ query, onChange }: Props) {
  return (
    <div className="search-wrap">
      <span className="search-ic">🔍</span>
      <input
        className="search-input"
        placeholder="이름, 학년, 부서, ID 검색 (초성 가능)"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className={`search-x ${query ? 'show' : ''}`} onClick={() => onChange('')}>
        ✕
      </button>
    </div>
  );
}
