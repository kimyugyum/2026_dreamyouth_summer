import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import type { ApiError, CueItem } from '../api/types';
import { getToken } from '../hooks/useAuth';
import { useCueSheet } from '../hooks/useCueSheet';
import { CUE_DAYS } from '../cuesheet-data';
import { Modal } from './modal/Modal';
import { CueItemForm } from './modal/CueItemForm';

interface Props {
  onBack: () => void;
  backLabel?: string;
  toast: (type: 'success' | 'error', msg: string) => void;
}

export function CueSheet({ onBack, backLabel, toast }: Props) {
  const { items, loading, error, reload } = useCueSheet();
  const [dayKey, setDayKey] = useState(CUE_DAYS[0].key);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CueItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const day = CUE_DAYS.find((d) => d.key === dayKey) ?? CUE_DAYS[0];
  const dayItems = items.filter((it) => it.day === dayKey);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  useEffect(() => {
    if (!menuId) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuId]);

  const handleDelete = async (item: CueItem) => {
    setMenuId(null);
    if (!confirm(`"${item.title}" 일정을 삭제하시겠습니까?`)) return;
    setBusy(true);
    try {
      await api({ action: 'deleteCueItem', token: getToken(), id: item.id });
      toast('success', '일정이 삭제되었습니다.');
      await reload();
    } catch (err) {
      toast('error', (err as ApiError).message || '삭제에 실패했습니다.');
    }
    setBusy(false);
  };

  return (
    <div className="cuesheet-wrap">
      <button className="btn btn-ghost cuesheet-back" onClick={onBack}>
        ← {backLabel ?? '홈으로'}
      </button>

      <div className="cs-title">
        <div className="cs-title-icon">📋</div>
        <div>
          <div className="cs-title-text">수련회 일정표</div>
          <div className="cs-title-sub">{day.dateLabel}</div>
        </div>
      </div>

      <div className="cs-tabs">
        {CUE_DAYS.map((d) => (
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

      {loading ? (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card retry">
          <p>일정표를 불러오지 못했습니다. 네트워크 연결을 확인해주세요.</p>
          <button className="btn btn-primary" onClick={() => reload()}>
            ⟳ 다시 시도
          </button>
        </div>
      ) : (
        <div className="timeline">
          {dayItems.map((item, i) => {
            const open = openIndex === i;
            const hasDetail = !!(item.notes?.length || item.nextPrep?.length || item.remark?.length);
            return (
              <div className="tl-item" key={item.id}>
                <div className="tl-rail">
                  <span className="tl-dot" />
                  {i < dayItems.length - 1 ? <span className="tl-line" /> : null}
                </div>
                <div className={`tl-content card${open ? ' open' : ''}`}>
                  <div className="tl-kebab-wrap" ref={menuId === item.id ? menuRef : null}>
                    <button
                      type="button"
                      className="tl-kebab"
                      onClick={() => setMenuId((prev) => (prev === item.id ? null : item.id))}
                      aria-label="일정 메뉴"
                    >
                      ⋮
                    </button>
                    {menuId === item.id ? (
                      <div className="tl-menu">
                        <button
                          className="tl-menu-item"
                          onClick={() => {
                            setMenuId(null);
                            setEditing(item);
                          }}
                        >
                          수정
                        </button>
                        <button className="tl-menu-item danger" onClick={() => handleDelete(item)} disabled={busy}>
                          삭제
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={`tl-toggle${hasDetail ? ' expandable' : ''}`}
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
              </div>
            );
          })}

          {dayItems.length === 0 ? (
            <div className="empty">
              <strong>등록된 일정이 없습니다</strong>
            </div>
          ) : null}

          <button className="btn btn-ghost cs-add-btn" onClick={() => setAdding(true)}>
            + 이 날짜에 일정 추가
          </button>
        </div>
      )}

      <Modal
        show={adding || !!editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
      >
        {adding || editing ? (
          <CueItemForm
            item={editing}
            defaultDay={dayKey}
            busy={busy}
            setBusy={setBusy}
            toast={toast}
            onCancel={() => {
              setAdding(false);
              setEditing(null);
            }}
            onSaved={async () => {
              setAdding(false);
              setEditing(null);
              await reload();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}
