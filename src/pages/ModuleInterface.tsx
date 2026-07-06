import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Settings, Share2, Download, 
  Play, Plus, Search, MoreHorizontal,
  FileText, Layout, BookOpen, Megaphone, 
  Layers, Grid, Video
} from 'lucide-react';
import { MODULES } from '../types';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, any> = {
  FileText, Layout, BookOpen, Megaphone, 
  Layers, Grid, Video
};

import { StoryboardWorkspace } from './StoryboardWorkspace';
import { ScriptWorkspace } from './ScriptWorkspace';
import { ComicsWorkspace } from './ComicsWorkspace';
import { AdsWorkspace } from './AdsWorkspace';
import { ProjectHubWorkspace } from './ProjectHubWorkspace';

export function ModuleInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const module = MODULES.find(m => m.id === id);

  if (!module) return <div>Module not found</div>;

  if (id === 'storyboard') {
    return <StoryboardWorkspace />;
  }

  if (id === 'script-making') {
    return <ScriptWorkspace />;
  }

  if (id === 'comics') {
    return <ComicsWorkspace />;
  }

  if (id === 'ads-creation') {
    return <AdsWorkspace />;
  }

  if (id === 'project-hub') {
    return <ProjectHubWorkspace />;
  }

  const Icon = ICON_MAP[module.icon];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-brand-dark"
    >
      {/* Top Bar */}
      <header className="h-16 border-bottom border-white/5 flex items-center justify-between px-6 bg-brand-dark/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-brand-light-grey hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue/20 text-brand-blue rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg">{module.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-light-grey hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-light-grey hover:text-white transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Contextual) */}
        <aside className="w-64 border-r border-white/5 p-4 hidden lg:flex flex-col gap-6">
          <div>
            <h3 className="text-[10px] font-bold text-brand-light-grey uppercase tracking-widest mb-4 opacity-50">Assets</h3>
            <div className="space-y-1">
              {['Recent Files', 'Drafts', 'Templates', 'Archive'].map(item => (
                <button key={item} className="w-full text-left px-3 py-2 text-sm text-brand-light-grey hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-[10px] font-bold text-brand-light-grey uppercase tracking-widest mb-4 opacity-50">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-brand-grey/30 border border-white/5 rounded-xl hover:border-brand-blue/50 cursor-pointer transition-colors flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/10 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Editor/Canvas Area */}
        <div className="flex-1 bg-brand-dark/50 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Workspace</h1>
                <p className="text-brand-light-grey">Start creating your {module.title.toLowerCase()} content here.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-dark bg-brand-grey flex items-center justify-center text-[10px] font-bold">
                      U{i}
                    </div>
                  ))}
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-brand-light-grey">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Placeholder for specific module interface */}
            <div className="aspect-video bg-brand-grey/10 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mb-6">
                <Icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Ready to Build?</h3>
              <p className="text-brand-light-grey max-w-sm mb-8">
                This is the professional interface for {module.title}. 
                All tools are calibrated for maximum sensitivity and precision.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-brand-light-grey transition-colors">
                  Create New
                </button>
                <button className="bg-brand-grey/50 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10 hover:bg-brand-grey transition-colors">
                  Import Existing
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-12">
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-brand-grey/20 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-brand-light-grey" />
                      </div>
                      <div>
                        <p className="font-medium">Draft_Sequence_00{i}.bt</p>
                        <p className="text-xs text-brand-light-grey">Last edited 2 hours ago</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-brand-light-grey">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
