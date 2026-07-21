import type { ToastItem } from '../hooks/useToast';

interface Props {
  toasts: ToastItem[];
}

export function ToastContainer({ toasts }: Props) {
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type === 'success' ? 'ok' : 'err'}`}>
          {t.type === 'success' ? '✓ ' : '✕ '}
          {t.msg}
        </div>
      ))}
    </div>
  );
}
