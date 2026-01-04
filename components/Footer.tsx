
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 pt-8 md:pt-12 pb-6 md:pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div className="max-w-xs w-full">
          <h2 className="text-lg md:text-xl font-black font-orbitron tracking-tighter text-cyan-400 mb-4 uppercase">EDULOCK <span className="text-slate-400">DRIVE</span></h2>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed uppercase tracking-wider font-medium opacity-80">
            High-security role-restricted academic storage platform. Vanguard Academic Coalition verified node.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:gap-12 w-full md:w-auto">
          <div>
            <h4 className="text-[10px] font-bold text-slate-300 font-orbitron tracking-widest uppercase mb-4">SYSTEM</h4>
            <ul className="space-y-2 text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-tight">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security Audit</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Nodes</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Network Map</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-300 font-orbitron tracking-widest uppercase mb-4">SUPPORT</h4>
            <ul className="space-y-2 text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-tight">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Terminal</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Command Center</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Bug Bounty</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Comms Link</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-xs text-slate-600 space-y-4 md:space-y-0 font-orbitron uppercase tracking-widest">
        <p>© 2026 GTech. NODE STATUS: SECURE.</p>
        <div className="flex space-x-6">
          <span>v2.4.0-STABLE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
