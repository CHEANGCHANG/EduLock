
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../types';

interface VerificationTrackerProps {
  students: User[];
  onToggleStatus: (studentId: string, field: 'isSubmitted' | 'isVerified') => void;
}

const VerificationTracker: React.FC<VerificationTrackerProps> = ({ students, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedStudents = useMemo(() => {
    return [...students]
      .filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.enrollmentId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.enrollmentId || '').localeCompare(b.enrollmentId || ''));
  }, [students, searchTerm]);

  const handleExport = (format: 'csv' | 'excel') => {
    const headers = ['Enrollment ID', 'Student Name', 'Submitted', 'Verified', 'Join Date'];
    const rows = sortedStudents.map(s => [
      s.enrollmentId || 'N/A',
      s.name,
      s.isSubmitted ? 'YES' : 'NO',
      s.isVerified ? 'YES' : 'NO',
      s.joinDate || 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `codex_verification_report_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSubmitted = students.filter(s => s.isSubmitted).length;
  const totalVerified = students.filter(s => s.isVerified).length;

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right duration-500">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black font-orbitron text-slate-100 uppercase tracking-tighter">Verification Tracker</h2>
          <p className="text-slate-500 text-[10px] md:text-sm font-orbitron uppercase tracking-widest mt-1">Compliance Monitor Node</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3 w-full xl:w-auto">
          <button 
            onClick={() => handleExport('csv')}
            className="flex-1 px-5 py-2.5 bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 font-black font-orbitron text-[10px] tracking-widest rounded transition-all uppercase"
          >
            Export CSV
          </button>
          <button 
            onClick={() => handleExport('excel')}
            className="flex-1 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black font-orbitron text-[10px] tracking-widest rounded shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all uppercase"
          >
            Export Excel
          </button>
        </div>
      </header>

      {/* Stats HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-xl hud-border">
          <p className="text-[9px] md:text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-widest mb-1">Total Enrollment</p>
          <p className="text-2xl md:text-3xl font-black font-orbitron text-white">{students.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-xl hud-border">
          <p className="text-[9px] md:text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-widest mb-1">Global Submissions</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl md:text-3xl font-black font-orbitron text-cyan-400">{totalSubmitted}</p>
            <p className="text-[9px] md:text-[10px] font-orbitron text-slate-600 mb-1">{Math.round((totalSubmitted / (students.length || 1)) * 100)}%</p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 md:p-6 rounded-xl hud-border">
          <p className="text-[9px] md:text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-widest mb-1">Final Verifications</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl md:text-3xl font-black font-orbitron text-purple-400">{totalVerified}</p>
            <p className="text-[9px] md:text-[10px] font-orbitron text-slate-600 mb-1">{Math.round((totalVerified / (students.length || 1)) * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hud-border glass-morphism">
        <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="SEARCH BY ID OR NAME..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-10 text-[10px] font-orbitron text-slate-300 focus:border-cyan-500 outline-none transition-all uppercase tracking-widest"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[8px] md:text-[9px] font-orbitron font-black text-slate-600 tracking-widest uppercase italic hidden xs:block">Real-time Node Sync: Active</p>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-6 text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Student Identity</th>
                <th className="p-6 text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Enrollment ID</th>
                <th className="p-6 text-center text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Submitted</th>
                <th className="p-6 text-center text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Verified</th>
                <th className="p-6 text-right text-[10px] font-black font-orbitron text-slate-500 tracking-[0.2em] uppercase">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/20 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 p-0.5 relative flex-shrink-0">
                        <img src={student.avatar} className="w-full h-full object-cover rounded-sm" alt={student.name} />
                        {(student.isSubmitted && student.isVerified) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-[0_0_5px_#22c55e]"></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black font-orbitron text-slate-200 uppercase tracking-tight truncate">{student.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-xs font-black font-orbitron text-cyan-400 tracking-widest">{student.enrollmentId}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => onToggleStatus(student.id, 'isSubmitted')}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                          student.isSubmitted 
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.2)]' 
                            : 'bg-slate-950 border-slate-800 text-slate-700 hover:border-slate-700'
                        }`}
                      >
                        {student.isSubmitted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => onToggleStatus(student.id, 'isVerified')}
                        disabled={!student.isSubmitted}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                          student.isVerified 
                            ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                            : student.isSubmitted 
                              ? 'bg-slate-950 border-slate-700 text-slate-500 hover:border-purple-500/50' 
                              : 'bg-slate-900 border-slate-800 text-slate-800 cursor-not-allowed'
                        }`}
                      >
                        {student.isVerified ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-[9px] md:text-[10px] font-orbitron text-slate-500 uppercase">{student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'NO ACTIVITY'}</p>
                    <p className="text-[8px] md:text-[9px] font-orbitron text-slate-600 uppercase tracking-tighter truncate">Node: {student.id}</p>
                  </td>
                </tr>
              ))}
              {sortedStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 md:p-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-orbitron text-[10px] md:text-xs uppercase tracking-widest">No matching personnel records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VerificationTracker;
