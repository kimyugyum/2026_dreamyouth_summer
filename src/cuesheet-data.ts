export interface CueDayMeta {
  key: string;
  label: string;
  dateLabel: string;
}

export const CUE_DAYS: CueDayMeta[] = [
  { key: 'thu', label: '30일(목)', dateLabel: '7월 30일 목요일 · 1일차' },
  { key: 'fri', label: '31일(금)', dateLabel: '7월 31일 금요일 · 2일차' },
  { key: 'sat', label: '8/1(토)', dateLabel: '8월 1일 토요일 · 3일차' },
];
