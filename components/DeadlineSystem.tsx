
import React, { useState } from 'react';
import { Deadline, UserRole } from '../types';
import { supabase } from '../services/supabaseService';

interface DeadlineSystemProps {
  deadlines: Deadline[];
  role: UserRole;
}

const DeadlineSystem: React.FC<DeadlineSystemProps> = ({ deadlines, role }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ title: '', description: '', due_date: '', priority: 'medium' as const });

  const isAdmin = role === UserRole.ADMIN || role === UserRole.HEAD;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('deadlines').insert([newDeadline]);
    if (!error) {
      setShowAdd(false);
      setNewDeadline({ title: '', description: '', due_date: '', priority: 'medium' });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-reveal">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black font-orbitron text-white uppercase tracking-tighter">Chronos Registry</h2>
          <p className="text-slate-500 text-[10px] md:text-xs font-orbitron uppercase tracking-widest">Active Academic Deadlines</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowAdd(true)} 
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 text-white font-orbitron text-[9px] md:text-[10px] rounded uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-md"
          >
            Initialize Deadline
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {deadlines.length === 0 && <p className="col-span-full text-center py-16 text-slate-600 font-orbitron uppercase text-[10px] tracking-[0.2em]">No active chronos markers detected.</p>}
        {deadlines.map((dl) => (
          <div key={dl.id} className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-xl hud-border group hover:border-cyan-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-0.5 rounded text-[7px] md:text-[8px] font-black font-orbitron uppercase tracking-widest ${
                dl.priority === 'high' ? 'bg-red-500/20 text-red-400' : dl.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {dl.priority} PRIORITY
              </span>
              <span className="text-[9px] md:text-[10px] font-orbitron text-slate-500 uppercase">{new Date(dl.due_date).toLocaleDateString()}</span>
            </div>
            <h4 className="text-sm md:text-base font-black font-orbitron text-slate-200 uppercase mb-2 group-hover:text-cyan-400 transition-colors leading-tight">{dl.title}</h4>
            <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">{dl.description}</p>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
               <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 hud-border overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg md:text-xl font-black font-orbitron text-white uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 text-center">New Chronos Marker</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[8px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Registry Title</label>
                <input required type="text" placeholder="Artifact Submission Phase 1" value={newDeadline.title} onChange={e => setNewDeadline({...newDeadline, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-cyan-500 outline-none font-orbitron" />
              </div>
              <div>
                <label className="text-[8px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Technical Description</label>
                <textarea placeholder="Describe parameters for validation..." value={newDeadline.description} onChange={e => setNewDeadline({...newDeadline, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-cyan-500 outline-none h-28 resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Chronos Target (Due Date)</label>
                  <input required type="datetime-local" value={newDeadline.due_date} onChange={e => setNewDeadline({...newDeadline, due_date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[8px] font-black font-orbitron text-slate-500 uppercase tracking-widest block mb-2">Threat Level (Priority)</label>
                  <select value={newDeadline.priority} onChange={e => setNewDeadline({...newDeadline, priority: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-cyan-500 outline-none uppercase font-orbitron">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="order-2 sm:order-1 flex-1 py-3 bg-slate-800 text-slate-500 font-orbitron text-[9px] font-black rounded-lg uppercase tracking-widest transition-all">Abort</button>
                <button type="submit" className="order-1 sm:order-2 flex-1 py-3 bg-cyan-600 text-white font-orbitron text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg transition-all hover:bg-cyan-500">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineSystem;
