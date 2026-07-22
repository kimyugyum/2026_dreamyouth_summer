interface Props {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

function getPageNumbers(page: number, pageCount: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const add = (p: number | '...') => pages.push(p);
  const window = 1;

  add(1);
  if (page - window > 2) add('...');
  for (let p = Math.max(2, page - window); p <= Math.min(pageCount - 1, page + window); p++) {
    add(p);
  }
  if (page + window < pageCount - 1) add('...');
  if (pageCount > 1) add(pageCount);

  return pages;
}

export function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null;
  const pages = getPageNumbers(page, pageCount);

  return (
    <div className="pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="이전 페이지">
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span className="page-ellipsis" key={'e' + i}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === page ? ' on' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button className="page-btn" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="다음 페이지">
        ›
      </button>
    </div>
  );
}
