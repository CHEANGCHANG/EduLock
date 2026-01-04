
import React from 'react';
import { User, UserRole, CodexFile, SubmissionStatus, Deadline } from '../types';

interface DashboardProps {
  user: User;
  files: CodexFile[];
  deadlines: Deadline[];
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, files, deadlines, setActiveTab }) => {
  const isAdminOrHead = [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD].includes(user.role);
  const myFiles = files.filter(f => f.ownerId === user.id);
  const approvedCount = myFiles.filter(f => f.status === SubmissionStatus.APPROVED).length;
  const progressPercent = Math.min(100, Math.round((approvedCount / 5) * 100)); // Target 5 approved files for demo

  return (
    <div className="space-y-10 animate-reveal">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className={`px-2 py-0.5 ${isAdminOrHead ? 'bg-purple-600' : 'bg-cyan-600'} text-white font-black font-orbitron text-[8px] tracking-widest rounded-sm uppercase mb-2 inline-block`}>
            {isAdminOrHead ? 'Command Core' : 'Personal Terminal'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black font-orbitron text-slate-100 uppercase tracking-tighter">Welcome, {user.name.split(' ')[0]}</h2>
          <div className={`h-1 w-24 ${isAdminOrHead ? 'bg-purple-500' : 'bg-cyan-500'} mt-2`}></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl hud-border flex items-center space-x-6">
           <div className="text-right">
              <p className="text-[9px] text-slate-500 font-orbitron uppercase">System Clearance</p>
              <p className={`text-lg font-black font-orbitron ${isAdminOrHead ? 'text-purple-400' : 'text-cyan-400'} uppercase`}>{user.role}</p>
           </div>
           <div className={`w-12 h-12 rounded-full border-2 ${isAdminOrHead ? 'border-purple-500 text-purple-500' : 'border-cyan-500 text-cyan-500'} flex items-center justify-center font-black`}>
             {progressPercent}%
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hud-border relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-full h-1 ${isAdminOrHead ? 'bg-purple-500' : 'bg-cyan-500'}`}></div>
             <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest mb-6">Submission Completion Status</h3>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-orbitron text-slate-500 mb-2 uppercase">
                      <span>Verification Milestone</span>
                      <span className={isAdminOrHead ? 'text-purple-400' : 'text-cyan-400'}>{progressPercent}%</span>
                   </div>
                   <div className="h-4 bg-slate-950 rounded-full border border-slate-800 p-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isAdminOrHead ? 'bg-purple-500' : 'bg-cyan-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Node synchronization: stabilizing academic artifacts...</p>
             </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl">
             <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest mb-6">Recent Tactical Alerts</h3>
             <div className="space-y-4">
                {deadlines.slice(0, 3).map(dl => (
                  <div key={dl.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg group hover:border-cyan-500/30 transition-all">
                     <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${dl.priority === 'high' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                        <div>
                           <p className="text-xs font-black font-orbitron text-slate-200 uppercase">{dl.title}</p>
                           <p className="text-[10px] text-slate-500 font-orbitron uppercase">DUE: {new Date(dl.due_date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <button onClick={() => setActiveTab('calendar')} className="text-[9px] font-orbitron text-slate-600 hover:text-cyan-400 uppercase tracking-widest transition-colors">[ VIEW ]</button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xs font-black font-orbitron text-cyan-400 uppercase tracking-widest mb-6">Quick Actions</h3>
              <div className="space-y-3">
                 <button onClick={() => setActiveTab('drive')} className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all text-xs font-black text-slate-300 flex justify-between items-center group">
                    MANAGE ARTIFACTS
                    <svg className="w-4 h-4 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
                 </button>
                 <button onClick={() => setActiveTab('ai')} className="w-full text-left p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all text-xs font-black text-purple-400 flex justify-between items-center group">
                    CONSULT EDU-LOCK AI
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
