'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useTables } from '../components/Providers';
import { useOrders } from '../components/Providers';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const STATUS_COLORS = { free: '#10b981', occupied: '#3b82f6', reserved: '#38bdf8', cleaning: '#f59e0b' };
const STATUS_LABELS = { free: 'Free', occupied: 'Occupied', reserved: 'Reserved', cleaning: 'Cleaning' };
const STATUS_ICONS = { free: '✓', occupied: '●', reserved: '⏰', cleaning: '🧹' };

function TableCard({ table, orders, onClick }) {
  const tableOrders = orders.filter(o => o.tableId === table.id && !['served', 'cancelled'].includes(o.status));
  const color = STATUS_COLORS[table.status];
  const total = tableOrders.reduce((s, o) => s + (o.total || 0), 0);
  const elapsed = tableOrders.length > 0
    ? Math.round((Date.now() - new Date(tableOrders[0].createdAt)) / 60000)
    : null;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        border: `2px solid ${color}${table.status === 'free' ? '44' : '88'}`,
        borderRadius: 14,
        padding: '14px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Status glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 50, height: 50, borderRadius: '0 14px 0 100%',
        background: color + '22',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
        paddingTop: 6, paddingRight: 8, fontSize: 14,
      }}>
        {STATUS_ICONS[table.status]}
      </div>

      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>{table.label}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10 }}>👥 {table.seats} seats · {table.floor}</div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 9px', borderRadius: 99,
        background: color + '18', color, fontSize: 11, fontWeight: 600,
        marginBottom: 8,
      }}>
        {STATUS_LABELS[table.status]}
      </div>

      {tableOrders.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 3 }}>
            {tableOrders.length} active order{tableOrders.length > 1 ? 's' : ''}
            {elapsed !== null ? ` · ${elapsed}m` : ''}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-accent)' }}>
            ₹{total.toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </div>
  );
}

function TableModal({ table, orders, onClose, onUpdateStatus }) {
  if (!table) return null;
  const tableOrders = orders.filter(o => o.tableId === table.id && !['cancelled'].includes(o.status));
  const nextStatuses = {
    free: ['occupied', 'reserved'],
    occupied: ['cleaning', 'free'],
    reserved: ['occupied', 'free'],
    cleaning: ['free'],
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Table ${table.label}`}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ background: STATUS_COLORS[table.status] + '20', color: STATUS_COLORS[table.status], padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
          {STATUS_LABELS[table.status]}
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>👥 {table.seats} seats · {table.floor} floor</span>
      </div>

      {/* Change status */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Change Status</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(nextStatuses[table.status] || []).map(s => (
            <Button
              key={s}
              variant="surface"
              size="sm"
              style={{ borderColor: STATUS_COLORS[s] + '44', color: STATUS_COLORS[s] }}
              onClick={() => { onUpdateStatus(table.id, s); onClose(); }}
            >
              {STATUS_ICONS[s]} Mark {STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
      </div>

      {tableOrders.length > 0 && (
        <>
          <div className="divider" />
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Active Orders</div>
          {tableOrders.map(o => (
            <div key={o.id} style={{ background: 'var(--color-surface2)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: 'var(--color-accent)', fontSize: 13 }}>{o.id}</span>
                <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>{o.status}</span>
              </div>
              {o.items.map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>×{item.qty} {item.name}</div>
              ))}
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{o.total?.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </>
      )}

      {tableOrders.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
          No active orders for this table
        </div>
      )}
    </Modal>
  );
}

export default function TablesPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { tables, updateTable } = useTables();
  const { orders } = useOrders();
  const [selectedTable, setSelectedTable] = useState(null);
  const [floorFilter, setFloorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const floors = ['all', ...new Set(tables.map(t => t.floor))];
  const filtered = tables.filter(t => {
    if (floorFilter !== 'all' && t.floor !== floorFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const summary = Object.keys(STATUS_COLORS).reduce((acc, s) => ({
    ...acc, [s]: tables.filter(t => t.status === s).length,
  }), {});

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {Object.entries(STATUS_COLORS).map(([s, c]) => (
              <div
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 14px', borderRadius: 99, cursor: 'pointer',
                  background: statusFilter === s ? c + '22' : 'var(--color-surface)',
                  border: `1px solid ${statusFilter === s ? c + '55' : 'var(--color-border)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 99, background: c }} />
                <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>{STATUS_LABELS[s]}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{summary[s]}</span>
              </div>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {floors.filter(f => f !== 'all').map(floor => (
                <Button
                  key={floor}
                  size="sm"
                  variant={floorFilter === floor ? 'accent' : 'surface'}
                  onClick={() => setFloorFilter(floorFilter === floor ? 'all' : floor)}
                >
                  {floor}
                </Button>
              ))}
            </div>
          </div>

          {/* Tables grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            {filtered.map(table => (
              <TableCard
                key={table.id}
                table={table}
                orders={orders}
                onClick={() => setSelectedTable(table)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Table modal */}
      {selectedTable && (
        <TableModal
          table={selectedTable}
          orders={orders}
          onClose={() => setSelectedTable(null)}
          onUpdateStatus={updateTable}
        />
      )}
    </div>
  );
}
