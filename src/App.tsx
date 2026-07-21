import { useEffect, useMemo, useState } from 'react';
import { setTokenExpiredHandler, api } from './api/client';
import type { ApiError, Participant } from './api/types';
import { useAuth, getToken, getStaff } from './hooks/useAuth';
import { useParticipants } from './hooks/useParticipants';
import { useToast } from './hooks/useToast';
import { matches } from './utils/search';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { StatsGrid } from './components/StatsGrid';
import { SearchBar } from './components/SearchBar';
import { FilterChips } from './components/FilterChips';
import { ParticipantList } from './components/ParticipantList';
import { Fab } from './components/Fab';
import { ToastContainer } from './components/ToastContainer';
import { Modal } from './components/modal/Modal';
import { ParticipantDetail } from './components/modal/ParticipantDetail';
import { EditForm } from './components/modal/EditForm';
import { AddForm } from './components/modal/AddForm';

function App() {
  const auth = useAuth();
  const { toasts, toast } = useToast();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  const { participants, stats, syncedAt, loading, error, loadData } = useParticipants(
    auth.loggedIn,
    busy || editing || adding,
  );

  useEffect(() => {
    setTokenExpiredHandler(() => auth.clearSession());
  }, [auth]);

  const filteredList = useMemo(() => {
    return participants.filter((p) => {
      if (filters.has('PAID') && p.paymentStatus !== 'PAID') return false;
      if (filters.has('UNPAID') && p.paymentStatus !== 'UNPAID') return false;
      if (filters.has('ISSUED') && p.badgeStatus !== 'ISSUED') return false;
      if (filters.has('NOT_ISSUED') && p.badgeStatus !== 'NOT_ISSUED') return false;
      return matches([p.name, p.id, p.grade, p.department, p.departmentRaw], query);
    });
  }, [participants, filters, query]);

  const selectedParticipant = selectedId ? participants.find((p) => p.id === selectedId) ?? null : null;

  const closeModal = () => {
    setSelectedId(null);
    setEditing(false);
    setAdding(false);
  };

  const handleChangeStaff = () => {
    if (confirm('담당자를 변경하시겠습니까? 다시 로그인해야 합니다.')) auth.clearSession();
  };

  const handleRefresh = async () => {
    await loadData();
    toast('success', '최신 데이터를 불러왔습니다.');
  };

  const handleStatSelect = (key: string) => {
    setQuery('');
    if (key === 'ALL') setFilters(new Set());
    else if (key === 'NEWFRIEND') {
      setFilters(new Set());
      setQuery('새친구');
    } else setFilters(new Set([key]));
  };

  const handleFilterToggle = (key: string) => {
    if (key === 'CLEAR') {
      setFilters(new Set());
      return;
    }
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else {
        next.add(key);
        if (key === 'PAID') next.delete('UNPAID');
        if (key === 'UNPAID') next.delete('PAID');
        if (key === 'ISSUED') next.delete('NOT_ISSUED');
        if (key === 'NOT_ISSUED') next.delete('ISSUED');
      }
      return next;
    });
  };

  const handleSetBadge = async (p: Participant, issue: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      await api({ action: 'setBadge', token: getToken(), participantId: p.id, issue, staffName: getStaff() });
      toast('success', issue ? '명찰 배부가 완료되었습니다.' : '명찰 배부가 취소되었습니다.');
    } catch (err) {
      const e = err as ApiError;
      toast(
        'error',
        e.errorCode === 'ALREADY_ISSUED'
          ? '다른 담당자가 이미 명찰 배부를 완료했습니다. 최신 정보를 다시 확인해주세요.'
          : e.message || '처리에 실패했습니다.',
      );
    }
    await loadData(true);
    setBusy(false);
  };

  if (!auth.loggedIn) {
    return (
      <>
        <LoginScreen onLogin={auth.login} toast={toast} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <>
      <Header staffName={auth.staffName} syncedAt={syncedAt} onRefresh={handleRefresh} onChangeStaff={handleChangeStaff} />

      {stats ? <StatsGrid stats={stats} activeFilters={filters} hasQuery={!!query} onSelect={handleStatSelect} /> : null}

      <SearchBar query={query} onChange={setQuery} />
      <FilterChips filters={filters} onToggle={handleFilterToggle} />

      <ParticipantList
        list={filteredList}
        loading={loading}
        error={error}
        onSelect={(id) => {
          setSelectedId(id);
          setEditing(false);
        }}
        onRetry={() => loadData()}
      />

      <Fab onClick={() => setAdding(true)} />

      <Modal show={!!selectedParticipant || adding} onClose={closeModal}>
        {adding ? (
          <AddForm
            busy={busy}
            setBusy={setBusy}
            toast={toast}
            onCancel={closeModal}
            onAdded={async () => {
              setAdding(false);
              closeModal();
              await loadData(true);
            }}
          />
        ) : selectedParticipant ? (
          editing ? (
            <EditForm
              p={selectedParticipant}
              busy={busy}
              setBusy={setBusy}
              toast={toast}
              onCancel={() => setEditing(false)}
              onClose={closeModal}
              onSaved={async () => {
                setEditing(false);
                await loadData(true);
              }}
            />
          ) : (
            <ParticipantDetail
              p={selectedParticipant}
              busy={busy}
              onClose={closeModal}
              onEdit={() => setEditing(true)}
              onSetBadge={handleSetBadge}
            />
          )
        ) : null}
      </Modal>

      <ToastContainer toasts={toasts} />
    </>
  );
}

export default App;
