
import React, { useState, useMemo } from 'react';
import { UserRole, User } from '../types';
import { supabase } from '../services/supabaseService';

interface UserManagementProps {
  currentRole: UserRole;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onTogglePermission: (studentId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentRole, users, setUsers, onTogglePermission }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterSemester, setFilterSemester] = useState<number | 'ALL'>('ALL');
  const [filterSection, setFilterSection] = useState<string | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    enrollmentId: '', 
    semester: 1, 
    section: 'A' 
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const canManage = currentRole === UserRole.ADMIN || currentRole === UserRole.HEAD;
  const students = users.filter(u => u.role === UserRole.STUDENT);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSemester = filterSemester === 'ALL' || s.semester === filterSemester;
      const matchSection = filterSection === 'ALL' || s.section === filterSection;
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.enrollmentId?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSemester && matchSection && matchSearch;
    });
  }, [students, filterSemester, filterSection, searchTerm]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    const userToAdd = {
      name: newUser.name,
      email: newUser.email,
      enrollment_id: newUser.enrollmentId,
      semester: newUser.semester,
      section: newUser.section,
      role: UserRole.STUDENT,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.enrollmentId}`,
      can_upload: false,
      is_submitted: false,
      is_verified: false,
      join_date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('profiles').insert([userToAdd]);

    if (!error) {
      setShowAddModal(false);
      setNewUser({ name: '', email: '', enrollmentId: '', semester: 1, section: 'A' });
    } else {
      console.error("Supabase Error:", error);
      alert(`Registration Error: ${error.message}`);
    }
    setIsRegistering(false);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-reveal">
        <div>
          <h2 className="text-2xl md:text-3xl font-black font-orbitron text-slate-100 uppercase tracking-tighter">Student Registry</h2>
          <p className="text-slate-500 text-[10px] md:text-sm font-orbitron uppercase tracking-widest mt-1">Classified Academic Node Management</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setShowAddModal(true)} 
            className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black font-orbitron text-[10px] md:text-xs tracking-widest rounded uppercase shadow-md transition-all active:scale-95"
          >
            Enlist Student
          </button>
        )}
      </header>

      {/* FILTER BAR HUD */}
      <div className="bg-slate-900/60 border border-slate-800 p-3 md:p-4 rounded-xl flex flex-col lg:flex-row gap-3 md:gap-4 items-stretch lg:items-center animate-reveal">
        <div className="relative flex-1">
           <input 
             type="text" 
             placeholder="SEARCH BY NAME OR ID..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-10 text-[9px] md:text-[10px] font-orbitron text-slate-300 focus:border-cyan-500 outline-none transition-all uppercase tracking-widest"
           />
           <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
        <div className="grid grid-cols-2 lg:flex gap-3 md:gap-4">
          <select 
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-400 font-orbitron text-[9px] md:text-[10px] font-black tracking-widest uppercase p-2.5 rounded-lg outline-none focus:border-purple-500 w-full lg:w-40"
          >
            <option value="ALL">ALL SEMESTERS</option>
            {semesters.map(s => <option key={s} value={s}>SEM {s}</option>)}
          </select>
          <select 
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-400 font-orbitron text-[9px] md:text-[10px] font-black tracking-widest uppercase p-2.5 rounded-lg outline-none focus:border-purple-500 w-full lg:w-40"
          >
            <option value="ALL">ALL SECTIONS</option>
            {sections.map(s => <option key={s} value={s}>SEC {s}</option>)}
          </select>
        </div>
      </div>

      {/* STUDENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl hud-border relative group animate-reveal hover:bg-slate-800/50 transition-all">
            <div className="absolute top-0 right-0 px-3 py-1 bg-slate-950 border-b border-l border-slate-800 text-[7px] md:text-[8px] font-black font-orbitron text-cyan-500 tracking-widest uppercase rounded-tr-xl">
              SEM {student.semester} • SEC {student.section}
            </div>
            
            <div className="flex items-start space-x-4 md:space-x-5 mb-4 md:mb-6">
               <div className="relative flex-shrink-0">
                 <img src={student.avatar} className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-slate-700 p-1 bg-slate-950" alt={student.name} />
                 <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 border-slate-900 ${student.canUpload ? 'bg-green-500' : 'bg-red-500'}`}></div>
               </div>
               <div className="min-w-0 flex-1 pt-1">
                  <p className="text-[8px] md:text-[9px] font-orbitron text-slate-500 tracking-widest uppercase mb-1">{student.enrollmentId}</p>
                  <h3 className="text-sm md:text-lg font-black font-orbitron text-slate-200 uppercase truncate group-hover:text-cyan-400 transition-colors">{student.name}</h3>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-medium truncate">{student.email}</p>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black font-orbitron text-slate-600 uppercase mb-0.5">Upload Access</span>
                <span className={`text-[9px] md:text-[10px] font-black font-orbitron uppercase ${student.canUpload ? 'text-green-500' : 'text-red-500'}`}>
                  {student.canUpload ? 'ENABLED' : 'LOCKED'}
                </span>
              </div>
              <div className="flex space-x-2">
                {canManage && (
                  <button 
                    onClick={() => onTogglePermission(student.id)} 
                    className={`p-2 rounded-lg border transition-all ${student.canUpload ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-green-500/30 text-green-500 hover:bg-green-500/10'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {student.canUpload ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4m0 0i10 10 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12z" />
                      )}
                    </svg>
                  </button>
                )}
                <button 
                  onClick={() => setSelectedUser(student)} 
                  className="p-2 bg-slate-950 border border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-full py-16 md:py-24 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <p className="text-slate-500 font-orbitron text-[10px] md:text-xs font-black tracking-widest uppercase">No students detected in the filtered array</p>
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 hud-border animate-reveal overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg md:text-xl font-black font-orbitron text-slate-100 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 text-center sm:text-left">Register Student Identity</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Legal Name</label>
                  <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-purple-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Network Alias (Email)</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-purple-500 outline-none transition-all" placeholder="john@university.edu" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Enrollment Identifier</label>
                  <input required type="text" value={newUser.enrollmentId} onChange={e => setNewUser({...newUser, enrollmentId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-purple-500 outline-none transition-all" placeholder="CS-2024-00X" />
                </div>
                <div>
                  <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Semester</label>
                  <select value={newUser.semester} onChange={e => setNewUser({...newUser, semester: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500">
                    {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Section</label>
                  <select value={newUser.section} onChange={e => setNewUser({...newUser, section: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500">
                    {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="order-2 sm:order-1 flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-orbitron text-[10px] font-black tracking-widest rounded-lg uppercase transition-all">Abort Ops</button>
                <button type="submit" disabled={isRegistering} className="order-1 sm:order-2 flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-orbitron text-[10px] font-black tracking-widest rounded-lg uppercase shadow-lg transition-all disabled:opacity-50">
                   {isRegistering ? 'SYNCING...' : 'COMMIT ENTRY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSSIER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 hud-border animate-reveal overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-6 md:mb-8">
               <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                 <img src={selectedUser.avatar} className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-slate-700 p-1 bg-slate-950 shadow-2xl" alt="" />
                 <div>
                   <h3 className="text-xl md:text-2xl font-black font-orbitron text-white uppercase">{selectedUser.name}</h3>
                   <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 px-2 py-0.5 rounded text-[7px] md:text-[8px] font-black font-orbitron uppercase tracking-widest">SEM {selectedUser.semester}</span>
                      <span className="bg-purple-500/10 border border-purple-500/30 text-purple-500 px-2 py-0.5 rounded text-[7px] md:text-[8px] font-black font-orbitron uppercase tracking-widest">SEC {selectedUser.section}</span>
                   </div>
                   <p className="text-slate-500 text-[10px] md:text-xs mt-3 font-medium uppercase tracking-widest">ID: {selectedUser.enrollmentId}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white uppercase font-orbitron text-[8px] md:text-xs tracking-widest transition-colors">[ CLOSE ]</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 p-4 md:p-6 rounded-xl border border-slate-800 mb-6 md:mb-8 text-center sm:text-left">
               <div><p className="text-[7px] md:text-[9px] font-black font-orbitron text-slate-500 uppercase mb-1">Registration Date</p><p className="text-slate-200 text-sm font-bold">{selectedUser.joinDate || 'UNKNOWN'}</p></div>
               <div><p className="text-[7px] md:text-[9px] font-black font-orbitron text-slate-500 uppercase mb-1">Verification Status</p><p className={selectedUser.isVerified ? "text-green-400 text-sm font-bold" : "text-yellow-400 text-sm font-bold"}>{selectedUser.isVerified ? 'FULLY VERIFIED' : 'PENDING APPROVAL'}</p></div>
            </div>
            <p className="text-slate-400 text-[11px] md:text-sm italic border-l-2 border-slate-800 pl-4 leading-relaxed text-center sm:text-left">
              "Authorized Dossier Retrieval. All academic artifacts associated with this node are currently encrypted and secured within the decentralized core."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
