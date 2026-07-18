import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  Sparkles, Zap, Film, Palette
} from 'lucide-react';

export function AuthPage() {
  const { login, register, isAuthenticated, error, setError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    // Validation
    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(email.trim(), password);
      } else {
        result = await register(email.trim(), password, name.trim());
      }

      if (!result.success) {
        setLocalError(result.error || 'Something went wrong.');
      }
    } catch {
      setLocalError('Connection error. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setLocalError('');
    setError(null);
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#060608] flex font-sans relative overflow-hidden">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3b82f6]/[0.03] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00F5D4]/[0.03] rounded-full blur-[100px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Left Panel — Branding & Features (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative z-10">

        {/* Top Logo */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">🫧</span>
          <div>
            <h1 className="text-white font-extrabold text-xl tracking-tight">Bubble Tree</h1>
            <span className="bg-[#00F5D4]/15 text-[#00F5D4] text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#00F5D4]/30">
              STUDIO PRO
            </span>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="space-y-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Create stories
              <br />
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#00F5D4] to-[#7c3aed] bg-clip-text text-transparent">
                that matter.
              </span>
            </h2>
            <p className="text-[#8a8a93] mt-4 text-sm leading-relaxed max-w-sm">
              AI-powered screenplay writing, storyboarding, and creative collaboration — all in one workspace designed for professional creators.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Film, label: 'Screenplay Writer', desc: 'Industry-standard formatting' },
              { icon: Palette, label: 'Storyboard Studio', desc: 'Visual sequence builder' },
              { icon: Sparkles, label: 'AI Co-Writer', desc: 'Gemini-powered assistance' },
              { icon: Zap, label: 'Real-time Collab', desc: 'Multi-user editing' },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] transition-all group"
              >
                <feature.icon className="w-5 h-5 text-[#00F5D4] mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-white text-xs font-bold mb-0.5">{feature.label}</h4>
                <p className="text-[#8a8a93] text-[10px]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="text-[#8a8a93]/50 text-[10px] font-mono">
          © 2026 Bubble Tree Studio. Professional Creative Suite.
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="text-2xl">🫧</span>
            <h1 className="text-white font-extrabold text-lg tracking-tight">Bubble Tree</h1>
            <span className="bg-[#00F5D4]/15 text-[#00F5D4] text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#00F5D4]/30">
              PRO
            </span>
          </div>

          {/* Card Container */}
          <div className="bg-[#0e0e12] border border-white/[0.08] rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/40">

            {/* Header */}
            <div className="text-center mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-[#8a8a93] text-sm mt-1.5">
                    {mode === 'login'
                      ? 'Sign in to your creative workspace'
                      : 'Start your creative journey today'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-medium flex items-center gap-2"
                >
                  <span className="shrink-0">⚠</span>
                  <span>{displayError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name Field (Register only) */}
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-[10px] font-bold text-[#8a8a93] uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a93]/50" />
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arjun Krishna"
                        className="w-full bg-[#141416] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8a8a93]/40 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all"
                        autoComplete="name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold text-[#8a8a93] uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a93]/50" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#141416] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8a8a93]/40 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold text-[#8a8a93] uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a93]/50" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#141416] border border-white/[0.08] rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-[#8a8a93]/40 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a8a93]/50 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="auth-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/30 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] text-[#8a8a93]/50 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-[#8a8a93] text-xs">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  id="auth-switch-mode"
                  onClick={switchMode}
                  className="text-[#3b82f6] hover:text-[#60a5fa] font-bold ml-1.5 transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[10px] text-[#8a8a93]/30 mt-6 font-mono">
            Secured with JWT • End-to-end encrypted sessions
          </p>
        </motion.div>
      </div>
    </div>
  );
}
