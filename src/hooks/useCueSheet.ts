import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import type { CueItem, GetCueSheetResult } from '../api/types';

export function useCueSheet() {
  const [items, setItems] = useState<CueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api<GetCueSheetResult>({ action: 'getCueSheet' });
      setItems(d.items);
      setError(false);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { items, loading, error, reload: loadData };
}
