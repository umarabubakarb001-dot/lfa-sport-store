import React, { useState } from 'react';
import { Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
// @ts-ignore
import lfaLogo from '../assets/images/lfa_logo_1781030825177.png';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function Login({ onLoginSuccess, theme, onThemeToggle }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Empty by default so managers enter their updated credentials
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorStr('Please input administrative username and credentials.');
      return;
    }

    setLoading(true);
    setErrorStr(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid manager access code key.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setErrorStr(err instanceof Error ? err.message : 'Login validation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-[#1e293b] rounded-2xl relative z-10 overflow-hidden shadow-2xl transition-all duration-300" id="login-form-card">
        {/* Upper Accent highlight */}
        <div className="h-1.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-400" />
        
        <div className="p-8 space-y-7">
          <div className="text-center space-y-3">
            <img 
              src={lfaLogo}
              alt="LFA Logo"
              referrerPolicy="no-referrer"
              className="w-16 h-16 mx-auto rounded-2xl object-cover border-2 border-slate-100 dark:border-[#1e293b]"
              id="login-logo-image"
            />
            <div className="space-y-1">
              <h1 className="font-sans font-bold text-slate-900 dark:text-white text-xl tracking-tight uppercase">
                LFA Sport Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#94a3b8] font-mono uppercase tracking-widest">
                Manager Entry Control
              </p>
            </div>
          </div>

          {errorStr && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-2.5 animate-pulse" id="login-error-alert">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed font-mono">{errorStr}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="login-credentials-form">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                Corporate Username
              </label>
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-[#1e293b]/70 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-[#2dd4bf] focus:ring-1 focus:ring-teal-500 transition-all font-mono placeholder-slate-400"
                id="login-input-username"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                Access Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-[#1e293b]/70 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 dark:focus:border-[#2dd4bf] focus:ring-1 focus:ring-teal-500 transition-all font-mono placeholder-slate-400"
                id="login-input-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-slate-900 border border-slate-800 hover:bg-black dark:bg-[#38bdf8] dark:hover:bg-[#0284c7] text-white dark:text-slate-950 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="btn-login-submit"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <span>Access System</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
