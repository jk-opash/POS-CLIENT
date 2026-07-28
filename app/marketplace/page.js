'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function MarketplacePage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', color: 'var(--color-text-primary)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>Marketplace</h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>Integrate with third-party aggregators and delivery partners.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {['Zomato Integration', 'Swiggy Integration', 'Dunzo Delivery', 'WhatsApp Ordering'].map((app, i) => (
              <Card key={app} style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {i === 0 ? '🍅' : i === 1 ? '🍔' : i === 2 ? '🛵' : '💬'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: 'var(--color-text-primary)' }}>{app}</h3>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Status: Not Connected</p>
                </div>
                <Button size="sm" variant="surface" style={{ color: 'var(--color-emerald)', borderColor: 'rgba(16,185,129,0.3)' }}>
                  Connect
                </Button>
              </Card>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
