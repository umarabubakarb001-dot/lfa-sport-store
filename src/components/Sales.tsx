import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  UserCheck, 
  HelpCircle, 
  Calendar, 
  CheckCircle,
  Clock,
  Ticket,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { Product, SaleRecord } from '../types';

interface SalesProps {
  sales: SaleRecord[];
  products: Product[];
  onAddSale: (saleData: { productId: string; quantity: number; date: string; customerType: 'Member' | 'Regular' }) => Promise<void>;
  onDeleteSale: (id: string) => Promise<void>;
}

export default function Sales({ sales, products, onAddSale, onDeleteSale }: SalesProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [customerType, setCustomerType] = useState<'Member' | 'Regular'>('Regular');
  
  // Set current default date to current local time date format
  const [date, setDate] = useState('2026-06-09');
  
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [saleToVoid, setSaleToVoid] = useState<SaleRecord | null>(null);

  // Find active product
  const activeProduct = products.find(p => p.id === selectedProductId);

  // Calculations
  const qtyNum = Number(quantity) || 0;
  const unitPrice = activeProduct ? activeProduct.price : 0;
  const costPrice = activeProduct ? activeProduct.costPrice : 0;
  
  const subtotal = unitPrice * qtyNum;
  // 5% discount for regular club members
  const memberDiscount = customerType === 'Member' ? subtotal * 0.05 : 0;
  const netTotal = subtotal - memberDiscount;
  
  const totalCost = costPrice * qtyNum;
  const netProfit = netTotal - totalCost;

  // Stock check
  const isStockAvailable = activeProduct ? activeProduct.stock >= qtyNum : false;

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(false);

    if (!selectedProductId) {
      setRegisterError('Please select a sports product from inventory.');
      return;
    }

    if (qtyNum <= 0) {
      setRegisterError('Sale quantity must be at least 1.');
      return;
    }

    if (!isStockAvailable) {
      setRegisterError(`Insufficient warehouse inventory! Available: ${activeProduct?.stock || 0}`);
      return;
    }

    if (!date) {
      setRegisterError('Please select transactional date.');
      return;
    }

    try {
      await onAddSale({
        productId: selectedProductId,
        quantity: qtyNum,
        customerType,
        date
      });

      setRegisterSuccess(true);
      // Reset form variables
      setSelectedProductId('');
      setQuantity('1');
      setCustomerType('Regular');
      
      // Auto-clear success message
      setTimeout(() => setRegisterSuccess(false), 3000);
    } catch (err: any) {
      setRegisterError(err.message || 'Error recording database transaction.');
    }
  };

  const RevertSaleClick = (sale: SaleRecord) => {
    setSaleToVoid(sale);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sales-register-grid">
      {/* COLUMN 1: Dynamic register panel (4 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-sans font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="text-emerald-500 stroke-[2.5px]" size={18} />
              <span>Checkout Register</span>
            </h3>
            <p className="text-xs text-slate-400">Record cashier sales clearances and club discounts</p>
          </div>

          <form onSubmit={handleRecordSubmit} className="space-y-4">
            {/* Choose product */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setRegisterError(null);
                }}
                id="sales-product-select"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-hidden text-slate-800"
              >
                <option value="">-- Choose Sports Gear --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} ({p.stock > 0 ? `${p.stock} left` : 'OUT OF STOCK'})
                  </option>
                ))}
              </select>
            </div>

            {/* Qty & Date row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  id="sales-qty-input"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sale Date</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    id="sales-date-input"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-xs font-medium focus:outline-hidden text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Customer Type toggles */}
            <div className="space-y-1.5Packed">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Customer Loyalty Status</label>
              <div className="grid grid-cols-2 gap-2" id="customer-type-selectors">
                <button
                  type="button"
                  onClick={() => setCustomerType('Regular')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    customerType === 'Regular'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Regular Shopper
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('Member')}
                  id="btn-customer-member"
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    customerType === 'Member'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-emerald-50/40 text-emerald-700 border-emerald-200 hover:bg-emerald-100/40'
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Store Member</span>
                </button>
              </div>
            </div>

            {/* Dynamic Bill clearance summary ticket */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs text-slate-600" id="register-sales-receipt">
              <div className="flex justify-between">
                <span>Unit Listing Price:</span>
                <span className="font-mono">₦{unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Gross Subtotal ({qtyNum}x):</span>
                <span className="font-mono">₦{subtotal.toFixed(2)}</span>
              </div>
              
              {customerType === 'Member' && (
                <div className="flex justify-between text-emerald-600 font-semibold" id="member-discount-line">
                  <span className="flex items-center gap-1">
                    <Ticket size={12} /> Special Loyalty Discount (5%):
                  </span>
                  <span className="font-mono">-₦{memberDiscount.toFixed(2)}</span>
                </div>
              )}

              <hr className="border-slate-200" />
              
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>Net Billing Price:</span>
                <span className="font-mono text-emerald-700">₦{netTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Computed Inventory Cost (COGS):</span>
                <span className="font-mono">₦{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-600 font-semibold">
                <span>Estimated Net Profit margin:</span>
                <span className="font-mono">₦{netProfit.toFixed(2)}</span>
              </div>
            </div>

            {/* Error / Success handlers */}
            {registerError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs text-left" id="register-error-banner">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{registerError}</span>
              </div>
            )}

            {registerSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold" id="register-success-banner">
                <CheckCircle size={16} className="shrink-0" />
                <span>Transaction logged. Stock deducted.</span>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              type="submit"
              id="btn-register-sale"
              disabled={!selectedProductId || qtyNum <= 0 || !isStockAvailable}
              className={`w-full py-2.5 rounded-xl font-bold transition-all text-sm cursor-pointer shadow-md ${
                !selectedProductId || qtyNum <= 0 || !isStockAvailable
                  ? 'bg-slate-100 text-slate-300 border border-slate-200 shadow-none cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/10'
              }`}
            >
              Record Transaction
            </button>
          </form>
        </div>
      </div>

      {/* COLUMN 2: Comprehensive transactional ledger (7 cols) */}
      <div className="lg:col-span-7">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full" id="sales-ledger-card">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-slate-900">Store Clearances Ledger</h3>
              <p className="text-xs text-slate-400 font-medium">Double-entry record ledger showing category margins and reversibility</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Clock size={12} className="text-slate-400" />
              <span>Historic Count: {sales.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[500px]">
            <table className="w-full text-left" id="ledger-table">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                  <th className="py-3 px-4">Sales Date</th>
                  <th className="py-3 px-4">Sports Article details</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-center">Loyalty</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-400">
                      <ShoppingBag className="mx-auto mb-2 text-slate-350" size={32} />
                      <p className="font-semibold text-sm">Clearances ledger empty</p>
                      <p className="text-xs">Log a new sale using the registration register form.</p>
                    </td>
                  </tr>
                ) : (
                  sales.slice().reverse().map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors" id={`sale-row-${s.id}`}>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500">{s.date}</td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 leading-tight">{s.productName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {s.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{s.quantity}</td>
                      <td className="py-3.5 px-4 text-right shrink-0">
                        <p className="font-mono font-bold text-slate-900">₦{s.totalPrice.toFixed(0)}</p>
                        <p className="text-[10px] text-emerald-600 font-mono font-semibold">Margin ₦{s.profit.toFixed(0)}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black uppercase ${
                          s.customerType === 'Member' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.customerType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => RevertSaleClick(s)}
                          id={`btn-revert-sale-${s.id}`}
                          className="p-1 px-2.5 hover:bg-red-50 hover:text-red-700 text-slate-450 border border-slate-200 hover:border-red-100 rounded-lg transition-all text-[11px] font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Void</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* React-Based Interactive Sales Voiding Confirmation Dialog Modal */}
      {saleToVoid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" id="dialog-sale-void-confirm">
          <div className="w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div className="flex items-center gap-2.5 text-red-500">
                  <Trash2 size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Void Transaction</h3>
                </div>
                <button 
                  onClick={() => setSaleToVoid(null)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm text-slate-300">
                  Do you wish to revert and void Transaction <strong className="font-mono text-teal-400 font-sans">{saleToVoid.id}</strong>?
                </p>
                <div className="p-3 bg-[rgba(239,68,68,0.04)] border border-red-500/20 rounded-xl space-y-1.5 text-xs">
                  <p className="text-[#cbd5e1] font-semibold">
                    Product: <span className="text-slate-200">{saleToVoid.productName}</span>
                  </p>
                  <p className="text-[#cbd5e1] font-semibold">
                    Quantity to Refund: <span className="font-mono text-slate-200">{saleToVoid.quantity} unit(s)</span>
                  </p>
                  <p className="text-[#cbd5e1] font-semibold">
                    Total Value: <span className="font-mono text-slate-200">₦{saleToVoid.totalPrice.toFixed(2)}</span>
                  </p>
                  <div className="pt-1.5 border-t border-red-500/10 text-[11px] text-slate-400 font-mono leading-relaxed">
                    Reverting will fully cancel this purchase, remove the record from ledger, and refund the {saleToVoid.quantity} item(s) back into active stock levels.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setSaleToVoid(null)}
                  className="px-4 py-2 bg-[#1e293b] text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 hover:bg-[#334155] cursor-pointer"
                >
                  Keep Transaction
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = saleToVoid.id;
                    setSaleToVoid(null);
                    await onDeleteSale(id);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-red-500/10 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Void &amp; Refund Stock</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
