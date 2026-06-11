import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  LogOut, 
  Settings,
  X
} from 'lucide-react';
import { User as UserType } from '../types';
// @ts-ignore
import lfaLogo from '../assets/images/lfa_logo_1781030825177.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType;
  onLogout: () => void;
  onCloseMobile?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, onCloseMobile }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Product Inventory', icon: Package },
    { id: 'sales', label: 'Sales Register', icon: ShoppingBag },
    { id: 'forecasting', label: 'AI Forecasting Plan', icon: TrendingUp }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0f172a] text-slate-800 dark:text-[#f8fafc] flex flex-col h-full border-r border-slate-200 dark:border-[#1e293b] overflow-y-auto transition-colors duration-300" id="lfa-sidebar">
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img 
            src={lfaLogo}
            alt="LFA Logo"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-[#1e293b]"
            id="sidebar-logo-image"
          />
          <div>
            <h1 className="font-sans font-bold text-slate-900 dark:text-[#f8fafc] text-sm uppercase leading-none tracking-tight">LFA Sport</h1>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold font-mono tracking-wider uppercase">Portal systems</span>
          </div>
        </div>
        
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-450 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            id="btn-sidebar-close-mobile"
            title="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => {
                if (item.id === 'logout') {
                  onLogout();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 border-r-3 ${
                isActive 
                  ? 'text-teal-600 dark:text-[#2dd4bf] bg-teal-50/50 dark:bg-[rgba(45,212,191,0.05)] border-teal-500 dark:border-[#2dd4bf] font-semibold' 
                  : item.id === 'logout'
                    ? 'text-red-500 hover:bg-red-500/10 hover:text-red-650'
                    : 'text-slate-500 dark:text-[#94a3b8] border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Information Profile bar & Logout & Settings */}
      <div className="p-4 border-t border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-slate-950/40 mt-auto space-y-3" id="sidebar-footer">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg border border-slate-200/60 dark:border-[#1e293b] bg-white dark:bg-[#070b19]/35">
          <div className="w-8 h-8 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-[#2dd4bf] flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
            {user.fullName ? user.fullName[0] : 'M'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate leading-tight uppercase tracking-wide">
              {user.fullName || 'Store Manager'}
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5 font-mono">
              @{user.username || 'manager'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            id="nav-tab-settings"
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-teal-500 text-white border-teal-500 dark:text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-white hover:bg-slate-50 dark:bg-[#0f172a] hover:dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
            }`}
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>

          <button
            onClick={onLogout}
            id="btn-logout"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-red-500/20 hover:shadow-red-500/30 active:scale-[0.98] cursor-pointer"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
