
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface StaffManagementProps {
  users: User[];
  onAddStaff: (staffData: Partial<User>) => void;
  onUpdateStaffRole: (userId: string, newRole: UserRole) => void;
  onRemoveStaff: (userId: string) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ users, onAddStaff, onUpdateStaffRole, onRemoveStaff }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: UserRole.CO_HEAD });

  // Filter for Heads and Co-Heads
  const staff = users.filter(u => u.role === UserRole.HEAD || u.role === UserRole.CO_HEAD);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStaff(newStaff);
    setShowAddModal(false);
    setNewStaff({ name: '', email: '', role: UserRole.CO_HEAD });
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black font-orbitron text-slate-100 uppercase tracking-tighter">Command Hierarchy</h2>
          <p className="text-slate-500 text-sm font-orbitron uppercase tracking-widest mt-1">Management of Head and Co-Head Personnel</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black font-orbitron text-xs tracking-widest rounded shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all uppercase"
        >
          Enlist New Staff
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hud-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40">
                <th className="p-6 text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Staff Member</th>
                <th className="p-6 text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Current Clearance</th>
                <th className="p-6 text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Auth Status</th>
                <th className="p-6 text-right text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Tactical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <img src={member.avatar} className="w-12 h-12 rounded-lg border border-slate-700 bg-slate-950 p-1" alt={member.name} />
                      <div>
                        <p className="text-sm font-black font-orbitron text-slate-200 uppercase tracking-tight">{member.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded text-[10px] font-black font-orbitron tracking-widest border ${
                      member.role === UserRole.HEAD 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                      <span className="text-[10px] font-orbitron text-slate-400 uppercase">Authenticated</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center space-x-3">
                      {member.role === UserRole.CO_HEAD ? (
                        <button 
                          onClick={() => onUpdateStaffRole(member.id, UserRole.HEAD)}
                          className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded text-[9px] font-black font-orbitron uppercase tracking-widest transition-all"
                          title="Promote to Head"
                        >
                          Promote
                        </button>
                      ) : (
                        <button 
                          onClick={() => onUpdateStaffRole(member.id, UserRole.CO_HEAD)}
                          className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded text-[9px] font-black font-orbitron uppercase tracking-widest transition-all"
                          title="Demote to Co-Head"
                        >
                          Demote
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (confirm(`INITIATE DISCHARGE SEQUENCE FOR ${member.name}? THIS ACTION IS PERMANENT.`)) {
                            onRemoveStaff(member.id);
                          }
                        }}
                        className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remove Staff"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 font-orbitron uppercase tracking-widest italic border-slate-800">
                    No active staff nodes found in hierarchy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-10 hud-border shadow-[0_0_100px_rgba(168,85,247,0.1)]">
            <h3 className="text-2xl font-black font-orbitron text-slate-100 uppercase tracking-widest mb-8 text-center">Staff Enlistment</h3>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Staff Member Name</label>
                <input 
                  required
                  type="text" 
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:border-purple-500 outline-none font-medium transition-all"
                  placeholder="Operational Handle"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Communication Alias (Email)</label>
                <input 
                  required
                  type="email" 
                  value={newStaff.email}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:border-purple-500 outline-none font-medium transition-all"
                  placeholder="alias@codex.drive"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Clearance Tier Assignment</label>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     type="button"
                     onClick={() => setNewStaff({...newStaff, role: UserRole.HEAD})}
                     className={`py-4 rounded-xl font-orbitron text-[11px] font-black uppercase tracking-widest border transition-all ${
                       newStaff.role === UserRole.HEAD 
                         ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                         : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                     }`}
                   >
                     Head Director
                   </button>
                   <button 
                     type="button"
                     onClick={() => setNewStaff({...newStaff, role: UserRole.CO_HEAD})}
                     className={`py-4 rounded-xl font-orbitron text-[11px] font-black uppercase tracking-widest border transition-all ${
                       newStaff.role === UserRole.CO_HEAD 
                         ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                         : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                     }`}
                   >
                     Co-Head Associate
                   </button>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-8">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-orbitron text-[10px] font-black tracking-[0.2em] rounded-xl transition-all uppercase"
                >
                  Cancel Ops
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-orbitron text-[10px] font-black tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all uppercase"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
