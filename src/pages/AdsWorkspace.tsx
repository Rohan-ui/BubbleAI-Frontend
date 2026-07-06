import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, Video, Sparkles, Copy, Check, 
  ArrowLeft, Share2, Download, Plus, Settings, AlertCircle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../services/api';
import { cn } from '../lib/utils';

export function AdsWorkspace() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ads' | 'motion'>('ads');

  // Ads Studio State
  const [productIdea, setProductIdea] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [tone, setTone] = useState('Urgent / Trending');
  const [adsLoading, setAdsLoading] = useState(false);
  const [adScript, setAdScript] = useState<{ hook: string; visuals: string; pitch: string; cta: string } | null>(null);
  const [adsError, setAdsError] = useState('');
  const [adsCopied, setAdsCopied] = useState(false);

  // Motion Video State
  const [sceneIdea, setSceneIdea] = useState('');
  const [camera, setCamera] = useState('Tracking Shot');
  const [lighting, setLighting] = useState('Cinematic');
  const [motionLoading, setMotionLoading] = useState(false);
  const [motionPrompts, setMotionPrompts] = useState<string[]>([]);
  const [motionError, setMotionError] = useState('');
  const [copiedTakeIndex, setCopiedTakeIndex] = useState<number | null>(null);

  // Generate Ad Script call
  const handleGenerateAds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productIdea.trim()) return;

    setAdsLoading(true);
    setAdsError('');
    setAdScript(null);

    try {
      const response = await axios.post(`${getApiUrl()}/ads`, {
        productIdea,
        platform,
        tone
      });
      if (response.data.success) {
        setAdScript(response.data.data);
      } else {
        setAdsError('Failed to generate ad script. Empty payload returned.');
      }
    } catch (err: any) {
      console.error(err);
      setAdsError(err.response?.data?.error || 'Failed to generate ad script. Ensure the backend server is running.');
    } finally {
      setAdsLoading(false);
    }
  };

  // Generate Motion Video Prompts call
  const handleGenerateMotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneIdea.trim()) return;

    setMotionLoading(true);
    setMotionError('');
    setMotionPrompts([]);

    try {
      const response = await axios.post(`${getApiUrl()}/motion`, {
        sceneIdea,
        cameraMovement: camera,
        lighting
      });
      if (response.data.success) {
        setMotionPrompts(response.data.data);
      } else {
        setMotionError('Failed to generate motion prompts.');
      }
    } catch (err: any) {
      console.error(err);
      setMotionError(err.response?.data?.error || 'Failed to generate prompts. Ensure the backend server is running.');
    } finally {
      setMotionLoading(false);
    }
  };

  const copyAdsToClipboard = () => {
    if (!adScript) return;
    const text = `HOOK:\n${adScript.hook}\n\nVISUALS:\n${adScript.visuals}\n\nPITCH:\n${adScript.pitch}\n\nCTA:\n${adScript.cta}`;
    navigator.clipboard.writeText(text);
    setAdsCopied(true);
    setTimeout(() => setAdsCopied(false), 3000);
  };

  const copyTakeToClipboard = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedTakeIndex(idx);
    setTimeout(() => setCopiedTakeIndex(null), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-[#060608] text-white"
    >
      {/* Top Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-brand-dark/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-brand-light-grey hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg">Ads & Motion Studio</h2>
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
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        {/* Contextual Sidebar / Tab Selector */}
        <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-6 select-none bg-brand-dark/20">
          <div>
            <h3 className="text-[10px] font-bold text-brand-light-grey uppercase tracking-widest mb-4 opacity-50 font-mono">WORKSPACE MODULES</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('ads')}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5",
                  activeTab === 'ads' ? "bg-white/10 text-white" : "text-brand-light-grey hover:bg-white/5 hover:text-white"
                )}
              >
                <Megaphone className="w-4 h-4 text-red-400" />
                <span>Ads Copywriter</span>
              </button>
              <button 
                onClick={() => setActiveTab('motion')}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5",
                  activeTab === 'motion' ? "bg-white/10 text-white" : "text-brand-light-grey hover:bg-white/5 hover:text-white"
                )}
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Motion Video Prompts</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-[10px] text-brand-light-grey font-mono uppercase tracking-wider">AI Studio Edition</p>
              <p className="text-[9px] text-[#8a8a93] mt-1 leading-relaxed">Connected to high-precision OpenRouter free prompt translation models.</p>
            </div>
          </div>
        </aside>

        {/* Content Editor Canvas Grid */}
        <div className="flex-1 bg-brand-dark/50 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            
            <AnimatePresence mode="wait">
              {/* ADS COPY TAB */}
              {activeTab === 'ads' && (
                <motion.div
                  key="ads-studio"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left Column Form */}
                  <div className="lg:col-span-5 bg-[#141416] border border-white/[0.05] p-6 lg:p-8 rounded-[28px] shadow-xl space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ad copywriting engine</span>
                      </div>
                      <h3 className="text-xl font-bold">Product Pitching Copy</h3>
                    </div>

                    <form onSubmit={handleGenerateAds} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-light-grey uppercase tracking-wider">Product / Service Description</label>
                        <textarea
                          required
                          value={productIdea}
                          onChange={(e) => setProductIdea(e.target.value)}
                          placeholder="e.g. A revolutionary smart coffee mug that never loses battery."
                          className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-xs text-white placeholder-brand-light-grey/40 focus:border-red-500/50 focus:outline-none transition-colors resize-none min-h-[120px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-light-grey uppercase tracking-wider">Target Platform</label>
                          <select 
                            value={platform} 
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-xs text-white outline-none cursor-pointer focus:border-red-500/50 appearance-none"
                          >
                            <option value="TikTok">TikTok</option>
                            <option value="Instagram Reels">Instagram Reels</option>
                            <option value="YouTube Pre-Roll">YouTube Pre-Roll</option>
                            <option value="TV Commercial (30s)">TV Commercial (30s)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-light-grey uppercase tracking-wider">Brand Tone</label>
                          <select 
                            value={tone} 
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-xs text-white outline-none cursor-pointer focus:border-red-500/50 appearance-none"
                          >
                            <option value="Urgent / Trending">Urgent / Trending</option>
                            <option value="Relatable / UGC">Relatable / UGC</option>
                            <option value="Luxury / Premium">Luxury / Premium</option>
                            <option value="Funny / Sarcastic">Funny / Sarcastic</option>
                            <option value="Direct / Corporate">Direct / Corporate</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={adsLoading || !productIdea.trim()}
                        className="w-full bg-red-650 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg shadow-red-650/10 active:scale-[0.98]"
                      >
                        {adsLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Formulating Script Copy...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate Ad Script</span>
                          </>
                        )}
                      </button>
                    </form>
                    {adsError && (
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{adsError}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column Output */}
                  <div className="lg:col-span-7 space-y-4">
                    {adScript ? (
                      <div className="bg-[#141416] border border-white/[0.05] p-8 rounded-[28px] shadow-xl relative space-y-6">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <h4 className="font-bold text-sm tracking-wide uppercase text-gray-400">Generated Ad Pitch</h4>
                          <button
                            onClick={copyAdsToClipboard}
                            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 border border-white/5"
                          >
                            {adsCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{adsCopied ? 'Copied' : 'Copy Script'}</span>
                          </button>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">The Hook (0-3s)</span>
                            <p className="text-white text-base font-semibold leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-2xl">{adScript.hook}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Audio & Visual Directions</span>
                            <p className="text-brand-light-grey text-xs italic leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-2xl border-l-2 border-cyan-400">{adScript.visuals}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFC857]">Body / Pitch Narrative</span>
                            <p className="text-brand-light-grey text-xs leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-2xl">{adScript.pitch}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Call to Action (CTA)</span>
                            <p className="text-white text-sm font-bold leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-2xl border-l-2 border-emerald-400">{adScript.cta}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-white/[0.02] border border-dashed border-white/5 rounded-[28px] flex flex-col items-center justify-center p-8 text-center min-h-[360px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-brand-light-grey/40 mb-6">
                          <Megaphone className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-base mb-1">Awaiting product brief parameters</h4>
                        <p className="text-xs text-brand-light-grey max-w-xs leading-relaxed">Fill out the platform settings and generate to view commercial copy layout suggestions.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MOTION VIDEO TAB */}
              {activeTab === 'motion' && (
                <motion.div
                  key="motion-studio"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left Column Form */}
                  <div className="lg:col-span-5 bg-[#141416] border border-white/[0.05] p-6 lg:p-8 rounded-[28px] shadow-xl space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Motion video prompts engineer</span>
                      </div>
                      <h3 className="text-xl font-bold">Text-to-Video Director</h3>
                    </div>

                    <form onSubmit={handleGenerateMotion} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-light-grey uppercase tracking-wider">Base Scene Idea</label>
                        <textarea
                          required
                          value={sceneIdea}
                          onChange={(e) => setSceneIdea(e.target.value)}
                          placeholder="e.g. A dystopian cyberpunk protagonist walks down an alleyway in the rain."
                          className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-xs text-white placeholder-brand-light-grey/40 focus:border-cyan-500/50 focus:outline-none transition-colors resize-none min-h-[120px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-light-grey uppercase tracking-wider">Camera Movement</label>
                          <select 
                            value={camera} 
                            onChange={(e) => setCamera(e.target.value)}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-xs text-white outline-none cursor-pointer focus:border-cyan-500/50 appearance-none"
                          >
                            <option value="Tracking Shot">Tracking Shot</option>
                            <option value="Dolly Zoom">Dolly Zoom</option>
                            <option value="Aerial Drone">Aerial Drone</option>
                            <option value="Handheld Cam">Handheld Cam</option>
                            <option value="Slow Pan Left">Slow Pan Left</option>
                            <option value="Crane Shot">Crane Shot</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-light-grey uppercase tracking-wider">Lighting Style</label>
                          <select 
                            value={lighting} 
                            onChange={(e) => setLighting(e.target.value)}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-xs text-white outline-none cursor-pointer focus:border-cyan-500/50 appearance-none"
                          >
                            <option value="Cinematic">Cinematic</option>
                            <option value="Neon Cyberpunk">Neon Cyberpunk</option>
                            <option value="Moody Film Noir">Moody Film Noir</option>
                            <option value="Golden Hour">Golden Hour</option>
                            <option value="Harsh Studio Light">Harsh Studio Light</option>
                            <option value="Ethereal Dream">Ethereal Dream</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={motionLoading || !sceneIdea.trim()}
                        className="w-full bg-cyan-600 hover:bg-cyan-750 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/10 active:scale-[0.98]"
                      >
                        {motionLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Engineering Prompt takes...</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            <span>Engineer Video Prompts</span>
                          </>
                        )}
                      </button>
                    </form>
                    {motionError && (
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{motionError}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column Output */}
                  <div className="lg:col-span-7 space-y-4">
                    {motionPrompts.length > 0 ? (
                      <div className="space-y-4">
                        {motionPrompts.map((promptText, idx) => (
                          <div key={idx} className="bg-[#141416] border border-white/[0.05] p-5 rounded-2xl shadow-xl flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">Take 0{idx + 1}</span>
                              <button
                                onClick={() => copyTakeToClipboard(promptText, idx)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 border border-white/5"
                              >
                                {copiedTakeIndex === idx ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedTakeIndex === idx ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="text-white text-xs leading-relaxed font-mono bg-white/[0.01] p-3 rounded-xl border border-white/5">{promptText}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-video bg-white/[0.02] border border-dashed border-white/5 rounded-[28px] flex flex-col items-center justify-center p-8 text-center min-h-[360px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-brand-light-grey/40 mb-6">
                          <Video className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-base mb-1">Awaiting motion descriptors</h4>
                        <p className="text-xs text-brand-light-grey max-w-xs leading-relaxed">Specify a baseline camera movement and lighting parameters to direct AI video generation prompt takes.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>
    </motion.div>
  );
}
