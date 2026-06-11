import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Forecasting from './components/Forecasting';
import DefenseGuide from './components/DefenseGuide';
import Login from './components/Login';
import Settings from './components/Settings';
import { Product, SaleRecord, User } from './types';
import { Loader2, LogOut, AlertTriangle, X, Sun, Moon, Menu } from 'lucide-react';
// @ts-ignore
import lfaLogo from './assets/images/lfa_logo_1781030825177.png';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('lfa_auth_token'));
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Track the mobile toggle flag
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('lfa_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark'; // Default to dark mode
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (!user) {
      root.classList.add('dark');
    } else {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('lfa_theme', theme);
  }, [theme, user]);

  // Business state
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  // 1. Initial Authentication Check
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Stale authorization token.');
        }

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          handleLogout();
        }
      } catch (err) {
        console.error('Session verify failed:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  // 2. Fetch Business data when logged in
  useEffect(() => {
    if (user && token) {
      fetchBusinessData();
    }
  }, [user]);

  const fetchBusinessData = async () => {
    try {
      const [prodsRes, salesRes] = await Promise.all([
        fetch('/api/products', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/sales', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (prodsRes.ok && salesRes.ok) {
        const prodsData = await prodsRes.json();
        const salesData = await salesRes.json();
        setProducts(prodsData);
        setSales(salesData);
      }
    } catch (err) {
      console.error('Error fetching core files:', err);
    }
  };

  const handleLoginSuccess = (newToken: string, loggedUser: User) => {
    localStorage.setItem('lfa_auth_token', newToken);
    setToken(newToken);
    setUser(loggedUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('lfa_auth_token');
    setToken(null);
    setUser(null);
    setProducts([]);
    setSales([]);
  };

  // ==========================================
  // SHARED DATABASE MUTATION HANDLERS
  // ==========================================

  // Products CRUD
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to insert product.');
      }

      await fetchBusinessData(); // Refetch whole dataset to keep sync
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to add product.');
    }
  };

  const handleEditProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to edit product.');
      }

      await fetchBusinessData();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to edit product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to remove product.');
      }

      await fetchBusinessData();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to remove product.');
    }
  };

  // Sales Mutations
  const handleAddSale = async (saleData: { productId: string; quantity: number; date: string; customerType: 'Member' | 'Regular' }) => {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(saleData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Billing declaration failed.');
    }

    await fetchBusinessData(); // Stock values and transactions log both dynamically adjust!
  };

  const handleDeleteSale = async (id: string) => {
    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to void transaction.');
      }

      await fetchBusinessData();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to void transaction.');
    }
  };

  // ==========================================
  // RENDER INTERFACE SELECTORS
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white" id="initial-loading">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={38} />
        <p className="text-sm font-sans font-medium animate-pulse">Loading LFA Sport...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        theme={theme} 
        onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
      />
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard sales={sales} products={products} />;
      case 'inventory':
        return (
          <Inventory 
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'sales':
        return (
          <Sales 
            sales={sales}
            products={products}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
          />
        );
      case 'forecasting':
        return <Forecasting sales={sales} products={products} />;
      case 'settings':
        return (
          <Settings 
            user={user}
            onUserUpdate={setUser}
            theme={theme}
            onThemeChange={setTheme}
            token={token}
          />
        );
      case 'defense':
        return <DefenseGuide />;
      default:
        return <Dashboard sales={sales} products={products} />;
    }
  };

  return (
    <div 
      className="relative flex h-screen text-slate-900 dark:text-[#f8fafc] font-sans overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-300" 
      id="applet-main-canvas"
    >
      {/* Glowing background gradient */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at top right, rgba(45, 212, 191, 0.08), transparent 60%), radial-gradient(circle at bottom left, rgba(30, 58, 138, 0.12), transparent 70%)'
            : 'radial-gradient(circle at top right, rgba(45, 212, 191, 0.05), transparent 60%), radial-gradient(circle at bottom left, rgba(30, 58, 138, 0.04), transparent 70%)',
        }}
      />

      {/* Professional Consistent Logo Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center select-none overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-[0.04] dark:opacity-[0.12]">
        <img 
          src={lfaLogo}
          alt="LFA Background Watermark"
          referrerPolicy="no-referrer"
          className="w-[120vh] h-[120vh] max-w-[950px] max-h-[950px] object-contain shrink-0 animate-pulse duration-[8000ms]"
          id="background-lfa-logo-watermark"
        />
      </div>

      {/* Sidebar overlay backdrop for mobile screens */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          id="mobile-sidebar-backdrop"
        />
      )}

      {/* Sidebar - relative or fixed slideover drawer depending on mobile/desktop screen size */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform h-full shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="sidebar-container-wrapper"
      >
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false); // Auto-close drawer on mobile when clicking a tab
          }} 
          user={user} 
          onLogout={() => {
            setMobileSidebarOpen(false);
            setShowLogoutModal(true);
          }} 
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main viewport area - relative and z-10 with responsive p-4 on mobile and p-8 on desktop */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col" id="tab-viewport-scroll">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-200 dark:border-[#1e293b] pb-5 mb-6 shrink-0 gap-3" id="executive-topbar">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
              title="Open Navigation"
              id="btn-mobile-menu-toggle"
            >
              <Menu size={20} />
            </button>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 font-mono tracking-widest uppercase">LFA SPORT ADMINISTRATIVE PORTAL</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">SYSTEMS</span>
                <span className="text-slate-400 dark:text-slate-600 text-[10px] font-bold">/</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize tracking-wide font-mono">{activeTab === 'defense' ? 'Defense Viva' : activeTab} Manager</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme controls moved to Systems Settings */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full h-full" id="inner-viewport-holder">
          {renderActiveTabContent()}
        </div>
      </main>

      {/* Professional Logout Confirmation Prompt Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" id="dialog-logout-confirm">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e293b]">
                <div className="flex items-center gap-2.5 text-red-500">
                  <AlertTriangle size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">System Exit</h3>
                </div>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Are you sure you want to log out of the LFA Sport Portal?
                </p>
                <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  All active unsaved session registers will be securely wiped, and you will need to enter your manager credentials again to gain administrative entry.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#1e293b] text-slate-750 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-[#334155] cursor-pointer"
                >
                  Keep Managing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-red-500/20 hover:shadow-red-500/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Yes, Exit System</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
