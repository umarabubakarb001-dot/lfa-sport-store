import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Sun, 
  Moon, 
  Loader2, 
  Check, 
  ShieldAlert, 
  KeyRound,
  Sparkles
} from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onUserUpdate: (updatedUser: UserType) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  token: string | null;
}

export default function Settings({ user, onUserUpdate, theme, onThemeChange, token }: SettingsProps) {
  // Profile State
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    if (!fullName.trim() || !email.trim() || !username.trim()) {
      setProfileError('All profile fields are required.');
      setProfileLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, email, username })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update credentials.');
      }

      onUserUpdate(data.user);
      setProfileSuccess('Manager credentials updated successfully.');
    } catch (err: any) {
      setProfileError(err.message || 'An error occurred.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters long.');
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPasswordSuccess('Manager password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="settings-view">
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div 
          className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-xs flex flex-col justify-between"
          id="profile-settings-card"
        >
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-[#1e293b] pb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <UserIcon size={18} className="text-teal-500" />
                <span>Manager Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Edit the username and credentials used to authenticate log-in clearance level.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1.5Packed">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Manager Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name Field */}
                <div className="space-y-1.5Packed">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5Packed">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Administrative Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {profileError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <Check size={14} className="shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-900 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-slate-950 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving Parameters...</span>
                    </>
                  ) : (
                    <span>Save Credentials</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Theme Settings Card */}
        <div 
          className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-xs flex flex-col justify-between"
          id="theme-settings-card"
        >
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-[#1e293b] pb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <span>Visual Theme</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize colors, contrast patterns, and lighting schemes.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Display Scheme
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Light Theme Card */}
                <button
                  onClick={() => onThemeChange('light')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-200 text-center cursor-pointer ${
                    theme === 'light'
                      ? 'border-teal-500 bg-teal-50/20 text-teal-600 dark:text-[#2dd4bf] ring-1 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/55 text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Sun size={20} className={theme === 'light' ? 'text-amber-500' : ''} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Light Mode</p>
                    <p className="text-[9px] text-slate-400">Crisp light view</p>
                  </div>
                </button>

                {/* Dark Theme Card */}
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-200 text-center cursor-pointer ${
                    theme === 'dark'
                      ? 'border-teal-500 bg-teal-50/10 text-teal-600 dark:text-[#2dd4bf] ring-1 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/55 text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Moon size={20} className={theme === 'dark' ? 'text-teal-400' : ''} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Dark Mode</p>
                    <p className="text-[9px] text-slate-400">Eye-safe slate layout</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[10px] text-slate-400 leading-relaxed italic border-t border-slate-100 dark:border-slate-800/50 mt-4">
            Theme choices are persistent and will store locally in active manager cache.
          </div>
        </div>

        {/* Change Password Card */}
        <div 
          className="lg:col-span-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-xs"
          id="password-settings-card"
        >
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-[#1e293b] pb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <KeyRound size={18} className="text-teal-500" />
                <span>Security Clearance Code</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Refine the managerial access passcode. Make sure it is secure.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="space-y-1.5Packed">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5Packed">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5Packed">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <Check size={14} className="shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-900 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-slate-950 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Updating security passcode...</span>
                    </>
                  ) : (
                    <span>Update Security Passcode</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
