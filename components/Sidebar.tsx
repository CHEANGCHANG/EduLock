
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, setActiveTab, onLogout, isOpen, onClose }) => {
  const isAdminOrHead = [UserRole.ADMIN, UserRole.HEAD].includes(currentRole);

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: 'M4 6h16M4 12h16M4 18h16', roles: [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD, UserRole.STUDENT] },
    { id: 'drive', label: 'CLOUD DRIVE', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', roles: [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD, UserRole.STUDENT] },
    { id: 'calendar', label: 'CHRONOS CALENDAR', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', roles: [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD, UserRole.STUDENT] },
    { id: 'submissions', label: 'SUBMISSIONS', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', roles: [UserRole.ADMIN, UserRole.HEAD] },
    { id: 'verification', label: 'VERIFICATION', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', roles: [UserRole.ADMIN, UserRole.HEAD] },
    { id: 'users', label: 'STUDENT ROSTER', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', roles: [UserRole.ADMIN, UserRole.HEAD] },
    { id: 'staff', label: 'STAFF HIERARCHY', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', roles: [UserRole.ADMIN, UserRole.HEAD] },
    { id: 'ai', label: 'EDULOCK AI', icon: 'M13 10V3L4 14h7v7l9-11h-7z', roles: [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD, UserRole.STUDENT] },
    { id: 'profile', label: 'MY IDENTITY', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', roles: [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD, UserRole.STUDENT] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentRole));
  const accentColorClass = [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD].includes(currentRole) ? 'text-purple-400' : 'text-cyan-400';
  const accentBgClass = [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD].includes(currentRole) ? 'bg-purple-500/10' : 'bg-cyan-500/10';
  const accentBorderClass = [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD].includes(currentRole) ? 'border-purple-500/50' : 'border-cyan-500/50';

  return (
    <div className={`fixed lg:static top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col pt-8 pb-4 z-[50] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="px-8 mb-12">
        <h1 className={`text-2xl font-black font-orbitron tracking-tighter ${accentColorClass} animate-pulse`}>EDULOCK <span className="text-slate-500">V2</span></h1>
        <p className="text-[9px] text-slate-500 font-orbitron mt-2 uppercase tracking-[0.4em] font-black">Codex Secure Node</p>
      </div>
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {filteredMenu.map((item) => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); onClose(); }} className={`w-full flex items-center px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${activeTab === item.id ? `${accentBgClass} ${accentColorClass} border ${accentBorderClass}` : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}>
            <svg className={`h-5 w-5 mr-4 ${activeTab === item.id ? accentColorClass : 'text-slate-600 group-hover:text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
            <span className="font-orbitron text-[10px] font-black tracking-[0.15em] text-left uppercase">{item.label}</span>
            {activeTab === item.id && <div className={`absolute right-0 top-0 h-full w-1 ${accentColorClass.replace('text-', 'bg-')}`}></div>}
          </button>
        ))}
      </nav>
      <div className="px-6 mt-auto space-y-4">
        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
           <p className="text-[8px] font-orbitron text-slate-600 uppercase mb-1">System Clearance</p>
           <p className={`text-[10px] font-black font-orbitron ${accentColorClass} uppercase`}>{currentRole}</p>
        </div>
        <button onClick={onLogout} className="w-full py-3 bg-slate-950 border border-slate-800 text-[10px] font-black font-orbitron text-slate-500 hover:text-red-500 hover:border-red-500/50 transition-all uppercase tracking-widest rounded-lg">De-Authorize Sync</button>
      </div>
    </div>
  );
};

export default Sidebar;
