import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FolderKanban, Plus, Search, Filter, ArrowUpRight, 
  FileText, Layout, BookOpen, Megaphone, Clock, 
  ChevronRight, MoreHorizontal, Sparkles, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

// Helper to match icons
const ICON_MAP: Record<string, any> = {
  'script-making': FileText,
  'storyboard': Layout,
  'comics': BookOpen,
  'ads-creation': Megaphone
};

export function MyProjectWorkspace() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'script-making' | 'storyboard' | 'comics' | 'ads-creation'>('all');

  const [projects, setProjects] = useState([
    {
      id: 'proj-1',
      title: 'Neon Odyssey',
      description: 'A cyberpunk neo-noir screenplay with interactive multi-branch timeline.',
      moduleType: 'script-making',
      updatedAt: '2 hours ago',
      progress: 85,
      version: 'v2.4',
      status: 'In Progress'
    },
    {
      id: 'proj-2',
      title: 'The Great Heist storyboard',
      description: 'Keyframe storyboard sequence for the treasury breakout scene.',
      moduleType: 'storyboard',
      updatedAt: '1 day ago',
      progress: 60,
      version: 'v1.1',
      status: 'Draft'
    },
    {
      id: 'proj-3',
      title: 'Mecha Awakening',
      description: 'Comic narrative draft and frame distribution guidelines.',
      moduleType: 'comics',
      updatedAt: '3 days ago',
      progress: 45,
      version: 'v0.9',
      status: 'Conceptual'
    },
    {
      id: 'proj-4',
      title: 'Quantum Cola Promo',
      description: 'Ad campaign targeting gen-z sci-fi enthusiasts, integrated pacing.',
      moduleType: 'ads-creation',
      updatedAt: '1 week ago',
      progress: 95,
      version: 'v3.0-final',
      status: 'Completed'
    }
  ]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ? true : p.moduleType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-blue mb-2">
            <FolderKanban className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Workspace</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">My Projects</h1>
          <p className="text-brand-light-grey text-sm mt-1">
            Manage your high-precision drafts, screenplays, and multi-media sequences.
          </p>
        </div>

        <button 
          onClick={() => navigate('/module/script-making')}
          className="bg-brand-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </header>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-brand-grey/10 p-4 rounded-2xl border border-white/5">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-light-grey" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-brand-light-grey/50 focus:border-brand-blue/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <Filter className="w-4 h-4 text-brand-light-grey shrink-0 ml-2" />
          {(['all', 'script-making', 'storyboard', 'comics', 'ads-creation'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all",
                filterType === type 
                  ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/30" 
                  : "bg-brand-dark/50 text-brand-light-grey border border-white/5 hover:text-white"
              )}
            >
              {type === 'all' ? 'All Modules' : type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p, idx) => {
          const ModuleIcon = ICON_MAP[p.moduleType] || FileText;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-brand-grey/20 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-blue/20 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-dark border border-white/10 rounded-xl flex items-center justify-center text-brand-light-grey group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-colors">
                      <ModuleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-light-grey/50 uppercase tracking-wider">{p.moduleType.replace('-', ' ')}</span>
                      <h3 className="font-bold text-lg leading-snug text-white group-hover:text-brand-blue transition-colors">{p.title}</h3>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    p.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    p.status === 'In Progress' ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20" :
                    "bg-brand-light-grey/10 text-brand-light-grey border border-white/5"
                  )}>
                    {p.status}
                  </span>
                </div>

                <p className="text-brand-light-grey text-sm mb-6 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-light-grey/60">Completion Progress</span>
                    <span className="font-semibold text-white">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-dark/50 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        p.progress > 80 ? "bg-emerald-500" : "bg-brand-blue"
                      )}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-light-grey">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{p.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-dark px-2 py-0.5 rounded border border-white/5 text-[10px] uppercase font-bold text-brand-light-grey/60">{p.version}</span>
                    <button 
                      onClick={() => navigate(`/module/${p.moduleType}`)}
                      className="flex items-center gap-1 font-bold text-brand-blue hover:text-blue-400 transition-colors"
                    >
                      Resume
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-1 md:col-span-2 aspect-[4/1] md:aspect-[3/1] bg-brand-grey/15 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-10 h-10 text-brand-light-grey/30 mb-4" />
            <h3 className="font-bold text-lg mb-1">No Projects Found</h3>
            <p className="text-brand-light-grey text-sm">Create a new project or adjust your search to start designing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
