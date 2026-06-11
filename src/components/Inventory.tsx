import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  ArrowUpDown,
  Calculator,
  X
} from 'lucide-react';
import { Product } from '../types';

export const CATEGORY_TEMPLATES: Record<string, string[]> = {
  'Boots': [
    'Adidas Predator (First Grade Cleats)',
    'Nike Airzoom (First Grade Cleats)',
    'Puma (First Grade Cleats)',
    'Adidas F50 (First Grade Cleats)',
    'Nike Phantom (First Grade Cleats)',
    'Nike Mercurial (First Grade Cleats)',
    'Samba (Academy Grade Boots)',
    'Predator (Academy Grade Boots)',
    'Crazy Fast (Academy Grade Boots)',
    'Nike Airzoom (Academy Grade Boots)'
  ],
  'Trainers': [
    'Puma Trainers (First Grade)',
    'Nike Airzoom (First Grade Trainers)',
    'Phantom GX6 (First Grade Trainers)',
    'Adidas F50 (First Grade Trainers)',
    'Adidas Crazy Fast (First Grade Trainers)',
    'Adidas Predator (First Grade Trainers)',
    'Nike Mercurial (First Grade Trainers)',
    'Academy Grade Trainers',
    'Low-Budget Trainers'
  ],
  'Balls': [
    'High Quality Original Molten Speed Ball',
    'Super-Pro Ball',
    'High Quality Tenth Ball',
    'Original Conti Ball'
  ],
  'Goalkeeper Gear': [
    'Goalkeeper Gloves',
    'Goalkeeper Jersey'
  ],
  'Socks & Shin Pads': [
    'Long Socks',
    'Ankle Socks',
    'Grip Socks',
    'Cut Socks',
    'Belgium Socks',
    'Anklet',
    'Mini Shin Pads (Big)',
    'Mini Shin Pads (Small)'
  ],
  'Jerseys & Apparel': [
    'Club Jerseys',
    'Fashion Jersey',
    'Body Hug',
    'Retro-Classic Jersey',
    'Knickers',
    'Full Gym Kits',
    'Singlets (Male Underwear)',
    'Boxers (Male Underwear)'
  ],
  'Trophies': [
    'Big Trophy',
    'Medium Trophy',
    'Small Trophy',
    'Mini Trophy'
  ],
  'Training Gear & Accessories': [
    'Gym Bag',
    'Nike Slides',
    'Face-Cap',
    'Belgium Bips',
    'Original Bips 2in1',
    'Captain Band',
    'Official Whistle',
    'Small Whistle'
  ]
};

interface InventoryProps {
  products: Product[];
  onAddProduct: (prodData: Omit<Product, 'id'>) => Promise<void>;
  onEditProduct: (id: string, prodData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export default function Inventory({ products, onAddProduct, onEditProduct, onDeleteProduct }: InventoryProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: 'Adidas Predator (First Grade Cleats)',
    category: 'Boots',
    stock: '',
    price: '',
    costPrice: '',
    minStockLevel: ''
  });

  const categories = [
    'All',
    'Boots',
    'Trainers',
    'Balls',
    'Goalkeeper Gear',
    'Socks & Shin Pads',
    'Jerseys & Apparel',
    'Trophies',
    'Training Gear & Accessories'
  ];

  // Potential profit calculator helpers
  const costPriceNum = Number(formData.costPrice) || 0;
  const priceNum = Number(formData.price) || 0;
  const potentialProfit = priceNum - costPriceNum;
  const markupPercent = costPriceNum > 0 ? (potentialProfit / costPriceNum) * 100 : 0;
  const marginPercent = priceNum > 0 ? (potentialProfit / priceNum) * 100 : 0;

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: 'Adidas Predator (First Grade Cleats)',
      category: 'Boots',
      stock: '',
      price: '',
      costPrice: '',
      minStockLevel: ''
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stock: String(product.stock),
      price: String(product.price),
      costPrice: String(product.costPrice),
      minStockLevel: String(product.minStockLevel)
    });
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await onAddProduct({
      name: formData.name.trim(),
      category: formData.category,
      stock: Number(formData.stock),
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      minStockLevel: Number(formData.minStockLevel)
    });

    setIsAddOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !formData.name.trim()) return;

    await onEditProduct(editingProduct.id, {
      name: formData.name.trim(),
      category: formData.category,
      stock: Number(formData.stock),
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      minStockLevel: Number(formData.minStockLevel)
    });

    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
  };

  return (
    <div className="space-y-6" id="inventory-tab-panel">
      {/* Tab Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="inventory-header">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Product Inventory Management</h2>
          <p className="text-sm text-slate-500 font-medium">Clearance thresholds, acquisition pricing markup checks, and core safety buffers</p>
        </div>
        <button
          onClick={handleOpenAdd}
          id="btn-add-product-trigger"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-emerald-500/10 cursor-pointer text-sm"
        >
          <Plus size={18} className="stroke-[2.5px]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters bar & search bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4" id="tools-bar">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search sports products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="product-search-input"
            className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 pl-10 pr-4 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white text-slate-800 transition-colors"
          />
        </div>

        {/* Category toggles */}
        <div className="flex flex-wrap items-center gap-1.5" id="category-filter-pills">
          <span className="text-xs text-slate-400 font-bold mr-2 uppercase flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              id={`pill-filter-${cat}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products list Table container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden" id="inventory-table-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="products-table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase font-sans">
                <th className="py-4.5 px-6">Product Details</th>
                <th className="py-4.5 px-6">Category</th>
                <th className="py-4.5 px-6 text-right">Cost Price</th>
                <th className="py-4.5 px-6 text-right">Selling Price</th>
                <th className="py-4.5 px-6 text-center">In-Stock Qty</th>
                <th className="py-4.5 px-6 text-center">Safety Stock</th>
                <th className="py-4.5 px-6 text-center">Margin</th>
                <th className="py-4.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-slate-400 bg-slate-50/10">
                    <AlertTriangle className="mx-auto mb-2 text-slate-300" size={32} />
                    <p className="font-semibold text-sm">No inventory records found</p>
                    <p className="text-xs">Adjust your category filter or refine your search input.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLowStock = p.stock <= p.minStockLevel;
                  const itemProfit = p.price - p.costPrice;
                  const itemMargin = (itemProfit / p.price) * 100;
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors" id={`product-row-${p.id}`}>
                      <td className="py-4.5 px-6">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] font-sans ${
                          p.category === 'Boots' ? 'bg-emerald-50 text-emerald-700' :
                          p.category === 'Trainers' ? 'bg-cyan-50 text-cyan-700' :
                          p.category === 'Balls' ? 'bg-amber-50 text-amber-700' :
                          p.category === 'Goalkeeper Gear' ? 'bg-slate-100 text-slate-700' :
                          p.category === 'Socks & Shin Pads' ? 'bg-rose-50 text-rose-700' :
                          p.category === 'Jerseys & Apparel' ? 'bg-blue-50 text-blue-700' :
                          p.category === 'Trophies' ? 'bg-yellow-50 text-yellow-800' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right font-mono font-medium">₦{p.costPrice.toFixed(2)}</td>
                      <td className="py-4.5 px-6 text-right font-mono font-bold text-slate-900">₦{p.price.toFixed(2)}</td>
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`font-mono font-bold text-sm ${isLowStock ? 'text-red-600' : 'text-slate-950'}`}>
                            {p.stock}
                          </span>
                          {isLowStock && (
                            <span className="p-1 text-red-600 bg-red-50 rounded-md" title="Critical low safety stock! Refill.">
                              <AlertTriangle size={14} className="stroke-[2.5px]" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-center font-mono text-slate-400 font-medium">{p.minStockLevel}</td>
                      <td className="py-4.5 px-6 text-center">
                        <span className="font-mono text-emerald-600 font-bold">{itemMargin.toFixed(0)}%</span>
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            id={`btn-edit-product-${p.id}`}
                            className="p-1.5 hover:bg-slate-100 hover:text-slate-900 text-slate-400 rounded-lg transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p)}
                            id={`btn-delete-product-${p.id}`}
                            className="p-1.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer"
                            title="Remove Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          ADD/EDIT INVENTORY MODALS
         ========================================== */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="inventory-modal-overlay">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col" id="inventory-modal-content">
            {/* Modal Heading */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-sans">
                  {isAddOpen ? 'Add New Store Product' : 'Modify Product Specifications'}
                </h3>
                <p className="text-xs text-slate-400">Configure margins and buffer limits below</p>
              </div>
              <button
                onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4 flex-1">
              {/* Category & Stocks */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Domain / Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const templates = CATEGORY_TEMPLATES[newCat] || [];
                      const defaultName = templates[0] || '';
                      setFormData({ 
                        ...formData, 
                        category: newCat, 
                        name: defaultName 
                      });
                    }}
                    id="form-product-category"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-hidden text-slate-800 cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Opening Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    id="form-product-stock"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-hidden text-slate-800"
                  />
                </div>
              </div>

              {/* Select Item Type Spec Option */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Select LFA Catalog Item Type</span>
                </label>
                <select
                  value={CATEGORY_TEMPLATES[formData.category]?.includes(formData.name) ? formData.name : 'CUSTOM_ITEM'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'CUSTOM_ITEM') {
                      setFormData(prev => ({ ...prev, name: '' }));
                    } else {
                      setFormData(prev => ({ ...prev, name: val }));
                    }
                  }}
                  className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-hidden text-slate-800 cursor-pointer"
                >
                  {(CATEGORY_TEMPLATES[formData.category] || []).map((tpl) => (
                    <option key={tpl} value={tpl}>{tpl}</option>
                  ))}
                  <option value="CUSTOM_ITEM">✏️ Custom - Type another name manually</option>
                </select>
              </div>

              {/* Title Input (only if name is custom or empty) */}
              {(!CATEGORY_TEMPLATES[formData.category]?.includes(formData.name) || formData.name === '') && (
                <div className="space-y-1.5 transition-all duration-150">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Specify Custom Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Edition Predator"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    id="form-product-name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-hidden focus:border-slate-400 focus:bg-white text-slate-800"
                  />
                </div>
              )}

              {/* Grid 3 Columns: Cost, Selling, Safety */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unit Cost Price (₦)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    id="form-product-cost"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Retail Price (₦)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    id="form-product-price"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Safety Buffer qty</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    id="form-product-min-stock"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Potential Markup Margin clearance calculator banner */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3" id="margin-visual-calculator">
                <Calculator size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-800">
                  <p className="font-bold flex items-center gap-1">Acquisition Markup yield</p>
                  <div className="mt-1 grid grid-cols-3 gap-4 text-[11px] font-sans">
                    <div>
                      <span className="text-emerald-600">Unit Profit: </span>
                      <strong className="font-mono text-emerald-900">₦{potentialProfit.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-600">Markup: </span>
                      <strong className="font-mono text-emerald-900">{markupPercent.toFixed(0)}%</strong>
                    </div>
                    <div>
                      <span className="text-emerald-600">Profit Margin: </span>
                      <strong className="font-mono text-emerald-900">{marginPercent.toFixed(0)}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-product"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  {isAddOpen ? 'Confirm Create' : 'Save Adjustments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* React-Based Interactive Product Deletion Confirmation Dialog Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" id="dialog-product-delete-confirm">
          <div className="w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div className="flex items-center gap-2.5 text-red-500">
                  <Trash2 size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Remove Product</h3>
                </div>
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm text-slate-300">
                  Are you sure you want to delete <strong className="text-teal-400 font-sans">{productToDelete.name}</strong> from the active inventory registry?
                </p>
                <div className="p-3 bg-[rgba(239,68,68,0.04)] border border-red-500/20 rounded-xl space-y-1">
                  <p className="text-[11px] text-red-400 font-bold uppercase tracking-wide flex items-center gap-1">
                    <AlertTriangle size={12} /> Warning
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    This will permanently clear this product record. Legacy sales reports and history in the ledger will remain completely intact to preserve project metrics.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 bg-[#1e293b] text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 hover:bg-[#334155] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = productToDelete.id;
                    setProductToDelete(null);
                    await onDeleteProduct(id);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-red-500/10 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Permanent Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
