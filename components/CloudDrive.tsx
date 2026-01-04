
import React, { useState } from 'react';
import { User, UserRole, CodexFile, SubmissionStatus } from '../types';

interface CloudDriveProps {
  user: User;
  files: CodexFile[];
  onUpload: (file: File) => void;
  onDelete: (fileId: string) => void;
}

const CloudDrive: React.FC<CloudDriveProps> = ({ user, files, onUpload, onDelete }) => {
  const [dragActive, setDragActive] = useState(false);

  // Admins/Heads/Co-Heads can always upload. Students can only upload if canUpload is true.
  const isPrivileged = [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD].includes(user.role);
  const canUpload = isPrivileged || user.canUpload === true;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-reveal">
        <div>
          <h2 className="text-2xl md:text-3xl font-black font-orbitron text-slate-100 uppercase hover-glitch">Secure Data Core</h2>
          <p className="text-slate-500 text-xs md:text-sm uppercase tracking-widest">Role-restricted decentralized storage node</p>
        </div>
        {canUpload ? (
          <label className="w-full sm:w-auto text-center cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded font-orbitron text-[10px] md:text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] active:scale-95">
            UPLOAD ARTIFACT
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="w-full sm:w-auto text-center bg-slate-900 border border-slate-800 px-6 py-2.5 rounded text-slate-500 font-orbitron text-[10px] tracking-widest uppercase cursor-not-allowed">
            UPLOAD RESTRICTED
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {files.map((file, idx) => {
          // Role-based deletion logic
          const canDelete = 
            (user.role === UserRole.ADMIN && !file.isImmutable) || 
            (user.role === UserRole.HEAD && file.ownerRole !== UserRole.ADMIN) ||
            (user.role === UserRole.CO_HEAD && file.ownerId === user.id && !file.isImmutable);
          
          // Determine stagger class (looping through 5 classes)
          const staggerClass = `stagger-${(idx % 5) + 1}`;

          return (
            <div key={file.id} className={`bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-lg hud-border relative group overflow-hidden transition-all hover:scale-[1.03] hover:bg-slate-800 hover:border-cyan-500/50 animate-reveal ${staggerClass}`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/10 group-hover:bg-cyan-500/50 transition-colors"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 md:p-3 bg-slate-800 rounded text-cyan-400 group-hover:bg-slate-700 transition-colors">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                {canDelete && (
                  <button 
                    onClick={() => onDelete(file.id)}
                    className="p-1 text-slate-500 hover:text-red-400 hover:scale-125 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <h3 className="text-slate-200 text-sm md:text-base font-bold truncate mb-1 pr-6 group-hover:text-white transition-colors" title={file.name}>{file.name}</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] md:text-xs text-slate-500 font-orbitron">{formatSize(file.size)}</span>
                <span className={`text-[8px] md:text-[10px] px-1.5 py-0.5 rounded font-orbitron font-bold border transition-colors ${
                  file.ownerRole === UserRole.ADMIN ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' :
                  file.ownerRole === UserRole.STUDENT ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' :
                  'border-slate-500/50 text-slate-400 bg-slate-500/10'
                }`}>
                  {file.ownerRole}
                </span>
              </div>

              {file.status && (
                <div className={`mt-2 py-1.5 px-3 rounded text-[9px] md:text-[11px] font-bold font-orbitron flex items-center justify-between transition-all ${
                  file.status === SubmissionStatus.APPROVED ? 'bg-green-500/10 text-green-400' :
                  file.status === SubmissionStatus.REJECTED ? 'bg-red-500/10 text-red-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  <span className="animate-pulse">{file.status}</span>
                  {file.status === SubmissionStatus.REJECTED && file.rejectionReason && (
                     <div className="group/reason relative ml-2">
                       <svg className="w-4 h-4 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <div className="invisible group-hover/reason:visible opacity-0 group-hover/reason:opacity-100 transition-all absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-950 border border-red-500/50 rounded text-slate-300 z-50 shadow-xl">
                         {file.rejectionReason}
                       </div>
                     </div>
                  )}
                </div>
              )}

              {file.isImmutable && (
                <div className="absolute top-2 right-2 text-purple-500 animate-pulse" title="Immutable Artifact">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
        {files.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-lg animate-reveal">
            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-slate-700 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-slate-500 font-orbitron text-xs md:text-sm tracking-widest uppercase px-4">No artifacts detected in the drive</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudDrive;
