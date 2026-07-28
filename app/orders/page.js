'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useOrders } from '../components/Providers';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';

const STATUS_PIPELINE = ['received', 'preparing', 'ready', 'served'];
const STATUS_COLORS = {
  received: '#f59e0b', preparing: '#38bdf8',
  ready: '#10b981', served: '#6b7280', cancelled: '#f43f5e',
};
const STATUS_ICONS = { received: '🔔', preparing: '🍳', ready: '✅', served: '🍽️', cancelled: '✕' };

function OrderCard({ order, onAdvance, onCancel }) {
  const elapsed = Math.round((Date.now() - new Date(order.createdAt)) / 60000);
  const isLate = elapsed > 20 && order.status !== 'served' && order.status !== 'cancelled';
  const canAdvance = order.status !== 'served' && order.status !== 'cancelled';
  const nextStatus = STATUS_PIPELINE[STATUS_PIPELINE.indexOf(order.status) + 1];
  const color = STATUS_COLORS[order.status];

  return (
    <Card style={{ borderColor: isLate ? 'var(--color-rose)' : undefined, padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: 14 }}>{order.id}</span>
            <Badge variant={order.type === 'dine-in' ? 'sky' : order.type === 'takeaway' ? 'amber' : 'violet'}>
              {order.type}
            </Badge>
            {isLate && <Badge variant="rose">⚠ Late</Badge>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {order.tableName ? `Table: ${order.tableName}` : order.customerName}
            {' · '}{elapsed}m ago
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
          background: color + '20', borderRadius: 99, fontSize: 12, fontWeight: 600, color,
        }}>
          {STATUS_ICONS[order.status]} {order.status}
        </div>
      </div>

      {/* Items */}
      <div style={{ background: 'var(--color-surface2)', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13, borderBottom: i < order.items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <span style={{ color: 'var(--color-text-primary)' }}>× {item.qty}  {item.name}</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
          ₹{order.total?.toLocaleString('en-IN')}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {order.status !== 'cancelled' && order.status !== 'served' && (
            <Button variant="danger" size="sm" onClick={() => onCancel(order.id)}>Cancel</Button>
          )}
          {canAdvance && nextStatus && (
            <Button variant="accent" size="sm" onClick={() => onAdvance(order.id)}>
              Mark {nextStatus} →
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function OrdersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { orders, advanceStatus, cancelOrder } = useOrders();
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleCancel = (id) => {
    const reason = window.prompt('Cancellation reason:');
    if (reason !== null) cancelOrder(id, reason || 'No reason given');
  };

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (typeFilter !== 'all' && o.type !== typeFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !(o.customerName || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = STATUS_PIPELINE.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Status pipeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {STATUS_PIPELINE.map(s => (
              <div key={s} style={{
                background: 'var(--color-surface)', border: `1px solid ${STATUS_COLORS[s]}33`,
                borderRadius: 12, padding: '14px 16px',
                cursor: 'pointer', borderBottom: filter === s ? `2px solid ${STATUS_COLORS[s]}` : undefined,
              }}
                onClick={() => setFilter(filter === s ? 'all' : s)}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: STATUS_COLORS[s] }}>{counts[s] || 0}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'capitalize', marginTop: 3 }}>
                  {STATUS_ICONS[s]} {s}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <input className="input" placeholder="Search order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
            <Tabs 
              tabs={[
                { id: 'all', label: 'All Types' },
                { id: 'dine-in', label: 'dine-in' },
                { id: 'takeaway', label: 'takeaway' },
                { id: 'delivery', label: 'delivery' }
              ]}
              activeTab={typeFilter}
              onChange={setTypeFilter}
              className="flex-none"
            />
            <Button variant="surface" size="sm" onClick={() => { setFilter('all'); setTypeFilter('all'); setSearch(''); }}>
              Reset
            </Button>
          </div>

          {/* Orders grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 40 }}>📋</div>
              <div style={{ marginTop: 12, fontWeight: 600 }}>No orders found</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {filtered.map(o => (
                <OrderCard key={o.id} order={o} onAdvance={advanceStatus} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
