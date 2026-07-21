import { useCallback, useRef, useState } from 'react';

export interface ToastItem {
  id: number;
  type: 'success' | 'error';
  msg: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((type: 'success' | 'error', msg: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, type, msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return { toasts, toast };
}
