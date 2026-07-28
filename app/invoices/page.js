'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useInvoices, useSettings } from '../components/Providers';

const PAYMENT_ICONS = { Cash: '💵', UPI: '📲', Card: '💳', Online: '🌐' };

function InvoiceDetailModal({ invoice, settings, onClose }) {
  const cgst = invoice.cgst || Math.round(invoice.subtotal * 0.025);
  const sgst = invoice.sgst || Math.round(invoice.subtotal * 0.025);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Invoice #{invoice.id}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-surface btn-sm" onClick={() => window.print()}>🖨️ Print</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Restaurant header */}
        <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-accent)', marginBottom: 4 }}>{settings.restaurantName}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{settings.address}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{settings.phone}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)' }}>
            <span>GSTIN: {settings.gstin}</span>
            <span>FSSAI: {settings.fssai}</span>
          </div>
        </div>

        {/* Invoice details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Invoice No</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{invoice.id}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Date</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{new Date(invoice.createdAt).toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Customer</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{invoice.customerName || 'Walk-in'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Payment</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{PAYMENT_ICONS[invoice.paymentMethod]} {invoice.paymentMethod}</div>
          </div>
        </div>

        {/* GST breakdown */}
        <div style={{ background: 'var(--color-surface2)', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Subtotal</span>
            <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>₹{invoice.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>CGST (2.5%)</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>₹{cgst}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>SGST (2.5%)</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>₹{sgst}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-accent)' }}>₹{invoice.total?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--color-text-muted)' }}>
          {settings.receiptFooter}
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { invoices } = useInvoices();
  const { settings } = useSettings();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const now = new Date();
  const filtered = invoices.filter(inv => {
    if (search && !inv.id.toLowerCase().includes(search.toLowerCase()) && !(inv.customerName || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFilter === 'today') {
      const d = new Date(inv.createdAt);
      if (d.toDateString() !== now.toDateString()) return false;
    }
    return true;
  });

  const todayTotal = invoices.filter(inv => new Date(inv.createdAt).toDateString() === now.toDateString()).reduce((s, inv) => s + (inv.total || 0), 0);
  const todayGST = invoices.filter(inv => new Date(inv.createdAt).toDateString() === now.toDateString()).reduce((s, inv) => s + ((inv.cgst || 0) + (inv.sgst || 0)), 0);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div className="card-sm"><div style={{ fontSize: 20, fontWeight: 700, color: '#ff6b35' }}>₹{todayTotal.toLocaleString('en-IN')}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Today's Revenue</div></div>
            <div className="card-sm"><div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>₹{todayGST.toLocaleString('en-IN')}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>GST Collected Today</div></div>
            <div className="card-sm"><div style={{ fontSize: 20, fontWeight: 700, color: '#38bdf8' }}>{invoices.length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Total Invoices</div></div>
            <div className="card-sm"><div style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>₹{invoices.reduce((s, inv) => s + (inv.total || 0), 0).toLocaleString('en-IN')}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>All Time Revenue</div></div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input className="input" placeholder="Search invoice or customer..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
            <div className="tab-bar">
              <button className={`tab-item ${dateFilter === 'all' ? 'active' : ''}`} onClick={() => setDateFilter('all')}>All</button>
              <button className={`tab-item ${dateFilter === 'today' ? 'active' : ''}`} onClick={() => setDateFilter('today')}>Today</button>
            </div>
            <button className="btn btn-surface btn-sm" style={{ marginLeft: 'auto' }}>📤 Export</button>
          </div>

          {/* Invoice table */}
          <div className="card" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Order</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Subtotal</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const cgst = inv.cgst || Math.round(inv.subtotal * 0.025);
                  const sgst = inv.sgst || Math.round(inv.subtotal * 0.025);
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{inv.id}</td>
                      <td style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{inv.orderId}</td>
                      <td><span className={`badge badge-${inv.type === 'dine-in' ? 'sky' : inv.type === 'takeaway' ? 'amber' : 'violet'}`}>{inv.type}</span></td>
                      <td style={{ color: 'var(--color-text-primary)' }}>{inv.customerName || 'Walk-in'}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>₹{inv.subtotal}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>₹{cgst}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>₹{sgst}</td>
                      <td style={{ fontWeight: 700, color: '#10b981' }}>₹{inv.total}</td>
                      <td>{PAYMENT_ICONS[inv.paymentMethod]} {inv.paymentMethod}</td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(inv.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedInvoice(inv)}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No invoices found</div>
            )}
          </div>
        </main>
      </div>

      {selectedInvoice && (
        <InvoiceDetailModal invoice={selectedInvoice} settings={settings} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}
