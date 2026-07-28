'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { usePurchaseOrders, useSuppliers, useInventory } from '../components/Providers';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const STATUS_COLORS = { pending: '#f59e0b', received: '#10b981', cancelled: '#f43f5e', partial: '#38bdf8' };

function CreatePOModal({ suppliers, inventory, onSave, onClose }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedAt, setExpectedAt] = useState('');
  const [items, setItems] = useState([{ inventoryId: '', name: '', qty: '', unit: 'kg', cost: '' }]);

  const addLine = () => setItems(p => [...p, { inventoryId: '', name: '', qty: '', unit: 'kg', cost: '' }]);
  const removeLine = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateLine = (i, k, v) => setItems(p => p.map((line, idx) => idx === i ? { ...line, [k]: v } : line));

  const pickInventoryItem = (lineIdx, inventoryId) => {
    const inv = inventory.find(i => i.id === inventoryId);
    if (inv) updateLine(lineIdx, 'inventoryId', inventoryId);
    updateLine(lineIdx, 'name', inv?.name || '');
    updateLine(lineIdx, 'unit', inv?.unit || 'kg');
    updateLine(lineIdx, 'cost', inv?.cost || '');
  };

  const total = items.reduce((s, l) => s + (Number(l.qty) * Number(l.cost) || 0), 0);
  const supplier = suppliers.find(s => s.id === supplierId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validItems = items.filter(l => l.name && l.qty && l.cost).map(l => ({
      ...l, qty: Number(l.qty), cost: Number(l.cost), total: Number(l.qty) * Number(l.cost),
    }));
    if (!validItems.length) return alert('Add at least one item');
    onSave({ supplierId, supplierName: supplier?.name, items: validItems, total, expectedAt });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Purchase Order" className="modal-xl">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Supplier *</label>
              <select className="input select" value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Expected Delivery Date</label>
              <input className="input" type="date" value={expectedAt} onChange={e => setExpectedAt(e.target.value)} />
            </div>
          </div>

          <div style={{ border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface2)' }}>
                  {['Ingredient', 'Qty', 'Unit', 'Cost/Unit (₹)', 'Total', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((line, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '6px 8px' }}>
                      <select className="input input-sm select" value={line.inventoryId} onChange={e => pickInventoryItem(i, e.target.value)}>
                        <option value="">Select ingredient</option>
                        {inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '6px 8px' }}>
                      <input className="input input-sm" type="number" step="0.1" value={line.qty} onChange={e => updateLine(i, 'qty', e.target.value)} placeholder="10" style={{ width: 70 }} />
                    </td>
                    <td style={{ padding: '6px 8px' }}>
                      <select className="input input-sm select" value={line.unit} onChange={e => updateLine(i, 'unit', e.target.value)} style={{ width: 70 }}>
                        {['kg', 'g', 'L', 'ml', 'pcs'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '6px 8px' }}>
                      <input className="input input-sm" type="number" value={line.cost} onChange={e => updateLine(i, 'cost', e.target.value)} placeholder="320" style={{ width: 90 }} />
                    </td>
                    <td style={{ padding: '6px 12px', fontWeight: 600, color: '#10b981' }}>
                      ₹{((Number(line.qty) * Number(line.cost)) || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '6px 8px' }}>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeLine(i)} disabled={items.length === 1}>✕</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 12px', background: 'var(--color-surface2)' }}>
              <Button type="button" variant="ghost" size="sm" onClick={addLine}>+ Add Line</Button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Total: <span style={{ color: 'var(--color-accent)' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="button" variant="surface" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="accent">Create PO</Button>
            </div>
          </div>
        </form>
    </Modal>
  );
}

export default function PurchaseOrdersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { purchaseOrders, addPO, updatePO } = usePurchaseOrders();
  const { suppliers } = useSuppliers();
  const { inventory } = useInventory();
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = purchaseOrders.filter(po => statusFilter === 'all' || po.status === statusFilter);
  const totalPending = purchaseOrders.filter(p => p.status === 'pending').reduce((s, p) => s + p.total, 0);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total POs', value: purchaseOrders.length, color: 'var(--color-text-primary)' },
              { label: 'Pending', value: purchaseOrders.filter(p => p.status === 'pending').length, color: '#f59e0b' },
              { label: 'Received', value: purchaseOrders.filter(p => p.status === 'received').length, color: '#10b981' },
              { label: 'Pending Value', value: `₹${totalPending.toLocaleString('en-IN')}`, color: 'var(--color-accent)' },
            ].map(s => (
              <div key={s.label} className="card-sm">
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters & action */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <Tabs
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'received', label: 'Received' },
                { id: 'cancelled', label: 'Cancelled' }
              ]}
              activeTab={statusFilter}
              onChange={setStatusFilter}
            />
            <Button variant="accent" style={{ marginLeft: 'auto' }} onClick={() => setShowCreate(true)}>+ New Purchase Order</Button>
          </div>

          {/* PO Table */}
          <Card style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Expected</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(po => (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{po.id}</td>
                    <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{po.supplierName}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{po.items.length} item{po.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>₹{po.total?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{po.expectedAt || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(po.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span style={{
                        background: STATUS_COLORS[po.status] + '20', color: STATUS_COLORS[po.status],
                        padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      }}>
                        {po.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {po.status === 'pending' && (
                          <Button
                            variant="surface"
                            size="sm"
                            style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}
                            onClick={() => updatePO(po.id, { status: 'received' })}
                          >
                            ✓ Receive
                          </Button>
                        )}
                        {po.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ color: '#f43f5e' }}
                            onClick={() => updatePO(po.id, { status: 'cancelled' })}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No purchase orders found
              </div>
            )}
          </Card>
        </main>
      </div>

      {showCreate && (
        <CreatePOModal
          suppliers={suppliers}
          inventory={inventory}
          onSave={addPO}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
