
import { UserRole, User, CodexFile, SubmissionStatus } from './types';

export const COLORS = {
  primary: '#00f2ff',
  secondary: '#a855f7',
  danger: '#ef4444',
  success: '#22c55e',
  bgDark: '#0f172a',
  bgCard: 'rgba(30, 41, 59, 0.7)',
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Commander Admin',
    email: 'admin@codex.drive',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    bio: 'System Architect and Lead Administrator for the Vanguard Codex Network.',
    joinDate: '2023-01-15',
    lastActive: new Date().toISOString()
  },
  {
    id: 'h1',
    name: 'Director Sarah',
    email: 'sarah@codex.drive',
    role: UserRole.HEAD,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Operational Head oversight for all academic submissions.',
    joinDate: '2023-03-22'
  },
  {
    id: 's1',
    name: 'Alice Smith',
    email: 'alice@codex.edu',
    role: UserRole.STUDENT,
    enrollmentId: 'CS-2024-001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    bio: 'Junior Cyber-Security major focusing on decentralized protocols.',
    joinDate: '2024-02-10'
  }
];

export const MOCK_STUDENTS: User[] = [
  { id: 's1', name: 'Alice Smith', email: 'alice@codex.edu', role: UserRole.STUDENT, enrollmentId: 'CS-2024-001', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 's2', name: 'Bob Johnson', email: 'bob@codex.edu', role: UserRole.STUDENT, enrollmentId: 'CS-2024-002', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 's3', name: 'Charlie Brown', email: 'charlie@codex.edu', role: UserRole.STUDENT, enrollmentId: 'CS-2024-003', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];

export const MOCK_FILES: CodexFile[] = [
  {
    id: 'f1',
    name: 'Security_Protocols.pdf',
    size: 1024 * 1024 * 2.5,
    type: 'application/pdf',
    ownerId: 'u1',
    ownerRole: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    isImmutable: true,
    url: '#'
  },
  {
    id: 'f2',
    name: 'Lab_Report_V1.docx',
    size: 1024 * 512,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ownerId: 's1',
    ownerRole: UserRole.STUDENT,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isImmutable: false,
    status: SubmissionStatus.PENDING,
    url: '#'
  }
];
