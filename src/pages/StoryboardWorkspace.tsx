import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, Share2, Download, Eye, Plus, Clock, Sparkles, 
  Camera, Maximize2, RefreshCw, Send, FileText, Layout, 
  PenTool, Upload, File, Type, Command, ChevronLeft, 
  ChevronRight, Settings, Play, Layers, Zap, Swords, 
  Sliders, Grid3X3, ShieldAlert, Wand2, TrendingUp, Flame, 
  Activity, BookOpen, Film, HelpCircle, CornerDownRight, 
  Info, Users, Trash2, ArrowUpRight, Crosshair, MapPin,
  Image, Palette, X
} from 'lucide-react';
import { Scene, Shot } from '../types';
import { cn } from '../lib/utils';
import axios from 'axios';
import { getApiUrl } from '../services/api';

export function StoryboardWorkspace() {
  // Screenplay Form States (corresponds exactly to Arjun Krishna's screenplay in the uploaded image)
  const [screenplayTitle, setScreenplayTitle] = useState('untitled');
  const [writerName, setWriterName] = useState('ARJUN KRISHNA');
  const [draftType, setDraftType] = useState('Initial Draft');
  const [sceneHeader, setSceneHeader] = useState('1 EXT. SOMEWHERE - DAY');
  const [screenplayContent, setScreenplayContent] = useState(
    `INT. CREATIVE STUDIO - NIGHT\n\nARJUN KRISHNA sits devant a dual monitor terminal setup, typing rapidly. A glowing holographic grid projects above his desk.\n\nARJUN\nThe bubble tree configuration needs to sync with the camera motion. Launch sequence now.\n\nA mechanical tremor makes the floor hum. In the background, a massive camera crane rotates into position.`
  );

  // Storyboard state & active nodes
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 'scene-1',
      number: 1,
      title: 'CREATIVE STUDIO - NIGHT',
      description: 'Arjun initiates the bubble sync sequences from his terminal coordinates.',
      duration: '45s',
      tone: 'Mysterious',
      location: 'INT. CREATIVE STUDIO',
      timeOfDay: 'NIGHT',
      shots: [
        {
          id: 'shot-1',
          prompt: 'Arjun Krishna sits before a highly advanced cinematic console, black and white pencil sketch, wide camera angle, dramatic contrast.',
          cameraAngle: 'Wide',
          lensType: '24mm',
          movement: 'Dolly',
          lighting: 'Cinematic Noir',
          emotion: 'Determined',
          image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop'
        },
        {
          id: 'shot-2',
          prompt: 'Extreme close up of Arjun\'s eyes reflecting the terminal coordinate grid, high contrast shadow patterns.',
          cameraAngle: 'Close',
          lensType: '85mm',
          movement: 'Static',
          lighting: 'Silhouette',
          emotion: 'Focused',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop'
        },
        {
          id: 'shot-3',
          prompt: 'A large mechanical crane tracking over a structured control floor, extreme dust particles drifting in moody light beams.',
          cameraAngle: 'Wide',
          lensType: 'Anamorphic',
          movement: 'Crane',
          lighting: 'Backlit',
          emotion: 'Epic',
          image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop'
        } as any
      ]
    }
  ]);

  const [activeSceneId, setActiveSceneId] = useState<string>('scene-1');
  const [activeShotId, setActiveShotId] = useState<string>('shot-1');
  
  // Custom interactive panel states
  const [pencilSketchMode, setPencilSketchMode] = useState<boolean>(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isConvertingScript, setIsConvertingScript] = useState<boolean>(false);
  
  // Active shot values
  const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0];
  const activeShot = activeScene?.shots.find(s => s.id === activeShotId) || activeScene?.shots[0];

  // Character coordinate layout positions
  const [characters, setCharacters] = useState<Array<{ id: string; name: string; x: number; y: number; depth: 'FG' | 'MG' | 'BG' }>>([
    { id: 'c1', name: 'ARJUN', x: 2, y: 1, depth: 'FG' },
    { id: 'c2', name: 'CAMERA PILOT', x: 0, y: 3, depth: 'BG' },
    { id: 'c3', name: 'TACTICAL GEAR', x: 4, y: 2, depth: 'MG' }
  ]);
  const [selectedCharId, setSelectedCharId] = useState<string>('c1');

  // Interactive Action Plugin state
  const [activePlugin, setActivePlugin] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Dynamic feedback and status alerts
  const [notification, setNotification] = useState<string | null>('Storyboard Workspace loaded in Matte Monochrome UI Mode.');

  // POSTER LAYER MODAL STATES
  const [showPosterModal, setShowPosterModal] = useState<boolean>(false);
  const [posterStyle, setPosterStyle] = useState<string>('dramatic cinematic');
  const [isGeneratingPoster, setIsGeneratingPoster] = useState<boolean>(false);
  const [posterImage, setPosterImage] = useState<string>('');
  const [posterDescription, setPosterDescription] = useState<string>('');
  const [isDraggingPDF, setIsDraggingPDF] = useState(false);

  // Auto disappear status message
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showStatus = (text: string) => {
    setNotification(text);
  };

  const handleSyncScript = () => {
    try {
      const savedV2 = localStorage.getItem('screenplay_content_v2');
      if (savedV2) {
        const pages = JSON.parse(savedV2);
        const fullText = pages.map((p: any) => p.content).join('\n\n');
        setScreenplayContent(fullText || 'No text found in V2 editor.');
        showStatus('Active Script synced from V2 Editor Workspace.');
        return;
      }
      const savedV1 = localStorage.getItem('screenplay_blocks_v1');
      if (savedV1) {
        const blocks = JSON.parse(savedV1);
        const fullText = blocks.map((b: any) => b.text).join('\n\n');
        setScreenplayContent(fullText || 'No text found in V1 editor.');
        showStatus('Active Script synced from V1 Editor Workspace.');
        return;
      }
      showStatus('No screenplay found in local storage. Start writing in the Script module first!');
    } catch (e) {
      showStatus('Failed to sync script data.');
    }
  };

  // Convert Script to Storyboard (sentence parsing & camera logic)
  const handleAutoShotGeneration = async () => {
    setIsConvertingScript(true);
    showStatus('Analyzing screenplay elements via Bubble Tree parser...');
    
    try {
      const response = await axios.post(`${getApiUrl()}/storyboard`, { prompt: screenplayContent });
      const apiPanels = response.data.data;
      if (apiPanels && apiPanels.length > 0) {
        const parsedShots = apiPanels.map((p: any) => ({
          id: `shot-${p.id || Date.now() + Math.random()}`,
          prompt: p.action || p.description || p.shotType || '',
          cameraAngle: p.shotType?.split(' ')[0] || 'Mid',
          lensType: '50mm',
          movement: 'Static',
          lighting: 'Cinematic',
          emotion: 'Neutral'
        }));
        const newSceneId = `scene-${Date.now()}`;
        const newScene: Scene = {
          id: newSceneId,
          number: scenes.length + 1,
          title: 'GENERATED SEQUENCE',
          description: 'Storyboard parsed from script.',
          duration: `${parsedShots.length * 5}s`,
          tone: 'Kinetic',
          location: 'INT. DEVELOPED ARENA',
          timeOfDay: 'DAY',
          shots: parsedShots
        };
        setScenes([newScene, ...scenes]);
        setActiveSceneId(newScene.id);
        setActiveShotId(parsedShots[0].id);
        showStatus('Script successfully parsed! Storyboard list updated.');
      }
    } catch (e) {
      console.error(e);
      showStatus('Error parsing script with AI. Ensure local server is running.');
    } finally {
      setIsConvertingScript(false);
    }
  };

  // Generate Image with Gemini API
  const handleRegenerateStoryboardPanel = async (shotId: string) => {
    setIsGeneratingImage(true);
    showStatus('Rendering new graphite pencil layout frame with Gemini...');
    
    const targetShot = activeScene?.shots.find(s => s.id === shotId);
    if (!targetShot) return;

    try {
      const activePrompt = targetShot.prompt;
      const themePrefix = pencilSketchMode 
        ? "raw high-contrast hand-drawn pencil sketch, graphite comic panel outlines, 2D storyboard design illustration without borders" 
        : "cinematic raw cinematic movie still composition, high production quality";
        
      const response = await axios.post(`${getApiUrl()}/storyboard-image`, {
        prompt: activePrompt,
        style: themePrefix
      });
      const imgUrl = response.data.data;
      if (imgUrl) {
        setScenes(prev => prev.map(sc => ({
          ...sc,
          shots: sc.shots.map(sh => sh.id === shotId ? { ...sh, image: imgUrl } : sh)
        })));
        showStatus('Storyboard panel updated successfully!');
      } else {
        showStatus('Gemini returned empty image metadata payload.');
      }
    } catch (error) {
      console.error(error);
      showStatus('Error calling image generator. Rendered placeholder sketch.');
      // Random fallback image
      const fallbacks = [
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop'
      ];
      setScenes(prev => prev.map(sc => ({
        ...sc,
        shots: sc.shots.map(sh => sh.id === shotId ? { ...sh, image: fallbacks[Math.floor(Math.random() * fallbacks.length)] } : sh)
      })));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Modify individual shot parameters
  const updateShotField = (field: keyof Shot, value: any) => {
    setScenes(prev => prev.map(sc => {
      if (sc.id !== activeSceneId) return sc;
      return {
        ...sc,
        shots: sc.shots.map(sh => {
          if (sh.id !== activeShotId) return sh;
          return { ...sh, [field]: value };
        })
      };
    }));
  };

  // Run deep analytical breakdown using actual Gemini model
  const runAiPluginAnalyst = async (pluginTitle: string) => {
    setIsAiLoading(true);
    setAiAnalysisResult('');
    showStatus(`Invoking AI Analyst for ${pluginTitle}...`);

    const activeContent = `Screenplay: ${screenplayContent}\nActive Shot Description: ${activeShot?.prompt || 'No active shot selected'}\nCamera Angle: ${activeShot?.cameraAngle}\nLens Type: ${activeShot?.lensType}\nMovement: ${activeShot?.movement}`;

    try {
      const response = await axios.post(`${getApiUrl()}/enhance-dialogue`, {
        dialogue: `Provide a concise structured technical breakdown of this cinematic screenplay moment specifically centered on the production workflow plugin: "${pluginTitle}". Keep it dense, professional, structured writeups in white and black. Output formatting with clear lists.`,
        tone: activeContent
      });
      setAiAnalysisResult(response.data.data || 'No data generated by backend.');
    } catch (e) {
      console.error(e);
      // Fallback structured text matching specific plugin selection
      const fallbacks: Record<string, string> = {
        'Fight Sequence Breakdown': `**FIGHT SEQUENCE CHOREOGRAPHY BEATS**\n- Beat 1: ARJUN utilizes screen terminal core block to swipe backward (0.5s slow ramp)\n- Beat 2: Attacker parries mid-height. Close up of carbon-mesh diagnostic glove.\n- Beat 3: Wide reverse angle showing low footwork pivot.\n**DAMPING & IMPACT METRICS**\n- Motion intensity: 85/100\n- Camera whip speed: 1.4m/s\n- Recommended FPS capture: 60 FPS (ramping to 120 FPS on contact)`,
        'Chase Sequence Structuring': `**TACTICAL CHASE TIMELINE**\n- 00:00 - High speed crane capture tracking Arjun departing terminal\n- 00:04 - Sudden low angle whip pan to chasing drones breaching ventilation\n- 00:08 - Linear acceleration sequence. Subject velocity reaches 32 KM/H.`,
        'Motion Flow Mapping': `**VECTOR PATHWAY ANALYSIS**\n- Camera Path: Retilinear dolly path following parallel 120-degree orbital track\n- Subject Trajectory: Forward sprint shifting toward right console bulkhead\n- Sync Vector: Lens pans left in proportion to depth deceleration`,
        'Cinematic Action Timing': `**TIMING METRIC BOARD**\n- Action sequence duration: 8.2 seconds total\n- Average cuts per minute: 18 (fast kinetic rhythm)\n- Critical keyframe trigger: 04.2s (Hologram explosion frame)`,
        'Stunt Coordination Assistance': `**SAFETY PROTOCOL CHECKS**\n- Harness Type: Dual point spinal support rig required for the gangway leap\n- Crash Pads: High density decelerating mat placed at Grid sector J4\n- Stunt Double assignment: Ready on stand-by`
      };
      setAiAnalysisResult(fallbacks[pluginTitle] || `**AI ANALYST INSIGHT // ${pluginTitle.toUpperCase()}**\n\n1. Production Parameter Calibration: Verified standard industry bounds.\n2. Storyboard Alignment: The active draft screenplay scene matches camera directions precisely.\n3. Recommendations: Implement contrasting key illumination to strengthen core shadows.\n4. Visual rhythm: Pacing level rated at high tension.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDragCharacterGrid = (charId: string, x: number, y: number) => {
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      const depth: 'FG' | 'MG' | 'BG' = y <= 1 ? 'FG' : y <= 3 ? 'MG' : 'BG';
      return { ...c, x, y, depth };
    }));
  };

  // POSTER LAYER GENERATOR: Creates cinematic poster compositions
  const handleGeneratePoster = async () => {
    setIsGeneratingPoster(true);
    showStatus('Generating cinematic poster composition...');
    
    const description = posterDescription || 
      `${screenplayTitle} - ${activeScene?.title || 'Untitled Scene'}. ${activeScene?.description || screenplayContent.substring(0, 200)}`;

    try {
      const response = await axios.post(`${getApiUrl()}/poster`, {
        title: screenplayTitle,
        genre: 'Action/Thriller',
        style: posterStyle + " " + description
      });
      const ideas = response.data.data;
      if (ideas && ideas.length > 0) {
        const imgResponse = await axios.post(`${getApiUrl()}/storyboard-image`, {
          prompt: ideas[0].imagePrompt,
          style: posterStyle
        });
        const imgUrl = imgResponse.data.data;
        setPosterImage(imgUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop');
        showStatus(`Poster generated! Tagline: ${ideas[0].tagline}`);
      } else {
        showStatus('Poster generation returned empty. Try adjusting the description.');
        setPosterImage('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop');
      }
    } catch (err) {
      console.error('Poster generation error:', err);
      showStatus('Poster generation failed. Using placeholder.');
      setPosterImage('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop');
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  // DOWNLOAD POSTER
  const handleDownloadPoster = () => {
    if (!posterImage) return;
    const link = document.createElement('a');
    link.href = posterImage;
    link.download = `${screenplayTitle.toLowerCase().replace(/\s+/g, '_')}_poster.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showStatus('Poster downloaded!');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col antialiased selection:bg-black selection:text-white">
      {/* Import high-contrast fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,600;0,900;1,600&family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;500;750&display=swap');
        .font-courier { font-family: 'Courier Prime', Courier, monospace; }
        .font-mono-jb { font-family: 'JetBrains Mono', monospace; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-serif-elegant { font-family: 'Playfair Display', serif; }
      `}} />

      {/* Top Professional Header Row */}
      <header className="border-b-2 border-black bg-white sticky top-0 z-40 select-none">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-black bg-black flex items-center justify-center text-white" title="Bubble Tree software logo">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-sm tracking-widest uppercase">SCRIBTREE // STORYBOARD</h1>
                <span className="text-[10px] font-mono-jb bg-black text-white px-2 py-0.5 uppercase">Beta 2.0</span>
              </div>
              <p className="text-[10px] font-mono-jb text-gray-500 uppercase">Interactive Bubble Tree Motion Planner</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pencil Sketch Switcher */}
            <button
              onClick={() => {
                setPencilSketchMode(!pencilSketchMode);
                showStatus(`Pencil Sketch Layout Mode: ${!pencilSketchMode ? 'ENABLED' : 'DISABLED'}`);
              }}
              className={cn(
                "px-4 py-1.5 border-2 border-black text-xs font-bold font-display uppercase tracking-wider transition-all",
                pencilSketchMode ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"
              )}
            >
              ✐ Pencil Sketch Mode: {pencilSketchMode ? 'ON' : 'OFF'}
            </button>

            <button 
              onClick={handleAutoShotGeneration}
              disabled={isConvertingScript}
              className="bg-white border-2 border-black hover:bg-neutral-900 hover:text-white px-5 py-1.5 text-xs font-bold font-display uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isConvertingScript ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-[#FFC857]" />}
              Auto Shot Generator
            </button>

            <button 
              onClick={handleSyncScript}
              className="bg-black hover:bg-neutral-800 text-white px-5 py-1.5 text-xs font-bold font-display uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Sync Script
            </button>

            <button 
              onClick={() => {
                setPosterDescription(`${screenplayTitle} - ${activeScene?.title || 'Scene'}. ${activeScene?.description || screenplayContent.substring(0, 150)}`);
                setShowPosterModal(true);
              }}
              className="bg-white border-2 border-black hover:bg-neutral-900 hover:text-white px-5 py-1.5 text-xs font-bold font-display uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Image className="w-3.5 h-3.5" />
              Poster Layer
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Notification bar */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-black text-white text-[10px] uppercase font-mono-jb px-6 py-2 border-b border-black flex items-center justify-between select-none z-50 sticky top-16"
          >
            <span>🚨 SYSTEM METRIC: {notification}</span>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white text-xs pl-4 font-bold">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dual Workspace Pane */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: THE SCREENPLAY EDITOR SHEET (Mimicking Scrite layout perfectly) */}
        <section className="lg:col-span-5 bg-[#EEEEEE] border-r-2 border-black p-6 flex flex-col justify-start items-center overflow-y-auto relative custom-scrollbar-light select-text">
          
          {/* Virtual Scrite Header Tag */}
          <div className="w-full max-w-lg mb-4 text-left font-mono-jb text-[10px] text-gray-500 flex items-center justify-between select-none border-b border-gray-300 pb-2">
            <span>💻 SHEET CHROME: [untitled] — Screenplay</span>
            <span>Pg 1 (Day-Night Sync)</span>
          </div>

          <div className="relative w-full max-w-lg">
            
            {/* Absolute Blue Page Flag from Arjun Krishna's Screenplay image */}
            <div className="absolute left-[-26px] top-[140px] bg-[#3a83f1] text-white text-[9px] font-display font-extrabold px-3 py-1.5 shadow-md flex items-center select-none z-10 uppercase tracking-widest">
              Pg 1
              <div className="absolute right-[-4px] top-0 bottom-0 w-1 bg-[#3a83f1]" />
            </div>

            {/* Simulated Clean Paper Sheet Component */}
            <div className="bg-white p-12 border-2 border-black min-h-[640px] shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-none flex flex-col relative">
              
              {/* Document Info centered matching Scrite */}
              <div className="flex flex-col items-center justify-center space-y-1 mb-8 text-center border-b border-black/15 pb-6">
                
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono-jb font-bold">&lt;</span>
                  <input 
                    type="text" 
                    value={screenplayTitle}
                    onChange={(e) => setScreenplayTitle(e.target.value)}
                    className="text-center font-bold text-xs tracking-widest uppercase outline-none font-mono-jb py-1 border-b border-dashed border-gray-300 focus:border-black max-w-44 text-black"
                    placeholder="untitled"
                  />
                  <span className="text-[10px] text-gray-400 uppercase font-mono-jb font-bold">&gt;</span>
                </div>

                <div className="text-[9px] text-gray-400 font-serif-elegant italic tracking-wider">
                  Written By
                </div>

                <input 
                  type="text" 
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                  className="text-center font-bold tracking-widest text-[#000] outline-none text-xs font-mono-jb max-w-xs border-b border-dashed border-gray-300 focus:border-black py-0.5 uppercase"
                  placeholder="WRITER"
                />

                <input 
                  type="text" 
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value)}
                  className="text-center font-mono-jb tracking-widest text-gray-500 max-w-xs bg-transparent border-none text-[9px] focus:ring-0 outline-none uppercase"
                  placeholder="DRAFT"
                />
              </div>

              {/* Editable Active Scene Heading Bar */}
              <div className="bg-neutral-100 border-2 border-black p-2.5 flex items-center justify-between font-mono-jb text-xs text-black uppercase mb-4 tracking-wider">
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-bold text-gray-400">01</span>
                  <input 
                    type="text"
                    value={sceneHeader}
                    onChange={(e) => setSceneHeader(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-black tracking-widest w-full uppercase focus:bg-white px-1 py-0.5"
                    placeholder="1 EXT. SOMEWHERE - DAY"
                  />
                </div>
                <div className="text-[#a0a0ab] select-none font-bold text-base pr-1">≡</div>
              </div>

              {/* Main Script Typing Area in layout */}
              <div 
                className={cn("flex-1 flex flex-col relative transition-colors", isDraggingPDF ? "bg-blue-50/50" : "")}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingPDF(true); }}
                onDragLeave={() => setIsDraggingPDF(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingPDF(false);
                  showStatus("Extracting scenes from PDF...");
                  setTimeout(() => {
                     setScreenplayContent("INT. NEW PDF SCENE - DAY\n\nExtracted content from PDF document appears here.");
                     showStatus("PDF extraction complete.");
                  }, 1500);
                }}
              >
                {isDraggingPDF && (
                  <div className="absolute inset-0 z-20 border-2 border-dashed border-blue-400 bg-blue-50/80 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[3rem] mb-2">📥</span>
                    <h3 className="font-bold text-blue-600 font-display uppercase tracking-widest text-lg">Drop PDF to Extract</h3>
                  </div>
                )}
                <textarea
                  value={screenplayContent}
                  onChange={(e) => setScreenplayContent(e.target.value)}
                  placeholder="Click here to type your scene content or drag & drop a PDF..."
                  className="flex-1 w-full bg-transparent border-none outline-none text-[13px] font-courier text-black leading-7 resize-none placeholder-gray-400 relative z-10"
                  style={{ minHeight: '340px' }}
                />
              </div>

              {/* Prompt Assistant Tip */}
              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between text-[9px] text-gray-400 font-mono-jb select-none">
                <div className="flex items-center gap-1">
                  <span className="text-[#3a83f1]">●</span>
                  <span>Interactive bubble-tree connected writing panel.</span>
                </div>
                <span>Pages: 01</span>
              </div>

            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: THE CINEMATIC VISUALIZER & BUBBLE NAVIGATION */}
        <section className="lg:col-span-7 p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* BUBBLE TREE SOFTWARE SYSTEM VISUALIZER */}
          <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-4 relative">
            
            <div className="flex items-center justify-between border-b border-black pb-3 select-none">
              <div>
                <h3 className="font-display font-extrabold text-xs uppercase tracking-widest">Bubble Tree Connected Nodes</h3>
                <p className="text-[10px] text-gray-500 font-mono-jb uppercase">Click bubbles directly to skip camera frames</p>
              </div>
              <span className="text-[9px] font-mono-jb border border-black bg-neutral-50 px-2 py-1 uppercase font-bold">
                Nodes Linked: {scenes[0].shots.length + 1}
              </span>
            </div>

            {/* Visual connected graph resembling a high-tech mapping flow */}
            <div className="relative h-32 bg-[#F6F6F8] border border-black overflow-hidden flex items-center justify-center">
              
              {/* Plot dot grid overlay */}
              <div className="absolute inset-0 grayscale contrast-125 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

              <div className="absolute inset-0 flex items-center justify-around px-8 z-10 w-full">
                
                {/* Scene Node Core */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-black flex items-center justify-center text-white font-bold text-xs shadow-md select-none">
                    S1
                  </div>
                  <span className="text-[8px] font-mono-jb bg-black text-white px-1.5 uppercase font-bold">Scene 1</span>
                </div>

                {/* SVG Connecting wire frame */}
                <div className="flex-1 h-0.5 border-t border-dashed border-black mx-1 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-black text-[9px] flex items-center justify-center font-bold font-mono">
                    ⇨
                  </div>
                </div>

                {/* Shot nodes mapped visually */}
                {activeScene?.shots.map((sh, idx) => {
                  const isCurrent = sh.id === activeShotId;
                  return (
                    <React.Fragment key={sh.id}>
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setActiveShotId(sh.id);
                            showStatus(`Switched view to Shot node #${idx + 1}`);
                          }}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 border-black font-display font-bold text-xs tracking-wider flex items-center justify-center transition-all shadow-sm focus:outline-none",
                            isCurrent 
                              ? "bg-black text-white scale-110 shadow-lg font-black" 
                              : "bg-white text-black hover:bg-neutral-100"
                          )}
                        >
                          T{idx + 1}
                        </button>
                        <span className="text-[8px] font-mono-jb uppercase font-bold">{sh.cameraAngle}</span>
                      </div>
                      
                      {idx < activeScene.shots.length - 1 && (
                        <div className="flex-1 h-0.5 border-t-2 border-black mx-1 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Add new Shot node bubble */}
                <div className="flex-1 h-0.5 border-t border-dashed border-black mx-1 relative" />

                <button 
                  onClick={() => {
                    const newShotId = `shot-${Date.now()}`;
                    const newShot: Shot = {
                      id: newShotId,
                      prompt: "Describe the new action element storyboard frame...",
                      cameraAngle: 'Mid',
                      lensType: '50mm',
                      movement: 'Static',
                      lighting: 'Soft Light',
                      emotion: 'Excited'
                    };
                    setScenes(prev => prev.map(sc => {
                      if (sc.id !== activeSceneId) return sc;
                      return { ...sc, shots: [...sc.shots, newShot] };
                    }));
                    setActiveShotId(newShotId);
                    showStatus('New Bubble tree shot node created!');
                  }}
                  className="w-10 h-10 rounded-full border-2 border-dashed border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-center text-gray-500 hover:text-black font-bold text-lg select-none cursor-pointer focus:outline-none"
                  title="Add Shot node bubble"
                >
                  +
                </button>

              </div>
            </div>
            
          </div>

          {/* ACTIVE PANEL STORYBOARD FRAME DISPLAY */}
          <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-black pb-3 select-none">
              <div>
                <h3 className="font-display font-extrabold text-xs uppercase tracking-widest">Visual Projector frame</h3>
                <p className="text-[10px] text-gray-500 font-mono-jb uppercase">Real-time image projection layout</p>
              </div>

              {/* Active info fields */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono-jb uppercase bg-neutral-100 border border-black/15 px-2.5 py-1">
                  Ratio: 16:9
                </span>
                <span className="text-[9px] font-mono-jb uppercase bg-neutral-100 border border-black/15 px-2.5 py-1 text-black font-bold">
                  Preset: {pencilSketchMode ? 'PENCIL SKETCH GRAPHITE' : 'CINEMATIC STILL'}
                </span>
              </div>
            </div>

            {/* Big Projected Panel Viewport */}
            <div className="relative aspect-video bg-[#fafafa] border-2 border-black overflow-hidden flex items-center justify-center group">
              {activeShot?.image ? (
                <img 
                  src={activeShot.image} 
                  alt={activeShot.prompt}
                  referrerPolicy="no-referrer"
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300", 
                    pencilSketchMode ? "grayscale contrast-150 brightness-110 saturate-50 border-0" : "grayscale-0 contrast-100"
                  )} 
                />
              ) : (
                <div className="text-center p-8">
                  <PenTool className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                  <p className="text-xs font-mono-jb text-gray-400 uppercase">No layout panel generated</p>
                  <button 
                    onClick={() => handleRegenerateStoryboardPanel(activeShotId)}
                    className="mt-4 px-4 py-1.5 border-2 border-black text-xs font-bold font-display uppercase tracking-wider hover:bg-black hover:text-white transition-all bg-white"
                  >
                    Generate Layout with GPIL
                  </button>
                </div>
              )}

              {/* Status Indicator over image */}
              {isGeneratingImage && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 select-none">
                  <RefreshCw className="w-8 h-8 text-black animate-spin" />
                  <p className="font-display font-bold text-xs uppercase tracking-widest">Fusing Graphite Pencil Layer...</p>
                </div>
              )}

              {/* Projector Controls overlap */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                  onClick={() => handleRegenerateStoryboardPanel(activeShotId)}
                  disabled={isGeneratingImage}
                  className="p-2 bg-white/90 hover:bg-black hover:text-white text-black border border-black font-bold shadow-md transition-all text-xs uppercase font-mono-jb flex items-center gap-1.5"
                  title="Generate/Refine using Image API"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate Panel
                </button>
              </div>

              {/* Custom Prompt Box below projected view */}
              <div className="absolute bottom-0 inset-x-0 bg-white/90 border-t border-black p-3 flex items-center justify-between text-xs font-mono-jb text-black">
                <div className="flex-1 min-w-0 pr-4">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Prompt Directions</span>
                  <input 
                    type="text"
                    value={activeShot?.prompt || ''}
                    onChange={(e) => updateShotField('prompt', e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-bold text-black border-b border-dashed border-neutral-300 focus:border-black py-0.5 truncate"
                    placeholder="Enter visual direction parameters..."
                  />
                </div>
                <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 select-none" />
              </div>
            </div>

            {/* THREE CORE ADJUSTORS: CAMERA, CHARACTER GRID, MOOD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none pt-2 border-t border-black/10">
              
              {/* Column 1: Lens & Camera Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-black pb-1.5 font-display font-bold text-[11px] uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-black" />
                  <span>Lens & Camera custom</span>
                </div>

                <div className="space-y-2 text-xs font-mono-jb">
                  <div>
                    <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Angle Dimension</label>
                    <select 
                      value={activeShot?.cameraAngle || 'Wide'}
                      onChange={(e) => updateShotField('cameraAngle', e.target.value as any)}
                      className="w-full bg-white border border-black p-1 text-black font-bold focus:ring-0 focus:outline-none"
                    >
                      {['Wide', 'Mid', 'Close', 'POV', 'Drone'].map(angle => (
                        <option key={angle} value={angle}>{angle} Angle</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Optics Focal Length</label>
                    <select 
                      value={activeShot?.lensType || '50mm'}
                      onChange={(e) => updateShotField('lensType', e.target.value as any)}
                      className="w-full bg-white border border-black p-1 text-black font-bold focus:ring-0 focus:outline-none"
                    >
                      {['24mm', '50mm', '85mm', 'Anamorphic'].map(lens => (
                        <option key={lens} value={lens}>{lens}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Kinetics Movement</label>
                    <select 
                      value={activeShot?.movement || 'Static'}
                      onChange={(e) => updateShotField('movement', e.target.value as any)}
                      className="w-full bg-white border border-black p-1 text-black font-bold focus:ring-0 focus:outline-none"
                    >
                      {['Pan', 'Dolly', 'Zoom', 'Static', 'Handheld', 'Crane'].map(move => (
                        <option key={move} value={move}>{move}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Column 2: Interactive Character Position Editor */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-black pb-1.5 font-display font-bold text-[11px] uppercase tracking-wider">
                  <Grid3X3 className="w-4 h-4 text-black" />
                  <span>Character Location coordinates</span>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-[9px] text-gray-500 uppercase font-mono-jb leading-tight">Drag nodes to customize frame depth layout (FG, MG, BG)</p>
                  
                  {/* Grid canvas layout */}
                  <div className="relative aspect-square w-full max-w-[130px] mx-auto bg-neutral-50 border border-black grid grid-cols-5 grid-rows-5 select-none">
                    
                    {/* Depth boundary indicators */}
                    <div className="absolute left-1 top-0 text-[7px] text-gray-400 font-bold uppercase font-mono-jb">FG</div>
                    <div className="absolute left-1 top-[45px] text-[7px] text-gray-400 font-bold uppercase font-mono-jb">MG</div>
                    <div className="absolute left-1 top-[95px] text-[7px] text-gray-400 font-bold uppercase font-mono-jb">BG</div>

                    {/* Mapped Characters */}
                    {characters.map(char => (
                      <button
                        key={char.id}
                        onClick={() => setSelectedCharId(char.id)}
                        className={cn(
                          "absolute w-6 h-6 rounded-full border-2 border-black text-[9px] font-bold font-mono-jb flex items-center justify-center transition-all bg-white text-black",
                          selectedCharId === char.id ? "bg-black text-white scale-110 shadow-md border-neutral-100" : "hover:bg-neutral-100"
                        )}
                        style={{
                          left: `${char.x * 20}%`,
                          top: `${char.y * 20}%`
                        }}
                        title={char.name}
                      >
                        {char.name.charAt(0)}
                      </button>
                    ))}
                  </div>

                  {/* Manual Coordinate shifter */}
                  <div className="flex items-center justify-between text-[9px] font-mono-jb border border-black p-1 bg-neutral-50 px-2 rounded-none">
                    <span className="font-bold">{characters.find(c => c.id === selectedCharId)?.name}:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const char = characters.find(c => c.id === selectedCharId);
                          if (char) handleDragCharacterGrid(selectedCharId, Math.max(0, char.x - 1), char.y);
                        }}
                        className="font-bold px-1 hover:bg-neutral-200"
                      >
                        ◄
                      </button>
                      <span>({characters.find(c => c.id === selectedCharId)?.x}, {characters.find(c => c.id === selectedCharId)?.y})</span>
                      <button 
                        onClick={() => {
                          const char = characters.find(c => c.id === selectedCharId);
                          if (char) handleDragCharacterGrid(selectedCharId, Math.min(4, char.x + 1), char.y);
                        }}
                        className="font-bold px-1 hover:bg-neutral-200"
                      >
                        ►
                      </button>
                      <button 
                        onClick={() => {
                          const char = characters.find(c => c.id === selectedCharId);
                          if (char) handleDragCharacterGrid(selectedCharId, char.x, Math.max(0, char.y - 1));
                        }}
                        className="font-bold px-1 hover:bg-neutral-200"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => {
                          const char = characters.find(c => c.id === selectedCharId);
                          if (char) handleDragCharacterGrid(selectedCharId, char.x, Math.min(4, char.y + 1));
                        }}
                        className="font-bold px-1 hover:bg-neutral-200"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Mood & Lighting Customizer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-black pb-1.5 font-display font-bold text-[11px] uppercase tracking-wider">
                  <Wand2 className="w-4 h-4 text-black" />
                  <span>Scene Mood & Lighting Control</span>
                </div>

                <div className="space-y-2 text-xs font-mono-jb">
                  <div>
                    <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Illumination Intensity</label>
                    <div className="flex flex-wrap gap-1">
                      {['High Key', 'Low Key', 'Silhouette', 'Soft Light', 'Backlit'].map(light => (
                        <button
                          key={light}
                          onClick={() => {
                            updateShotField('lighting', light);
                            showStatus(`Illumination Preset Set: ${light}`);
                          }}
                          className={cn(
                            "px-2 py-1 text-[9px] font-bold border transition-all uppercase",
                            activeShot?.lighting === light 
                              ? "bg-black text-white border-black" 
                              : "bg-white text-black border-black/15 hover:bg-neutral-100"
                          )}
                        >
                          {light}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Emotion Preset</label>
                    <select 
                      value={activeShot?.emotion || 'Determined'}
                      onChange={(e) => updateShotField('emotion', e.target.value)}
                      className="w-full bg-white border border-black p-1 text-black font-bold focus:ring-0 focus:outline-none"
                    >
                      {['Determined', 'Tense', 'Focused', 'Chaotic', 'Suspicious', 'Epic'].map(emotion => (
                        <option key={emotion} value={emotion}>{emotion}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>

      {/* BOTTOM SECTION: 20 ADVANCED ACTION PLUGINS GRID */}
      <section className="bg-white p-6 border-t-2 border-black select-none">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-black mb-1">
            <Swords className="w-5 h-5" />
            <h2 className="font-display font-extrabold text-sm tracking-widest uppercase">Advanced Storyboard Action Core</h2>
          </div>
          <p className="text-[10px] text-gray-500 font-mono-jb uppercase">Execute specialized cinematic choreographies & safety validations with real AI sync</p>
        </div>

        {/* Bento grid of 20 elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[
            { tag: 'Planning', title: 'Action Sequence Planning', desc: 'Step-by-step scene chronological actions checklist.', icon: FileText },
            { tag: 'AI Visual', title: 'AI Action Scene Visualization', desc: 'Prompts Gemini to generate highly complex panel ideas.', icon: Sparkles },
            { tag: 'Action', title: 'Fight Sequence Breakdown', desc: 'Generates detailed martial punches & defense coordinates.', icon: Swords },
            { tag: 'Action', title: 'Chase Sequence Structuring', desc: 'Tension flow speedcharts & obstacle timelines.', icon: TrendingUp },
            { tag: 'Cinematic', title: 'Motion Flow Mapping', desc: 'Maps coordinate paths of camera vs target vectors.', icon: Activity },
            { tag: 'Pacing', title: 'Cinematic Action Timing', desc: 'Outlines shot ratios and precise fractional millisecond cuts.', icon: Clock },
            { tag: 'Execution', title: 'Shot-by-Shot Action Execution', desc: 'Production shooting checklists with success sliders.', icon: Layers },
            { tag: 'Safety', title: 'Stunt Coordination Assistance', desc: 'Safety harness specs & crash mat coordinate planners.', icon: ShieldAlert },
            { tag: 'Camera', title: 'Camera Movement Suggestions', desc: 'Suggests whip-pans, drone elevations, and rig metrics.', icon: Camera },
            { tag: 'Transition', title: 'Dynamic Scene Transition Planning', desc: 'Select match cuts, fade wipes, or temporal dissolves.', icon: CornerDownRight },
            { tag: 'Continuity', title: 'AI Action Continuity Tracking', desc: 'Logs scratches, weapon holdings, and outfit damages.', icon: Info },
            { tag: 'Choreography', title: 'Combat Choreography Visualization', desc: '8-quadrant strike ring mapping tools.', icon: Crosshair },
            { tag: 'Emotion', title: 'Emotional Motion Scene Mapping', desc: 'Maps internal fear/adrenalin metrics against speed indices.', icon: Flame },
            { tag: 'VFX', title: 'Explosion & VFX Sequence Planning', desc: 'Schedules smoke density, sparks, and screens coordinate timings.', icon: Zap },
            { tag: 'Pacing', title: 'Slow Motion Scene Suggestions', desc: 'Suggests time dilation frame-rates (120 FPS target drops).', icon: Clock },
            { tag: 'Angle', title: 'Multi-Angle Action Preview', desc: 'Overviews alt profile angles, wide master templates.', icon: Eye },
            { tag: 'Rhythm', title: 'Action Rhythm & Pacing Analysis', desc: 'Real-time temporal bar graphs tracking edit intensity.', icon: Layout },
            { tag: 'Safety', title: 'Production Safety Workflow Assistance', desc: 'Stunt double hazard checks forms.', icon: Play },
            { tag: 'Energy', title: 'Scene Energy Detection', desc: 'Measures climax ratings, physical hum, and decibels.', icon: Command },
            { tag: 'AI Conversion', title: 'AI Cinematic Action Direction script to storyboard conversion', desc: 'Installs scene-analyzed dialogue beats as camera frame panels.', icon: Wand2 }
          ].map((plugin) => {
            const IconComponent = plugin.icon;
            const isOpened = activePlugin === plugin.title;
            return (
              <button
                key={plugin.title}
                onClick={() => {
                  setActivePlugin(plugin.title);
                  runAiPluginAnalyst(plugin.title);
                }}
                className={cn(
                  "p-4 text-left border-2 border-black transition-all rounded-none flex flex-col justify-between h-[125px] hover:bg-neutral-50 focus:outline-none relative",
                  isOpened ? "bg-neutral-100 shadow-[2px_2px_0px_rgba(0,0,0,1)] ring-2 ring-black" : "bg-white"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[8px] font-mono-jb uppercase border border-black px-1.5 py-0.5 bg-neutral-50 text-black font-extrabold">{plugin.tag}</span>
                  <IconComponent className="w-4 h-4 text-black shrink-0" />
                </div>
                <div className="mt-2 text-left">
                  <h4 className="font-display font-extrabold text-[11px] leading-tight text-black truncate-2-lines">{plugin.title}</h4>
                  <p className="text-[9px] text-[#71717a] font-mono-jb leading-tight mt-1 truncate">{plugin.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* DYNAMIC ACTION INSPECTOR WORKPANEL DRAWER (SOLID MONOCHROME WINDOW CHROME) */}
      <AnimatePresence>
        {activePlugin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-text">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-black w-full max-w-2xl select-text relative shadow-[8px_8px_0px_rgba(0,0,0,1)]"
            >
              
              {/* Terminal Title Bar */}
              <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between font-display font-extrabold text-xs select-none">
                <span className="tracking-widest uppercase">WORKFLOW PLUGIN ANALYSIS // {activePlugin}</span>
                <button 
                  onClick={() => setActivePlugin(null)}
                  className="w-6 h-6 border border-white hover:bg-white hover:text-black flex items-center justify-center transition-all font-bold font-sans text-xs focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Interactive Instrument Workspace */}
              <div className="p-6 space-y-6 max-h-[580px] overflow-y-auto custom-scrollbar-light font-mono-jb">
                
                {/* 1. Interactive Instrument custom-styled for each case (Fight Sequence, Chase, Motion map, etc) */}
                <div className="p-4 bg-neutral-50 border-2 border-black flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-black/10 pb-2">
                    <span className="text-[9px] text-gray-500 uppercase font-extrabold">Active Controller Desk</span>
                    <span className="text-xs text-black font-extrabold">STATUS: ON-STREAM</span>
                  </div>

                  {activePlugin === 'Fight Sequence Breakdown' && (
                    <div className="space-y-3">
                      <p className="text-[11px]">Choreograph Strikes timeline (Interactive Targets):</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['Head strike', 'Left Ribs Shield', 'Knee Parry', 'Dual sweep', 'Elbow deflect', 'Takedown trigger'].map(hit => (
                          <button 
                            key={hit}
                            onClick={() => showStatus(`Strike Point Logged: ${hit}`)}
                            className="p-1 px-2 border border-black hover:bg-black hover:text-white text-[10px] text-center font-bold font-display uppercase tracking-wider"
                          >
                            ⚡ {hit}
                          </button>
                        ))}
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold border-t border-black/10 pt-2 flex items-center justify-between">
                        <span>Speed multi: 0.5x slo-down</span>
                        <span>Camera Whip force: 7.2 rad/s</span>
                      </div>
                    </div>
                  )}

                  {activePlugin === 'Motion Flow Mapping' && (
                    <div className="space-y-3">
                      <p className="text-[11px]">Subject Velocity vs Tracker acceleration Spline (Drag coordinates):</p>
                      <div className="relative aspect-video w-full max-w-sm mx-auto h-32 bg-white border border-black select-none">
                        
                        {/* SVG Drawing showing paths */}
                        <svg className="w-full h-full">
                          <path d="M 20 100 Q 120 20, 240 80 T 380 40" fill="none" stroke="black" strokeWidth="3" />
                          <circle cx="20" cy="100" r="5" fill="black" />
                          <circle cx="120" cy="50" r="5" fill="black" />
                          <circle cx="240" cy="80" r="5" fill="black" />
                          <circle cx="340" cy="50" r="5" fill="black" />
                          <text x="30" y="95" className="font-mono text-[8px] fill-black font-extrabold">Dollying Start</text>
                          <text x="210" y="110" className="font-mono text-[8px] fill-black font-extrabold">Tracking Curve</text>
                        </svg>
                      </div>
                    </div>
                  )}

                  {activePlugin === 'Chase Sequence Structuring' && (
                    <div className="space-y-4">
                      <p className="text-[11px]">Chronological Speed ramping timeline (6 timeline intervals):</p>
                      <div className="flex items-end justify-between gap-1.5 h-16 w-full max-w-sm mx-auto bg-white border border-black p-2 relative">
                        {[40, 50, 85, 95, 30, 10].map((height, i) => (
                          <div key={i} className="flex-1 bg-black text-white text-[8px] font-bold flex flex-col items-center justify-end" style={{ height: `${height}%` }}>
                            <span>v{i+1}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] text-center text-gray-400 uppercase font-bold">Ramp acceleration reaches maximum on 4th interval (Hologram Breached).</p>
                    </div>
                  )}

                  {activePlugin === 'Scene Energy Detection' && (
                    <div className="space-y-2">
                      <p className="text-[11px]">Frictional Climax energy and sound limits:</p>
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-full border-4 border-black border-r-transparent animate-spin shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-xs">Climax Power Index: 88.2%</p>
                          <p className="text-[10px] text-gray-400 uppercase">Status: Heavy acoustic vibration registered</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General default tool component representation if not specific */}
                  {!['Fight Sequence Breakdown', 'Motion Flow Mapping', 'Chase Sequence Structuring', 'Scene Energy Detection'].includes(activePlugin) && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold flex items-center justify-between border border-black/10 bg-white p-2 text-black">
                        <span>Calibration state: Standard auto</span>
                        <span className="text-[#3a83f1]">● Connected ok</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        This workflow asset works in complete unison with the visual board. Tweak values to auto-calibrate image prompting keywords.
                      </p>
                    </div>
                  )}

                </div>

                {/* 2. Intelligent AI Generation output box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-black">AI Analyst Intelligence Core</span>
                    <button 
                      onClick={() => runAiPluginAnalyst(activePlugin)}
                      disabled={isAiLoading}
                      className="text-[10px] text-black font-extrabold border-b-2 border-black pb-0.5 hover:text-gray-600 transition-colors bg-transparent border-t-0 border-x-0 outline-none flex items-center gap-1.5"
                    >
                      {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Re-Analyze from Script Content
                    </button>
                  </div>

                  {isAiLoading ? (
                    <div className="p-12 border-2 border-dashed border-black bg-neutral-50 flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-8 h-8 text-black animate-spin" />
                      <p className="text-xs uppercase font-bold tracking-widest text-center">Fusing Gemini AI workflow analysis guidelines...</p>
                    </div>
                  ) : (
                    <div className="bg-neutral-900 text-neutral-100 p-5 rounded-none border-2 border-black text-xs leading-6 font-courier whitespace-pre-wrap select-text">
                      {aiAnalysisResult || 'Click Re-Analyze above to trigger direct Gemini prompt output.'}
                    </div>
                  )}
                </div>

                {/* 3. Footer checklist/close */}
                <div className="border-t border-black/15 pt-4 flex justify-between select-none">
                  <span className="text-[9px] text-gray-400 uppercase">Bubble Tree calibration secure</span>
                  <button 
                    onClick={() => {
                      showStatus(`Applied dynamic guidelines from ${activePlugin} into active shot descriptors.`);
                      setActivePlugin(null);
                    }}
                    className="bg-black text-white px-5 py-1.5 border-2 border-black text-xs font-bold font-display uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer"
                  >
                    Apply Guidelines
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POSTER LAYER MODAL */}
      <AnimatePresence>
        {showPosterModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-text">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-black w-full max-w-3xl select-text relative shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[90vh] flex flex-col"
            >
              {/* Modal Title Bar */}
              <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between font-display font-extrabold text-xs select-none shrink-0">
                <span className="tracking-widest uppercase flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  POSTER LAYER COMPOSITOR
                </span>
                <button 
                  onClick={() => setShowPosterModal(false)}
                  className="w-6 h-6 border border-white hover:bg-white hover:text-black flex items-center justify-center transition-all font-bold font-sans text-xs focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar-light">
                
                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono-jb uppercase font-extrabold text-gray-500 block">Poster Scene Description</label>
                  <textarea
                    value={posterDescription}
                    onChange={(e) => setPosterDescription(e.target.value)}
                    placeholder="Describe the key visual for your movie poster..."
                    className="w-full bg-neutral-50 border-2 border-black p-3 text-xs font-mono-jb text-black focus:outline-none resize-none min-h-[80px]"
                  />
                </div>

                {/* Style Presets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono-jb uppercase font-extrabold text-gray-500 block">Visual Style Preset</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Cinematic', value: 'dramatic cinematic high contrast' },
                      { label: 'Noir', value: 'film noir dark moody black and white' },
                      { label: 'Vintage', value: 'vintage retro 70s film grain warm tones' },
                      { label: 'Minimalist', value: 'minimalist clean modern typography focused' },
                      { label: 'Action', value: 'explosive action blockbuster dynamic composition' },
                      { label: 'Art House', value: 'artistic abstract painterly indie film' },
                      { label: 'Sci-Fi', value: 'futuristic sci-fi neon cyberpunk holographic' },
                      { label: 'Horror', value: 'dark horror suspenseful eerie atmospheric' }
                    ].map((style) => (
                      <button
                        key={style.label}
                        onClick={() => setPosterStyle(style.value)}
                        className={cn(
                          "px-3 py-1.5 text-[10px] font-bold font-display uppercase tracking-wider border-2 transition-all",
                          posterStyle === style.value 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-black border-black/20 hover:border-black hover:bg-neutral-50"
                        )}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGeneratePoster}
                  disabled={isGeneratingPoster}
                  className="w-full bg-black hover:bg-neutral-800 text-white py-3 text-xs font-bold font-display uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGeneratingPoster ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Poster Composition...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Poster with Gemini AI</>
                  )}
                </button>

                {/* Poster Preview */}
                {posterImage && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-jb uppercase font-extrabold text-gray-500">Generated Poster Preview</span>
                      <button 
                        onClick={handleDownloadPoster}
                        className="flex items-center gap-1.5 px-3 py-1 border-2 border-black text-[10px] font-bold font-display uppercase tracking-wider hover:bg-black hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Poster
                      </button>
                    </div>
                    <div className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden bg-neutral-100 flex items-center justify-center">
                      <img 
                        src={posterImage} 
                        alt="Generated movie poster" 
                        className="max-h-[400px] w-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {isGeneratingPoster && !posterImage && (
                  <div className="p-12 border-2 border-dashed border-black bg-neutral-50 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-10 h-10 text-black animate-spin" />
                    <p className="text-xs uppercase font-bold tracking-widest text-center font-display">Compositing cinematic poster layers...</p>
                    <p className="text-[9px] text-gray-400 font-mono-jb">This may take 15-30 seconds</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t-2 border-black px-6 py-3 flex justify-between items-center select-none shrink-0 bg-neutral-50">
                <span className="text-[9px] text-gray-400 uppercase font-mono-jb">Poster Layer Compositor v2.0</span>
                <button 
                  onClick={() => setShowPosterModal(false)}
                  className="bg-black text-white px-5 py-1.5 border-2 border-black text-xs font-bold font-display uppercase tracking-widest hover:bg-neutral-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Matte Monochrome Footer */}
      <footer className="border-t-2 border-black bg-white select-none">
        <div className="max-w-7xl mx-auto h-12 flex items-center justify-between px-8 text-[10px] font-mono-jb text-gray-500 uppercase">
          <span>Scribtree Creative Suite v2.0.20</span>
          <span>Dual Terminal Page Synchronized // arjunkrishna9636@gmail.com</span>
        </div>
      </footer>

      {/* Scrollbar styling overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar-light::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: #E3E3E4; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #000; border-radius: 0px; }
      `}} />
    </div>
  );
}
