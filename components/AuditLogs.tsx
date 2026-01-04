
import React, { useState } from 'react';
import { AuditLog } from '../types';

const MOCK_LOGS: AuditLog[] = [
  { id: '1', timestamp: new Date().toISOString(), userId: 'u1', action: 'LOGIN_SUCCESS', details: 'Admin session initiated from 192.168.1.1', type: 'security' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), userId: 's1', action: 'FILE_UPLOAD', details: 'Artifact "Thesis_Draft_V2.pdf" committed to node', type: 'file' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), userId: 'u1', action: 'PERM_TOGGLE', details: 'Upload access granted to node CS-2024-001', type: 'user' },
  { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), userId: 'system', action: 'CORE_SYNC', details: 'Database integrity check: Optimal', type: 'system' },
];

const AuditLogs: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const filteredLogs = filter === 'all' ? MOCK_LOGS : MOCK_LOGS.filter(l => l.type === filter);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black font-orbitron text-slate-100 uppercase tracking-tighter">System Audit Trails</h2>
          <p className="text-slate-500 text-sm font-orbitron uppercase tracking-widest mt-1">Master Log of Node Activity</p>
        </div>
        <div className="flex gap-2">
          {['all', 'security', 'file', 'user', 'system'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded text-[9px] font-black font-orbitron uppercase tracking-widest border transition-all ${
                filter === t ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hud-border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="p-4 text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Timestamp</th>
              <th className="p-4 text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Agent ID</th>
              <th className="p-4 text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Operation</th>
              <th className="p-4 text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Analysis Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/20">
                <td className="p-4 font-orbitron text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 text-xs font-bold text-cyan-400 uppercase">{log.userId}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black font-orbitron uppercase tracking-tighter ${
                    log.type === 'security' ? 'bg-red-500/10 text-red-500' :
                    log.type === 'system' ? 'bg-purple-500/10 text-purple-500' :
                    'bg-cyan-500/10 text-cyan-500'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-400">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
