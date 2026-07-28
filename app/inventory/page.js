'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useInventory } from '../components/Providers';
import {
  Package, Search, Settings2, Trash2, Plus, X, Save,
  AlertCircle, Upload, Clock, LayoutGrid, List,
  ArrowUpCircle, ArrowDownCircle, AlertTriangle, ClipboardList,
  TrendingUp, RotateCcw, ShieldAlert, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── helpers ──────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }

function getBadgeStyle(status) {
  switch (status) {
    case 'Normal': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'Low': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Critical': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'Out of Stock': return 'bg-red-100 text-red-700 border border-red-200';
    default: return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
}

// ── Summary Card ──────────────────────────────────────────────────────
function SummaryCard({ title, value, sub, icon, iconBg, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Stock Bar ─────────────────────────────────────────────────────────
function StockBar({ current, reorder }) {
  const pct = Math.min(100, (current / Math.max(reorder * 3, 1)) * 100);
  const color = current <= 0 ? '#f43f5e' : current <= reorder * 0.5 ? '#f97316' : current <= reorder ? '#f59e0b' : '#10b981';
  return (
    <div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full transition-all duration-500" />
      </div>
    </div>
  );
}

// ── Stock List Tab (card grid) ────────────────────────────────────────
function StockListTab({ inventory, onAdjust, onView, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = ['all', ...new Set(inventory.map(i => i.category))];
  const statuses = ['all', 'Normal', 'Low', 'Critical', 'Out of Stock'];

  const filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchCat = catFilter === 'all' || item.category === catFilter;
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[220px] max-w-xs">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            className="flex-1 text-sm text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Search item or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer"
        >
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
        </select>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer"
        >
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <div className="font-semibold">No items found</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {filtered.map(item => {
            const isZero = item.currentStock <= 0;
            const isCrit = !isZero && item.currentStock <= item.reorderLevel * 0.5;
            const isLow = !isZero && !isCrit && item.currentStock <= item.reorderLevel;
            const stockColor = isZero ? 'text-red-600' : isCrit ? 'text-orange-600' : isLow ? 'text-amber-600' : 'text-emerald-600';
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                onClick={() => onView(item)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* Image area */}
                <div className="h-28 bg-slate-50 relative flex items-center justify-center border-b border-slate-100">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={36} className="text-slate-200" />
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getBadgeStyle(item.status)}`}>
                    {item.status}
                  </span>
                  {/* Category */}
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white">
                    {item.category}
                  </span>
                </div>
                {/* Content */}
                <div className="p-3">
                  <div className="font-black text-slate-800 text-sm truncate mb-0.5">{item.name}</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400 font-mono">{item.sku}</span>
                    <span className="text-sm font-black text-slate-700">₹{item.price?.toFixed(0)}</span>
                  </div>
                  <StockBar current={item.currentStock} reorder={item.reorderLevel} />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">{item.unit}</span>
                      <span className={`text-sm font-black ${stockColor}`}>{item.currentStock}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); onAdjust(item); }}
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                        title="Adjust Stock"
                      >
                        <Settings2 size={13} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onDelete(item); }}
                        className="p-1.5 bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        // List view
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">In Stock</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Reorder</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const isZero = item.currentStock <= 0;
                const isCrit = !isZero && item.currentStock <= item.reorderLevel * 0.5;
                const isLow = !isZero && !isCrit && item.currentStock <= item.reorderLevel;
                const stockColor = isZero ? 'text-red-600' : isCrit ? 'text-orange-600' : isLow ? 'text-amber-600' : 'text-emerald-600';
                return (
                  <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                    onClick={() => onView(item)}>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{item.category}</span></td>
                    <td className={`px-4 py-3 text-right font-black ${stockColor}`}>{item.currentStock} {item.unit}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{item.reorderLevel} {item.unit}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getBadgeStyle(item.status)}`}>{item.status}</span></td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">₹{(item.currentStock * item.cost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={e => { e.stopPropagation(); onAdjust(item); }} className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"><Settings2 size={14} /></button>
                        <button onClick={e => { e.stopPropagation(); onDelete(item); }} className="p-1.5 border border-red-100 bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Adjustments Tab ───────────────────────────────────────────────────
function AdjustmentsTab({ adjustments }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 800 }}>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Qty Adjusted</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Performed By</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-slate-400"><ClipboardList size={40} className="mx-auto mb-3 opacity-30" /><div>No stock adjustments recorded yet.</div></td></tr>
            ) : adjustments.map((item, i) => (
              <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                <td className="px-4 py-3 text-blue-600 font-mono text-xs font-bold">{item.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Clock size={12} />
                    {new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-800">{item.itemName}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{item.reason}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-black text-base ${item.quantityChange > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{item.performedBy}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Audit Log Tab ─────────────────────────────────────────────────────
function AuditLogTab({ ledger }) {
  const typeIcon = (type) => {
    switch (type) {
      case 'ADJUSTMENT': return <RotateCcw size={13} className="text-amber-500" />;
      case 'RECEIVED': return <ArrowUpCircle size={13} className="text-emerald-500" />;
      case 'DELETION': return <Trash2 size={13} className="text-red-500" />;
      case 'ITEM_CREATED': return <Plus size={13} className="text-blue-500" />;
      default: return <ClipboardList size={13} className="text-slate-400" />;
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 900 }}>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Log ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User / System</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-slate-400"><ClipboardList size={40} className="mx-auto mb-3 opacity-30" /><div>No stock movements recorded yet.</div></td></tr>
            ) : ledger.map((item, i) => (
              <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.id.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Clock size={12} />
                    {new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{item.performedBy || 'System'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {typeIcon(item.type)}
                    <span className="font-bold text-slate-700 text-xs">{item.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  <span className="font-bold text-slate-700">{item.itemName}</span>
                  {' '}
                  (<span className={item.quantityChange >= 0 ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                    {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
                  </span>)
                  {' – '}{item.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Add Item Modal ────────────────────────────────────────────────────
function AddItemModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', sku: '', category: '', unit: 'kg',
    currentStock: '', reorderLevel: '', cost: '', price: '', image: null,
  });
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const CATEGORIES = ['Raw Materials', 'Packaging', 'Ingredients', 'Beverages', 'Dairy', 'Vegetables', 'Meat', 'Grains', 'Oil', 'Spices', 'Dry Goods', 'Other'];
  const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'box', 'dozen'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Item name is required.');
    if (!form.sku.trim()) return setError('SKU is required.');
    if (!form.category) return setError('Category is required.');
    const stock = parseFloat(form.currentStock);
    const reorder = parseFloat(form.reorderLevel);
    const cost = parseFloat(form.cost);
    if (isNaN(stock) || stock < 0) return setError('Valid initial stock required.');
    if (isNaN(reorder) || reorder < 0) return setError('Valid reorder level required.');
    const status = stock <= 0 ? 'Out of Stock' : stock <= reorder * 0.5 ? 'Critical' : stock <= reorder ? 'Low' : 'Normal';
    onSave({
      name: form.name.trim(), sku: form.sku.trim(), category: form.category,
      unit: form.unit, currentStock: stock, inStock: stock, minStock: reorder,
      reorderLevel: reorder, cost: isNaN(cost) ? 0 : cost,
      price: isNaN(parseFloat(form.price)) ? 0 : parseFloat(form.price),
      status, image: form.image, reserved: 0,
      lastCounted: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Add Inventory Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Name *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Butter Chicken Masala" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">SKU *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. SPI-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Unit</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white" value={form.unit} onChange={e => set('unit', e.target.value)}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Initial Stock *</label>
                <input type="number" step="0.1" min="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={form.currentStock} onChange={e => set('currentStock', e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reorder Level *</label>
                <input type="number" step="0.1" min="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={form.reorderLevel} onChange={e => set('reorderLevel', e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cost Price (₹)</label>
                <input type="number" step="0.01" min="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Unit Price (₹)</label>
                <input type="number" step="0.01" min="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Image</label>
              <div
                onClick={() => set('image', form.image ? null : 'https://picsum.photos/seed/' + uid() + '/200')}
                className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-full h-24 object-cover rounded-lg" />
                ) : (
                  <>
                    <Upload size={24} className="text-slate-300" />
                    <span className="text-xs text-slate-400">Click to mock-upload image</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
              <Save size={15} /> Save Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Inventory Action Modal (adjust / quarantine / transfer / etc.) ─────
function ActionModal({ visible, onClose, type, initialItem, inventory, onSubmit }) {
  const [productSearch, setProductSearch] = useState(initialItem?.name || '');
  const [selectedProduct, setSelectedProduct] = useState(initialItem || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adjType, setAdjType] = useState('remove');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const ADD_REASONS = ['Stock Correction (Found)', 'Supplier Over-delivery', 'Customer Return', 'Other Addition'];
  const REMOVE_REASONS = ['Stock Correction (Lost)', 'Damage/Spoilage', 'Promotional/Giveaway', 'Return to Supplier', 'Theft/Loss'];
  const QUARANTINE_REASONS = ['Damaged in Transit', 'Quality Check Pending', 'Expired/Spoiled', 'Recall'];

  const titles = {
    adjustments: 'Inventory Adjustment',
    quarantine: 'Log Quarantine Issue',
    transfers: 'New Stock Transfer',
    replenish: 'Order Replenishment',
    count: 'Start Stock Count',
  };

  const filteredItems = inventory.filter(i =>
    i.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (i.sku || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedProduct) return setError('Please select a product.');
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return setError('Valid quantity is required.');
    if (!reason) return setError('Reason is required.');
    const delta = (type === 'adjustments' && adjType === 'remove') || type === 'quarantine' ? -qty : qty;
    onSubmit(selectedProduct, delta, reason, notes);
    onClose();
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">{titles[type] || 'Inventory Action'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {/* Product selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Product</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  className="flex-1 text-sm outline-none text-slate-700"
                  placeholder="Search by name or SKU..."
                  value={productSearch}
                  onChange={e => { setProductSearch(e.target.value); setSelectedProduct(null); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                />
                {selectedProduct && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Selected</span>}
              </div>
              {showDropdown && productSearch && !selectedProduct && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredItems.slice(0, 8).map(item => (
                    <div key={item.id} onClick={() => { setSelectedProduct(item); setProductSearch(item.name); setShowDropdown(false); }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0">
                      <div>
                        <div className="font-bold text-sm text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.sku}</div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.currentStock} {item.unit}</span>
                    </div>
                  ))}
                  {filteredItems.length === 0 && <div className="px-4 py-3 text-sm text-slate-400">No items found</div>}
                </div>
              )}
            </div>

            {/* Adjustment type toggle (only for adjustments) */}
            {type === 'adjustments' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Action</label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1 gap-1">
                  <button type="button" onClick={() => { setAdjType('add'); setReason(''); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${adjType === 'add' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    <ArrowUpCircle size={14} className="inline mr-1.5" />Add Stock
                  </button>
                  <button type="button" onClick={() => { setAdjType('remove'); setReason(''); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${adjType === 'remove' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    <ArrowDownCircle size={14} className="inline mr-1.5" />Remove Stock
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
                <input type="number" step="0.1" min="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reason</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-slate-400"
                  value={reason} onChange={e => setReason(e.target.value)}>
                  <option value="">Select...</option>
                  {(type === 'quarantine' ? QUARANTINE_REASONS : adjType === 'add' ? ADD_REASONS : REMOVE_REASONS).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProduct && quantity && (
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm border border-slate-200">
                <span className="text-slate-500">New stock will be: </span>
                <span className="font-black text-slate-800">
                  {Math.max(0, (selectedProduct.currentStock || 0) + ((type === 'adjustments' && adjType === 'remove') || type === 'quarantine' ? -1 : 1) * Math.abs(parseFloat(quantity) || 0)).toFixed(1)} {selectedProduct.unit}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Additional Notes</label>
              <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:border-slate-400"
                rows={3} placeholder="Optional notes..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
              <Save size={15} /> Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Item Detail Modal ─────────────────────────────────────────────────
function ItemDetailModal({ item, onClose, onAdjust }) {
  if (!item) return null;
  const stockColor = item.currentStock <= 0 ? 'text-red-600' : item.currentStock <= item.reorderLevel * 0.5 ? 'text-orange-600' : item.currentStock <= item.reorderLevel ? 'text-amber-600' : 'text-emerald-600';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-800">Item Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {item.image && <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-xl" />}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-black text-slate-800">{item.name}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">{item.sku}</div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getBadgeStyle(item.status)}`}>{item.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Category', item.category],
              ['Unit', item.unit],
              ['In Stock', <span className={`font-black ${stockColor}`}>{item.currentStock}</span>],
              ['Reorder At', item.reorderLevel],
              ['Cost Price', `₹${item.cost}`],
              ['Unit Price', `₹${item.price}`],
              ['Reserved', item.reserved || 0],
              ['Last Counted', item.lastCounted],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-sm font-bold text-slate-800">{value}</div>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <StockBar current={item.currentStock} reorder={item.reorderLevel} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Close</button>
          <button onClick={() => { onClose(); onAdjust(item); }} className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-700 transition-colors">Adjust Stock</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────
function DeleteConfirmModal({ item, onConfirm, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Delete Item?</h2>
        <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete <strong className="text-slate-800">{item.name}</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ── Main Page ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
export default function InventoryPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { inventory, stockAdjustments, stockLedger, metrics, addInventoryItem, deleteInventoryItem, adjustStock, logStockMovement } = useInventory();

  const [activeTab, setActiveTab] = useState('stock');
  const [showAdd, setShowAdd] = useState(false);
  const [actionModal, setActionModal] = useState({ visible: false, type: 'adjustments', item: null });
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const TABS = [
    { key: 'stock', label: 'Stock List', icon: Package },
    { key: 'adjustments', label: 'Adjustments', icon: RotateCcw },
    { key: 'audit', label: 'Audit Log', icon: ClipboardList },
  ];

  const FAB_ACTIONS = [
    { key: 'adjustments', label: 'Adjustment', icon: RotateCcw, color: 'bg-blue-500' },
    { key: 'quarantine', label: 'Quarantine', icon: ShieldAlert, color: 'bg-orange-500' },
    { key: 'transfers', label: 'Transfer', icon: TrendingUp, color: 'bg-purple-500' },
    { key: 'replenish', label: 'Replenish', icon: ArrowUpCircle, color: 'bg-emerald-500' },
  ];
  const [showFabMenu, setShowFabMenu] = useState(false);

  const handleAddItem = (item) => {
    addInventoryItem(item);
    logStockMovement({ type: 'ITEM_CREATED', itemId: uid(), itemName: item.name, quantityChange: item.currentStock, reason: 'Initial setup', performedBy: 'Admin' });
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    logStockMovement({ type: 'DELETION', itemId: deleteItem.id, itemName: deleteItem.name, quantityChange: -deleteItem.currentStock, reason: 'Item deleted from inventory', performedBy: 'Admin' });
    deleteInventoryItem(deleteItem.id);
    setDeleteItem(null);
  };

  const handleActionSubmit = (product, delta, reason, notes) => {
    adjustStock(product.id, product.name, delta, reason, 'Admin');
  };

  const now = new Date();
  const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Inventory</h1>
              <p className="text-slate-400 text-sm mt-0.5">{dateString}</p>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-700 transition-colors shadow-lg shadow-slate-800/20">
              <Plus size={16} /> Add Item
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors ${activeTab === t.key
                  ? 'border-slate-800 text-slate-800 bg-slate-50'
                  : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <SummaryCard title="Total Stock Value" value={`₹${(metrics.totalValue / 1000).toFixed(1)}K`} sub={`${metrics.totalItems} items`} icon={<Package size={22} className="text-blue-600" />} iconBg="bg-blue-50" color="text-blue-600" />
            <SummaryCard title="Low Stock Alerts" value={metrics.lowStockCount} sub="Needs restock" icon={<AlertTriangle size={22} className="text-amber-500" />} iconBg="bg-amber-50" color="text-amber-600" />
            <SummaryCard title="Out of Stock" value={metrics.outOfStockCount} sub="Zero quantity" icon={<ShieldAlert size={22} className="text-red-500" />} iconBg="bg-red-50" color="text-red-600" />
            <SummaryCard title="Quarantine" value={metrics.quarantineCount} sub="Awaiting inspection" icon={<ClipboardList size={22} className="text-purple-500" />} iconBg="bg-purple-50" color="text-purple-600" />
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {activeTab === 'stock' && (
                <StockListTab
                  inventory={inventory}
                  onAdjust={item => setActionModal({ visible: true, type: 'adjustments', item })}
                  onView={setViewItem}
                  onDelete={setDeleteItem}
                />
              )}
              {activeTab === 'adjustments' && <AdjustmentsTab adjustments={stockAdjustments} />}
              {activeTab === 'audit' && <AuditLogTab ledger={stockLedger} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-40">
        <AnimatePresence>
          {showFabMenu && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute bottom-16 right-0 flex flex-col gap-2 items-end mb-2">
              {FAB_ACTIONS.map(action => (
                <button key={action.key}
                  onClick={() => { setActionModal({ visible: true, type: action.key, item: null }); setShowFabMenu(false); }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 ${action.color} text-white font-bold rounded-2xl text-sm shadow-lg whitespace-nowrap`}>
                  <action.icon size={15} /> {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => { if (activeTab === 'stock') setShowAdd(true); else setShowFabMenu(v => !v); }}
          className="w-14 h-14 rounded-full bg-slate-800 text-white shadow-2xl flex items-center justify-center hover:bg-slate-700 transition-all"
        >
          <Plus size={24} className={`transition-transform ${showFabMenu ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Modals */}
      {showAdd && <AddItemModal onSave={handleAddItem} onClose={() => setShowAdd(false)} />}
      {actionModal.visible && (
        <ActionModal
          visible={actionModal.visible}
          type={actionModal.type}
          initialItem={actionModal.item}
          inventory={inventory}
          onSubmit={handleActionSubmit}
          onClose={() => setActionModal({ visible: false, type: 'adjustments', item: null })}
        />
      )}
      {viewItem && <ItemDetailModal item={viewItem} onClose={() => setViewItem(null)} onAdjust={item => { setActionModal({ visible: true, type: 'adjustments', item }); }} />}
      {deleteItem && <DeleteConfirmModal item={deleteItem} onConfirm={handleConfirmDelete} onClose={() => setDeleteItem(null)} />}
    </div>
  );
}
