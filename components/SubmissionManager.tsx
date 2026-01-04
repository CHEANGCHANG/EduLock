
import React, { useState } from 'react';
import { User, CodexFile, SubmissionStatus, UserRole } from '../types';

interface SubmissionManagerProps {
  files: CodexFile[];
  users: User[];
  onUpdateStatus: (fileId: string, status: SubmissionStatus, reason?: string) => void;
}

const SubmissionManager: React.FC<SubmissionManagerProps> = ({ files, users, onUpdateStatus }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<SubmissionStatus | 'ALL'>('ALL');
  
  const studentFiles = files
    .filter(f => f.ownerRole === UserRole.STUDENT)
    .map(f => {
      const student = users.find(s => s.id === f.ownerId);
      return { ...f, student };
    })
    .sort((a, b) => (a.student?.enrollmentId || '').localeCompare(b.student?.enrollmentId || ''));

  const filteredFiles = filter === 'ALL' ? studentFiles : studentFiles.filter(f => f.status === filter);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map(f => f.id));
    }
  };

  const handleBulkApprove = () => {
    if (confirm(`Authorize approval for ${selectedIds.length} nodes?`)) {
      selectedIds.forEach(id => onUpdateStatus(id, SubmissionStatus.APPROVED));
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    const headers = ['Enrollment ID', 'Student Name', 'File Name', 'Status', 'Timestamp'];
    const rows = filteredFiles.map(f => [
      f.student?.enrollmentId || 'N/A',
      f.student?.name || 'N/A',
      f.name,
      f.status,
      f.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `codex_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black font-orbitron text-slate-100 uppercase tracking-tighter">Command: Submission Archive</h2>
          <p className="text-slate-500 text-xs font-orbitron uppercase tracking-[0.2em] mt-2">Centralized processing for student data artifacts</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkApprove}
              className="px-6 py-2 bg-green-600/20 border border-green-500/50 text-green-400 rounded-md font-orbitron text-[10px] font-black tracking-widest uppercase shadow-md"
            >
              BULK APPROVE ({selectedIds.length})
            </button>
          )}
          <select 
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-4 py-2 font-orbitron text-[10px] font-black tracking-widest focus:ring-1 focus:ring-purple-500 outline-none uppercase"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="ALL">ALL ARTIFACTS</option>
            <option value={SubmissionStatus.PENDING}>PENDING SCAN</option>
            <option value={SubmissionStatus.APPROVED}>VERIFIED</option>
            <option value={SubmissionStatus.REJECTED}>QUARANTINED</option>
          </select>
          <button 
            onClick={handleExport}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md font-orbitron text-[10px] font-black tracking-widest transition-all uppercase"
          >
            EXPORT DOSSIER
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hud-border glass-morphism">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="p-5 w-14 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 checked:bg-purple-500 focus:ring-purple-500"
                    checked={selectedIds.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-5 text-[10px] font-black font-orbitron text-slate-500 tracking-widest uppercase">Registry ID</th>
                <th className="p-5 text-[10px] font-black font-orbitron text-slate-500 tracking-widest uppercase">Student Node</th>
                <th className="p-5 text-[10px] font-black font-orbitron text-slate-500 tracking-widest uppercase">Data Fragment</th>
                <th className="p-5 text-[10px] font-black font-orbitron text-slate-500 tracking-widest uppercase">Status</th>
                <th className="p-5 text-[10px] font-black font-orbitron text-slate-500 tracking-widest uppercase text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredFiles.map((file) => (
                <tr key={file.id} className={`hover:bg-slate-800/20 transition-all group ${selectedIds.includes(file.id) ? 'bg-purple-500/5' : ''}`}>
                  <td className="p-5 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 checked:bg-purple-500 focus:ring-purple-500"
                      checked={selectedIds.includes(file.id)}
                      onChange={() => toggleSelect(file.id)}
                    />
                  </td>
                  <td className="p-5 font-orbitron text-xs text-cyan-500 font-black tracking-[0.2em]">{file.student?.enrollmentId || 'UNKNOWN'}</td>
                  <td className="p-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 p-0.5 relative flex-shrink-0">
                        <img src={file.student?.avatar} alt="" className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black font-orbitron text-slate-200 uppercase truncate">{file.student?.name || 'Lost Data Node'}</p>
                        <p className="text-[10px] text-slate-600 truncate">{file.student?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-300 group-hover:text-cyan-400 transition-colors uppercase truncate max-w-[250px]">{file.name}</span>
                      <span className="text-[9px] text-slate-600 font-orbitron uppercase mt-1">TIMESTAMP: {new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex px-3 py-1 rounded-[4px] text-[9px] font-black font-orbitron tracking-widest uppercase border ${
                      file.status === SubmissionStatus.APPROVED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      file.status === SubmissionStatus.REJECTED ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {file.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-500 hover:text-cyan-400 rounded-lg transition-all"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                      <button 
                        onClick={() => onUpdateStatus(file.id, SubmissionStatus.APPROVED)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-green-500 text-slate-500 hover:text-green-400 rounded-lg transition-all"
                        title="Approve"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          const reason = prompt("State reason for quarantine (rejection):");
                          if (reason) onUpdateStatus(file.id, SubmissionStatus.REJECTED, reason);
                        }}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-red-500 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                        title="Reject"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mb-6">
                         <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                         </svg>
                      </div>
                      <p className="text-slate-500 font-orbitron text-xs font-black tracking-widest uppercase">No data fragments detected in this node</p>
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

export default SubmissionManager;
