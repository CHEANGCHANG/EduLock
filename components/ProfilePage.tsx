
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [isRotating, setIsRotating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdminOrHead = [UserRole.ADMIN, UserRole.HEAD, UserRole.CO_HEAD].includes(user.role);
  const accentColor = isAdminOrHead ? 'text-purple-400' : 'text-cyan-400';
  const accentBg = isAdminOrHead ? 'bg-purple-600' : 'bg-cyan-600';

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleRotateKeys = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      alert('ACCESS KEYS ROTATED: Master cipher updated across all nodes.');
    }, 2000);
  };

  const handleTerminate = () => {
    if (confirm('CRITICAL: INITIATE ACCOUNT TERMINATION? THIS WILL PURGE ALL ARTIFACTS AND REVOKE ACCESS PERMANENTLY.')) {
      alert('TERMINATION REQUEST LOGGED: Clearance pending administrator approval.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditedUser({ ...editedUser, avatar: reader.result as string });
            reader.readAsDataURL(file);
          }
        }} />

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hud-border relative">
          <div className={`h-24 ${accentBg} opacity-10 absolute top-0 left-0 w-full`}></div>
          <div className="p-8 pt-12 relative flex items-center md:items-end gap-6">
             <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
                <div className={`w-32 h-32 rounded-2xl border-2 border-slate-700 bg-slate-950 p-2 shadow-2xl`}>
                  <img src={isEditing ? editedUser.avatar : user.avatar} className="w-full h-full object-cover rounded-xl" alt={user.name} />
                </div>
             </div>
             <div className="flex-1">
                <p className={`${accentColor} font-orbitron text-[10px] font-black tracking-[0.3em] uppercase mb-2`}>{user.role} CLEARANCE</p>
                {isEditing ? (
                  <input value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} className="bg-slate-950 border border-slate-700 rounded p-2 text-2xl font-black font-orbitron text-white uppercase w-full outline-none" />
                ) : (
                  <h1 className="text-4xl font-black font-orbitron text-white uppercase tracking-tighter truncate">{user.name}</h1>
                )}
                <p className="text-slate-500 text-xs font-medium truncate">{user.email}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[10px] font-black font-orbitron text-slate-300 uppercase tracking-widest">Bio-Data Profile</h3>
                 {!isEditing && <button onClick={() => setIsEditing(true)} className="text-[9px] font-orbitron font-black text-slate-500 hover:text-cyan-400 uppercase">[ EDIT DOSSIER ]</button>}
               </div>
               {isEditing ? (
                 <textarea value={editedUser.bio} onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })} className="w-full h-32 bg-slate-950 border border-slate-700 rounded p-4 text-slate-300 text-sm outline-none resize-none" />
               ) : (
                 <p className="text-slate-400 text-sm leading-relaxed italic">"{user.bio || 'No personalized bio provided.'}"</p>
               )}
               {isEditing && (
                 <div className="flex gap-3 mt-8">
                    <button onClick={handleSave} className={`flex-1 py-3 ${accentBg} text-white font-orbitron font-black text-[10px] tracking-widest rounded-lg uppercase`}>Commit Changes</button>
                    <button onClick={() => { setIsEditing(false); setEditedUser({ ...user }); }} className="flex-1 py-3 bg-slate-800 text-slate-400 font-orbitron font-black text-[10px] tracking-widest rounded-lg uppercase">Abort</button>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 ${accentBg}`}></div>
                <h4 className="text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-[0.2em] mb-4">Identity Controls</h4>
                <div className="space-y-2">
                   <button onClick={() => setIsEditing(true)} className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black font-orbitron uppercase rounded-lg text-left">Update Biometrics</button>
                   <button onClick={handleRotateKeys} disabled={isRotating} className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black font-orbitron uppercase rounded-lg text-left disabled:opacity-50">
                     {isRotating ? 'Rotating Nodes...' : 'Rotate Access Keys'}
                   </button>
                   <button onClick={handleTerminate} className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black font-orbitron uppercase rounded-lg text-left border border-red-500/20">Request Terminate</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
