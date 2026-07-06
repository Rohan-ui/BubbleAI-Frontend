import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, User, Key, Sliders, Type, HelpCircle, 
  Check, Save, RefreshCw, Cpu, Database, Info
} from 'lucide-react';

export function SettingsWorkspace() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Arjun Krishna',
    email: 'arjunkrishna9636@gmail.com',
    role: 'Creative Director & Producer'
  });

  const [apiConfig, setApiConfig] = useState({
    endpoint: 'https://api.google.com/gemini',
    model: 'gemini-2.5-flash',
    maxTokens: '4096',
    temperature: '0.7'
  });

  const [editorPref, setEditorPref] = useState({
    fontSize: '14px',
    lineHeight: '1.6',
    fontFamily: 'JetBrains Mono',
    autoSaveInterval: '1 min'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-blue mb-2">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Configuration</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">System Settings</h1>
          <p className="text-brand-light-grey text-sm mt-1">
            Configure your AI creative engine models, system profiles, and text editor interfaces.
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-4 h-4 text-emerald-300 animate-pulse" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saveSuccess ? 'Settings Saved' : isSaving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </header>

      {/* Grid Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Navigation-Like Settings Category Visual */}
        <div className="space-y-4">
          <div className="bg-brand-grey/20 border border-white/5 rounded-2xl p-6 space-y-2">
            <h3 className="text-xs font-bold text-brand-light-grey uppercase tracking-widest opacity-50 mb-4">Categories</h3>
            {[
              { label: 'Profile Settings', icon: User, active: true },
              { label: 'AI Engine (Gemini)', icon: Cpu, active: false },
              { label: 'Writing Preferences', icon: Type, active: false },
              { label: 'Workspace Databases', icon: Database, active: false }
            ].map((cat, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${cat.active ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/20' : 'text-brand-light-grey hover:bg-white/5 hover:text-white'}`}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-brand-blue/10 border border-brand-blue/15 p-6 rounded-2xl flex gap-3 text-xs leading-relaxed text-brand-light-grey">
            <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1">API Key Management</p>
              In accordance with security guidelines, all developer pipeline secret keys are safely queried purely server-side via backend environment configurations (`.env.example`).
            </div>
          </div>
        </div>

        {/* Form Inputs Fields */}
        <div className="md:col-span-2 space-y-8">
          {/* Section 1: User Profile */}
          <div className="bg-brand-grey/15 border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="text-brand-blue w-5 h-5" />
              <h2 className="font-extrabold text-lg text-white">Creator Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Display Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none text-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  disabled
                  className="w-full bg-brand-dark/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-brand-light-grey cursor-not-allowed focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Professional Title</label>
                <input 
                  type="text" 
                  value={profile.role}
                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none text-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: AI Engine Preferences */}
          <div className="bg-brand-grey/15 border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Cpu className="text-brand-blue w-5 h-5" />
              <h2 className="font-extrabold text-lg text-white">AI Engine Models</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Default Model</label>
                <select 
                  value={apiConfig.model}
                  onChange={(e) => setApiConfig({...apiConfig, model: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none text-white transition-colors"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Creativity Temperature</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={apiConfig.temperature}
                  onChange={(e) => setApiConfig({...apiConfig, temperature: e.target.value})}
                  className="w-full h-1.5 bg-brand-dark/60 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <div className="flex justify-between text-[10px] text-brand-light-grey/60">
                  <span>Precise (0.0)</span>
                  <span className="font-bold text-brand-blue">{apiConfig.temperature}</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Writing View Layout Preferences */}
          <div className="bg-brand-grey/15 border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Type className="text-brand-blue w-5 h-5" />
              <h2 className="font-extrabold text-lg text-white">Writing Workbench Preferences</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Editor Font Family</label>
                <select 
                  value={editorPref.fontFamily}
                  onChange={(e) => setEditorPref({...editorPref, fontFamily: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none text-white transition-colors"
                >
                  <option value="JetBrains Mono">JetBrains Mono (Technical/Precision)</option>
                  <option value="Courier New">Courier New (Fictional Script Standard)</option>
                  <option value="Inter">Inter (Swiss Modern UI)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-light-grey uppercase tracking-wider">Script Font Size</label>
                <select 
                  value={editorPref.fontSize}
                  onChange={(e) => setEditorPref({...editorPref, fontSize: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none text-white transition-colors"
                >
                  <option value="12px">12px (Compact)</option>
                  <option value="14px">14px (Recommended)</option>
                  <option value="16px">16px (Comfortable)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
