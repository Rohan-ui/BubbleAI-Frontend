import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, RotateCcw, AlertTriangle, Search, Info, 
  Trash, Database, FileText, Layout, BookOpen, Megaphone 
} from 'lucide-react';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, any> = {
  'Script': FileText,
  'Storyboard': Layout,
  'Comic': BookOpen,
  'Ad Campaign': Megaphone
};

export function BinWorkspace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [binItems, setBinItems] = useState([
    {
      id: 'bin-1',
      title: 'Sc-9: The Underworld Chase Draft',
      origin: 'Script',
      deletedAt: '2 hours ago',
      size: '14 KB',
      author: 'Arjun Krishna'
    },
    {
      id: 'bin-2',
      title: 'Intro Keyframe Sequence Draft',
      origin: 'Storyboard',
      deletedAt: 'Yesterday',
      size: '2.5 MB',
      author: 'Arjun Krishna'
    },
    {
      id: 'bin-3',
      title: 'Promo Ad Copy A/B Testing Matrix',
      origin: 'Ad Campaign',
      deletedAt: '3 days ago',
      size: '8 KB',
      author: 'System Autoprice'
    },
    {
      id: 'bin-4',
      title: 'Shonen Volume 1 Cover Sketch Grid',
      origin: 'Comic',
      deletedAt: '1 week ago',
      size: '1.4 MB',
      author: 'Koji Takahashi'
    }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleRestore = (id: string, name: string) => {
    setBinItems(items => items.filter(item => item.id !== id));
    setNotification(`Successfully restored "${name}" to Active Workspace.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePermanentDelete = (id: string, name: string) => {
    setBinItems(items => items.filter(item => item.id !== id));
    setNotification(`Permanently deleted "${name}".`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEmptyBin = () => {
    if (binItems.length === 0) return;
    setBinItems([]);
    setNotification('Recycle Bin successfully cleared of all cached materials.');
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredItems = binItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Trash & Archival</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Recycle Bin</h1>
          <p className="text-brand-light-grey text-sm mt-1">
            Restore deleted scenes, script sequences, storyboards, or clear items permanently to reclaim workspace volume.
          </p>
        </div>

        {binItems.length > 0 && (
          <button 
            onClick={handleEmptyBin}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-600/10 flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Trash className="w-4 h-4" />
            Empty Recycle Bin
          </button>
        )}
      </header>

      {/* Notifications banner */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-brand-blue/15 border border-brand-blue/30 text-brand-blue px-4 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar / Search */}
      <div className="flex bg-brand-grey/10 p-4 rounded-xl border border-white/5 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-light-grey" />
          <input 
            type="text" 
            placeholder="Search matching resources in trash..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-brand-light-grey/50 focus:border-brand-blue/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* List content */}
      <div className="bg-brand-grey/15 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-brand-grey/10 grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-light-grey/50">
          <div className="col-span-6 pl-2">Filename & Creative Origin</div>
          <div className="col-span-2">Origin Module</div>
          <div className="col-span-2">Deleted</div>
          <div className="col-span-2 text-right pr-2">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredItems.map((item, idx) => {
            const OriginIcon = ICON_MAP[item.origin] || FileText;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Name */}
                <div className="col-span-6 flex items-center gap-3 pl-2">
                  <div className="w-9 h-9 bg-brand-dark border border-white/10 rounded-lg flex items-center justify-center text-brand-light-grey/60">
                    <OriginIcon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-white leading-tight truncate">{item.title}</p>
                    <p className="text-[10px] text-brand-light-grey/40">Deleted by {item.author} • {item.size}</p>
                  </div>
                </div>

                {/* Origin */}
                <div className="col-span-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] uppercase font-bold text-brand-light-grey/60">
                    {item.origin}
                  </span>
                </div>

                {/* Deleted timestamp */}
                <div className="col-span-2 text-xs text-brand-light-grey">
                  {item.deletedAt}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                  <button 
                    onClick={() => handleRestore(item.id, item.title)}
                    className="p-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-lg transition-colors flex items-center justify-center group relative"
                    title="Restore file"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-dark text-[10px] rounded border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Restore
                    </div>
                  </button>

                  <button 
                    onClick={() => handlePermanentDelete(item.id, item.title)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors flex items-center justify-center group relative"
                    title="Delete permanently"
                  >
                    <Trash className="w-4 h-4" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-dark text-[10px] rounded border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                      Erase
                    </div>
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-brand-light-grey flex flex-col items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-brand-light-grey/30 mb-3" />
              <p className="font-bold">No items found</p>
              <p className="text-xs text-brand-light-grey/50">Your recycle bin is clean and empty of cached workspace data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
