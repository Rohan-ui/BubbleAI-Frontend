import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, Layout, Megaphone, BookOpen, Grid, 
  FolderKanban, Users, Settings, Trash2, ChevronRight, HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [suggestionEnabled, setSuggestionEnabled] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Tools in the sidebar
  const sidebarTools = [
    { title: 'Screenplay writer', path: '/module/script-making', icon: FileText },
    { title: 'Story Board', path: '/module/storyboard', icon: Layout },
    { title: 'Ads Studio', path: '/module/ads-creation', icon: Megaphone },
    { title: 'Comic Studio', path: '/module/comics', icon: BookOpen },
    { title: 'Project Hub', path: '/module/project-hub', icon: Grid }
  ];

  // My Projects section in the sidebar
  const myProjectsItems = [
    { title: 'My Projects', path: '/my-project', icon: FolderKanban },
    { title: 'Team', path: '/team-community', icon: Users },
    { title: 'Community', path: '/team-community', icon: HelpCircle },
    { title: 'Trash', path: '/bin', icon: Trash2 }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  // Generate user initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userInitials = user ? getInitials(user.name) : 'U';
  const userName = user?.name || 'User';
  const userRole = user?.role || 'Creator';

  return (
    <aside className="w-64 bg-[#0a0a0c] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none pb-4 font-sans text-xs">
      
      {/* Scrollable Upper Section */}
      <div className="flex-1 py-4 overflow-y-auto space-y-6 px-3">
        
        {/* Active Overview Dashboard */}
        <div className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium transition-colors",
              isActive && location.pathname === '/'
                ? "bg-white/10 text-white font-semibold"
                : "text-brand-light-grey/85 hover:bg-white/5 hover:text-white"
            )}
          >
            <Grid className="w-4 h-4 text-[#00F5D4]" />
            <span>Dashboard</span>
          </NavLink>
        </div>

        {/* Tools Section Title */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-[#8a8a93] font-mono px-3 font-semibold">
            Tools
          </div>
          
          <div className="space-y-0.5">
            {sidebarTools.map((tool) => {
              const ToolIcon = tool.icon;
              const isToolActive = location.pathname === tool.path;
              return (
                <NavLink
                  key={tool.title}
                  to={tool.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-medium",
                    isToolActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-brand-light-grey/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <ToolIcon className="w-4 h-4 opacity-75 shrink-0" />
                  <span className="truncate">{tool.title}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* My Projects Nested Panel Section */}
        <div className="space-y-2">
          <div className="bg-[#141416] rounded-2xl border border-white/5 p-1.5 space-y-0.5">
            {myProjectsItems.map((item) => {
              const ItemIcon = item.icon;
              const isItemActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left",
                    isItemActive
                      ? "bg-white/5 text-white font-semibold border-l-2 border-[#00F5D4]"
                      : "text-[#8a8a93] hover:text-white hover:bg-white/[0.02]"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ItemIcon className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    <span className="truncate text-[11px]">{item.title}</span>
                  </div>
                  {isItemActive && <div className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Suggestion Toggle Row */}
        <div className="flex items-center justify-between px-3 py-3 rounded-2xl bg-[#141416]/40 border border-white/5">
          <span className="text-brand-light-grey/90 font-medium">Suggestion</span>
          <button
            onClick={() => {
              setSuggestionEnabled(!suggestionEnabled);
              navigate('/bubble-tree?node=suggestion');
            }}
            className={cn(
              "w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none relative",
              suggestionEnabled ? "bg-[#7DDF1D]" : "bg-neutral-800"
            )}
          >
            <div 
              className={cn(
                "w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200",
                suggestionEnabled ? "translate-x-3.5" : "translate-x-0"
              )} 
            />
          </button>
        </div>

        {/* Settings Button */}
        <div className="space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-medium",
              isActive
                ? "bg-white/10 text-white font-semibold"
                : "text-brand-light-grey/80 hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className="w-4 h-4 opacity-75 shrink-0" />
            <span>Settings</span>
          </NavLink>
        </div>

      </div>

      {/* User Information Profile Section at Bottom */}
      <div className="px-3 pt-3 border-t border-white/5 space-y-2">

        {/* User Profile Card */}
        <div 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 p-2 bg-[#141416] hover:bg-[#1c1c1f] rounded-2xl cursor-pointer transition-colors border border-white/5"
        >
          {/* Neon/Lime Green Box Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#7DDF1D] flex items-center justify-center font-bold text-black shadow-lg shadow-[#7DDF1D]/10">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-white text-[11px] truncate leading-tight tracking-wide uppercase">
              {userName}
            </h4>
            <p className="text-[9px] text-[#8a8a93] font-mono mt-0.5 font-semibold truncate">
              {userRole}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        {!showLogoutConfirm ? (
          <button
            id="sidebar-sign-out"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#8a8a93] hover:text-red-400 hover:bg-red-500/5 transition-all text-left group border border-transparent hover:border-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            <span className="text-[11px] font-medium">Sign Out</span>
          </button>
        ) : (
          <div className="bg-[#141416] border border-red-500/20 rounded-xl p-3 space-y-2.5">
            <p className="text-[10px] text-[#8a8a93] text-center font-medium">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-1.5 text-[10px] font-bold text-[#8a8a93] bg-white/5 hover:bg-white/10 rounded-lg transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                id="sidebar-confirm-sign-out"
                onClick={handleLogout}
                className="flex-1 py-1.5 text-[10px] font-bold text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
}
