export type PaymentStatus = 'PAID' | 'UNPAID';
export type BadgeStatus = 'ISSUED' | 'NOT_ISSUED';

export interface Participant {
  id: string;
  name: string;
  grade: string;
  department: string;
  departmentRaw: string;
  gender: string;
  birthDate: string;
  age: number | null;
  paymentStatus: PaymentStatus;
  badgeStatus: BadgeStatus;
  badgeTime?: string;
  badgeStaff?: string;
  newFriendPath?: string;
  prayer?: string;
  comment?: string;
  timestamp?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Stats {
  total: number;
  paid: number;
  unpaid: number;
  badgeIssued: number;
  badgeNotIssued: number;
  newFriend: number;
}

export interface GetParticipantsResult {
  participants: Participant[];
  stats: Stats;
  syncedAt: string;
}

export interface LoginResult {
  token: string;
  staffName: string;
  expiresAt: number;
}

export interface AddParticipantResult {
  id: string;
}

export interface ApiError {
  success: false;
  message?: string;
  errorCode?: string;
}

export interface ParticipantEditData {
  name: string;
  gender: string;
  grade: string;
  department: string;
  payment: PaymentStatus;
  prayer?: string;
  comment?: string;
  rrn?: string;
}

export interface CueItem {
  id: string;
  day: string;
  order: number;
  time: string;
  title: string;
  subtitle?: string;
  place?: string;
  owner?: string;
  notes: string[];
  nextPrep: string[];
  remark: string[];
}

export type CueItemData = Omit<CueItem, 'id'>;

export interface GetCueSheetResult {
  items: CueItem[];
}

export interface AddCueItemResult {
  id: string;
}
