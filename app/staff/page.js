"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DataTable from '../components/DataTable';
import { useStaff } from '../components/Providers';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const ROLES = ['Owner', 'Manager', 'Cashier', 'Waiter', 'Kitchen', 'Inventory'];
const ROLE_COLORS = { Owner: '#ff6b35', Manager: '#8b5cf6', Cashier: '#38bdf8', Waiter: '#10b981', Kitchen: '#f59e0b', Inventory: '#f43f5e' };

function StaffModal({ member, onSave, onClose }) {
  const [form, setForm] = useState(member || { name: '', role: 'Waiter', phone: '', email: '', pin: '', salary: '', active: true });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal isOpen={true} onClose={onClose} title={member ? 'Edit Staff Member' : 'Add Staff Member'}>
      <form onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Full Name *</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Rajan Verma" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Role *</label>
              <select className="input select" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Phone</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Email</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>4-Digit PIN</label>
              <input className="input" type="password" maxLength={4} value={form.pin} onChange={e => set('pin', e.target.value)} placeholder="••••" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>Monthly Salary (₹)</label>
              <input className="input" type="number" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="22000" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Active (can clock-in)</span>
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="surface" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="accent">Save</Button>
          </div>
        </form>
    </Modal>
  );
}

export default function StaffPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  const handleSave = (data) => {
    if (editMember) updateStaff(editMember.id, data);
    else addStaff(data);
    setEditMember(null);
  };

  const filteredStaff = staff.filter(s => roleFilter === 'all' || s.role === roleFilter);
  const totalSalary = staff.reduce((s, m) => s + (Number(m.salary) || 0), 0);

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      render: (_, row) => {
        const initials = (row.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        const color = ROLE_COLORS[row.role] || 'var(--color-text-muted)';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 99,
              background: color + '25', border: `1px solid ${color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: color, flexShrink: 0
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>{row.name || 'Unknown'}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>ID: {row.id}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'role',
      label: 'Role',
      render: (_, row) => {
        const color = ROLE_COLORS[row.role] || 'var(--color-text-muted)';
        return (
          <span style={{ background: color + '20', color: color, padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
            {row.role}
          </span>
        );
      }
    },
    {
      key: 'active',
      label: 'Status',
      render: (_, row) => (
        <Badge variant={row.active ? 'emerald' : 'muted'} style={{ fontSize: 11 }}>
          {row.active ? '● Active' : '○ Inactive'}
        </Badge>
      )
    },
    {
      key: 'salary',
      label: 'Salary',
      align: 'right',
      render: (_, row) => row.salary ? `₹${Number(row.salary).toLocaleString('en-IN')}` : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Button variant="surface" size="sm" onClick={() => { setEditMember(row); setShowModal(true); }}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => { if (confirm('Remove staff member?')) deleteStaff(row.id); }}>Remove</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20, flexShrink: 0 }}>
            <Card className="card-sm"><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)' }}>{staff.length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Total Staff</div></Card>
            <Card className="card-sm"><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-emerald)' }}>{staff.filter(s => s.active).length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Active</div></Card>
            <Card className="card-sm"><div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-amber)' }}>₹{totalSalary.toLocaleString('en-IN')}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Monthly Payroll</div></Card>
            <Card className="card-sm"><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-violet)' }}>{ROLES.filter(r => staff.some(s => s.role === r)).length}</div><div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>Roles Filled</div></Card>
          </div>

          <DataTable 
            data={filteredStaff}
            columns={columns}
            searchPlaceholder="Search staff by name or phone..."
            onAdd={() => { setEditMember(null); setShowModal(true); }}
            addLabel="Add Staff"
            emptyIcon="👥"
            emptyMessage="No staff members found"
            CustomFilters={() => (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Button size="sm" variant={roleFilter === 'all' ? 'accent' : 'surface'} onClick={() => setRoleFilter('all')}>All</Button>
                {ROLES.map(r => (
                  <Button key={r} size="sm" variant={roleFilter === r ? 'accent' : 'surface'}
                    style={{ borderColor: roleFilter === r ? undefined : ROLE_COLORS[r] + '44', color: roleFilter === r ? '#fff' : ROLE_COLORS[r] }}
                    onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}>
                    {r}
                  </Button>
                ))}
              </div>
            )}
          />
        </main>
      </div>

      {showModal && (
        <StaffModal
          member={editMember}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditMember(null); }}
        />
      )}
    </div>
  );
}
