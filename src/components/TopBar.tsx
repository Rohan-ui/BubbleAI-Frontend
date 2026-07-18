import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    navigate('/auth');
  };

  const userInitials = user ? getInitials(user.name) : 'U';

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

      {/* Right User Circle Indicator with Dropdown */}
      <div className="flex items-center gap-4">
        {/* User name display */}
        {user && (
          <span className="text-[#8a8a93] text-xs font-medium hidden md:block">
            {user.name}
          </span>
        )}

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F5D4] to-blue-500 p-[1.5px] shadow-[0_0_12px_rgba(0,245,212,0.2)]">
              <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center text-[10px] font-bold text-[#00F5D4]">
                {userInitials}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00F5D4] border-2 border-[#0a0a0c] rounded-full animate-pulse" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#141416] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-white/[0.05]">
                <p className="text-white text-xs font-bold truncate">{user?.name || 'User'}</p>
                <p className="text-[#8a8a93] text-[10px] font-mono truncate mt-0.5">{user?.email || ''}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1.5">
                <button
                  onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[#8a8a93] hover:text-white hover:bg-white/[0.03] transition-all text-left"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Settings</span>
                </button>

                <button
                  onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[#8a8a93] hover:text-white hover:bg-white/[0.03] transition-all text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Profile</span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="border-t border-white/[0.05] py-1.5">
                <button
                  id="topbar-sign-out"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
