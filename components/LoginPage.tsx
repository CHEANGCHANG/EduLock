
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(`ACCESS DENIED: ${authError.message.toUpperCase()}`);
      setIsAuthenticating(false);
      return;
    }

    if (session) {
      // Small delay/retry to ensure the DB trigger has completed profile creation
      let profile = null;
      let retries = 3;
      
      while (retries > 0 && !profile) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          profile = data;
        } else {
          await new Promise(r => setTimeout(r, 500));
          retries--;
        }
      }
      
      if (profile) {
        // Map snake_case to camelCase for the app
        const mappedUser: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          enrollmentId: profile.enrollment_id,
          avatar: profile.avatar,
          bio: profile.bio,
          joinDate: profile.join_date,
          lastActive: profile.last_active,
          canUpload: profile.can_upload,
          isSubmitted: profile.is_submitted,
          isVerified: profile.is_verified,
        };
        onLogin(mappedUser);
      } else {
        setError("PROFILE NOT INITIALIZED. CONTACT COMMANDER.");
        setIsAuthenticating(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,242,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 hud-border animate-reveal">
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-6 neon-shadow animate-pulse">
            <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black font-orbitron tracking-tighter text-white mb-1 uppercase">EduLock <span className="text-cyan-400">Portal</span></h1>
          <p className="text-slate-500 font-orbitron text-[9px] tracking-[0.4em] uppercase animate-typewriter">Vanguard Auth Node Active</p>
        </div>

        {isAuthenticating ? (
          <div className="py-12 flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
            <p className="text-cyan-400 font-orbitron text-[10px] tracking-widest animate-pulse uppercase">Authenticating Identity...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest mb-2 ml-1">Identity Identifier (Email)</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-cyan-500/50 outline-none font-orbitron transition-all"
                  placeholder="name@codex.drive"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Cipher</label>
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-cyan-500/50 outline-none font-orbitron transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-[10px] font-orbitron uppercase tracking-widest text-center animate-reveal">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black font-orbitron text-xs tracking-[0.2em] rounded-lg shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all uppercase"
            >
              INITIALIZE SYNC
            </button>

            <div className="text-center pt-4 border-t border-slate-800">
              <p className="text-[9px] text-slate-500 font-orbitron tracking-widest uppercase">
                Enterprise Node Security Protocol Enabled
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
