import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Share2, Link2, FileSpreadsheet, Network, FolderSync,
  HelpCircle, Search, Plus, Trash2, ArrowLeft, Settings, Info, 
  Check, Play, User, Zap, Shield, Globe, Activity, Layers, 
  Cpu, Database, Cloud, Command, Terminal, Layout, ChevronRight, 
  MessageSquare, ArrowUpRight, RotateCcw, AlertTriangle, FileText, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BubbleTreeWorkspaceProps {
  script?: string;
  onBackToStoryboard?: () => void;
}

type NodeOption = 'suggestion' | 'share-file' | 'connector' | 'current-work-view-sheet' | 'all-organisations' | 'file-share';

interface NodeItem {
  id: NodeOption;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

export function BubbleTreeWorkspace({ onBackToStoryboard }: BubbleTreeWorkspaceProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const nodeParam = searchParams.get('node') as NodeOption | null;
  const initialNode = (nodeParam && ['suggestion', 'share-file', 'connector', 'current-work-view-sheet', 'all-organisations', 'file-share'].includes(nodeParam)) ? nodeParam : 'suggestion';
  
  const [activeNode, setActiveNode] = useState<NodeOption>(initialNode);

  // Sync activeNode if the searchParam changes
  useEffect(() => {
    if (nodeParam && ['suggestion', 'share-file', 'connector', 'current-work-view-sheet', 'all-organisations', 'file-share'].includes(nodeParam)) {
      setActiveNode(nodeParam);
    }
  }, [nodeParam]);

  const handleBack = onBackToStoryboard || (() => navigate('/'));

  
  // Suggestion parameters
  const [suggestionType, setSuggestionType] = useState<'dialogue' | 'pacing' | 'cinematography'>('dialogue');
  const [generatedSuggestions, setGeneratedSuggestions] = useState<string[]>([
    "Enhance the protagonist's emotional resonance in Act II by adding high-contrast visual cues (e.g., contrasting shadows).",
    "Pacing suggestion: Restructure the silent intervals during the cliff descent to heighten physical stakes before dialog initiation.",
    "Cinematography proposal: Introduce a wide, slow-descending crane pan to frame the isolation of the setting."
  ]);
  const [newSuggestionInput, setNewSuggestionInput] = useState('');

  // Share File parameters
  const [emailsToShare, setEmailsToShare] = useState<string[]>(['sarah_director@studio.org', 'koji_manga@studio.org']);
  const [newEmail, setNewEmail] = useState('');
  const [shareLink, setShareLink] = useState('https://bubbletree.ai/share/sh-98fx73a');
  const [linkCopied, setLinkCopied] = useState(false);

  // Advanced collaborative file-sharing workflow states
  const [selectedWorkingFiles, setSelectedWorkingFiles] = useState<string[]>(['Screenplay', 'SB']);
  const [pendingPermissionRequests, setPendingPermissionRequests] = useState([
    { id: 'req-1', name: 'Arjun Krishna', email: 'arjunkrishna9636@gmail.com', fileType: 'Screenplay', status: 'Pending' },
    { id: 'req-2', name: 'Zoe Marketing', email: 'zoe_mkt@ventures.com', fileType: 'ADS', status: 'Pending' },
    { id: 'req-3', name: 'Sarah Director', email: 'sarah_director@studio.org', fileType: 'SB', status: 'Pending' },
    { id: 'req-4', name: 'Koji Manga', email: 'koji_manga@studio.org', fileType: 'Comic', status: 'Approved' }
  ]);
  const [collaborationType, setCollaborationType] = useState<'Real-time Edit' | 'Comments Only' | 'Read Only'>('Real-time Edit');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['Creative Directors', 'Storyboard Artists']);
  const [newGroupInput, setNewGroupInput] = useState<string>('');

  // Connector parameters
  const [connectedApps, setConnectedApps] = useState([
    { name: 'Storyboard Engine', status: 'Connected', latency: '12ms', type: 'internal' },
    { name: 'Comics panel compiler', status: 'Connected', latency: '45ms', type: 'internal' },
    { name: 'Ads generation workspace', status: 'Disconnected', latency: '-', type: 'external' },
    { name: 'Global Asset Database (Firestore)', status: 'Connected', latency: '8ms', type: 'database' }
  ]);

  // Current Work View Sheet parameters
  const [sheetsData, setSheetsData] = useState([
    { scene: 'Scene 1: Cliffside Ascent', size: '2.4 MB', words: 450, visualAssets: 4, revision: 'v2.1', status: 'Ready' },
    { scene: 'Scene 2: High altitude storm', size: '1.8 MB', words: 320, visualAssets: 3, revision: 'v1.4', status: 'In Review' },
    { scene: 'Scene 3: Deep crevasse decision', size: '3.1 MB', words: 580, visualAssets: 6, revision: 'v0.9', status: 'Drafting' },
    { scene: 'Scene 4: Midnight base camp', size: '840 KB', words: 190, visualAssets: 1, revision: 'v1.0', status: 'Final' }
  ]);

  // All Organisations parameters
  const [orgs, setOrgs] = useState([
    { name: 'Quantum Core Studio', members: 18, license: 'Enterprise Plus', baseRegion: 'US East' },
    { name: 'Neo-Tokyo Production Collective', members: 12, license: 'Studio Pro', baseRegion: 'Asia Pacific' },
    { name: 'Stellar Animation Ventures', members: 6, license: 'Team Builder', baseRegion: 'Europe West' }
  ]);

  // File Share logs parameters
  const [shareHistory, setShareHistory] = useState([
    { filename: 'Odyssey_ActI_final.pdf', sharedTo: 'sarah_director@studio.org', timestamp: '2 hours ago', size: '12.4 MB', status: 'Downloaded' },
    { filename: 'Mecha_Awakening_Grids.png', sharedTo: 'koji_manga@studio.org', timestamp: 'Yesterday', size: '4.8 MB', status: 'Pending' },
    { filename: 'Promo_Cola_FinalAd.mp4', sharedTo: 'stellar_marketing@ventures.com', timestamp: '3 days ago', size: '48.2 MB', status: 'Expired' }
  ]);

  const nodesOrdered: NodeItem[] = [
    { 
      id: 'suggestion', 
      label: 'Suggestion', 
      description: 'AI-driven strategic and creative ideas generator',
      icon: Sparkles, 
      color: 'text-amber-400', 
      gradient: 'from-amber-400/20 to-amber-600/5' 
    },
    { 
      id: 'share-file', 
      label: 'Share File', 
      description: 'Secure enterprise and collaborative asset link configurations',
      icon: Share2, 
      color: 'text-indigo-400', 
      gradient: 'from-indigo-400/20 to-indigo-600/5' 
    },
    { 
      id: 'connector', 
      label: 'Connector', 
      description: 'Dynamic communication interface linking multi-media workspace pipelines',
      icon: Link2, 
      color: 'text-cyan-400', 
      gradient: 'from-cyan-400/20 to-cyan-600/5' 
    },
    { 
      id: 'current-work-view-sheet', 
      label: 'Current Work View Sheet', 
      description: 'High-performance interactive metadata and sequence grid',
      icon: FileSpreadsheet, 
      color: 'text-emerald-400', 
      gradient: 'from-emerald-400/20 to-emerald-600/5' 
    },
    { 
      id: 'all-organisations', 
      label: 'All Organisations', 
      description: 'Workspace-wide cloud organizations and division access controls',
      icon: Network, 
      color: 'text-rose-400', 
      gradient: 'from-rose-400/20 to-rose-600/5' 
    },
    { 
      id: 'file-share', 
      label: 'File Share', 
      description: 'Direct files distribution histories and transfer indicators',
      icon: FolderSync, 
      color: 'text-sky-400', 
      gradient: 'from-sky-400/20 to-sky-600/5' 
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim() && !emailsToShare.includes(newEmail)) {
      setEmailsToShare([...emailsToShare, newEmail]);
      setNewEmail('');
    }
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSuggestionInput.trim()) {
      setGeneratedSuggestions([newSuggestionInput, ...generatedSuggestions]);
      setNewSuggestionInput('');
    }
  };

  const handleToggleConnector = (name: string) => {
    setConnectedApps(apps => apps.map(app => 
      app.name === name 
        ? { ...app, status: app.status === 'Connected' ? 'Disconnected' : 'Connected', latency: app.status === 'Connected' ? '-' : '15ms' } 
        : app
    ));
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F2A] overflow-y-auto overflow-x-hidden font-sans selection:bg-[#FFC857]/30 relative">
      
      {/* Deep Navy to Purple Gradient Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0B0F2A] via-[#1a1f4d] to-[#4B2EFF] -z-30" />
      
      {/* Decorative Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4B2EFF] opacity-20 blur-[180px] rounded-full -z-20 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFC857] opacity-5 blur-[180px] rounded-full -z-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#4B2EFF] opacity-10 blur-[200px] rounded-full -z-20" />

      {/* Header */}
      <header className="border-b border-white/5 bg-brand-dark/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-brand-light-grey hover:text-white rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC857] shadow-lg shadow-[#FFC857]/20 flex items-center justify-center">
                <Command className="w-5 h-5 text-[#0B0F2A]" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Bubble Tree AI</h1>
                <p className="text-[10px] text-brand-light-grey uppercase tracking-widest font-semibold font-mono">Precision Coordination Suite</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-brand-light-grey/80">
            <span className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider">
              Mode: High Precision AI
            </span>
          </div>
        </div>
      </header>

      {/* Content Layout Grid */}
      <main className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-8 relative z-10">
        
        {/* Top Mini Navigation Bar - Small stylized options in order */}
        <div className="col-span-12 bg-white/[0.02] border border-white/10 p-2.5 rounded-[22px] backdrop-blur-md flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-lg">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar w-full">
            <div className="flex items-center gap-1.5 px-3 border-r border-white/10 text-white/45 font-mono text-[9px] uppercase tracking-widest shrink-0 select-none">
              <Command className="w-3.5 h-3.5 text-[#FFC857]" />
              <span>Tree Nodes:</span>
            </div>
            {nodesOrdered.map((node, index) => {
              const Icon = node.icon;
              const isActive = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shrink-0 border",
                    isActive 
                      ? "bg-white/10 text-white border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]" 
                      : "bg-transparent text-brand-light-grey border-transparent hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300", 
                    isActive ? "bg-[#080B22]" : "bg-white/5"
                  )}>
                    <Icon className={cn("w-3 h-3", node.color)} />
                  </div>
                  <span>{node.label}</span>
                  {isActive && (
                    <span className="relative flex h-1.5 w-1.5 ml-1">
                      <span className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", 
                        node.id === 'suggestion' ? 'bg-amber-400' : 
                        node.id === 'share-file' ? 'bg-indigo-400' : 
                        node.id === 'connector' ? 'bg-cyan-400' : 
                        node.id === 'current-work-view-sheet' ? 'bg-emerald-400' : 
                        node.id === 'all-organisations' ? 'bg-rose-400' : 'bg-sky-400'
                      )}></span>
                      <span className={cn(
                        "relative inline-flex rounded-full h-1.5 w-1.5", 
                        node.id === 'suggestion' ? 'bg-amber-400' : 
                        node.id === 'share-file' ? 'bg-indigo-400' : 
                        node.id === 'connector' ? 'bg-cyan-400' : 
                        node.id === 'current-work-view-sheet' ? 'bg-emerald-400' : 
                        node.id === 'all-organisations' ? 'bg-rose-400' : 'bg-sky-400'
                      )}></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/5 text-[9px] text-[#FFC857] font-mono whitespace-nowrap bg-white/5 px-3 py-1.5 rounded-xl uppercase font-bold tracking-widest shrink-0">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Node: {activeNode.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Left Side: Interactive SVG Bubble Tree Map & Ordered Quick Navigation */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          
          {/* Interactive SVG Bubble Tree Diagram */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-white font-extrabold text-base uppercase tracking-wider">Bubble Map</h2>
              <p className="text-brand-light-grey text-xs mt-1">Click the nodes directly to navigate options in order.</p>
            </div>

            <div className="relative aspect-square w-full rounded-2xl bg-[#080B22] border border-white/5 overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 grayscale contrast-125 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {/* Dynamic SVG with Connections & Highlighted active states */}
              <svg viewBox="0 0 400 400" className="w-full h-full relative z-10">
                {/* SVG Connections Line to Center Node */}
                <line x1="200" y1="200" x2="200" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="313" y2="135" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="313" y2="265" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="200" y2="330" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="87" y2="265" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="87" y2="135" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

                {/* Center Core Node */}
                <circle cx="200" cy="200" r="35" className="fill-[#1b1f4d] stroke-white/20" strokeWidth="2" />
                <g className="text-[#FFC857]">
                  <path fill="currentColor" d="M195 190h10v20h-10z" className="opacity-40" />
                  <circle cx="200" cy="200" r="8" fill="currentColor" />
                </g>

                {/* Node 1: Suggestion (Top-Mid) */}
                <g className="cursor-pointer" onClick={() => setActiveNode('suggestion')}>
                  <circle 
                    cx="200" y1="70" cy="70" r="28" 
                    className={cn(
                      "transition-all duration-300", 
                      activeNode === 'suggestion' ? "fill-amber-500/30 stroke-amber-400" : "fill-brand-dark/80 stroke-white/10 hover:stroke-amber-400/50"
                    )} 
                    strokeWidth="2" 
                  />
                  <text x="200" y="74" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">S</text>
                </g>

                {/* Node 2: Share File (Top-Right) */}
                <g className="cursor-pointer" onClick={() => setActiveNode('share-file')}>
                  <circle 
                    cx="313" cy="135" r="28" 
                    className={cn(
                      "transition-all duration-300", 
                      activeNode === 'share-file' ? "fill-indigo-500/30 stroke-indigo-400" : "fill-brand-dark/80 stroke-white/10 hover:stroke-indigo-400/50"
                    )} 
                    strokeWidth="2" 
                  />
                  <text x="313" y="139" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">SF</text>
                </g>

                {/* Node 3: Connector (Bottom-Right) */}
                <g className="cursor-pointer" onClick={() => setActiveNode('connector')}>
                  <circle 
                    cx="313" cy="265" r="28" 
                    className={cn(
                      "transition-all duration-300", 
                      activeNode === 'connector' ? "fill-cyan-500/30 stroke-cyan-400" : "fill-brand-dark/80 stroke-white/10 hover:stroke-cyan-400/50"
                    )} 
                    strokeWidth="2" 
                  />
                  <text x="313" y="269" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">C</text>
                </g>

                {/* Node 4: Current Work View Sheet (Bottom-Mid) */}
                <g className="cursor-pointer" onClick={() => setActiveNode('current-work-view-sheet')}>
                  <circle 
                    cx="200" cy="330" r="28" 
                    className={cn(
                      "transition-all duration-300", 
                      activeNode === 'current-work-view-sheet' ? "fill-emerald-500/30 stroke-emerald-400" : "fill-brand-dark/80 stroke-white/10 hover:stroke-emerald-400/50"
                    )} 
                    strokeWidth="2" 
                  />
                  <text x="200" y="334" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">WS</text>
                </g>

                {/* Node 5: All Organisations (Bottom-Left) */}
                <g className="cursor-pointer" onClick={() => setActiveNode('all-organisations')}>
                  <circle 
                    cx="87" cy="265" r="28" 
                    className={cn(
                      "transition-all duration-300", 
                      activeNode === 'all-organisations' ? "fill-rose-500/30 stroke-rose-400" : "fill-brand-dark/80 stroke-white/10 hover:stroke-rose-400/50"
                    )} 
                    strokeWidth="2" 
                  />
                  <text x="87" y="269" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">AO</text>
                </g>

                {/* Node 6: File Share (Top-Left) */}
                <g className="cursor-pointer" onClick={() => setActiveNode('file-share')}>
                  <circle 
                    cx="87" cy="135" r="28" 
                    className={cn(
                      "transition-all duration-300", 
                      activeNode === 'file-share' ? "fill-sky-500/30 stroke-sky-400" : "fill-brand-dark/80 stroke-white/10 hover:stroke-sky-400/50"
                    )} 
                    strokeWidth="2" 
                  />
                  <text x="87" y="139" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">FS</text>
                </g>
              </svg>

              {/* Central text overlay */}
              <div className="absolute text-[9px] text-white/50 font-bold tracking-widest bg-brand-dark/80 px-2 py-1 rounded border border-white/5">
                BUBBLE CONNECTED
              </div>
            </div>
          </div>

          {/* Ordered Quick-Click Options List */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 backdrop-blur-xl">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 px-2">Coordinate Pipeline</h3>
            <div className="space-y-2">
              {nodesOrdered.map((node, index) => {
                const Icon = node.icon;
                const isActive = activeNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all border",
                      isActive 
                        ? cn("bg-white/15 border-white/20 shadow-md", node.gradient) 
                        : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-[#080B22] border border-white/10 flex items-center justify-center shrink-0", node.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white/30 font-mono">0{index + 1}.</span>
                        <h4 className="font-extrabold text-sm text-white truncate">{node.label}</h4>
                      </div>
                      <p className="text-brand-light-grey text-[11px] truncate">{node.description}</p>
                    </div>

                    <ChevronRight className={cn("w-4 h-4 text-white/20 transition-transform", isActive && "text-white translate-x-1")} />
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right Side: High-Intelligence Component Canvas Details */}
        <section className="col-span-12 lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-[40px] p-8 lg:p-10 backdrop-blur-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[700px] relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {/* 1. SUGGESTION MODULE */}
            {activeNode === 'suggestion' && (
              <motion.div
                key="suggestion"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2.5 text-amber-400 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono">AI Suggestion Engine</span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight">Suggestions List</h2>
                  <p className="text-brand-light-grey text-sm mt-1">
                    Custom calibrated screenplays and storytelling pointers produced automatically.
                  </p>
                </div>

                {/* suggestion configuration parameters */}
                <div className="flex gap-2 bg-brand-dark/50 p-1.5 rounded-xl border border-white/5">
                  {(['dialogue', 'pacing', 'cinematography'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSuggestionType(type)}
                      className={cn(
                        "flex-1 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                        suggestionType === type ? "bg-amber-400/20 text-amber-400 border border-amber-400/20" : "text-brand-light-grey hover:text-white"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* suggestion outputs list */}
                <div className="space-y-4">
                  {generatedSuggestions.map((sug, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-white/80 text-xs leading-relaxed">{sug}</p>
                    </div>
                  ))}
                </div>

                {/* add manual custom suggestion tool */}
                <form onSubmit={handleAddSuggestion} className="pt-4 border-t border-white/5 flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Feed fresh guidelines or questions for real-time AI suggestions..."
                    value={newSuggestionInput}
                    onChange={(e) => setNewSuggestionInput(e.target.value)}
                    className="flex-1 bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-brand-light-grey/50 focus:border-amber-400/50 focus:outline-none transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-[#0B0F2A] px-5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 hover:-translate-y-0.5"
                  >
                    Generate
                  </button>
                </form>
              </motion.div>
            )}

            {/* 2. SHARE FILE MODULE */}
            {activeNode === 'share-file' && (
              <motion.div
                key="share-file"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Header Description */}
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2.5 text-indigo-400 mb-2">
                    <Share2 className="w-5 h-5 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Asset Distribution Hub</span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight">Share Working Files</h2>
                  <p className="text-brand-light-grey text-sm mt-1">
                    Securely distribute project files, manage gatekeeper authorizations, and establish collaborative pipeline credentials.
                  </p>
                </div>

                {/* 1. EASY TO SHARE WORKING FILES LIKE SCREENPLAY, SB, ADS, COMIC ETC */}
                <div id="share-working-files-section" className="space-y-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-xs font-bold uppercase tracking-wider">1. Select Working Files</h3>
                      <p className="text-[11px] text-brand-light-grey/60">Choose which core development assets are included in the shared access key.</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#FFC857] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                      {selectedWorkingFiles.length} Selected
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'Screenplay', label: 'Screenplay', icon: FileText, desc: 'Draft scripts, screenplay dialogues' },
                      { id: 'SB', label: 'Storyboard (SB)', icon: Layout, desc: 'Visual scene progressions & cells' },
                      { id: 'ADS', label: 'Advertisements (ADS)', icon: Sparkles, desc: 'Promotional creatives' },
                      { id: 'Comic', label: 'Comic Layouts', icon: Layers, desc: 'Art panel structures' }
                    ].map((file) => {
                      const isSelected = selectedWorkingFiles.includes(file.id);
                      const Icon = file.icon;
                      return (
                        <button
                          key={file.id}
                          id={`toggle-file-${file.id.toLowerCase()}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedWorkingFiles(selectedWorkingFiles.filter(f => f !== file.id));
                            } else {
                              setSelectedWorkingFiles([...selectedWorkingFiles, file.id]);
                            }
                          }}
                          className={cn(
                            "p-4 text-left border rounded-2xl transition-all duration-300 flex items-center gap-4 relative group",
                            isSelected 
                              ? "bg-white/10 border-white/20 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]" 
                              : "bg-transparent border-white/5 text-brand-light-grey hover:bg-white/5 hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl bg-[#080B22] border flex items-center justify-center shrink-0 transition-all duration-300",
                            isSelected ? "border-indigo-400 text-indigo-400" : "border-white/15 text-brand-light-grey"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider">{file.label}</h4>
                            <p className="text-[10px] text-brand-light-grey/50 truncate mt-0.5">{file.desc}</p>
                          </div>

                          <div className={cn(
                            "w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0",
                            isSelected ? "bg-indigo-500/20 border-indigo-400 text-indigo-400" : "border-white/10 text-white/5"
                          )}>
                            <Check className={cn("w-3.5 h-3.5 stroke-[2.5]", isSelected ? "opacity-100" : "opacity-0")} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. ACCESSIBLE SOMEONE GAVE PERMISSION */}
                <div id="permission-required-section" className="space-y-4 pt-4 border-t border-white/5">
                  <div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">2. Authorization Approvals</h3>
                    <p className="text-[11px] text-brand-light-grey/60">Gated access workflow: files are accessible when designated file owners grant clearance key validations.</p>
                  </div>

                  <div className="bg-brand-dark/40 border border-white/5 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 text-[10px] font-mono text-brand-light-grey/60 uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" /> Secure Approval Stream
                      </span>
                      <span className="text-[#FFC857] font-bold">Clearance Required</span>
                    </div>

                    <div className="divide-y divide-white/5">
                      {pendingPermissionRequests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
                          <div className="font-mono">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">{req.name}</span>
                              <span className="text-[10px] text-brand-light-grey/40">({req.email})</span>
                            </div>
                            <span className="text-[10px] text-brand-light-grey/60">
                              Access requested to: <strong className="text-indigo-400 font-bold uppercase">{req.fileType}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => {
                                    setPendingPermissionRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
                                    if (!emailsToShare.includes(req.email)) {
                                      setEmailsToShare(prev => [...prev, req.email]);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-[#FFC857] hover:bg-[#FFC857]/95 text-brand-dark rounded-xl text-[10px] font-bold font-mono transition-all duration-200"
                                >
                                  Grant
                                </button>
                                <button
                                  onClick={() => {
                                    setPendingPermissionRequests(prev => prev.filter(r => r.id !== req.id));
                                  }}
                                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-brand-light-grey rounded-xl text-[10px] font-mono transition-all duration-200"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[2.5]" /> Approved
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. SHARED WITH TEAM MEMBER ACCESSIBLE TO COLLABORATION */}
                <div id="collaboration-team-section" className="space-y-4 pt-4 border-t border-white/5">
                  <div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">3. Shared with Team Members</h3>
                    <p className="text-[11px] text-brand-light-grey/60">Invite specific team collaborators to participate in direct co-authoring streams.</p>
                  </div>

                  <div className="space-y-4">
                    <form onSubmit={handleAddEmail} className="flex gap-3">
                      <input
                        type="email"
                        required
                        placeholder="Invite team member by email..."
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 bg-brand-dark/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-brand-light-grey/30 focus:outline-none focus:border-indigo-400 transition-colors font-mono"
                      />
                      <button 
                        type="submit"
                        className="bg-white hover:bg-neutral-200 text-[#0B0F2A] px-5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 hover:-translate-y-0.5 font-mono uppercase tracking-wider"
                      >
                        Invite
                      </button>
                    </form>

                    {/* Access role matrix choices */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-brand-dark/20 border border-white/5 rounded-xl gap-2">
                      <span className="text-[10px] font-bold text-brand-light-grey/60 uppercase tracking-widest font-mono">Access Role Matrix</span>
                      <div className="flex gap-1">
                        {['Real-time Edit', 'Comments Only', 'Read Only'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setCollaborationType(lvl as any)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all font-mono",
                              collaborationType === lvl 
                                ? "bg-white/10 text-white border border-white/10 shadow-sm" 
                                : "bg-transparent text-brand-light-grey/50 hover:text-white"
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active member tags list */}
                    {emailsToShare.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {emailsToShare.map((email, idx) => (
                          <div key={idx} className="bg-white/5 border border-white/5 pl-3 pr-2 py-1 rounded-full text-[10px] font-mono text-white flex items-center gap-2.5">
                            <span>{email}</span>
                            <span className="text-[#FFC857] font-bold bg-[#FFC857]/10 px-2 py-0.5 rounded-full font-sans text-[8.5px] uppercase tracking-wider">
                              {collaborationType === 'Real-time Edit' ? 'Editor' : 'Spectator'}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setEmailsToShare(emailsToShare.filter(e => e !== email))}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-red-400 hover:bg-white/10 text-[11px] font-sans font-bold transition-all"
                              title="Revoke access"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. VISIBLE TO SELECTED USERS / GROUPS */}
                <div id="visibility-scope-section" className="space-y-4 pt-4 border-t border-white/5">
                  <div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">4. Visible to Selected Users / Groups</h3>
                    <p className="text-[11px] text-brand-light-grey/60">Control visibility filter parameters for organizational divisions, crews, or cohorts.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Groups checkboxes row */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Creative Directors',
                        'Storyboard Artists',
                        'Comic Artists Guild'
                      ].map((group) => {
                        const isChecked = selectedGroups.includes(group);
                        return (
                          <button
                            key={group}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setSelectedGroups(selectedGroups.filter(g => g !== group));
                              } else {
                                setSelectedGroups([...selectedGroups, group]);
                              }
                            }}
                            className={cn(
                              "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2",
                              isChecked 
                                ? "bg-white/10 border-white/25 text-white animate-pulse" 
                                : "bg-transparent border-white/5 text-brand-light-grey hover:border-white/15 hover:text-white"
                            )}
                          >
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full", 
                              isChecked ? "bg-indigo-400" : "bg-brand-light-grey/30"
                            )} />
                            {group}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom visibility entry inline layout */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom workspace cohort..."
                        value={newGroupInput}
                        onChange={(e) => setNewGroupInput(e.target.value)}
                        className="flex-1 bg-brand-dark/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-brand-light-grey/30 focus:outline-none focus:border-white/20 transition-all font-mono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newGroupInput.trim() && !selectedGroups.includes(newGroupInput)) {
                              setSelectedGroups([...selectedGroups, newGroupInput.trim()]);
                              setNewGroupInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newGroupInput.trim() && !selectedGroups.includes(newGroupInput)) {
                            setSelectedGroups([...selectedGroups, newGroupInput.trim()]);
                            setNewGroupInput('');
                          }
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider font-mono shrink-0"
                      >
                        Add Cohort
                      </button>
                    </div>

                    {/* Custom categories as clean simple chips */}
                    {selectedGroups.filter(g => !['Creative Directors', 'Storyboard Artists', 'Comic Artists Guild'].includes(g)).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedGroups.map((g) => {
                          if (['Creative Directors', 'Storyboard Artists', 'Comic Artists Guild'].includes(g)) return null;
                          return (
                            <div key={g} className="bg-white/5 border border-white/5 text-white px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-2 uppercase font-mono tracking-wider">
                              <span>{g}</span>
                              <button 
                                onClick={() => setSelectedGroups(selectedGroups.filter(item => item !== g))}
                                className="text-red-400 hover:text-red-300 font-sans text-xs"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Secure Access Link copy banner */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-brand-light-grey/40 font-mono uppercase tracking-widest text-[9.5px]">Access Pipeline Key</span>
                  <div className="flex items-center gap-2 bg-brand-dark/40 px-3.5 py-2 rounded-xl border border-white/10">
                    <code className="text-[#A3CEFF] font-mono text-[10px] max-w-[140px] truncate">{shareLink}</code>
                    <button 
                      onClick={handleCopyLink}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-colors shrink-0",
                        linkCopied 
                          ? "bg-emerald-500/20 text-emerald-300" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      {linkCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CONNECTOR MODULE */}
            {activeNode === 'connector' && (
              <motion.div
                key="connector"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2.5 text-cyan-400 mb-2">
                    <Link2 className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Workspace Connector Broker</span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight">Connector Panel</h2>
                  <p className="text-brand-light-grey text-sm mt-1">
                    Connect and supervise direct APIs linking scripts, storyboard outputs, and database frames.
                  </p>
                </div>

                {/* App list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {connectedApps.map((app, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between hover:border-cyan-400/20 transition-all cursor-pointer"
                      onClick={() => handleToggleConnector(app.name)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-white">{app.name}</h4>
                          <span className="text-[9px] uppercase font-bold text-brand-light-grey/40">{app.type} sync</span>
                        </div>
                        <span className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          app.status === 'Connected' ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : "bg-white/20"
                        )} />
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] uppercase font-bold text-brand-light-grey">
                        <span>Latency: {app.latency}</span>
                        <span className={cn(app.status === 'Connected' ? "text-cyan-400" : "text-white/30")}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#080B22] border border-white/5 flex gap-3 text-xs leading-relaxed text-brand-light-grey">
                  <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-bold text-white mb-1">Bridge Console log</p>
                    Firestore integration active. Listening to structural card updates on storyboard panel. Ready.
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. CURRENT WORK VIEW SHEET MODULE */}
            {activeNode === 'current-work-view-sheet' && (
              <motion.div
                key="current-work-view-sheet"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Analytical Sheet Engine</span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight">Current Work View Sheet</h2>
                  <p className="text-brand-light-grey text-sm mt-1">
                    High performance spreadsheet exhibiting specific revision sizes, counts, and asset configurations.
                  </p>
                </div>

                {/* Spreadsheet layout Grid */}
                <div className="bg-brand-dark/40 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-white/5 border-b border-white/5 grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-widest text-[#FFC857]">
                    <div className="col-span-5">Active Sequence</div>
                    <div className="col-span-2 text-center">Words</div>
                    <div className="col-span-2 text-center">Revisions</div>
                    <div className="col-span-3 text-right">Status</div>
                  </div>

                  <div className="divide-y divide-white/5 text-xs">
                    {sheetsData.map((row, idx) => (
                      <div key={idx} className="p-4 grid grid-cols-12 gap-2 items-center hover:bg-white/[0.02]">
                        <div className="col-span-5">
                          <p className="font-bold text-white leading-none mb-1">{row.scene}</p>
                          <span className="text-[10px] text-brand-light-grey/40">{row.size} • {row.visualAssets} visual maps</span>
                        </div>
                        <div className="col-span-2 text-center font-semibold text-white/80">{row.words}</div>
                        <div className="col-span-2 text-center font-mono text-brand-light-grey">{row.revision}</div>
                        <div className="col-span-3 text-right">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase",
                            row.status === 'Ready' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            row.status === 'In Review' ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                            row.status === 'Final' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                            "bg-brand-light-grey/10 text-brand-light-grey"
                          )}>
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. ALL ORGANISATIONS MODULE */}
            {activeNode === 'all-organisations' && (
              <motion.div
                key="all-organisations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2.5 text-rose-400 mb-2">
                    <Network className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Enterprise Division Supervision</span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight">All Organisations</h2>
                  <p className="text-brand-light-grey text-sm mt-1">
                    Manage studio divisions, cross-organizational privileges, licenses, and regional base camps.
                  </p>
                </div>

                {/* list organisations */}
                <div className="space-y-4">
                  {orgs.map((org, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-base text-white">{org.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-brand-light-grey">
                          <span>{org.members} Creative members</span>
                          <span>•</span>
                          <span>{org.baseRegion}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-xl">
                          {org.license}
                        </span>
                        <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 6. FILE SHARE LOGS MODULE */}
            {activeNode === 'file-share' && (
              <motion.div
                key="file-share"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2.5 text-sky-400 mb-2">
                    <FolderSync className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Transfer Indicators Log</span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight">File Share</h2>
                  <p className="text-brand-light-grey text-sm mt-1">
                    Inspect transfer records, direct downloads status, sizes, and file shares metrics in real-time.
                  </p>
                </div>

                {/* Share logs grid */}
                <div className="space-y-3">
                  {shareHistory.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 pl-1 truncate">
                        <div className="w-10 h-10 rounded-xl bg-brand-dark/50 border border-white/15 flex items-center justify-center text-sky-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-sm text-white truncate leading-tight mb-1">{item.filename}</p>
                          <p className="text-[10px] text-brand-light-grey/40">Sent to {item.sharedTo} • {item.size}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div className="hidden sm:block">
                          <p className="text-[10px] text-brand-light-grey/40 uppercase font-bold tracking-wider mb-1">timestamp</p>
                          <p className="text-xs text-white/60">{item.timestamp}</p>
                        </div>
                        <span className={cn(
                          "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider",
                          item.status === 'Downloaded' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" :
                          item.status === 'Pending' ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/15"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Brand Manifesto Badge */}
          <div className="pt-6 border-t border-white/5 flex justify-between items-center text-xs text-brand-light-grey">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFC857]" />
              <span className="font-semibold uppercase tracking-wider">Cloud Engine Authorized</span>
            </div>
            <span className="text-white/20 font-mono">v3.42-Stable</span>
          </div>

        </section>

      </main>

      {/* Floating Action Button */}
      <button 
        onClick={handleBack}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-3xl flex items-center justify-center hover:bg-white/20 transition-all z-[100] group shadow-2xl"
      >
        <motion.div whileHover={{ scale: 1.15, rotate: -10 }}>
          <Layout className="w-7 h-7 text-white group-hover:text-[#FFC857] transition-colors" />
        </motion.div>
      </button>

      {/* Final Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-[#4B2EFF]/20 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
