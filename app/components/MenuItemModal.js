'use client';

import { useState, useEffect } from 'react';
import { useMenu, useInventory } from './Providers';

export default function MenuItemModal({ item, onClose, onSave }) {
  const { categories, addonGroups } = useMenu();
  const { inventory } = useInventory();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    takeawayPrice: '',
    tax: 5,
    vegetarian: true,
    spicy: 0,
    available: true,
    variants: [],
    addonGroups: [],
    recipe: [],
    timeAvailability: null,
    image: null,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        variants: item.variants || [],
        addonGroups: item.addonGroups || [],
        recipe: item.recipe || [],
        timeAvailability: item.timeAvailability || null,
      });
    }
  }, [item]);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing & Variants' },
    { id: 'modifiers', label: 'Modifiers' },
    { id: 'inventory', label: 'Recipe Link' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleSave = () => {
    onSave({ ...formData, price: Number(formData.price), takeawayPrice: Number(formData.takeawayPrice), tax: Number(formData.tax) });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div className="card animate-scale-in" style={{ width: 800, maxWidth: '95vw', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, color: 'var(--color-text-primary)' }}>{item ? 'Edit Menu Item' : 'New Menu Item'}</h2>
          <button className="btn btn-surface" onClick={onClose} style={{ padding: '4px 12px' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Sidebar Tabs */}
          <div style={{ width: 200, borderRight: '1px solid var(--color-border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: activeTab === t.id ? 'var(--color-accent)' : 'transparent',
                  color: activeTab === t.id ? '#fff' : 'var(--color-text-secondary)',
                  border: 'none', padding: '10px 16px', borderRadius: 8,
                  textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="input-label">Item Name</label>
                  <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <select className="input select" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">Dietary Type</label>
                    <select className="input select" value={formData.vegetarian ? 'veg' : 'nonveg'} onChange={e => setFormData({ ...formData, vegetarian: e.target.value === 'veg' })}>
                      <option value="veg">🟢 Vegetarian</option>
                      <option value="nonveg">🔴 Non-Vegetarian</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">Spice Level (0-3)</label>
                    <input type="number" min="0" max="3" className="input" value={formData.spicy} onChange={e => setFormData({ ...formData, spicy: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Image URL (Optional)</label>
                  <input className="input" placeholder="https://..." value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">Default Price (₹)</label>
                    <input type="number" className="input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">Takeaway Price (₹)</label>
                    <input type="number" className="input" value={formData.takeawayPrice} onChange={e => setFormData({ ...formData, takeawayPrice: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Tax Slab (%)</label>
                  <select className="input select" value={formData.tax} onChange={e => setFormData({ ...formData, tax: Number(e.target.value) })}>
                    <option value={0}>0% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST</option>
                  </select>
                </div>
                
                <div className="divider" style={{ margin: '16px 0' }} />
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <label className="input-label" style={{ margin: 0 }}>Variants (e.g., Half/Full)</label>
                    <button className="btn btn-surface" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setFormData({ ...formData, variants: [...formData.variants, { name: '', price: 0 }] })}>+ Add Variant</button>
                  </div>
                  {formData.variants.length === 0 ? (
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, background: 'var(--color-surface2)', padding: 16, borderRadius: 8, textAlign: 'center' }}>No variants configured. Default price will be used.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {formData.variants.map((v, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <input className="input" placeholder="Name (e.g. Half)" value={v.name} onChange={e => { const nv = [...formData.variants]; nv[i].name = e.target.value; setFormData({ ...formData, variants: nv }); }} />
                          <input type="number" className="input" placeholder="Price" value={v.price} onChange={e => { const nv = [...formData.variants]; nv[i].price = Number(e.target.value); setFormData({ ...formData, variants: nv }); }} />
                          <button className="btn btn-surface" onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, idx) => idx !== i) })}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'modifiers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: '0 0 8px 0' }}>Assign Add-on groups (like "Choice of Crust" or "Extra Toppings") to this item.</p>
                {addonGroups.map(group => (
                  <label key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface2)', padding: 12, borderRadius: 8, cursor: 'pointer', border: '1px solid var(--color-border)' }}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: 'var(--color-accent)', width: 18, height: 18 }} 
                      checked={formData.addonGroups.includes(group.id)}
                      onChange={e => {
                        if (e.target.checked) setFormData({ ...formData, addonGroups: [...formData.addonGroups, group.id] });
                        else setFormData({ ...formData, addonGroups: formData.addonGroups.filter(id => id !== group.id) });
                      }}
                    />
                    <div>
                      <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{group.name}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{group.multiSelect ? 'Multi-select' : 'Single-select'} • {group.options.length} options</div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'inventory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 8px 0' }}>Link raw materials to auto-deduct from inventory when this item is sold.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label" style={{ margin: 0 }}>Recipe Materials</label>
                  <button className="btn btn-surface" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setFormData({ ...formData, recipe: [...formData.recipe, { inventoryId: inventory[0]?.id, qty: 0 }] })}>+ Add Material</button>
                </div>
                {formData.recipe.length === 0 ? (
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, background: 'var(--color-surface2)', padding: 16, borderRadius: 8, textAlign: 'center' }}>No recipe configured.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {formData.recipe.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <select className="input select" value={r.inventoryId} onChange={e => { const nr = [...formData.recipe]; nr[i].inventoryId = e.target.value; setFormData({ ...formData, recipe: nr }); }}>
                          {inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name} ({inv.unit})</option>)}
                        </select>
                        <input type="number" step="0.01" className="input" placeholder="Qty" value={r.qty} onChange={e => { const nr = [...formData.recipe]; nr[i].qty = Number(e.target.value); setFormData({ ...formData, recipe: nr }); }} style={{ width: 100 }} />
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, width: 40 }}>{inventory.find(inv => inv.id === r.inventoryId)?.unit}</span>
                        <button className="btn btn-surface" onClick={() => setFormData({ ...formData, recipe: formData.recipe.filter((_, idx) => idx !== i) })}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--color-accent)', width: 20, height: 20 }} checked={formData.available} onChange={e => setFormData({ ...formData, available: e.target.checked })} />
                  <div>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Currently Available</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Uncheck to "86" (hide) this item immediately across all platforms.</div>
                  </div>
                </label>
                
                <div className="divider" />
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <input type="checkbox" style={{ accentColor: 'var(--color-accent)', width: 20, height: 20 }} checked={formData.timeAvailability !== null} onChange={e => setFormData({ ...formData, timeAvailability: e.target.checked ? { days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], hours: ['09:00', '12:00'] } : null })} />
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Time-based Availability</div>
                  </div>
                  {formData.timeAvailability && (
                    <div style={{ background: 'var(--color-surface2)', padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--color-border)' }}>
                      <div>
                        <label className="input-label">Active Hours</label>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <input type="time" className="input" value={formData.timeAvailability.hours[0]} onChange={e => setFormData({ ...formData, timeAvailability: { ...formData.timeAvailability, hours: [e.target.value, formData.timeAvailability.hours[1]] } })} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>to</span>
                          <input type="time" className="input" value={formData.timeAvailability.hours[1]} onChange={e => setFormData({ ...formData, timeAvailability: { ...formData.timeAvailability, hours: [formData.timeAvailability.hours[0], e.target.value] } })} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn btn-surface" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Menu Item</button>
        </div>
      </div>
    </div>
  );
}
