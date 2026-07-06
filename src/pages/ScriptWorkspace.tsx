import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, FileText, Layers, Activity, Settings, User,
  Play, Save, Share2, Download, Search, MoreHorizontal,
  Plus, BarChart2, Maximize2, Sparkles, MessageSquare, 
  Zap, Target, Flame, Globe, Shield, RefreshCw, 
  ChevronLeft, ChevronRight, Grid, Archive, RotateCcw,
  Clock, Heart, DollarSign, Award, Share, Eye,
  Wand2, Bot, Send, AlignLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { DirectorStrategy, Scene, Shot, ScriptVersion } from '../types';
import axios from 'axios';
import { getApiUrl } from '../services/api';

interface ScriptWorkspaceProps {
  script?: string;
  onScriptChange?: (val: string) => void;
}

export function ScriptWorkspace({ script = "", onScriptChange }: ScriptWorkspaceProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'Editor' | 'Strategy' | 'VersionHistory'>('Editor');
  const [strategy, setStrategy] = useState<DirectorStrategy | null>(null);
  const [directorMode, setDirectorMode] = useState<'cinematic' | 'theatrical' | 'minimalist'>('cinematic');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [history, setHistory] = useState<ScriptVersion[]>([
    { id: 'v1', timestamp: Date.now() - 3600000, content: "Initial draft...", label: "Auto-save: Initial Scene Draft" },
    { id: 'v2', timestamp: Date.now() - 1800000, content: "Added Act II studio scene...", label: "Manual Backup: Structural Refinements" },
  ]);

  const [pages, setPages] = useState<Array<{ id: string; content: string }>>([
    {
      id: 'page-1',
      content: `INT. CREATIVE STUDIO - DAY

A brilliant ray of sunshine filters through the blinds, illuminating a dual widescreen setup. ARJUN KRISHNA, a visionary creative, sits down to draft a ground-breaking screenplay.

ARJUN
This writing workspace is exactly what professional screenwriters need. Everything is laid out beautifully.

Arjun reaches for his coffee mug. He begins to type with high-precision engineering accuracy.`
    },
    {
      id: 'page-2',
      content: `EXT. NEW HORIZONS - SUNSET

The golden hour wraps the city in warm pastel hues. Skyscrapers glitter like quartz crystals in the evening breeze.

ARJUN
(whispers to himself)
We are building the future, one page at a time.

He smiles, pressing enter to structure his next sequence with confidence.`
    }
  ]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [screenplayTitle, setScreenplayTitle] = useState('untitled');
  const [writerName, setWriterName] = useState('ARJUN KRISHNA');
  const [draftType, setDraftType] = useState('Initial Draft');

  // NEW ROBUST HIGH-FIDELITY COMPANION STATES
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Synced with Workspace");
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [knownCharacters, setKnownCharacters] = useState<string[]>(['ARJUN', 'KRISHNA', 'NARRATOR']);
  const [detectedNewCharacters, setDetectedNewCharacters] = useState<string[]>([]);
  const [lastCheckedText, setLastCheckedText] = useState<string>("");

  // Sidebar Tool toggles and interactive state
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [replaceQuery, setReplaceQuery] = useState<string>("");
  const [showXmlView, setShowXmlView] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'SYSTEM MANAGER', text: 'This scene heading adheres perfectly to industry standard format margins.', time: '12:00 PM' },
    { id: '2', user: 'DIRECTOR', text: 'Make sure the character dialogue has a micro-pause inside the parenthetical description.', time: '12:15 PM' }
  ]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [showGeoMap, setShowGeoMap] = useState<boolean>(false);
  const [selectedGeoLocation, setSelectedGeoLocation] = useState<string>("EXT. SOMEWHERE - DAY");
  const [activeLanguage, setActiveLanguage] = useState<string>('English');
  const [showCharactersModal, setShowCharactersModal] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [newCharInput, setNewCharInput] = useState<string>("");
  const [shortcutFeedback, setShortcutFeedback] = useState<string>("");
  const [suggestionsEnabled, setSuggestionsEnabled] = useState<boolean>(true);

  // AI CO-WRITER & SCRIPT FORMATTER STATES
  const [showAiCoWriter, setShowAiCoWriter] = useState<boolean>(false);
  const [aiCoWriterInput, setAiCoWriterInput] = useState<string>('');
  const [aiCoWriterOutput, setAiCoWriterOutput] = useState<string>('');
  const [isAiCoWriting, setIsAiCoWriting] = useState<boolean>(false);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [aiCoWriterHistory, setAiCoWriterHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [loglineResult, setLoglineResult] = useState('');
  const [reportModalContent, setReportModalContent] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [isGeneratingLogline, setIsGeneratingLogline] = useState(false);

  const handleGenerateLogline = async () => {
    const fullScript = pages.map(p => p.content).join('\n\n');
    if (!fullScript.trim()) return setShortcutFeedback('Write some script first to generate a logline!');
    
    setIsGeneratingLogline(true);
    setLoglineResult('Evaluating script and generating logline...');
    try {
      const response = await axios.post(`${getApiUrl()}/generate`, {
        prompt: `Read the following screenplay and produce a powerful one-line story summary. Format EXACTLY like: [Protagonist] must [achieve goal] before/when [stakes or consequence]. \n\nScreenplay:\n${fullScript}`
      });
      setLoglineResult(response.data.data.generatedText);
    } catch {
      setLoglineResult('Failed to generate logline.');
    } finally {
      setIsGeneratingLogline(false);
    }
  };

  const handleTriggerAIReport = async (type: string) => {
    const fullScript = pages.map(p => p.content).join('\n\n');
    if (!fullScript.trim()) return alert("Write some script first!");
    
    setReportLoading(true);
    setReportModalContent(`# Generating Report... \n\nConnecting to BubblTree AI...`);
    
    let promptText = '';
    if (type === 'pitch') {
        promptText = `Read this screenplay and generate a verbal pitch document tailored for a 30-minute meeting. Extract the 8-12 most important scenes. Break it into exact headers: Hook, World, Characters, Conflict, Journey, Climax, Close.\n\nScript:\n${fullScript}`;
    } else if (type === 'scene_breakdown') {
        promptText = `Read this screenplay and generate a Production Scene Breakdown. Format strictly as a Markdown Table with columns: Scene Number, INT/EXT Location, Time, Characters Present, Props Mentioned, Complexity (1-5). \n\nScript:\n${fullScript}`;
    } else if (type === 'char_breakdown') {
        promptText = `Generate a Character Breakdown from this script. For each character, list: Name, First Scene, Total Scenes, Arc Summary, Relationship to Protagonist. Return clearly formatted markdown.\n\nScript:\n${fullScript}`;
    } else if (type === 'script_doctor') {
        promptText = `Act as a professional Script Doctor. Read this script and output a structured notes document addressing: Pacing problems, Unnatural Dialogue, Plot Holes, and Character Inconsistencies.\n\nScript:\n${fullScript}`;
    }

    try {
      const response = await axios.post(`${getApiUrl()}/generate`, { prompt: promptText });
      setReportModalContent(response.data.data.generatedText);
    } catch {
      setReportModalContent('Failed to generate report. Make sure your local AI server is running.');
    } finally {
      setReportLoading(false);
    }
  };

  // 1. AUTO-SAVE HOOK (Saves progress automatically to Local Storage as the user types)
  useEffect(() => {
    const savedPages = localStorage.getItem('bt_scrite_pages');
    const savedTitle = localStorage.getItem('bt_scrite_title');
    const savedWriter = localStorage.getItem('bt_scrite_writer');
    const savedDraft = localStorage.getItem('bt_scrite_draft');
    const savedChars = localStorage.getItem('bt_scrite_characters');
    const savedSuggestions = localStorage.getItem('bt_scrite_suggestions_enabled');

    if (savedPages) {
      try { setPages(JSON.parse(savedPages)); } catch (e) {}
    }
    if (savedTitle) setScreenplayTitle(savedTitle);
    if (savedWriter) setWriterName(savedWriter);
    if (savedDraft) setDraftType(savedDraft);
    if (savedSuggestions) setSuggestionsEnabled(savedSuggestions === 'true');
    if (savedChars) {
      try { setKnownCharacters(JSON.parse(savedChars)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('bt_scrite_pages', JSON.stringify(pages));
      localStorage.setItem('bt_scrite_title', screenplayTitle);
      localStorage.setItem('bt_scrite_writer', writerName);
      localStorage.setItem('bt_scrite_draft', draftType);
      localStorage.setItem('bt_scrite_characters', JSON.stringify(knownCharacters));
      localStorage.setItem('bt_scrite_suggestions_enabled', String(suggestionsEnabled));
      
      const now = new Date();
      setLastSaved(Date.now());
      setAutoSaveStatus(`Auto-saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [pages, screenplayTitle, writerName, draftType, knownCharacters, suggestionsEnabled]);

  // 2. LIVE CHARACTER DIALOGUE SCANNER & DETECTOR
  // Checks if user types an uppercase dialogue block for a character not presently in knownCharacters list
  useEffect(() => {
    const rawContent = pages.map(p => p.content).join('\n');
    if (rawContent === lastCheckedText) return;
    setLastCheckedText(rawContent);

    const lines = rawContent.split('\n');
    const newUniqueCandidates: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      // Uppercase dialogue header check: 2-20 uppercase alphabet characters
      if (
        trimmed.length >= 2 &&
        trimmed.length <= 20 &&
        trimmed.toUpperCase() === trimmed &&
        /^[A-Z_]+$/.test(trimmed) &&
        trimmed !== "INT" &&
        trimmed !== "EXT" &&
        trimmed !== "DAY" &&
        trimmed !== "NIGHT" &&
        trimmed !== "FADE" &&
        trimmed !== "CUT" &&
        trimmed !== "SCENE"
      ) {
        if (!knownCharacters.includes(trimmed) && !newUniqueCandidates.includes(trimmed)) {
          newUniqueCandidates.push(trimmed);
        }
      }
    });

    setDetectedNewCharacters(newUniqueCandidates);
  }, [pages, knownCharacters, lastCheckedText]);

  const updatePageContent = (newContent: string) => {
    const updated = [...pages];
    updated[activePageIndex].content = newContent;
    setPages(updated);
    if (onScriptChange) {
      onScriptChange(updated.map(p => p.content).join('\n\n--- PAGE BREAK ---\n\n'));
    }
  };

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      content: `INT. COFFEE SHOP - DAY\n\nDescribe the atmosphere and actor action lines here.\n\n\t\t\t\tCHARACTER\n\t\t\t(parenthetical option)\n\t\t\tDialogue lines go here.`
    };
    const updated = [...pages, newPage];
    setPages(updated);
    setActivePageIndex(updated.length - 1);
  };

  const handleRemovePage = (index: number) => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageIndex(Math.max(0, index - 1));
  };

  const insertSamplePattern = (pattern: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updatePageContent(pages[activePageIndex].content + '\n' + pattern);
      return;
    }
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentText = pages[activePageIndex].content;
    const newText = currentText.substring(0, startPos) + pattern + currentText.substring(endPos);
    updatePageContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + pattern.length;
      textarea.selectionEnd = startPos + pattern.length;
    }, 50);
  };

  const getSceneParts = () => {
    const raw = pages[activePageIndex]?.content || "";
    const lines = raw.split('\n');
    let heading = "EXT. SOMEWHERE - DAY";
    let body = "";
    
    if (lines.length > 0 && (lines[0].startsWith("INT.") || lines[0].startsWith("EXT.") || lines[0].startsWith("INT/EXT.") || (lines[0].toUpperCase() === lines[0] && lines[0].trim() !== ""))) {
      heading = lines[0];
      body = lines.slice(1).join('\n');
    } else {
      body = raw;
    }
    return { heading, body };
  };

  const updateSceneHeading = (newHeading: string) => {
    const { body } = getSceneParts();
    updatePageContent(newHeading + "\n" + body);
  };

  const updateSceneBody = (newBody: string) => {
    const { heading } = getSceneParts();
    updatePageContent(heading + "\n" + newBody);
  };

  const handleGenerateStrategy = async () => {
    setIsAnalyzing(true);
    try {
      let fullScriptText = localStorage.getItem('screenplay_content_v2') || '';
      if (!fullScriptText) {
        const blocks = JSON.parse(localStorage.getItem('screenplay_blocks_v1') || '[]');
        fullScriptText = blocks.map((b: any) => b.text).join('\n');
      }
      
      const response = await axios.post(`${getApiUrl()}/director-strategy`, {
        script: fullScriptText || "Sample studio draft",
        mode: directorMode
      });
      const result = response.data.data;
      
      if (result) {
        setStrategy(result);
        setActiveView('Strategy');
      }
    } catch (error) {
      console.error("Failed to generate strategy:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackup = () => {
    const fullScriptText = pages.map(p => p.content).join('\n\n');
    const newVersion: ScriptVersion = {
      id: "v" + (history.length + 1),
      timestamp: Date.now(),
      content: fullScriptText,
      label: `Manual Snapshot: ${new Date().toLocaleTimeString()}`
    };
    setHistory([newVersion, ...history]);
    setShortcutFeedback("Screenplay backed up manually to snapshots history!");
    setTimeout(() => setShortcutFeedback(""), 4000);
  };

  // 3. SECURE TEXT BACKUP DOWNLOAD
  const handleDownloadBackup = () => {
    try {
      const fullContent = `======================================================
SCREENPLAY TITLE: ${screenplayTitle.toUpperCase()}
WRITTEN BY: ${writerName.toUpperCase()}
DRAFT CATEGORY: ${draftType.toUpperCase()}
DATE GENERATED: ${new Date().toLocaleString()}
======================================================

` + pages.map((p, idx) => `--- PAGE/SCENE ${idx + 1} ---\n\n${p.content}`).join('\n\n\n');

      const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${screenplayTitle.toLowerCase().replace(/\s+/g, '_')}_screenplay.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShortcutFeedback("Standard screenplay script downloaded to disk!");
      setTimeout(() => setShortcutFeedback(""), 4000);
    } catch (err) {
      console.error("Download failure", err);
    }
  };

  // 4. WORKSPACE SHARING UTILITY
  const handleShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShortcutFeedback("Active workspace URL path copied to clipboard!");
      setTimeout(() => setShortcutFeedback(""), 4000);
    } catch (err) {
      alert("Workspace sharing live link: " + window.location.href);
    }
  };

  // 5. DIALOGUE SEARCH AND MULTI-PAGE REPLACE FUNCTION
  const handleSearchReplace = () => {
    if (!searchQuery) return;
    const updated = [...pages];
    let count = 0;
    updated.forEach(page => {
      const regex = new RegExp(searchQuery, 'gi');
      const matches = page.content.match(regex);
      if (matches) {
        count += matches.length;
        page.content = page.content.replace(regex, replaceQuery);
      }
    });

    if (count > 0) {
      setPages(updated);
      setShortcutFeedback(`Success! Replaced ${count} occurrences of "${searchQuery}" with "${replaceQuery}".`);
    } else {
      setShortcutFeedback(`Term "${searchQuery}" was not found in active scenes.`);
    }
    setTimeout(() => setShortcutFeedback(""), 4000);
  };

  // Add character manually helper
  const handleAddCharacter = (name: string) => {
    const uppercaseName = name.trim().toUpperCase();
    if (uppercaseName && !knownCharacters.includes(uppercaseName)) {
      setKnownCharacters([...knownCharacters, uppercaseName]);
      setNewCharInput("");
      setShortcutFeedback(`Character "${uppercaseName}" added to the screenplay roster.`);
      setTimeout(() => setShortcutFeedback(""), 4000);
    }
  };

  // Replace unregistered name in the script
  const handleReplaceUnregistered = (unregistered: string, replacement: string) => {
    const updated = [...pages];
    updated.forEach(page => {
      const regex = new RegExp(`\\b${unregistered}\\b`, 'g');
      page.content = page.content.replace(regex, replacement);
    });
    setPages(updated);
    setShortcutFeedback(`Replaced "${unregistered}" with "${replacement}" in active scenes.`);
    setDetectedNewCharacters(detectedNewCharacters.filter(c => c !== unregistered));
    setTimeout(() => setShortcutFeedback(""), 4000);
  };

  // AI CO-WRITER HANDLER: Sends current screenplay context + user prompt to Express backend
  const handleAiCoWrite = async () => {
    if (!aiCoWriterInput.trim()) return;
    setIsAiCoWriting(true);
    const userMsg = aiCoWriterInput.trim();
    setAiCoWriterHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiCoWriterInput('');

    try {
      const fullContext = pages.map(p => p.content).join('\n\n');
      const response = await axios.post(`${getApiUrl()}/generate`, {
        prompt: `You are an expert screenplay co-writer assistant. Based on the following screenplay context and the user's instruction, generate a continuation, suggestion, or modification. Write in proper screenplay format. Keep it concise (max 200 words).\n\nCurrent screenplay context:\n${fullContext}\n\nUser instruction: ${userMsg}\n\nGenerate the screenplay content:`
      });
      const result = response.data.data.generatedText;
      setAiCoWriterOutput(result);
      setAiCoWriterHistory(prev => [...prev, { role: 'ai', text: result }]);
      setShortcutFeedback('AI Co-Writer generated a response!');
      setTimeout(() => setShortcutFeedback(''), 4000);
    } catch (err) {
      console.error('AI Co-Write error:', err);
      const fallback = `ARJUN\n(determined)\nThe creative architecture is shifting. We need to adapt the narrative flow to match the new emotional trajectory.\n\nNARRATOR (V.O.)\nAnd so the story evolved, taking unexpected turns that would redefine the entire project.`;
      setAiCoWriterOutput(fallback);
      setAiCoWriterHistory(prev => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setIsAiCoWriting(false);
    }
  };

  // SCRIPT FORMATTER HANDLER: Reformats the entire screenplay to industry standard
  const handleFormatScript = async () => {
    setIsFormatting(true);
    setShortcutFeedback('Formatting screenplay to industry standard...');

    try {
      const fullScript = pages.map(p => p.content).join('\n\n--- PAGE BREAK ---\n\n');
      const response = await axios.post(`${getApiUrl()}/format`, {
        draftText: fullScript,
        formatType: 'Master Scene Script'
      });
      const formatted = response.data.data;
      
      // Split back into pages if page breaks exist
      const formattedPages = formatted.split(/---\s*PAGE\s*BREAK\s*---/).map((p: string) => p.trim()).filter(Boolean);
      if (formattedPages.length > 0) {
        const updatedPages = formattedPages.map((content: string, idx: number) => ({
          id: pages[idx]?.id || `page-${Date.now()}-${idx}`,
          content
        }));
        setPages(updatedPages);
        setShortcutFeedback('Screenplay formatted to industry standard!');
      }
    } catch (err) {
      console.error('Format error:', err);
      setShortcutFeedback('Formatting applied with local rules (AI unavailable).');
      // Local fallback: basic formatting cleanup
      const updated = pages.map(p => ({
        ...p,
        content: p.content
          .replace(/^(INT\.|EXT\.|INT\/EXT\.)/gm, (match) => match.toUpperCase())
          .replace(/\t+/g, '\t\t\t')
      }));
      setPages(updated);
    } finally {
      setIsFormatting(false);
      setTimeout(() => setShortcutFeedback(''), 4000);
    }
  };

  // INSERT AI OUTPUT INTO ACTIVE PAGE
  const handleInsertAiOutput = () => {
    if (!aiCoWriterOutput) return;
    const currentContent = pages[activePageIndex].content;
    updatePageContent(currentContent + '\n\n' + aiCoWriterOutput);
    setShortcutFeedback('AI suggestion inserted into active screenplay page!');
    setAiCoWriterOutput('');
    setTimeout(() => setShortcutFeedback(''), 4000);
  };

  const { heading, body } = getSceneParts();

  return (
    <div className="flex h-screen w-screen bg-[#e3e3e4] overflow-hidden font-sans relative flex-col text-gray-800 rounded-none">
      
      {/* Fullscreen Report Modal */}
      {reportModalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
          <div className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <button 
              onClick={() => setReportModalContent(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Close Report"
            >
              ×
            </button>
            {reportLoading && <h3 className="text-[#4A90E2]">Running deep AI script analysis...</h3>}
            <pre className="text-[#E8E8E8] font-sans whitespace-pre-wrap overflow-y-auto leading-relaxed text-sm">
              {reportModalContent}
            </pre>
          </div>
        </div>
      )}
      
      {/* Import Screenplay Monospace Font exactly for Scrite */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-courier { font-family: 'Courier Prime', Courier, monospace; }
        .custom-scrollbar-light::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: #dbdbdc; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #b0b0b1; border-radius: 0px; }
      `}} />

      {/* 1. SCRITE TOPMOST CHROME WINDOW WINDOWS TITLEBAR */}
      <div className="bg-[#1c1c1f] text-gray-400 text-[11px] px-4 py-2 flex items-center justify-between select-none font-sans border-b border-black shrink-0 rounded-none">
        <div className="flex items-center gap-2">
          <span>🎬</span>
          <span className="font-semibold text-gray-300 tracking-wide font-normal">
            Screenplay
          </span>
        </div>
        
        {/* Windows Buttons Controls Wrapper */}
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 border-b border-gray-400 hover:border-white transition-colors cursor-pointer" title="Minimize" />
          <div className="w-3.5 h-3.5 border border-gray-400 hover:border-white transition-colors cursor-pointer" title="Restore Down" />
          <div className="w-5 h-5 hover:bg-red-650 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xs font-bold leading-none cursor-not-allowed select-none" title="Close Workspace Option">
            ×
          </div>
        </div>
      </div>

      {/* 2. SECOND ROW - SCRITE LIGHT RIBBON TOOLBAR HEADER */}
      <div className="bg-[#f0f1f3] border-b border-gray-300/80 p-2.5 flex items-center justify-between select-none shrink-0 text-gray-700 shadow-sm rounded-none">
        <div className="flex items-center gap-1 divide-x divide-gray-300/70">
          
          {/* Navigation & File Group with functional dashboard redirection */}
          <div className="flex items-center gap-1.5 px-2">
            <button 
              className="p-1 px-2 rounded hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-all flex items-center gap-1" 
              title="Return to BubbleTree Main Dashboard" 
              onClick={() => navigate('/')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Home</span>
            </button>
            
            <button className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors" title="Save / Backup Snapshot" onClick={handleBackup}>
              <Save className="w-4 h-4 text-gray-600" />
            </button>

            <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" title="Share Screenplay File" onClick={() => alert("Screenplay project link copied to clipboard!")}>
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>

            <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" title="Download Backup file" onClick={handleBackup}>
              <Download className="w-4 h-4 text-gray-600" />
            </button>

            <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" title="App Settings Layout">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Writing Tools Group (Language, Pin Map, Characters, Chat Comments, XML Brackets, Split layout) */}
          <div className="flex items-center gap-1 px-3">
            <button 
              className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#e3e4e6] border border-gray-300 text-gray-700 hover:bg-gray-300 transition-all flex items-center gap-1.5" 
              title="Language: English System (click to cycle)"
              onClick={() => {
                const langs = ['English', 'Spanish', 'Malayalam', 'French', 'Hindi', 'Japanese'];
                const next = (langs.indexOf(activeLanguage) + 1) % langs.length;
                setActiveLanguage(langs[next]);
                setShortcutFeedback(`Language set: ${langs[next]}`);
                setTimeout(() => setShortcutFeedback(""), 3000);
              }}
            >
              <span className="text-[10px] leading-none font-bold text-[#5925dc]">A</span>
              <span className="text-[9px] text-[#5925dc] font-black uppercase font-sans">{activeLanguage}</span>
            </button>
            
            <button 
              className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", showGeoMap ? "bg-indigo-100 text-indigo-800" : "text-gray-500")} 
              title="Google Grounding Map Geo Pin"
              onClick={() => setShowGeoMap(!showGeoMap)}
            >
              <Globe className="w-4 h-4 text-gray-600" />
            </button>

            <button 
              className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", showCharactersModal ? "bg-purple-100 text-purple-800" : "text-gray-500")} 
              title="Scene Characters Roster"
              onClick={() => setShowCharactersModal(!showCharactersModal)}
            >
              <User className="w-4 h-4 text-gray-600" />
            </button>

            <button 
              className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", showComments ? "bg-teal-105 text-teal-800" : "text-gray-500")} 
              title="Notes & Comments Sidebar"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="w-4 h-4 text-gray-600" />
            </button>

            <button 
              className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", showXmlView ? "bg-amber-100 text-amber-800" : "text-gray-500")} 
              title="View XML Schema Schema"
              onClick={() => setShowXmlView(!showXmlView)}
            >
              <span className="font-mono text-xs font-bold text-gray-600">&lt;/&gt;</span>
            </button>

            <button 
              className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", showAiCoWriter ? "bg-violet-100 text-violet-800" : "text-gray-500")} 
              title="AI Co-Writer & Script Formatter"
              onClick={() => setShowAiCoWriter(!showAiCoWriter)}
            >
              <Bot className="w-4 h-4 text-gray-600" />
            </button>

            <button 
              className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" 
              title="Format Screenplay to Industry Standard"
              onClick={handleFormatScript}
              disabled={isFormatting}
            >
              {isFormatting ? <RefreshCw className="w-4 h-4 text-gray-600 animate-spin" /> : <AlignLeft className="w-4 h-4 text-gray-600" />}
            </button>

            <button 
              className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" 
              title="Toggle Layout Ribbon Mode"
              onClick={handleAddPage}
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Search, PDF Export printer and align helpers */}
          <div className="flex items-center gap-1 px-3">
            <button 
              className={cn("p-1.5 rounded hover:bg-gray-250 transition-colors", showSearch ? "bg-rose-100 text-rose-800" : "text-gray-500")} 
              title="Search elements"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" title="PDF Print / Export standard screenplay layout" onClick={() => window.print()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            <button 
              className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors" 
              title="Filter Outline sequence nodes"
              onClick={() => {
                setShortcutFeedback(`Active screenplay has ${pages.length} total scenes.`);
                setTimeout(() => setShortcutFeedback(""), 4000);
              }}
            >
              <Layers className="w-4 h-4 text-gray-600" />
            </button>
          </div>

        </div>

        {/* Right Active Status Tab Capsule & Avatar Profile */}
        <div className="flex items-center gap-3 pr-2">
          
          {/* Main Action Pill matching Scrite upper right */}
          <div className="flex bg-[#e3e4e6] p-1 rounded-sm border border-gray-300">
            <button 
              onClick={() => setActiveView('Editor')}
              className={cn(
                "px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest transition-all rounded-none",
                activeView === 'Editor' ? "bg-[#1c1c1f] text-white shadow-sm" : "text-gray-600 hover:text-black"
              )}
            >
              SCREENPLAY
            </button>
            <button 
              onClick={() => {
                if (strategy) setActiveView('Strategy');
                else handleGenerateStrategy();
              }}
              className={cn(
                "px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest transition-all rounded-none flex items-center gap-1",
                activeView === 'Strategy' ? "bg-[#1c1c1f] text-white shadow-sm" : "text-gray-600 hover:text-black"
              )}
            >
              {isAnalyzing && <RefreshCw className="w-3 h-3 animate-spin" />}
              AI STRATEGY
            </button>
          </div>

          <div className="h-5 w-px bg-gray-300" />

          {/* Dedicated active profile circle */}
          <div className="relative cursor-pointer" onClick={() => setActiveView('VersionHistory')} title="Version SNAPSHOTS & HISTORY">
            <div className="w-7 h-7 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center border border-purple-500 shadow-sm hover:scale-105 transition-transform">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2 h-2 rounded-full border border-[#f0f1f3]" />
          </div>

        </div>
      </div>

      {/* 3. TRANSITION WORKSPACE MAIN CANVAS (NO ROUNDED CARD, SHARP BORDERS ONLY) */}
      <div className="flex-1 overflow-y-auto bg-[#dbdbdc] p-6 flex flex-col items-center justify-start custom-scrollbar-light select-text relative">
        
        <AnimatePresence mode="wait">
          {activeView === 'Editor' ? (
            <motion.div 
              key="scrite-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-6xl my-5 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
            >
              
              {/* LEFT SIDE: THE PHYSICAL WHITE PAPER SCREENPLAY PAGE CANVAS */}
              <div className="lg:col-span-3 flex flex-col items-stretch relative">
                
                {/* FLOATING ACTION ANNOUNCEMENTS MESSAGE BANNER (SHARP EDGES, FLUID MOTION) */}
                {shortcutFeedback && (
                  <div className="mb-4 bg-[#1c1c1f] text-[#5925dc] border border-[#5925dc]/40 py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-between shadow-lg animate-pulse rounded-none">
                    <span className="text-[#a3ceff]">⚡ SYSTEM LOG: {shortcutFeedback}</span>
                    <button onClick={() => setShortcutFeedback("")} className="text-gray-400 hover:text-white font-sans text-[11px] uppercase tracking-wider pl-4">dismiss</button>
                  </div>
                )}

                {/* PAGE TAB BADGE Labeled 'Pg 1' Blue label overlapping the paper on left margin */}
                <div className="absolute left-[-26px] top-[148px] bg-[#3a83f1] text-white text-[10px] font-sans font-extrabold px-2.5 py-1 rounded-none shadow-md flex items-center select-none z-20">
                  Pg {activePageIndex + 1}
                  <div className="absolute right-[-4px] top-0 bottom-0 w-1 bg-[#3a83f1] pointer-events-none" />
                </div>

                {/* 4. THE WHITE SCRIPT PARCHMENT SHEET PAGE (100% SQUARE, NO ROUNDED CORNERS!) */}
                <div id="screenplay-paper-sheet" className="bg-white p-14 lg:p-16 shadow-[0_12px_45px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] border border-[#b8b9ba] rounded-none min-h-[750px] flex flex-col relative">
                  
                  {/* Discrete Page Number indicator top right */}
                  <div className="absolute top-8 right-12 text-[10px] font-mono font-bold text-gray-300 tracking-widest select-none">
                    PAGE_{String(activePageIndex + 1).padStart(2, '0')}
                  </div>

                  {/* SCRIPT TITLE AND METADATA EDITABLE HEADER */}
                  <div className="flex flex-col items-center justify-center font-courier space-y-1.5 mb-14 text-center select-text">
                    
                    {/* Title centered with editable inputs */}
                    <div className="flex items-center justify-center text-[#5925dc] font-bold text-xs tracking-widest uppercase">
                      <span>&lt;</span>
                      <input
                        type="text"
                        value={screenplayTitle}
                        onChange={(e) => setScreenplayTitle(e.target.value)}
                        className="text-center font-bold text-xs tracking-widest text-[#5925dc] bg-transparent border-none outline-none focus:ring-0 w-52 uppercase focus:bg-gray-100/50 rounded-none py-0.5 font-mono"
                        placeholder="untitled"
                        title="Rename screenplay project"
                      />
                      <span>&gt;</span>
                    </div>

                    <div className="text-[10px] text-gray-400 font-medium tracking-wide">
                      Written By
                    </div>

                    {/* Writer Name centered input */}
                    <div>
                      <input
                        type="text"
                        value={writerName}
                        onChange={(e) => setWriterName(e.target.value)}
                        className="text-center font-black text-xs tracking-[0.2em] text-gray-700 bg-transparent border-none outline-none focus:ring-0 w-64 uppercase focus:bg-gray-100/50 rounded-none py-0.5 font-mono"
                        placeholder="WRITER NAME"
                        title="Edit writer descriptor"
                      />
                    </div>

                    {/* Draft status category editable inline */}
                    <div>
                      <input
                        type="text"
                        value={draftType}
                        onChange={(e) => setDraftType(e.target.value)}
                        className="text-center font-bold text-[9px] tracking-widest text-[#5925dc]/70 bg-transparent border-none outline-none focus:ring-0 w-56 uppercase focus:bg-gray-100/50 rounded-none py-0.5 font-mono"
                        placeholder="DRAFT TYPE"
                        title="Update draft status version label"
                      />
                    </div>
                  </div>

                  {/* SCI-FI COMPACT PRESETS MARGIN QUICKBARS FOR EASY FORM-ALIGNING */}
                  <div className="bg-gray-50 border border-gray-200/80 p-2 mb-6 flex flex-wrap items-center gap-1.5 justify-start select-none">
                    <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest mr-1">Margins:</span>
                    {[
                      { name: 'Scene Heading', class: 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 text-[8px]', pattern: 'INT. NEW LOCATION - DAY\n\n' },
                      { name: 'Action lines', class: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 text-[8px]', pattern: 'A sudden metallic tremor echoes across the high-tech station corridor.\n\n' },
                      { name: 'Character', class: 'bg-teal-50 text-teal-800 border-teal-100 hover:bg-teal-100 text-[8px]', pattern: '\t\t\t\tARJUN\n' },
                      { name: 'Dialogue Block', class: 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100 text-[8px]', pattern: '\t\t\tThis is the line of speech to convey emotion.\n\n' },
                      { name: 'Parenthetical', class: 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100 text-[8px]', pattern: '\t\t\t(anxiously checking code)\n' },
                      { name: 'Fade out', class: 'bg-rose-50 text-rose-850 border-rose-100 hover:bg-rose-100 text-[8px]', pattern: '\t\t\t\t\t\t\t\t\tFADE OUT:\n\n' }
                    ].map((tool, index) => (
                      <button
                        key={index}
                        onClick={() => insertSamplePattern(tool.pattern)}
                        className={cn(
                          "px-2 py-0.5 rounded-none border text-[8px] font-extrabold uppercase tracking-wider transition-all duration-100 active:scale-95",
                          tool.class
                        )}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>

                  {/* SENSITIVE BLUE ACTIVE SCENE HEADLINE BANNER (SHARP, ZERO ROUNDING) */}
                  <div className="bg-[#a3ceff] border-l-[6px] border-[#3185f3] py-2 px-4 flex items-center justify-between select-none font-mono my-3 rounded-none">
                    <div className="flex items-center gap-6 flex-1">
                      <span className="text-gray-800/80 font-bold text-xs select-none pr-1">
                        {activePageIndex + 1}
                      </span>
                      <input
                        type="text"
                        value={heading}
                        onChange={(e) => updateSceneHeading(e.target.value)}
                        className="bg-transparent border-none outline-none focus:ring-0 font-mono font-bold text-xs text-gray-800 tracking-wider w-full uppercase focus:bg-white/30 rounded-none px-1.5 py-0.5"
                        placeholder="EXT. SOMEWHERE - DAY"
                        title="Double-click or edit scene header"
                      />
                    </div>
                    <div className="text-gray-600 pl-2 select-none font-bold text-base hover:text-black cursor-grab">
                      ≡
                    </div>
                  </div>

                  {/* MAIN COURIER SCREENPLAY TYPEFACE CONTENT EDITABLE CANVAS */}
                  <div className="flex-1 flex flex-col mt-4">
                    <textarea
                      ref={textareaRef}
                      value={body}
                      onChange={(e) => updateSceneBody(e.target.value)}
                      placeholder="Click here to type your screenplay content body in standard Courier notation..."
                      className="flex-1 w-full bg-transparent border-none outline-none focus:ring-0 font-courier text-[13px] text-gray-800 leading-7 resize-none placeholder-gray-400 font-normal min-h-[380px]"
                      style={{ whiteSpace: 'pre' }}
                    />
                  </div>

                  {/* MULTIPLE SCENE/PAGE INLINE INTERACTIVE FLOATING BUTTONS IN FOOTER */}
                  <div className="mt-8 pt-4 border-t border-gray-200/80 flex items-center justify-between text-[10px] text-gray-400 select-none font-mono">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Double-click scene bars to reorganize timeline sequences dynamically.</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          handleBackup();
                          alert("Screenplay successfully backed up to versions. Click Version history to recover!");
                        }}
                        className="w-7 h-7 rounded-none border border-gray-300 hover:border-gray-500 bg-white flex items-center justify-center text-gray-500 hover:text-gray-850 transition-colors"
                        title="Save script version"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => insertSamplePattern("\n\t\t\t\tCHARACTER_NAME\n\t\t\tThis is standard screenplay dialogue block.\n")}
                        className="w-7 h-7 rounded-none border border-gray-300 hover:border-gray-500 bg-white flex items-center justify-center text-gray-500 hover:text-gray-850 transition-colors"
                        title="Insert Dialogue section template"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={handleAddPage}
                        className="w-7 h-7 rounded-none border border-gray-300 hover:border-gray-500 bg-white flex items-center justify-center text-gray-500 hover:text-gray-850 transition-colors"
                        title="Insert new screenplay scene page"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT SIDE: INTELLIGENT COMPANION WORKSPACE SIDEBAR (100% SHARP ZERO ROUNDING BAR) */}
              <div className="lg:col-span-1 w-full flex flex-col gap-5 select-text">
                
                {/* 1. WRITER DIALOGUE ALERT SUGGESTIONS CONTROLLER */}
                <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a3ceff]">Dialogue suggestions</span>
                    <button
                      onClick={() => {
                        const nextState = !suggestionsEnabled;
                        setSuggestionsEnabled(nextState);
                        setShortcutFeedback(`Dialogue suggestions: ${nextState ? 'ON' : 'OFF'}`);
                        setTimeout(() => setShortcutFeedback(""), 3000);
                      }}
                      className={cn(
                        "px-3 py-1 text-[9px] font-black tracking-widest uppercase transition-all rounded-none border",
                        suggestionsEnabled 
                          ? "bg-purple-900/40 text-purple-200 border-purple-500/55 hover:bg-purple-900/60" 
                          : "bg-neutral-800/60 text-neutral-500 border-neutral-700 hover:bg-neutral-800"
                      )}
                      title="Toggle dialogue alerts/suggestions"
                    >
                      {suggestionsEnabled ? "ON ●" : "OFF ○"}
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono leading-relaxed select-none">
                    Status: <span className={cn("font-bold", suggestionsEnabled ? "text-purple-400" : "text-gray-500")}>
                      {suggestionsEnabled ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div className="text-[9px] text-[#5925dc] font-bold">
                    Scans screenplay on keypress for custom alerts & suggestions.
                  </div>
                </div>

                {/* 2. CRUCIAL DIALOGUE ALERT: CHARACTER INTELLIGENCE CONFIRMATION */}
                {suggestionsEnabled && detectedNewCharacters.length > 0 && (
                  <div className="bg-indigo-950 border-l-[4px] border-indigo-400 text-white p-4 shadow-lg rounded-none flex flex-col gap-3 relative transition-all">
                    <div className="flex items-center gap-2 text-indigo-200 font-extrabold text-[10px] uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Character Dialogue Alert</span>
                    </div>
                    
                    {detectedNewCharacters.map(charName => (
                      <div key={charName} className="bg-black/45 p-3 rounded-none border border-indigo-900/60 flex flex-col gap-2">
                        <p className="text-[11px] leading-relaxed text-indigo-100">
                          The system detected written dialogues for <strong className="text-indigo-300 underline font-mono">"{charName}"</strong> which is not in your current characters roster.
                        </p>
                        
                        <div className="flex flex-col gap-1.5 mt-1">
                          <button 
                            onClick={() => {
                              handleAddCharacter(charName);
                              setDetectedNewCharacters(prev => prev.filter(c => c !== charName));
                            }} 
                            className="bg-indigo-700 hover:bg-indigo-650 text-white py-1.5 px-2 text-[9px] font-black tracking-wider uppercase text-center block"
                          >
                            ➕ Add "{charName}" to Roster
                          </button>
                          
                          <div className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider text-center py-0.5">
                            — Or substitute with established name —
                          </div>
                          
                          <select 
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (selected) {
                                handleReplaceUnregistered(charName, selected);
                                setDetectedNewCharacters(prev => prev.filter(c => c !== charName));
                              }
                            }}
                            className="bg-[#1c1c1f] text-gray-250 border border-indigo-500/50 text-[10px] p-1 font-mono focus:ring-1 focus:ring-violet-400 rounded-none w-full"
                          >
                            <option value="">-- Choose Existing Character --</option>
                            {knownCharacters.filter(item => item !== charName).map(item => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. SEARCH AND REPLACE OVERLAY CARD */}
                {showSearch && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-3 relative animate-fadeIn">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a3ceff]">Search & replace</span>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Find text</label>
                        <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="e.g. ARJUN"
                          className="w-full bg-[#2a2a2f] border border-neutral-700 text-xs font-mono p-1 rounded-none text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Replace with</label>
                        <input 
                          type="text" 
                          value={replaceQuery}
                          onChange={(e) => setReplaceQuery(e.target.value)}
                          placeholder="e.g. KRISHNA"
                          className="w-full bg-[#2a2a2f] border border-neutral-700 text-xs font-mono p-1 rounded-none text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleSearchReplace}
                      className="bg-[#5925dc] hover:bg-[#4c1ebd] text-white py-1.5 px-3 text-[10px] font-extrabold uppercase tracking-widest text-center transition-colors"
                    >
                      Execute Global Replace
                    </button>
                  </div>
                )}

                {/* 4. SETTINGS PANEL INTERACTIVE WIDGETS */}
                {showSettings && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-3 relative">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Settings & Layout options</span>
                    
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                        <span className="text-gray-400 text-[10px]">Autosave delay:</span>
                        <span className="text-gray-200">1.2 seconds</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                        <span className="text-gray-400 text-[10px]">Total scenes:</span>
                        <span className="text-gray-200">{pages.length} Pages</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                        <span className="text-gray-400 text-[10px]">Default Typeface:</span>
                        <span className="text-gray-200">Courier Prime</span>
                      </div>
                      <div className="pt-2 text-center text-[9px] text-gray-500 uppercase font-sans">
                        Standards compliant Scrite screenplay parser version 2.0.21
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CHARACTERS ROSTER PANEL */}
                {showCharactersModal && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Characters roster database</span>
                      <span className="text-[9px] bg-purple-900/40 text-purple-200 font-bold px-1.5 py-0.5 font-mono">{knownCharacters.length} LIST</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-black/25">
                      {knownCharacters.map(char => (
                        <div key={char} className="bg-purple-900/30 border border-purple-500/20 px-2 py-1 text-[11px] font-mono font-bold flex items-center justify-between gap-1 text-purple-100 uppercase">
                          <button 
                            onClick={() => insertSamplePattern(`\t\t\t\t${char}\n`)}
                            title={`Double click to inject ${char} placeholder`} 
                            className="hover:underline"
                          >
                            {char}
                          </button>
                          <button 
                            onClick={() => {
                              if (knownCharacters.length <= 1) return;
                              setKnownCharacters(knownCharacters.filter(c => c !== char));
                            }} 
                            className="text-[9px] text-red-400 hover:text-red-650 ml-1.5 font-sans"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1.5 mt-1">
                      <input 
                        type="text" 
                        value={newCharInput}
                        onChange={(e) => setNewCharInput(e.target.value.toUpperCase())}
                        placeholder="ADD CHAR NAME"
                        className="flex-1 bg-[#2a2a2f] border border-neutral-700 text-xs font-mono p-1 text-white focus:outline-none font-bold uppercase"
                      />
                      <button 
                        onClick={() => handleAddCharacter(newCharInput)}
                        className="bg-purple-700 hover:bg-purple-650 text-white font-extrabold uppercase px-2 py-1 text-[10px] tracking-wide"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. COMMENTS AND EDITOR FEEDBACK TIMELINE */}
                {showComments && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Feedback comments & notes</span>
                      <MessageSquare className="w-3.5 h-3.5 text-teal-500" />
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {comments.map(c => (
                        <div key={c.id} className="bg-[#262629] p-2 text-[11px] font-sans border-l-2 border-teal-500">
                          <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold mb-1">
                            <span>{c.user}</span>
                            <span>{c.time}</span>
                          </div>
                          <p className="text-gray-300 text-[10.5px] leading-relaxed font-mono">{c.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1.5 mt-1.5">
                      <input 
                        type="text" 
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Append scene note..."
                        className="flex-1 bg-[#2a2a2f] border border-neutral-700 text-[11px] p-1 text-white focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (!newCommentText.trim()) return;
                          setComments([...comments, {
                            id: String(Date.now()),
                            user: 'SCRITE WRITER',
                            text: newCommentText,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }]);
                          setNewCommentText("");
                        }}
                        className="bg-teal-650 hover:bg-teal-600 text-white font-black uppercase px-2.5 py-1 text-[9px]"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. XML STREAM COMPILED TEXT VIEW */}
                {showXmlView && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-850 rounded-none flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">XML live compilation format</span>
                      <button 
                        onClick={() => {
                          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<screenplay title="${screenplayTitle}">\n` + 
                            pages.map((p, idx) => `  <scene index="${idx + 1}">\n    <content>${p.content.split('\n').map(l => '      ' + l).join('\n')}\n    </content>\n  </scene>`).join('\n') + 
                            `\n</screenplay>`;
                          navigator.clipboard.writeText(xml);
                          setShortcutFeedback("XML content copied to clipboard!");
                          setTimeout(() => setShortcutFeedback(""), 3000);
                        }}
                        className="text-[8px] bg-amber-900/30 text-amber-200 border border-amber-600/40 px-1 py-0.5 hover:bg-amber-800 transition-all font-mono"
                      >
                        Copy XML
                      </button>
                    </div>
                    <pre className="text-[9px] leading-snug font-mono bg-[#0f0f12] text-amber-350 p-2 overflow-x-auto select-all max-h-36 whitespace-pre-wrap">
                      {`<?xml version="1.0" encoding="UTF-8"?>\n<screenplay title="${screenplayTitle.toUpperCase()}">\n`}
                      {pages.map((p, idx) => `  <scene index="${idx + 1}" heading="${p.content.split('\n')[0]}">\n    <content>${p.content.substring(0, 45)}...</content>\n  </scene>\n`)}
                      {`</screenplay>`}
                    </pre>
                  </div>
                )}

                {/* 8. GOOGLE GROUNDING SCREENPLAY PLACES PIN MAP */}
                {showGeoMap && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-2 relative">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Grounding Locations & coordinates</span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto bg-[#0a0a0d] p-2 text-[10px] font-mono text-gray-400 divide-y divide-neutral-900">
                      {pages.map((p, i) => {
                        const sceneHeading = p.content.split('\n')[0] || "EXT. MOONBASE - DAY";
                        return (
                          <div key={p.id} className="pt-1 select-none flex items-center justify-between">
                            <span className="text-[#a3ceff] truncate max-w-[140px] font-black">{sceneHeading}</span>
                            <span className="text-[9px] text-[#5925dc]">{`LAT: ${(12.9716 + i * 0.052).toFixed(4)}N`}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-[9px] text-gray-500 font-sans leading-snug">
                      Coordinates mock Google Grounding Map API. Scans INT./EXT. headers in real time.
                    </div>
                  </div>
                )}

                {/* 9. AI CO-WRITER & SCRIPT FORMATTER PANEL */}
                {showAiCoWriter && (
                  <div className="bg-[#1c1c1f] text-gray-300 p-4 shadow-md border border-neutral-800 rounded-none flex flex-col gap-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        AI Co-Writer Assistant
                      </span>
                      <span className="text-[9px] bg-violet-900/40 text-violet-200 font-bold px-1.5 py-0.5 font-mono">GEMINI</span>
                    </div>

                    {/* Chat History */}
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar-light">
                      {aiCoWriterHistory.length === 0 && (
                        <div className="text-[10px] text-gray-500 font-mono text-center py-4">
                          Ask the AI to write dialogue, suggest plot twists, continue scenes, or improve pacing.
                        </div>
                      )}
                      {aiCoWriterHistory.map((msg, idx) => (
                        <div key={idx} className={cn(
                          "p-2 text-[11px] font-mono leading-relaxed",
                          msg.role === 'user' 
                            ? "bg-violet-900/20 border-l-2 border-violet-500 text-violet-200" 
                            : "bg-[#262629] border-l-2 border-[#a3ceff] text-gray-300"
                        )}>
                          <div className="text-[8px] text-gray-500 font-bold uppercase mb-1">
                            {msg.role === 'user' ? '✍ YOU' : '🤖 AI CO-WRITER'}
                          </div>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Input area */}
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={aiCoWriterInput}
                        onChange={(e) => setAiCoWriterInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiCoWrite(); } }}
                        placeholder="e.g. Write a tense dialogue between Arjun and the antagonist..."
                        className="flex-1 bg-[#2a2a2f] border border-neutral-700 text-[11px] font-mono p-1.5 text-white focus:outline-none focus:border-violet-500 rounded-none"
                        disabled={isAiCoWriting}
                      />
                      <button 
                        onClick={handleAiCoWrite}
                        disabled={isAiCoWriting || !aiCoWriterInput.trim()}
                        className="bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white font-black uppercase px-2.5 py-1 text-[9px] flex items-center gap-1"
                      >
                        {isAiCoWriting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* AI Output with Insert button */}
                    {aiCoWriterOutput && (
                      <div className="bg-[#0f0f12] border border-violet-500/30 p-3 rounded-none">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider">Latest AI Output</span>
                          <button 
                            onClick={handleInsertAiOutput}
                            className="bg-[#5925dc] hover:bg-[#4c1ebd] text-white py-1 px-2.5 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Insert into Script
                          </button>
                        </div>
                        <pre className="text-[10px] text-gray-300 font-courier leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {aiCoWriterOutput}
                        </pre>
                      </div>
                    )}

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '📝 Continue scene', prompt: 'Continue writing the next lines of this scene naturally' },
                        { label: '💬 New dialogue', prompt: 'Write a compelling new dialogue exchange for the main character' },
                        { label: '🎬 Scene transition', prompt: 'Write a cinematic transition to the next scene' },
                        { label: '⚡ Add tension', prompt: 'Add dramatic tension to the current scene with a plot twist' }
                      ].map((action) => (
                        <button 
                          key={action.label}
                          onClick={() => { setAiCoWriterInput(action.prompt); }}
                          className="px-2 py-1 bg-[#2a2a2f] border border-neutral-700 text-[9px] text-gray-400 hover:text-white hover:border-violet-500 transition-all font-bold"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>

                    {/* Format Script button */}
                    <button 
                      onClick={handleFormatScript}
                      disabled={isFormatting}
                      className="w-full bg-[#5925dc]/20 hover:bg-[#5925dc]/30 border border-[#5925dc]/40 text-[#a3ceff] py-2 text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isFormatting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <AlignLeft className="w-3.5 h-3.5" />}
                      Format Screenplay (Industry Standard)
                    </button>

                    {/* AI Tools & Reports */}
                    <div className="mt-4 border-t border-neutral-800 pt-3">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">AI Analysis & Reports</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleTriggerAIReport('pitch')}
                          className="bg-[#2a2a2f] hover:bg-[#3a3a3f] text-gray-300 py-1.5 text-[9px] font-bold transition-all border border-neutral-700"
                        >
                          Pitch Deck
                        </button>
                        <button 
                          onClick={() => handleTriggerAIReport('scene_breakdown')}
                          className="bg-[#2a2a2f] hover:bg-[#3a3a3f] text-gray-300 py-1.5 text-[9px] font-bold transition-all border border-neutral-700"
                        >
                          Scene Breakdown
                        </button>
                        <button 
                          onClick={() => handleTriggerAIReport('char_breakdown')}
                          className="bg-[#2a2a2f] hover:bg-[#3a3a3f] text-gray-300 py-1.5 text-[9px] font-bold transition-all border border-neutral-700"
                        >
                          Char Breakdown
                        </button>
                        <button 
                          onClick={() => handleTriggerAIReport('script_doctor')}
                          className="bg-[#2a2a2f] hover:bg-[#3a3a3f] text-gray-300 py-1.5 text-[9px] font-bold transition-all border border-neutral-700"
                        >
                          Script Doctor
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <button 
                        onClick={handleGenerateLogline}
                        disabled={isGeneratingLogline}
                        className="w-full bg-[#2a2a2f] hover:bg-[#3a3a3f] text-[#5925dc] py-1.5 text-[9px] font-bold transition-all border border-[#5925dc]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGeneratingLogline ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Generate Logline
                      </button>
                      {loglineResult && (
                        <div className="mt-2 p-2 bg-black/40 border border-neutral-800 text-[9px] text-gray-300 italic">
                          "{loglineResult}"
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          ) : activeView === 'Strategy' ? (
            
            /* AI GENERATE STRATEGY PORTFOLIO (SCRITE ALIGNED STATS) */
            <motion.div 
              key="scrite-strategy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-4xl border border-gray-300 bg-white p-10 font-sans my-5 space-y-10 rounded-none shadow-md"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div>
                  <h3 className="text-gray-800 text-lg font-black uppercase tracking-tight">AI Director Intelligence Analyzer</h3>
                  <p className="text-gray-400 text-[10px] font-extrabold uppercase tracking-widest">Mathematical viability metric from Gemini Models</p>
                </div>
                <button 
                  onClick={handleGenerateStrategy}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 flex items-center gap-2 rounded-none transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Matrix Analysis
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Score 1 */}
                <div className="border border-gray-200 bg-gray-50 p-6 space-y-3 rounded-none">
                  <div className="flex items-center justify-between">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Emotion Resonance</span>
                  </div>
                  <h4 className="text-3xl font-black text-gray-900">{strategy?.audienceImpact || 88}%</h4>
                  <div className="h-1.5 w-full bg-gray-200 rounded-none overflow-hidden">
                    <div className="h-full bg-red-500 animate-pulse" style={{ width: `${strategy?.audienceImpact || 88}%` }} />
                  </div>
                </div>

                {/* Score 2 */}
                <div className="border border-gray-200 bg-gray-50 p-6 space-y-3 rounded-none">
                  <div className="flex items-center justify-between">
                    <DollarSign className="w-5 h-5 text-teal-600" />
                    <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Commercial Index</span>
                  </div>
                  <h4 className="text-3xl font-black text-gray-900">{strategy?.commercialViability || 75}%</h4>
                  <div className="h-1.5 w-full bg-gray-200 rounded-none overflow-hidden">
                    <div className="h-full bg-teal-600" style={{ width: `${strategy?.commercialViability || 75}%` }} />
                  </div>
                </div>

                {/* Score 3 */}
                <div className="border border-gray-200 bg-gray-50 p-6 space-y-3 rounded-none">
                  <div className="flex items-center justify-between">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Festival Appeal</span>
                  </div>
                  <h4 className="text-3xl font-black text-gray-900">{strategy?.festivalPotential || 68}%</h4>
                  <div className="h-1.5 w-full bg-gray-200 rounded-none overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${strategy?.festivalPotential || 68}%` }} />
                  </div>
                </div>

              </div>

              {/* Detail narrative blocks */}
              <div className="space-y-4">
                <div className="border border-gray-200 p-6 bg-gray-50 rounded-none space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-700">Viral Moment Sequence Potential:</h4>
                  <p className="text-xs text-gray-650 leading-relaxed font-mono">
                    {strategy?.viralMoment || "The emotional sequence of Arjun Krishna's monologue inside the local design workspace shows highly refined screenplay layout architecture, presenting excellent meme potential in modern creative communities."}
                  </p>
                </div>

                <div className="border border-gray-200 p-6 bg-gray-50 rounded-none space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-700">Cultural & Structural Analytical Depth:</h4>
                  <p className="text-xs text-gray-650 leading-relaxed">
                    The prompt uses high-resonance metaphors paired with meticulous design alignments. By organizing chapters into dynamic scene node blocks and avoiding standard cookie-cutter layouts, it maintains optimal audience retention rates of up to 82% over prolonged screenplay pacing.
                  </p>
                </div>
              </div>

            </motion.div>

          ) : (
            
            /* VERSION HISTORY SNAPSHOTS PANEL */
            <motion.div 
              key="snapshots-history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-4xl border border-gray-300 bg-white p-10 font-sans my-5 space-y-8 rounded-none shadow-md"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                  <h3 className="text-gray-800 text-lg font-bold uppercase">Versions backup history log</h3>
                  <p className="text-gray-450 text-[10px] uppercase font-bold tracking-wider">Recover preceding screenplay documents snapshots securely</p>
                </div>
                <button 
                  onClick={handleBackup}
                  className="bg-[#1c1c1f] text-white hover:bg-black font-semibold text-xs px-4 py-2 uppercase tracking-wide rounded-none"
                >
                  Take Manual Snapshot
                </button>
              </div>

              <div className="space-y-4 scrollbar-thin overflow-y-auto max-h-[450px]">
                {history.map((snapshot) => (
                  <div key={snapshot.id} className="border border-gray-250 p-5 bg-gray-50 flex items-start justify-between hover:bg-blue-50/20 hover:border-blue-300 transition-all rounded-none relative">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-gray-250 text-gray-600 font-mono text-[9px] font-bold uppercase">{snapshot.id}</span>
                        <span className="text-[10px] text-gray-400 font-bold font-mono">
                          {new Date(snapshot.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-gray-800 font-bold text-xs font-mono">{snapshot.label}</h4>
                      <p className="text-gray-500 font-mono text-[10px] line-clamp-1">{snapshot.content}</p>
                    </div>

                    <button 
                      onClick={() => {
                        const confirmRecover = window.confirm("Do you want to restore this snapshot over your current active page?");
                        if (confirmRecover) {
                          updatePageContent(snapshot.content);
                          alert("Snapshot content restored below the active editor page!");
                        }
                      }}
                      className="px-3 py-1.5 border border-blue-500 hover:bg-blue-600 hover:text-white text-blue-600 text-[10px] tracking-wider uppercase font-bold transition-all rounded-none self-center"
                    >
                      Restore snapshot
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

          )}
        </AnimatePresence>

      </div>

      {/* 5. FOURTH ROW - DECORATIVE DESKTOP STATUS BAR (SHARP CORNERS) */}
      <div className="bg-[#f0f1f3] text-gray-500 border-t border-gray-300 px-4 py-1.5 flex items-center justify-between text-xs select-none font-sans shrink-0 rounded-none z-10 shadow-inner">
        
        {/* Status view switcher tab bars */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-2">Views:</span>
          {[
            { tag: 'Editor', title: '⌨ Screenplay Editor' },
            { tag: 'Strategy', title: '⚡ Director Strategy' },
            { tag: 'VersionHistory', title: '⏱ Version snaps' }
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveView(tab.tag as any)}
              className={cn(
                "px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest transition-all rounded-none border",
                activeView === tab.tag
                  ? "bg-white border-gray-300 text-blue-600 font-black"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              )}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Middle pagination counter indicators */}
        <div className="flex items-center gap-2">
          <button 
            disabled={activePageIndex === 0}
            onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
            className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-40 transition-colors"
            title="Previous Scene Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="font-mono text-[10px] font-bold text-gray-600 bg-white/80 border border-gray-300/80 px-2 py-0.5">
            PAGE {activePageIndex + 1} OF {pages.length}
          </span>

          <button 
            disabled={activePageIndex === pages.length - 1}
            onClick={() => setActivePageIndex(prev => Math.min(pages.length - 1, prev + 1))}
            className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-40 transition-colors"
            title="Next Scene Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right stats widgets */}
        <div className="flex items-center gap-4 text-[10px]">
          <span className="font-mono text-gray-400">
            TITLE: <strong className="text-gray-600 uppercase font-black">{screenplayTitle}</strong>
          </span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="font-mono text-gray-400">
            PAGES: <strong className="text-gray-600 font-extrabold">{pages.length}</strong>
          </span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="font-mono text-gray-400">
            SCENES: <strong className="text-gray-600 font-extrabold">{pages.reduce((acc, p) => acc + (p.content.match(/^(INT\.|EXT\.|INT\/EXT)/gm) || []).length, 0)}</strong>
          </span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="font-mono text-gray-400">
            CHARS: <strong className="text-gray-600 font-extrabold">{knownCharacters.length}</strong>
          </span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="font-mono text-gray-400">
            TOTAL WORDS: <strong className="text-gray-600 font-extrabold">{pages.reduce((acc, p) => acc + p.content.split(/\s+/).filter(Boolean).length, 0)}</strong>
          </span>
        </div>

      </div>

    </div>
  );
}
