import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Coins, 
  TrendingUp, 
  Package, 
  Percent, 
  ShoppingBag,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { Product, SaleRecord } from '../types';

interface DashboardProps {
  sales: SaleRecord[];
  products: Product[];
}

const CATEGORY_COLORS = {
  'Boots': '#10b981',                  // emerald
  'Trainers': '#06b6d4',               // cyan
  'Balls': '#f59e0b',                  // amber
  'Goalkeeper Gear': '#64748b',        // slate
  'Socks & Shin Pads': '#f43f5e',      // rose
  'Jerseys & Apparel': '#3b82f6',      // blue
  'Trophies': '#eab308',               // yellow
  'Training Gear & Accessories': '#6366f1' // indigo
};

export default function Dashboard({ sales, products }: DashboardProps) {
  // 1. Calculate Core KPIs
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const totalSalesCount = sales.length;
  
  const lowStockProducts = products.filter(p => p.stock <= p.minStockLevel);
  const lowStockCount = lowStockProducts.length;

  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Let's calculate growth. Compare May 2026 vs June 2026 (or April vs May)
  const salesByMonth: Record<string, { revenue: number, profit: number }> = {};
  sales.forEach(s => {
    const month = s.date.substring(0, 7); // YYYY-MM
    if (!salesByMonth[month]) {
      salesByMonth[month] = { revenue: 0, profit: 0 };
    }
    salesByMonth[month].revenue += s.totalPrice;
    salesByMonth[month].profit += s.profit;
  });

  const months = Object.keys(salesByMonth).sort();
  let growthRate = 0;
  if (months.length >= 2) {
    const lastMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];
    const lastVal = salesByMonth[lastMonth].revenue;
    const prevVal = salesByMonth[prevMonth].revenue;
    if (prevVal > 0) {
      growthRate = ((lastVal - prevVal) / prevVal) * 100;
    }
  }

  // 2. Prepare Chart Data - Monthly Revenue & Profit
  const monthsNames: Record<string, string> = {
    '2026-01': 'Jan 26',
    '2026-02': 'Feb 26',
    '2026-03': 'Mar 26',
    '2026-04': 'Apr 26',
    '2026-05': 'May 26',
    '2026-06': 'Jun 26'
  };

  const trendData = months.map(m => ({
    name: monthsNames[m] || m,
    Revenue: Math.round(salesByMonth[m].revenue),
    Profit: Math.round(salesByMonth[m].profit)
  }));

  // 3. Prepare Chart Data - Category Breakdown
  const categoryAgg: Record<string, { value: number, profit: number, count: number }> = {};

  sales.forEach(s => {
    const cat = s.category || 'Training Gear & Accessories';
    if (!categoryAgg[cat]) {
      categoryAgg[cat] = { value: 0, profit: 0, count: 0 };
    }
    categoryAgg[cat].value += s.totalPrice;
    categoryAgg[cat].profit += s.profit;
    categoryAgg[cat].count += s.quantity;
  });

  const categoryPieData = Object.entries(categoryAgg).map(([key, data]) => ({
    name: key,
    value: Math.round(data.value),
    profit: Math.round(data.profit),
    color: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] || '#64748b'
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-6" id="dashboard-tab-panel">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="dashboard-header-block">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">LFA Sport Analytics Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time retail inventory performance and net gross yields</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-cards-grid">
        {/* Revenue */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between" id="kpi-card-revenue">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">₦{totalRevenue.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-xs">
              {growthRate >= 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight size={14} /> +{growthRate.toFixed(1)}%
                </span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center gap-0.5">
                  <TrendingDown size={14} /> {growthRate.toFixed(1)}%
                </span>
              )}
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Coins size={22} className="stroke-[2.5px]" />
          </div>
        </div>

        {/* Profit */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between" id="kpi-card-profit">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Profit Yield</p>
            <h3 className="text-2xl font-bold text-slate-900">₦{totalProfit.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="text-emerald-600 font-semibold">Healthy Margin</span>
              <span>across categories</span>
            </div>
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl">
            <TrendingUp size={22} className="stroke-[2.5px]" />
          </div>
        </div>

        {/* Margin */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between" id="kpi-card-margin">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Profit Margin</p>
            <h3 className="text-2xl font-bold text-slate-900">{profitMargin.toFixed(1)}%</h3>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>Avg Markup:</span>
              <span className="font-semibold text-slate-700">{(totalRevenue / Math.max(totalRevenue - totalProfit, 1)).toFixed(1)}x</span>
            </div>
          </div>
          <div className="p-3.5 bg-violet-50 text-violet-600 rounded-xl">
            <Percent size={22} className="stroke-[2.5px]" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between" id="kpi-card-alerts">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">In-Stock Alerts</p>
            <h3 className="text-2xl font-bold text-slate-900">{lowStockCount} Items</h3>
            <div className="flex items-center gap-1 text-xs">
              {lowStockCount > 0 ? (
                <span className="text-amber-600 font-semibold animate-pulse">Critical stock refill needed</span>
              ) : (
                <span className="text-emerald-600 font-semibold">Inventory fully secure</span>
              )}
            </div>
          </div>
          <div className={`p-3.5 rounded-xl ${lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <Package size={22} className="stroke-[2.5px]" />
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-layout">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-[380px]" id="revenue-growth-chart-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-sans font-bold text-slate-800">Monthly Revenue & Profit Run</h4>
              <p className="text-xs text-slate-400">Aggregated tracking of monthly sales values vs. net margin cashflow</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs inline-block"></span> Revenue
              </span>
              <span className="flex items-center gap-1 text-sky-600">
                <span className="w-2.5 h-2.5 bg-sky-500 rounded-xs inline-block"></span> Net Profit
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} stroke="#94a3b8" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', color: '#cbd5e1' }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Profit" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-[380px]" id="category-distribution-chart-card">
          <div>
            <h4 className="font-sans font-bold text-slate-800">Revenue Share by Category</h4>
            <p className="text-xs text-slate-400">Total store turnover allocation across domains</p>
          </div>
          <div className="relative flex-1 min-h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="95%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Total Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Margin overlay */}
            <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center pointer-events-none mt-2" id="donut-center-kpi">
              <ShoppingBag className="text-slate-300 mb-0.5" size={20} />
              <span className="text-xl font-bold font-sans text-slate-700">₦{totalRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Gross</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs" id="category-legend">
            {categoryPieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                <span className="text-slate-600 truncate font-medium">{entry.name}</span>
                <span className="text-slate-400 font-mono ml-auto">
                  {((entry.value / Math.max(totalRevenue, 1)) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Stock Alerts and Recent Sales logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-critical-log-row">
        {/* Critical Refills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs" id="critical-stock-alerts-list">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-sans font-bold text-slate-800">Critical Refill Alerts</h4>
              <p className="text-xs text-slate-400">Products currently below safety buffer thresholds</p>
            </div>
            <span className="px-2 py-1 bg-amber-50 rounded-lg text-amber-700 border border-amber-200 text-[11px] font-bold font-mono">
              Action Required ({lowStockCount})
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Package size={28} className="mx-auto mb-2 text-emerald-400" />
              <p className="text-sm font-semibold">All products fully stocked!</p>
              <p className="text-xs">No active inventory warning flags detected.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{p.name}</p>
                    <p className="text-xs text-slate-400 font-medium">Category: {p.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Inventory: </span>
                      <span className="text-sm font-bold text-red-600 font-mono">{p.stock}</span>
                      <p className="text-[10px] text-slate-400">Safe Level: {p.minStockLevel}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 font-bold rounded-lg text-[10px] tracking-wide uppercase">
                      Replenish
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Recent Activity list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs" id="quick-recent-sales-list">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-sans font-bold text-slate-800">Recent Transactions Log</h4>
              <p className="text-xs text-slate-400">Latest active register clearances</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {sales.slice(-4).reverse().map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-all duration-150">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg text-xs font-bold leading-none shrink-0 ${
                    sale.category === 'Boots' ? 'bg-emerald-50 text-emerald-700' :
                    sale.category === 'Trainers' ? 'bg-cyan-50 text-cyan-700' :
                    sale.category === 'Balls' ? 'bg-amber-50 text-amber-700' :
                    sale.category === 'Goalkeeper Gear' ? 'bg-slate-100 text-slate-700' :
                    sale.category === 'Socks & Shin Pads' ? 'bg-rose-50 text-rose-700' :
                    sale.category === 'Jerseys & Apparel' ? 'bg-blue-50 text-blue-700' :
                    sale.category === 'Trophies' ? 'bg-yellow-50 text-yellow-800' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                    {sale.category?.charAt(0) || 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-850 truncate">{sale.productName}</p>
                    <p className="text-[11px] text-slate-400 font-mono font-medium">Qty {sale.quantity} • {sale.customerType} • {sale.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">+₦{sale.totalPrice.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-mono font-semibold">Profit ₦{sale.profit.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
