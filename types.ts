
export enum UserRole {
  ADMIN = 'ADMIN',
  HEAD = 'HEAD',
  CO_HEAD = 'CO_HEAD',
  STUDENT = 'STUDENT'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentId?: string;
  semester?: number;
  section?: string;
  avatar?: string;
  bio?: string;
  joinDate?: string;
  lastActive?: string;
  canUpload?: boolean;
  isSubmitted?: boolean;
  isVerified?: boolean;
}

export interface CodexFile {
  id: string;
  name: string;
  size: number;
  type: string;
  ownerId: string;
  ownerRole: UserRole;
  createdAt: string;
  isImmutable: boolean;
  status?: SubmissionStatus;
  rejectionReason?: string;
  url: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface Deadline {
  id: string;
  title: string;
  due_date: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
  type: string;
}
