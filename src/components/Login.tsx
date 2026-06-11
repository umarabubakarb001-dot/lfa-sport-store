import React, { useState, useEffect } from 'react';
import { Lock, User, AlertCircle, Sparkles, Sun, Moon } from 'lucide-react';
// @ts-ignore
import lfaLogo from '../assets/images/lfa_logo_1781030825177.png';

interface LoginProps {
  onLoginSuccess: (token: string, user: { id: string; username: string; email: string; fullName: string }) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

export default function Login({ onLoginSuccess, theme, onThemeToggle }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Empty by default so managers enter their updated credentials
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Auto-transition splash screen after 3 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid login details.');
      }

      const data = await response.json();
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setErrorStr(err.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden" id="login-container">
      {/* Glowing background gradient matching the dashboard perfectly */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at top right, rgba(45, 212, 191, 0.08), transparent 60%), radial-gradient(circle at bottom left, rgba(30, 58, 138, 0.12), transparent 70%)',
        }}
      />

      {/* LFA Background Watermark - High Visibility, centered on the page at 15% opacity to stand out beautifully */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center select-none overflow-hidden opacity-[0.15]">
        <img 
          src={lfaLogo}
          alt="LFA Background Watermark"
          referrerPolicy="no-referrer"
          className="w-[110vh] h-[110vh] max-w-[900px] max-h-[900px] object-contain shrink-0 animate-pulse duration-[8000ms]"
        />
      </div>

      {showWelcome ? (
        /* ================= WELCOME SPLASH PORTAL PAGE ================= */
        <div 
          className="z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 ease-out transition-all space-y-6" 
          id="welcome-portal-panel"
        >
          {/* Glowing LFA Logo */}
          <div className="relative group" id="welcome-logo-halo">
            <div className="absolute -inset-4 bg-teal-500/30 rounded-full blur-2xl animate-pulse" />
            <img 
              src={lfaLogo} 
              alt="LFA Sport Store Master Logo"
              referrerPolicy="no-referrer"
              className="relative w-36 h-36 rounded-3xl object-cover shadow-2xl border-2 border-teal-500/30"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-widest text-[#f8fafc] uppercase">
              LFA SPORT
            </h1>
            <div className="h-[2px] w-12 bg-teal-400 mx-auto rounded-full" />
          </div>
        </div>
      ) : (
        /* ================= AUTH LOGIN SCREEN MODULE ================= */
        <div 
          className="w-full max-w-sm bg-[#070b19]/30 border border-slate-800/30 p-8 rounded-3xl shadow-2xl space-y-6 z-10 backdrop-blur-[2px] animate-in fade-in duration-500 relative" 
          id="login-card"
        >
          {/* Branding Title */}
          <div className="text-center space-y-3">
            <img 
              src={lfaLogo}
              alt="LFA Logo"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border border-slate-800 mx-auto"
              id="login-brand-logo"
            />
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-white tracking-widest uppercase text-center">Manager Login</h2>
              <p className="text-[11px] text-slate-400 font-medium text-center">Provide credentials to enter LFA control center</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manager Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="login-username-input"
                  className="w-full bg-[#020617]/50 border border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500/50"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manager Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="login-password-input"
                  className="w-full bg-[#020617]/50 border border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500/50"
                />
              </div>
            </div>

            {/* Validation Banner */}
            {errorStr && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-left rounded-xl flex items-start gap-2" id="login-error-card">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span className="leading-tight">{errorStr}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="btn-login"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 active:brightness-90 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-black rounded-xl text-xs tracking-wider transition-all duration-100 shadow-lg cursor-pointer uppercase flex items-center justify-center gap-2 select-none"
            >
              {loading ? 'Authenticating Access...' : 'Access System'}
            </button>
          </form>

          <div className="space-y-2 text-center">
            <p className="text-[10px] text-slate-500 tracking-wide leading-relaxed">
              Authorized management credentials can be updated under settings menu anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
