'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function HyperpurePage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', color: 'var(--color-text-primary)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>Explore Hyperpure</h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>Source fresh ingredients directly from certified suppliers.</p>
            </div>
            <Button variant="accent">
              Browse Catalog
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {['Fresh Vegetables', 'Dairy & Poultry', 'Spices & Staples', 'Packaging Material'].map(cat => (
              <Card key={cat} style={{ padding: 20 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, color: 'var(--color-text-primary)' }}>{cat}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>High quality supplies delivered tomorrow morning.</p>
                <Button variant="surface" size="sm" style={{ width: '100%' }}>
                  View Items
                </Button>
              </Card>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
