'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useSettings } from '../components/Providers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';

function SettingRow({ label, description, children }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ flex: '1 1 200px', minWidth: 0, paddingRight: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 3 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{description}</div>}
      </div>
      <div style={{ flex: '0 0 auto', maxWidth: '100%' }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 99, cursor: 'pointer', transition: 'background 0.2s',
        background: value ? 'var(--color-accent)' : 'var(--color-surface2)', position: 'relative',
        border: `1px solid ${value ? 'var(--color-accent)' : 'var(--color-border)'}`,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: value ? 22 : 2,
        width: 18, height: 18, borderRadius: 99, background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

const TABS = [
  { id: 'business', label: '🏪 Business' },
  { id: 'tax', label: '📄 Tax & GST' },
  { id: 'receipt', label: '🧾 Receipt' },
  { id: 'features', label: '⚙️ Features' },
];

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { settings, updateSettings } = useSettings();
  const [tab, setTab] = useState('business');
  const [saved, setSaved] = useState(false);

  const set = (k, v) => updateSettings({ [k]: v });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Tabs */}
            <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="mb-5" style={{ marginBottom: 24 }} />

            {/* Business */}
            {tab === 'business' && (
              <Card className="animate-fade-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--color-text-primary)' }}>Business Information</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>Appears on receipts and invoices</div>

                <SettingRow label="Restaurant Name" description="Shown on all bills and receipts">
                  <input className="input" value={settings.restaurantName} onChange={e => set('restaurantName', e.target.value)} style={{ width: '100%', minWidth: 240 }} />
                </SettingRow>
                <SettingRow label="Address" description="Full address for invoices">
                  <textarea className="input" rows={2} value={settings.address} onChange={e => set('address', e.target.value)} style={{ width: '100%', minWidth: 240, resize: 'none' }} />
                </SettingRow>
                <SettingRow label="Phone" description="Contact number on receipts">
                  <input className="input" value={settings.phone} onChange={e => set('phone', e.target.value)} style={{ width: '100%', minWidth: 200 }} />
                </SettingRow>
                <SettingRow label="Currency Symbol" description="Used on all bills">
                  <select className="input select" value={settings.currency} onChange={e => set('currency', e.target.value)} style={{ width: 100 }}>
                    {['₹', '$', '€', '£'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </SettingRow>
                <SettingRow label="Timezone" description="For date/time on reports">
                  <select className="input select" value={settings.timezone} onChange={e => set('timezone', e.target.value)} style={{ width: '100%', minWidth: 200 }}>
                    <option>Asia/Kolkata</option>
                    <option>Asia/Mumbai</option>
                    <option>UTC</option>
                  </select>
                </SettingRow>
              </Card>
            )}

            {/* Tax & GST */}
            {tab === 'tax' && (
              <Card className="animate-fade-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--color-text-primary)' }}>Tax Configuration</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>GST-compliant billing settings</div>

                <SettingRow label="Enable GST" description="Apply CGST + SGST on bills">
                  <Toggle value={settings.gstEnabled} onChange={v => set('gstEnabled', v)} />
                </SettingRow>
                <SettingRow label="GSTIN" description="Your restaurant's GST Identification Number">
                  <input className="input" value={settings.gstin} onChange={e => set('gstin', e.target.value)} style={{ width: 220 }} placeholder="29AABCU9603R1ZV" />
                </SettingRow>
                <SettingRow label="FSSAI License No." description="Food Safety license number on receipts">
                  <input className="input" value={settings.fssai} onChange={e => set('fssai', e.target.value)} style={{ width: 200 }} placeholder="10020012000123" />
                </SettingRow>
                <SettingRow label="Default Tax Rate %" description="Applied to items without a specific rate">
                  <select className="input select" value={settings.taxRate} onChange={e => set('taxRate', Number(e.target.value))} style={{ width: 80 }}>
                    {[0, 5, 12, 18].map(t => <option key={t} value={t}>{t}%</option>)}
                  </select>
                </SettingRow>
                <SettingRow label="Service Charge" description="Optional % added to the bill total">
                  <Toggle value={settings.serviceChargeEnabled} onChange={v => set('serviceChargeEnabled', v)} />
                </SettingRow>
                {settings.serviceChargeEnabled && (
                  <SettingRow label="Service Charge %" description="">
                    <input className="input" type="number" value={settings.serviceCharge} onChange={e => set('serviceCharge', Number(e.target.value))} style={{ width: 80 }} min="0" max="20" />
                  </SettingRow>
                )}
                <div style={{
                  marginTop: 16, padding: '12px 14px',
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 10, fontSize: 12, color: '#f59e0b',
                }}>
                  💡 <strong>E-Invoice (IRN) hook</strong> is ready but dormant. Mandatory above ₹5 crore turnover. Enable in future without redeploy.
                </div>
              </Card>
            )}

            {/* Receipt */}
            {tab === 'receipt' && (
              <Card className="animate-fade-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--color-text-primary)' }}>Receipt & Invoice</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>Customize what appears on printed receipts</div>

                <SettingRow label="Footer Message" description="Shown at the bottom of every receipt">
                  <input className="input" value={settings.receiptFooter} onChange={e => set('receiptFooter', e.target.value)} style={{ width: 280 }} placeholder="Thank you for dining!" />
                </SettingRow>
                <SettingRow label="Show GSTIN on receipt" description="">
                  <Toggle value={settings.gstEnabled} onChange={v => set('gstEnabled', v)} />
                </SettingRow>
                <SettingRow label="Show FSSAI on receipt" description="">
                  <Toggle value={true} onChange={() => {}} />
                </SettingRow>

                {/* Receipt preview */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: 11 }}>RECEIPT PREVIEW</div>
                  <div style={{
                    background: '#fff', color: '#111', borderRadius: 8,
                    padding: '16px', maxWidth: 300, margin: '0 auto',
                    fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7,
                  }}>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{settings.restaurantName}</div>
                    <div style={{ textAlign: 'center', fontSize: 10, color: '#555' }}>{settings.address}</div>
                    <div style={{ textAlign: 'center', fontSize: 10, color: '#555' }}>Ph: {settings.phone}</div>
                    <div style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paneer Tikka ×2</span><span>₹640</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Butter Naan ×3</span><span>₹180</span></div>
                    <div style={{ borderTop: '1px dashed #ccc', margin: '6px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555' }}><span>CGST 2.5%</span><span>₹21</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555' }}><span>SGST 2.5%</span><span>₹21</span></div>
                    <div style={{ borderTop: '1px solid #ccc', margin: '6px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>TOTAL</span><span>₹862</span></div>
                    <div style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
                    {settings.gstEnabled && <div style={{ fontSize: 9, color: '#777' }}>GSTIN: {settings.gstin}</div>}
                    <div style={{ fontSize: 9, color: '#777' }}>FSSAI: {settings.fssai}</div>
                    <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: '#555' }}>{settings.receiptFooter}</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Features */}
            {tab === 'features' && (
              <Card className="animate-fade-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--color-text-primary)' }}>Feature Toggles</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>Enable or disable modules for your operation</div>

                <SettingRow label="Dine-In Orders" description="Table-based ordering">
                  <Toggle value={settings.tableService} onChange={v => set('tableService', v)} />
                </SettingRow>
                <SettingRow label="Takeaway Orders" description="Walk-in pickup orders">
                  <Toggle value={settings.takeaway} onChange={v => set('takeaway', v)} />
                </SettingRow>
                <SettingRow label="Delivery Orders" description="In-house delivery management">
                  <Toggle value={settings.delivery} onChange={v => set('delivery', v)} />
                </SettingRow>
                <SettingRow label="GST Billing" description="Apply taxes on all bills">
                  <Toggle value={settings.gstEnabled} onChange={v => set('gstEnabled', v)} />
                </SettingRow>
                <SettingRow label="Service Charge" description="Add service charge to bills">
                  <Toggle value={settings.serviceChargeEnabled} onChange={v => set('serviceChargeEnabled', v)} />
                </SettingRow>
              </Card>
            )}

            {/* Save button */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button
                variant="accent"
                size="lg"
                onClick={handleSave}
                style={{ minWidth: 140 }}
              >
                {saved ? '✅ Saved!' : '💾 Save Settings'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
