import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-[#0a0a0c] border-b border-white/[0.08] px-6 flex items-center justify-between select-none shrink-0">
      <div className="flex items-center gap-6">
        {/* Brand Logo & PRO Badging */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-white font-extrabold text-base tracking-tight group-hover:text-brand-blue transition-colors">
            Bubble Tree
          </span>
          <span className="bg-[#00F5D4]/15 text-[#00F5D4] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#00F5D4]/30">
            PRO
          </span>
        </div>

        {/* Dashboard Link Option */}
        <div className="h-4 w-px bg-white/10" />
        
        <button 
          onClick={() => navigate('/')}
          className="text-white hover:text-[#00F5D4] text-xs font-semibold tracking-wide transition-colors"
        >
          Dashboard
        </button>
      </div>

      {/* Right User Circle Indicator */}
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F5D4] to-blue-500 p-[1.5px] shadow-[0_0_12px_rgba(0,245,212,0.2)]">
            <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center text-[10px] font-bold text-[#00F5D4]">
              AK
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00F5D4] border-2 border-[#0a0a0c] rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
}
