import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Sparkles, Layout, Grid, 
  Layers, User, Globe, Zap, 
  Activity, MessageSquare, Plus, 
  Search, Settings, Maximize2, 
  PenTool, MousePointer2, Volume2,
  ChevronRight, ChevronDown, 
  Smartphone, Monitor, Eye,
  Download, Share2, History,
  GitBranch, Shield, Sword,
  Flame, Heart, Skull, Rocket,
  Star, Coffee, ZapOff, Info,
  FileText, RefreshCw, Command,
  GripVertical, Square, MoreHorizontal,
  Play, Save, ChevronLeft, Copy, Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MangaGenre, ComicPanel } from '../types';
import axios from 'axios';
import { getApiUrl } from '../services/api';

type ComicFormat = 'Comics' | 'Manga' | 'Webtoons' | 'Novels';
type ColorMode = 'B&W' | 'Color';

export function ComicsWorkspace() {
  const [format, setFormat] = useState<ComicFormat>('Comics');
  const [colorMode, setColorMode] = useState<ColorMode>('Color');
  const [genre, setGenre] = useState<MangaGenre>('Superhero');
  const [script, setScript] = useState("");
  const [panels, setPanels] = useState<ComicPanel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  // New states for Story Format Studio integration
  const [outputMode, setOutputMode] = useState<'visual' | 'text'>('visual');
  const [textFormat, setTextFormat] = useState('Logline');
  const [formattedText, setFormattedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Automatic generation effect
  useEffect(() => {
    if (isLiveMode && script.trim().length > 50) {
      if (generationTimerRef.current) clearTimeout(generationTimerRef.current);
      generationTimerRef.current = setTimeout(() => {
        handleGenerateFromScript();
      }, 3000); // 3s debounce for auto-gen
    }
    return () => {
      if (generationTimerRef.current) clearTimeout(generationTimerRef.current);
    };
  }, [script, isLiveMode, format, genre]);

  const handleGenerateFromScript = async () => {
    if (!script.trim()) return;
    setIsGenerating(true);
    
    try {
      const styleDesc = colorMode === 'B&W' 
        ? 'Black and white ink comic style, high contrast, detailed' 
        : `Vibrant ${genre} comic book style, colorful, attractive, high-quality rendering, cinematic lighting`;
      
      // Generate 4 panels for a full page feel
      const panelTypes: ('Splash' | 'Medium' | 'Micro' | 'Medium')[] = ['Splash', 'Medium', 'Micro', 'Medium'];
      const newPanels: ComicPanel[] = [];
      
      for (let i = 0; i < panelTypes.length; i++) {
        const prompt = `Comic panel ${i+1}: ${script.substring(i * 100, (i + 1) * 100)}. ${styleDesc}`;
        
        // Push a placeholder first
        const placeholderId = Math.random().toString();
        setPanels(prev => [...prev, {
          id: placeholderId,
          type: panelTypes[i],
          content: `Generating panel ${i+1}...`,
          image: '',
          position: { x: i, y: 0 }
        }]);
        
        const response = await axios.post(`${getApiUrl()}/storyboard-image`, {
          prompt: prompt,
          style: styleDesc
        });
        const imageUrl = response.data.data;
        if (imageUrl) {
          setPanels(prev => prev.map(p => p.id === placeholderId ? { ...p, image: imageUrl } : p));
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormat = async () => {
    if (!script.trim()) return;
    setIsGenerating(true);
    setFormattedText('');
    try {
      const response = await axios.post(`${getApiUrl()}/format`, {
        draftText: script,
        formatType: textFormat
      });
      setFormattedText(response.data.data);
    } catch (err) {
      console.error(err);
      setFormattedText('Failed to format story. Make sure your local server is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateClick = async () => {
    if (outputMode === 'text') {
      await handleFormat();
    } else {
      await handleGenerateFromScript();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0F2A] overflow-hidden font-sans relative">
      {/* Background Gradient Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0B0F2A] via-[#1a1f4d] to-[#4B2EFF] -z-10" />
      
      {/* Left Sidebar (Global Nav) */}
      <aside className="w-20 flex flex-col items-center py-8 gap-10 bg-white/[0.03] border-r border-white/10 backdrop-blur-2xl z-50">
        <div className="w-12 h-12 rounded-2xl bg-[#FFC857] shadow-[0_0_20px_rgba(255,200,87,0.4)] flex items-center justify-center mb-4">
          <Command className="w-7 h-7 text-[#0B0F2A]" />
        </div>
        <div className="flex flex-col gap-6 flex-1">
          {[Layout, FileText, Layers, Activity, Grid].map((Icon, i) => (
            <button key={i} className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", i === 2 ? "bg-white/10 text-[#FFC857]" : "text-white/40 hover:text-white hover:bg-white/5")}>
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Toolbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/[0.02] border-b border-white/10 backdrop-blur-md z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#FFC857]" />
              </div>
              <div className="w-32 h-3 bg-white/20 rounded-full" />
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setOutputMode('visual')}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                  outputMode === 'visual' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                Visual Comics
              </button>
              <button
                onClick={() => setOutputMode('text')}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                  outputMode === 'text' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                Text Formatting
              </button>
            </div>
            
            <div className="ml-2">
              {outputMode === 'text' ? (
                <select 
                  value={textFormat} 
                  onChange={(e) => setTextFormat(e.target.value)}
                  className="bg-transparent border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                >
                  {['Logline', 'Beat Sheet', 'Treatment', 'Master Scene Script'].map(opt => (
                    <option key={opt} value={opt} className="bg-[#0B0F2A]">{opt}</option>
                  ))}
                </select>
              ) : (
                <select 
                  value={format} 
                  onChange={(e: any) => setFormat(e.target.value)}
                  className="bg-transparent border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                >
                  {['Comics', 'Manga', 'Webtoons'].map(opt => (
                    <option key={opt} value={opt} className="bg-[#0B0F2A]">{opt}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[Play, Save, Share2, Download].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <button 
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="bg-[#FFC857] text-[#0B0F2A] px-6 py-2 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(255,200,87,0.3)] flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <div className="w-16 h-2 bg-current rounded-full opacity-40" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left: Script Editor Panel */}
          <section className="w-[450px] flex flex-col gap-4">
            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl flex flex-col overflow-hidden">
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FFC857]" />
                  <div className="w-20 h-2 bg-white/20 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer" onClick={() => setIsLiveMode(!isLiveMode)}>
                    <motion.div 
                      className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-[#FFC857]"
                      animate={{ x: isLiveMode ? 16 : 0 }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8 relative">
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="TYPE YOUR SCRIPT HERE..."
                  className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-white/80 placeholder:text-white/10"
                />
                {isGenerating && (
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-[#FFC857]/10 border border-[#FFC857]/20 rounded-full backdrop-blur-md">
                    <RefreshCw className="w-3 h-3 text-[#FFC857] animate-spin" />
                    <div className="w-12 h-1.5 bg-[#FFC857]/40 rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Assets/Characters Mini Panel */}
            <div className="h-48 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl p-6 flex flex-col gap-4">
              <div className="w-24 h-2 bg-white/20 rounded-full" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-white/20" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </div>
          </section>

          {/* Right: Visual Canvas Panel */}
          <section className="flex-1 bg-[#F5F6FA] rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-10">
              <div className="flex items-center gap-4">
                <div className="w-32 h-3 bg-gray-200 rounded-full" />
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-2 bg-gray-200 rounded-full" />
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar-light">
              {outputMode === 'text' ? (
                <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-2xl border border-gray-100 p-10 min-h-[600px] flex flex-col relative">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h3 className="text-[#0B0F2A] font-bold text-xl">{textFormat} Output</h3>
                    {formattedText && (
                      <button 
                        onClick={() => { navigator.clipboard.writeText(formattedText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Text'}
                      </button>
                    )}
                  </div>
                  {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      <p>Generating {textFormat}...</p>
                    </div>
                  ) : formattedText ? (
                    <div className="flex-1 whitespace-pre-wrap text-gray-800 text-sm leading-relaxed font-mono">
                      {formattedText}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
                      <FileText className="w-12 h-12 text-gray-200" />
                      <p>Click generate to create your {textFormat}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={cn(
                  "mx-auto transition-all duration-700",
                  format === 'Webtoons' ? "max-w-md space-y-10" : "max-w-4xl grid grid-cols-2 gap-8"
                )}>
                {panels.length > 0 ? panels.map((panel, i) => (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "group relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 bg-white",
                      panel.type === 'Splash' ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"
                    )}
                  >
                    {panel.image ? (
                      <img 
                        src={panel.image} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gray-50">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 animate-pulse">
                          <Sparkles className="w-8 h-8 text-gray-300" />
                        </div>
                        <div className="w-32 h-3 bg-gray-200 rounded-full mb-2" />
                        <div className="w-20 h-2 bg-gray-100 rounded-full" />
                      </div>
                    )}
                    
                    {/* Panel Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#FFC857] flex items-center justify-center text-[#0B0F2A]">
                          <Plus className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-2 h-[600px] flex flex-col items-center justify-center text-gray-200 border-4 border-dashed border-gray-50 rounded-[40px]">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
                      <Layout className="w-10 h-10 text-gray-200" />
                    </div>
                    <div className="w-48 h-4 bg-gray-100 rounded-full mb-4" />
                    <div className="w-32 h-3 bg-gray-50 rounded-full" />
                  </div>
                )}
              </div>
              )}
            </div>

            {/* Canvas Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-gray-200 shadow-2xl">
              <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <div className="flex gap-1 px-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={cn("w-2 h-2 rounded-full", i === 1 ? "bg-gray-900" : "bg-gray-200")} />
                ))}
              </div>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar-light::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
      `}} />
    </div>
  );
}
