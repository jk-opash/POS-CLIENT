'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function AppsPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', color: 'var(--color-text-primary)' }}>
          
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>Petpooja APPs</h1>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>Discover and install add-ons for your POS ecosystem.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { name: 'Waiter App', desc: 'Take orders directly from the table.', icon: '📱' },
              { name: 'Captain App', desc: 'Manage tables, reservations, and feedback.', icon: '👨‍✈️' },
              { name: 'Owner Dashboard', desc: 'Real-time analytics on your mobile.', icon: '📈' },
            ].map((app) => (
              <Card key={app.name} style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-surface2)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {app.icon}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: 'var(--color-text-primary)' }}>{app.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 12px 0', lineHeight: 1.4 }}>{app.desc}</p>
                  <Button variant="surface" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
