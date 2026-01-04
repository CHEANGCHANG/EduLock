
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CloudDrive from './components/CloudDrive';
import SubmissionManager from './components/SubmissionManager';
import UserManagement from './components/UserManagement';
import VerificationTracker from './components/VerificationTracker';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import StaffManagement from './components/StaffManagement';
import EduLockAI from './components/EduLockAI';
import AuditLogs from './components/AuditLogs';
import DeadlineSystem from './components/DeadlineSystem';
import Footer from './components/Footer';
import { User, UserRole, CodexFile, SubmissionStatus, Notification, Deadline } from './types';
import { gemini } from './services/geminiService';
import { supabase } from './services/supabaseService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<CodexFile[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSyncing, setIsSyncing] = useState(true);

  const mapProfile = (dbProfile: any): User => ({
    id: dbProfile.id,
    name: dbProfile.name,
    email: dbProfile.email,
    role: dbProfile.role as UserRole,
    enrollmentId: dbProfile.enrollment_id,
    semester: dbProfile.semester,
    section: dbProfile.section,
    avatar: dbProfile.avatar,
    bio: dbProfile.bio,
    joinDate: dbProfile.join_date,
    lastActive: dbProfile.last_active,
    canUpload: dbProfile.can_upload,
    isSubmitted: dbProfile.is_submitted,
    isVerified: dbProfile.is_verified,
  });

  const mapFile = (dbFile: any): CodexFile => ({
    id: dbFile.id,
    name: dbFile.name,
    size: dbFile.size,
    type: dbFile.type,
    ownerId: dbFile.owner_id,
    ownerRole: dbFile.owner_role as UserRole,
    createdAt: dbFile.created_at,
    isImmutable: dbFile.is_immutable,
    status: dbFile.status as SubmissionStatus,
    rejectionReason: dbFile.rejection_reason,
    url: dbFile.url,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchUserProfile(session.user.id);
      else setIsSyncing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchUserProfile(session.user.id);
      else {
        setCurrentUser(null);
        setIsSyncing(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      fetchFiles();
      fetchDeadlines();
      fetchNotifications();
      subscribeToChanges();
    }
  }, [currentUser]);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setCurrentUser(mapProfile(data));
    setIsSyncing(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setAllUsers(data.map(mapProfile));
  };

  const fetchFiles = async () => {
    const { data } = await supabase.from('files').select('*').order('created_at', { ascending: false });
    if (data) setFiles(data.map(mapFile));
  };

  const fetchDeadlines = async () => {
    const { data } = await supabase.from('deadlines').select('*').order('due_date', { ascending: true });
    if (data) setDeadlines(data);
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;
    const { data } = await supabase.from('notifications').select('*').eq('user_id', currentUser.id).order('timestamp', { ascending: false });
    if (data) setNotifications(data);
  };

  const subscribeToChanges = () => {
    const channel = supabase.channel('codex-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, fetchFiles)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deadlines' }, fetchDeadlines)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleUpdateStaffRole = async (userId: string, newRole: UserRole) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
  };

  const handleRemoveStaff = async (userId: string) => {
    await supabase.from('profiles').delete().eq('id', userId);
  };

  const toggleStudentUploadPermission = async (studentId: string) => {
    const student = allUsers.find(u => u.id === studentId);
    if (!student) return;
    const newState = !student.canUpload;
    await supabase.from('profiles').update({ can_upload: newState }).eq('id', studentId);
  };

  const handleUpload = async (file: File) => {
    if (!currentUser) return;
    const fileName = `${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from('artifacts').upload(fileName, file);
    if (storageError) {
      console.error("Storage Error:", storageError);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('artifacts').getPublicUrl(fileName);
    const newFileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      owner_id: currentUser.id,
      owner_role: currentUser.role,
      is_immutable: currentUser.role === UserRole.ADMIN,
      status: currentUser.role === UserRole.STUDENT ? SubmissionStatus.PENDING : null,
      url: publicUrl
    };
    await supabase.from('files').insert([newFileData]);
  };

  const handleUpdateStatus = async (fileId: string, status: SubmissionStatus, reason?: string) => {
    await supabase.from('files').update({ status, rejection_reason: reason }).eq('id', fileId);
    if (status === SubmissionStatus.APPROVED) {
      const file = files.find(f => f.id === fileId);
      if (file && file.ownerRole === UserRole.STUDENT) {
        await supabase.from('profiles').update({ is_submitted: true }).eq('id', file.ownerId);
      }
    }
  };

  if (isSyncing) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin mb-6 mx-auto"></div>
        <p className="text-cyan-400 font-orbitron text-[10px] tracking-[0.5em] uppercase">Initializing Command Link</p>
      </div>
    </div>
  );

  if (!currentUser) return <LoginPage onLogin={(u) => setCurrentUser(u)} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={currentUser} files={files} deadlines={deadlines} setActiveTab={setActiveTab} />;
      case 'drive': return <CloudDrive user={currentUser} files={files} onUpload={handleUpload} onDelete={async (id) => await supabase.from('files').delete().eq('id', id)} />;
      case 'calendar': return <DeadlineSystem deadlines={deadlines} role={currentUser.role} />;
      case 'submissions': return <SubmissionManager files={files} users={allUsers} onUpdateStatus={handleUpdateStatus} />;
      case 'verification': return <VerificationTracker students={allUsers.filter(u => u.role === UserRole.STUDENT)} onToggleStatus={async (id, f) => {
          const column = f === 'isSubmitted' ? 'is_submitted' : 'is_verified';
          const currentVal = allUsers.find(u => u.id === id)?.[f];
          await supabase.from('profiles').update({ [column]: !currentVal }).eq('id', id);
      }} />;
      case 'users': return <UserManagement currentRole={currentUser.role} users={allUsers} setUsers={setAllUsers} onTogglePermission={toggleStudentUploadPermission} />;
      case 'profile': return <ProfilePage user={currentUser} onUpdate={async (u) => {
          const dbProfile = { name: u.name, bio: u.bio, avatar: u.avatar };
          await supabase.from('profiles').update(dbProfile).eq('id', u.id);
      }} />;
      case 'staff': return <StaffManagement users={allUsers} onAddStaff={() => {}} onUpdateStaffRole={handleUpdateStaffRole} onRemoveStaff={handleRemoveStaff} />;
      case 'ai': return <EduLockAI />;
      case 'audit': return <AuditLogs />;
      default: return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${theme === 'light' ? 'light-mode' : 'bg-slate-950'} text-slate-200 transition-all duration-500 relative overflow-hidden`}>
      <Sidebar currentRole={currentUser.role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-40 bg-slate-900/60">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className={`block w-2.5 h-2.5 rounded-full ${currentUser.role === UserRole.ADMIN ? 'bg-purple-500' : 'bg-cyan-500'}`}></span>
              </div>
              <span className="text-[10px] font-orbitron font-black tracking-[0.2em] text-slate-400 uppercase hidden sm:inline">Node Status: Online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
             <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-4 py-1.5 border border-slate-800 rounded-md hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-[9px] font-orbitron font-black uppercase tracking-widest text-slate-500 hover:text-cyan-400">
               {theme === 'dark' ? 'Stealth' : 'Lumina'}
             </button>
             <button onClick={() => setShowNotificationPanel(!showNotificationPanel)} className="relative p-2 text-slate-500 hover:text-cyan-400 transition-colors group">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               {notifications.some(n => !n.read) && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-slate-900"></span>}
             </button>
             <div className="h-8 w-[1px] bg-slate-800"></div>
             <button onClick={() => setActiveTab('profile')} className="flex items-center space-x-3 group pl-2">
               <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black font-orbitron text-white uppercase group-hover:text-cyan-400 transition-colors">{currentUser.name}</p>
                 <p className="text-[8px] font-orbitron text-slate-500 uppercase tracking-tighter">{currentUser.role}</p>
               </div>
               <div className="relative">
                 <img src={currentUser.avatar} className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-950 p-0.5 group-hover:border-cyan-500 transition-colors" alt="Avatar" />
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
               </div>
             </button>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-950/20">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default App;
