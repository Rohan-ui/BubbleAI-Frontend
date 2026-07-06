import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Search, ChevronDown, Check, ArrowRight, Clock, Star, Plus 
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom screen/view/screenplay actions
  const [selectedScreenplayOption, setSelectedScreenplayOption] = useState<string | null>(null);
  const [showScreenplayMenu, setShowScreenplayMenu] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning Creator";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon Creator";
    } else if (hour >= 17 && hour < 22) {
      return "Good Evening Creator";
    } else {
      return "Good Night Creator";
    }
  };

  const cards = [
    {
      id: 'script-making',
      title: 'Screenplay writer',
      description: 'Ai - assisted script generation',
      primaryColor: '#1E60D5', // Blue
      stripeBg: 'bg-[#1E60D5]',
      clickable: true,
      hasDropdown: true,
      dropdownText: 'view screenplay ⌵'
    },
    {
      id: 'storyboard',
      title: 'Story Board',
      description: 'Visual Sequence Builder',
      primaryColor: '#D97706', // Orange
      stripeBg: 'bg-[#C1711F]',
      clickable: true,
      hasDropdown: false
    },
    {
      id: 'ads-creation',
      title: 'Ads Studio',
      description: 'Transform Drafts into industry standard',
      primaryColor: '#DC2626', // Red
      stripeBg: 'bg-[#942023]',
      clickable: true,
      hasDropdown: false
    },
    {
      id: 'comics',
      title: 'Comic Studio',
      description: 'Tools for Manga, Webtoons & Graphic novels',
      primaryColor: '#65A30D', // Green
      stripeBg: 'bg-[#557E1E]',
      clickable: true,
      hasDropdown: false
    },
    {
      id: 'project-hub',
      title: 'Project Hub',
      description: 'Centralized management for all creative assets',
      primaryColor: '#7C3AED', // Purple
      stripeBg: 'bg-[#4C2ECC]',
      clickable: true,
      hasDropdown: false
    },
    {
      id: 'budget-planner',
      title: 'Budget Planner',
      description: 'Industrial budget analysis and cost allocation',
      primaryColor: '#10B981', // Vivid Teal/Green
      stripeBg: 'bg-[#187545]',
      clickable: false,
      hasDropdown: false
    }
  ];

  const recentProjects = [
    { id: 'proj-1', name: 'Midnight Escape (Action Thriller)', updated: '2 hours ago', progress: '84%', scenes: 14 },
    { id: 'proj-2', name: 'Cyber Hunter 2088 (Sci-Fi Manga Spec)', updated: 'Yesterday', progress: '42%', scenes: 8 }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 font-sans select-none text-white bg-[#060608]">
      
      {/* Top Welcome Title Grid Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-[#8a8a93] text-base lg:text-lg font-mono font-medium">
            “ Hello Arjun Krishna
          </p>
        </div>

        {/* Right Search Input matched to Mockup */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141416] border border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-[#8a8a93]/60 focus:outline-none focus:border-white/20 transition-all font-medium pr-10"
          />
          <Search className="w-4 h-4 text-[#8a8a93]/60 absolute right-3.5 top-3" />
        </div>
      </header>

      {/* Industrial Works Section Tag & Horizontal Filter Pills Row */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-3">
          <div className="text-xs uppercase tracking-[0.25em] text-[#8a8a93] font-bold font-mono">
            Industrial Works
          </div>

          {/* Quick-Pill Selection Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Active Left share tab pill */}
            <button 
              onClick={() => navigate('/bubble-tree?node=share-file')}
              className="px-4 py-2 rounded-full bg-[#1e1e24] hover:bg-[#282830] text-white text-[11px] font-bold uppercase tracking-wider transition-colors border border-white/5 shadow-md flex items-center gap-1.5"
            >
              <span>Share Files</span>
            </button>

            {/* Other pill choices navigating directly to respective bubble tree parameter screen */}
            <button 
              onClick={() => navigate('/bubble-tree?node=file-share')}
              className="px-4 py-2 rounded-full bg-[#141416] hover:bg-white/[0.05] text-[#8a8a93] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all border border-white/[0.08]"
            >
              All files
            </button>

            <button 
              onClick={() => navigate('/bubble-tree?node=all-organisations')}
              className="px-4 py-2 rounded-full bg-[#141416] hover:bg-white/[0.05] text-[#8a8a93] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all border border-white/[0.08]"
            >
              All organization
            </button>

            <button 
              onClick={() => navigate('/bubble-tree?node=connector')}
              className="px-4 py-2 rounded-full bg-[#141416] hover:bg-white/[0.05] text-[#8a8a93] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all border border-white/[0.08]"
            >
              Connector
            </button>

            <button 
              onClick={() => navigate('/bubble-tree?node=current-work-view-sheet')}
              className="px-4 py-2 rounded-full bg-[#141416] hover:bg-white/[0.05] text-[#8a8a93] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all border border-white/[0.08]"
            >
              Current view
            </button>

          </div>
        </div>

        {/* 6 Grid Cards Matching Mockup Visual Style Exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {cards.map((card) => {
            const isFirst = card.id === 'script-making';

            return (
              <div
                key={card.id}
                className={cn(
                  "group relative rounded-[28px] bg-[#141416] border border-white/[0.05] flex flex-col justify-between overflow-hidden shadow-xl min-h-[220px] transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5"
                )}
              >
                
                {/* Upper Body Area */}
                <div className="p-7 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-white group-hover:text-[#00F5D4] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-[#8a8a93] text-xs font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Button / Trigger area */}
                  {isFirst ? (
                    <div className="relative inline-block z-30">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowScreenplayMenu(!showScreenplayMenu);
                        }}
                        className="py-2.5 px-4 rounded-xl bg-[#222226] hover:bg-[#323236] text-[11px] font-bold tracking-wide uppercase transition-colors text-white shrink-0 flex items-center gap-2 border border-white/5 active:scale-95"
                      >
                        <span>{selectedScreenplayOption || 'view screenplay'}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-65" />
                      </button>

                      {showScreenplayMenu && (
                        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#1c1c1f] border border-white/10 shadow-2xl overflow-hidden z-50">
                          <button
                            onClick={() => {
                              setSelectedScreenplayOption('Standard Draft');
                              setShowScreenplayMenu(false);
                              navigate('/module/script-making');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 text-[11px] font-bold text-white uppercase tracking-wider transition-colors border-b border-white/5"
                          >
                            Standard Draft
                          </button>
                          <button
                            onClick={() => {
                              setSelectedScreenplayOption('AI Assistant');
                              setShowScreenplayMenu(false);
                              navigate('/module/script-making');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 text-[11px] font-bold text-white uppercase tracking-wider transition-colors border-b border-white/5"
                          >
                            AI Gen Assistant
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => card.clickable && navigate(`/module/${card.id}`)}
                      className="py-3 px-8 rounded-xl bg-[#222226]/50 group-hover:bg-[#222226] transition-colors w-24 h-4.5 block select-none border border-transparent"
                    />
                  )}

                </div>

                {/* Highly Saturated Accent Bottom Strip 'Currently Building' */}
                <div 
                  onClick={() => card.clickable && navigate(`/module/${card.id}`)}
                  className={cn(
                    "cursor-pointer w-full py-4 text-center select-none shrink-0 transition-opacity active:opacity-90",
                    card.stripeBg
                  )}
                >
                  <span className="text-white text-xs font-extrabold uppercase tracking-widest block text-shadow-sm">
                    Currently Building
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Divider Separator Line */}
      <hr className="border-t border-white/[0.08] lg:my-14" />

      {/* Recent Projects Section */}
      <div className="space-y-6">
        <div className="text-sm uppercase tracking-[0.25em] text-[#8a8a93] font-bold font-mono">
          Recent Project
        </div>

        {/* 2 Wide horizontal panels representing recent project elements mirroring mockup screenshot */}
        <div className="space-y-4">
          {recentProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate('/module/script-making')}
              className="p-8 bg-[#141416] hover:bg-[#18181b] border border-white/[0.04] rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer transition-all duration-300 hover:border-white/10 group shadow-lg"
            >
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-base lg:text-lg group-hover:text-[#00F5D4] transition-colors leading-tight">
                  {proj.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#8a8a93]">
                  <span>{proj.scenes} Scenes formulated</span>
                  <span>•</span>
                  <span>Updated {proj.updated}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#8a8a93] mb-1">Index State</p>
                  <p className="text-xs font-mono font-bold text-white bg-white/5 border border-white/5 px-3 py-1 rounded-lg">
                    {proj.progress}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] group-hover:bg-[#00F5D4]/10 flex items-center justify-center text-white group-hover:text-[#00F5D4] transition-all duration-300">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
