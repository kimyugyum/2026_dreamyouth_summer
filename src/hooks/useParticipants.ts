import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import type { GetParticipantsResult, Participant, Stats } from '../api/types';
import { getToken } from './useAuth';
import { REFRESH_MS } from '../constants';

export function useParticipants(tokenValid: boolean, paused: boolean) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [syncedAt, setSyncedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadData = useCallback(async (silent?: boolean) => {
    if (!silent) setLoading(true);
    try {
      const d = await api<GetParticipantsResult>({ action: 'getParticipants', token: getToken() });
      setParticipants(d.participants);
      setStats(d.stats);
      setSyncedAt(d.syncedAt);
      setError(false);
    } catch {
      if (!silent) setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tokenValid) loadData();
  }, [tokenValid, loadData]);

  useEffect(() => {
    if (!tokenValid) return;
    const timer = setInterval(() => {
      if (!paused) loadData(true);
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [tokenValid, paused, loadData]);

  return { participants, stats, syncedAt, loading, error, loadData };
}
