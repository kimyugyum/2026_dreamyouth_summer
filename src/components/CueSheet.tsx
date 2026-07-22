import { useState } from 'react';
import { CUE_SHEET } from '../cuesheet-data';

interface Props {
  onBack: () => void;
}

export function CueSheet({ onBack }: Props) {
  const [dayKey, setDayKey] = useState(CUE_SHEET[0].key);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const day = CUE_SHEET.find((d) => d.key === dayKey) ?? CUE_SHEET[0];

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="cuesheet-wrap">
      <button className="btn btn-ghost cuesheet-back" onClick={onBack}>
        ← 홈으로
      </button>

      <div className="cs-title">
        <div className="cs-title-icon">📋</div>
        <div>
          <div className="cs-title-text">수련회 일정표</div>
          <div className="cs-title-sub">{day.dateLabel}</div>
        </div>
      </div>

      <div className="cs-tabs">
        {CUE_SHEET.map((d) => (
          <button
            key={d.key}
            className={`cs-tab${d.key === dayKey ? ' on' : ''}`}
            onClick={() => {
              setDayKey(d.key);
              setOpenIndex(null);
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="timeline">
        {day.items.map((item, i) => {
          const open = openIndex === i;
          const hasDetail = !!(item.notes?.length || item.nextPrep?.length || item.remark?.length);
          return (
            <div className="tl-item" key={i}>
              <div className="tl-rail">
                <span className="tl-dot" />
                {i < day.items.length - 1 ? <span className="tl-line" /> : null}
              </div>
              <button
                type="button"
                className={`tl-content card${hasDetail ? ' expandable' : ''}${open ? ' open' : ''}`}
                onClick={() => hasDetail && toggle(i)}
                disabled={!hasDetail}
              >
                <div className="tl-top">
                  <div>
                    <div className="tl-time">{item.time}</div>
                    <div className="tl-title">{item.title}</div>
                    {item.subtitle ? <div className="tl-sub">{item.subtitle}</div> : null}
                  </div>
                  {hasDetail ? <span className="tl-chevron">{open ? '▲' : '▼'}</span> : null}
                </div>

                {(item.place || item.owner) && (
                  <div className="tl-meta">
                    {item.place ? <span className="tl-badge">📍 {item.place}</span> : null}
                    {item.owner ? <span className="tl-badge">👤 {item.owner}</span> : null}
                  </div>
                )}

                {open ? (
                  <div className="tl-detail">
                    {item.notes?.length ? (
                      <div className="tl-section">
                        <div className="tl-section-label">진행사항</div>
                        <ul>
                          {item.notes.map((n, ni) => (
                            <li key={ni}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {item.nextPrep?.length ? (
                      <div className="tl-section">
                        <div className="tl-section-label prep">다음일정 준비사항</div>
                        <ul>
                          {item.nextPrep.map((n, ni) => (
                            <li key={ni}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {item.remark?.length ? (
                      <div className="tl-section">
                        <div className="tl-section-label remark">비고</div>
                        <ul>
                          {item.remark.map((n, ni) => (
                            <li key={ni}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
