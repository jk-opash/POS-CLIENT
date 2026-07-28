'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useOrders, useMenu, useInventory } from '../components/Providers';
import DataTable from '../components/DataTable';

function MiniBar({ value, max, color = '#ff6b35' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: 'var(--color-surface2)', borderRadius: 99, height: 6 }}>
        <div style={{ height: 6, borderRadius: 99, background: color, width: `${Math.min(100, (value / max) * 100)}%`, transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 32, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function SummaryCard({ label, value, sub, color = '#ff6b35', icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="stat-label">{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div className="stat-value" style={{ color, fontSize: 24 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{sub}</div>}
    </div>
  );
}

export default function ReportsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { orders } = useOrders();
  const { items, categories } = useMenu();
  const { inventory } = useInventory();
  const [tab, setTab] = useState('sales');

  // ── derived stats ──────────────────────────
  const completedOrders = orders.filter(o => !['cancelled'].includes(o.status));
  const totalRevenue = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrderValue = completedOrders.length ? Math.round(totalRevenue / completedOrders.length) : 0;

  // Item sales (simulated from menu item prices)
  const itemSales = items.map((item, i) => ({
    ...item,
    sold: Math.round(10 + Math.random() * 50 + i * 3),
    revenue: Math.round((10 + Math.random() * 50 + i * 3) * item.price),
  })).sort((a, b) => b.revenue - a.revenue);

  const maxRevenue = itemSales[0]?.revenue || 1;

  // Category breakdown
  const catRevenue = categories.map(cat => ({
    ...cat,
    revenue: itemSales.filter(i => i.categoryId === cat.id).reduce((s, i) => s + i.revenue, 0),
  })).sort((a, b) => b.revenue - a.revenue);
  const maxCatRevenue = catRevenue[0]?.revenue || 1;

  // Order type breakdown
  const byType = ['dine-in', 'takeaway', 'delivery'].map(t => ({
    type: t,
    count: orders.filter(o => o.type === t).length,
    revenue: orders.filter(o => o.type === t).reduce((s, o) => s + (o.total || 0), 0),
  }));

  // Hourly (mocked)
  const hours = Array.from({ length: 14 }, (_, i) => ({
    hour: `${i + 8}:00`,
    orders: Math.round(Math.random() * 8 + (i >= 4 && i <= 6 ? 8 : 2)),
    revenue: Math.round(Math.random() * 4000 + 1000),
  }));
  const maxHourOrders = Math.max(...hours.map(h => h.orders));

  // Inventory consumption
  const stockAlerts = inventory.filter(i => i.currentStock <= i.minStock);

  const tabs = [
    { key: 'sales', label: '💰 Sales' },
    { key: 'items', label: '🍽️ Items' },
    { key: 'hourly', label: '⏰ Hourly' },
    { key: 'inventory', label: '📦 Inventory' },
  ];

  const inventoryColumns = [
    { key: 'name', label: 'Ingredient', render: (_, row) => <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.name}</span> },
    { key: 'category', label: 'Category', render: (_, row) => <span className="badge badge-muted">{row.category}</span> },
    { 
      key: 'stock', 
      label: 'Stock', 
      render: (_, row) => {
        const isOut = row.currentStock <= 0;
        const isLow = !isOut && row.currentStock <= row.minStock;
        return <span style={{ fontWeight: 600, color: isOut ? '#f43f5e' : isLow ? '#f59e0b' : '#10b981' }}>{row.currentStock} {row.unit}</span>;
      } 
    },
    { key: 'minStock', label: 'Min Level', render: (_, row) => <span style={{ color: 'var(--color-text-secondary)' }}>{row.minStock} {row.unit}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: false,
      render: (_, row) => {
        const isOut = row.currentStock <= 0;
        const isLow = !isOut && row.currentStock <= row.minStock;
        return (
          <span className={`badge ${isOut ? 'badge-rose' : isLow ? 'badge-amber' : 'badge-emerald'}`}>
            {isOut ? 'OUT' : isLow ? 'LOW' : 'OK'}
          </span>
        );
      }
    },
    { key: 'stockValue', label: 'Stock Value', render: (_, row) => <span style={{ fontWeight: 600 }}>₹{(row.currentStock * row.cost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="tab-bar">
              {tabs.map(t => (
                <button key={t.key} className={`tab-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
            <button className="btn btn-surface btn-sm" style={{ marginLeft: 'auto' }}>📤 Export Report</button>
          </div>

          {/* SALES TAB */}
          {tab === 'sales' && (
            <div className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                <SummaryCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} color="#ff6b35" icon="💰" />
                <SummaryCard label="Completed Orders" value={completedOrders.length} color="#38bdf8" icon="✅" />
                <SummaryCard label="Avg Order Value" value={`₹${avgOrderValue}`} color="#10b981" icon="📈" />
                <SummaryCard label="Cancelled Orders" value={orders.filter(o => o.status === 'cancelled').length} color="#f43f5e" icon="✕" />
              </div>

              {/* Order type cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {byType.map(t => (
                  <div key={t.type} className="card">
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'capitalize', marginBottom: 8 }}>
                      {t.type === 'dine-in' ? '🪑' : t.type === 'takeaway' ? '📦' : '🛵'} {t.type}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: t.type === 'dine-in' ? '#38bdf8' : t.type === 'takeaway' ? '#f59e0b' : '#8b5cf6', marginBottom: 4 }}>{t.count}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)' }}>₹{t.revenue.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              {/* Category revenue bars */}
              <div className="card">
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <span className="section-title">Revenue by Category</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {catRevenue.map(cat => (
                    <div key={cat.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{cat.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: cat.color || '#ff6b35' }}>₹{cat.revenue.toLocaleString('en-IN')}</span>
                      </div>
                      <MiniBar value={Math.round(cat.revenue / 1000)} max={Math.round(maxCatRevenue / 1000)} color={cat.color || '#ff6b35'} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ITEMS TAB */}
          {tab === 'items' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top sellers */}
                <div className="card">
                  <div className="section-header" style={{ marginBottom: 14 }}>
                    <span className="section-title">🏆 Top Sellers (by Revenue)</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {itemSales.slice(0, 8).map((item, idx) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: 99, flexShrink: 0,
                          background: idx < 3 ? 'rgba(245,158,11,0.2)' : 'var(--color-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: idx < 3 ? '#f59e0b' : 'var(--color-text-muted)',
                        }}>
                          {idx + 1}
                        </div>
                        <span style={{
                          display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                          background: item.vegetarian ? '#10b981' : '#f43f5e', flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <MiniBar value={item.sold} max={itemSales[0]?.sold || 1} color="#ff6b35" />
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 70 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>₹{item.revenue.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{item.sold} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Worst sellers */}
                <div className="card">
                  <div className="section-header" style={{ marginBottom: 14 }}>
                    <span className="section-title">📉 Slow Movers</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[...itemSales].reverse().slice(0, 8).map((item, idx) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                          background: item.vegetarian ? '#10b981' : '#f43f5e', flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <MiniBar value={item.sold} max={itemSales[0]?.sold || 1} color="#f43f5e" />
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 70 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#f43f5e' }}>₹{item.revenue.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{item.sold} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOURLY TAB */}
          {tab === 'hourly' && (
            <div className="animate-fade-in">
              <div className="card">
                <div className="section-header" style={{ marginBottom: 20 }}>
                  <span className="section-title">📊 Hourly Order Volume (Today)</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Simulated data</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, overflowX: 'auto', paddingBottom: 4 }}>
                  {hours.map(h => (
                    <div key={h.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 42 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#ff6b35', marginBottom: 2 }}>{h.orders}</div>
                      <div style={{
                        width: 32,
                        height: `${Math.max(6, (h.orders / maxHourOrders) * 120)}px`,
                        borderRadius: '6px 6px 0 0',
                        background: h.orders >= 10 ? '#ff6b35' : h.orders >= 6 ? '#f59e0b' : 'var(--color-border)',
                        transition: 'height 0.5s',
                      }} />
                      <div style={{ fontSize: 9, color: 'var(--color-text-muted)', textAlign: 'center' }}>{h.hour}</div>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Peak Hour</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#ff6b35' }}>{hours.reduce((m, h) => h.orders > m.orders ? h : m).hour}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Peak Orders</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>{Math.max(...hours.map(h => h.orders))}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Avg/Hour</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8' }}>
                      {Math.round(hours.reduce((s, h) => s + h.orders, 0) / hours.length)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {tab === 'inventory' && (
            <div className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div className="card-sm"><div style={{ fontSize: 22, fontWeight: 700 }}>{inventory.length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Total Ingredients</div></div>
                <div className="card-sm"><div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{stockAlerts.filter(i => i.currentStock > 0).length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Low Stock Alerts</div></div>
                <div className="card-sm"><div style={{ fontSize: 22, fontWeight: 700, color: '#f43f5e' }}>{stockAlerts.filter(i => i.currentStock <= 0).length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Out of Stock</div></div>
                <div className="card-sm"><div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>₹{inventory.reduce((s, i) => s + i.currentStock * i.cost, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Total Stock Value</div></div>
              </div>

              <div style={{ height: 400 }}>
                <DataTable 
                  data={inventory.sort((a, b) => (a.currentStock / a.minStock) - (b.currentStock / b.minStock))}
                  columns={inventoryColumns}
                  searchPlaceholder="Search inventory..."
                  emptyMessage="No inventory items found"
                  emptyIcon="📦"
                />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
