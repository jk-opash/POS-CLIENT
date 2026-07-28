'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useMenu, useOrders, useTables, useSettings } from '../components/Providers';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';

function POSItem({ item, onAdd }) {
  return (
    <button
      onClick={() => onAdd(item)}
      style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 12, padding: '12px', cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 6,
        opacity: item.available ? 1 : 0.4, width: '100%',
      }}
      disabled={!item.available}
      onMouseEnter={e => item.available && (e.currentTarget.style.borderColor = 'var(--color-accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: 1,
          border: `2px solid ${item.vegetarian ? 'var(--color-emerald)' : 'var(--color-rose)'}`,
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>{item.name}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-accent)' }}>₹{item.price}</div>
      {!item.available && <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-error)', letterSpacing: '0.8px' }}>86'd</div>}
    </button>
  );
}

export default function POSPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { categories, items } = useMenu();
  const { addOrder } = useOrders();
  const { tables } = useTables();
  const { settings } = useSettings();

  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const addToCart = (item) => {
    setCart(c => {
      const existing = c.find(x => x.id === item.id);
      if (existing) return c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...item, qty: 1, note: '' }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(c => c.map(x => x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x).filter(x => x.qty > 0));
  };

  const clearCart = () => { setCart([]); setCustomerName(''); setSelectedTable(''); setDiscount(0); };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const taxAmt = settings.gstEnabled ? Math.round(subtotal * (settings.taxRate / 100)) : 0;
  const discountAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal + taxAmt - discountAmt;

  const filteredItems = items.filter(item => {
    if (activeCategory !== 'all' && item.categoryId !== activeCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const table = tables.find(t => t.id === selectedTable);
    const order = {
      type: orderType,
      tableId: selectedTable || null,
      tableName: table?.label || null,
      customerName: customerName || 'Walk-in',
      items: cart.map(i => ({ menuId: i.id, name: i.name, qty: i.qty, price: i.price })),
      subtotal,
      tax: taxAmt,
      discount: discountAmt,
      total,
      paymentMethod,
      status: 'received',
    };
    addOrder(order);
    setLastOrder(order);
    clearCart();
    setShowCheckout(false);
    alert(`✅ Order placed! Total: ₹${total}`);
  };

  const freeTables = tables.filter(t => t.status === 'free');

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

          {/* ── Left: Menu ───────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden md:border-r border-slate-200" style={{ minHeight: '50vh' }}>
            {/* Category tabs */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 6, flexWrap: 'wrap', background: 'var(--color-surface2)' }}>
              <Button size="sm" variant={activeCategory === 'all' ? 'accent' : 'surface'} onClick={() => setActiveCategory('all')}>All</Button>
              {categories.map(cat => (
                <Button key={cat.id}
                  size="sm"
                  variant={activeCategory === cat.id ? 'accent' : 'surface'}
                  style={{ borderColor: activeCategory !== cat.id ? cat.color + '33' : undefined }}
                  onClick={() => setActiveCategory(cat.id)}>
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div style={{ padding: '8px 16px', background: 'var(--color-surface2)' }}>
              <input className="input" placeholder="🔍 Search menu..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Items grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {filteredItems.map(item => <POSItem key={item.id} item={item} onAdd={addToCart} />)}
              </div>
              {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>No items</div>
              )}
            </div>
          </div>

          {/* ── Right: Cart ──────────────────────── */}
          <div className="w-full md:w-[320px] flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-slate-200" style={{ background: 'var(--color-surface2)', minHeight: '50vh' }}>
            {/* Order type */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-border)' }}>
              <Tabs 
                tabs={[
                  { id: 'dine-in', label: '🪑 dine-in' },
                  { id: 'takeaway', label: '📦 takeaway' },
                  { id: 'delivery', label: '🛵 delivery' },
                ]} 
                activeTab={orderType} 
                onChange={setOrderType} 
                className="mb-2" 
                style={{ marginBottom: 10 }}
              />
              {orderType === 'dine-in' && (
                <select className="input select" value={selectedTable} onChange={e => setSelectedTable(e.target.value)}>
                  <option value="">Select Table</option>
                  {freeTables.map(t => <option key={t.id} value={t.id}>{t.label} ({t.seats} seats)</option>)}
                </select>
              )}
              <input className="input" style={{ marginTop: 8 }} placeholder="Customer name (optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
                  <div style={{ fontSize: 32 }}>🛒</div>
                  <div style={{ marginTop: 8, fontSize: 13 }}>Cart is empty</div>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>₹{item.price * item.qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Button size="sm" variant="surface" style={{ padding: '2px 8px' }} onClick={() => updateQty(item.id, -1)}>−</Button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <Button size="sm" variant="surface" style={{ padding: '2px 8px' }} onClick={() => updateQty(item.id, 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill summary */}
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                {settings.gstEnabled && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted)' }}>
                    <span>GST ({settings.taxRate}%)</span>
                    <span>₹{taxAmt}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Discount %</span>
                  <input
                    className="input input-sm"
                    type="number" min="0" max="100" value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                    style={{ width: 60, textAlign: 'right' }}
                  />
                  {discountAmt > 0 && <span style={{ fontSize: 12, color: 'var(--color-emerald)' }}>−₹{discountAmt}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', paddingTop: 6, borderTop: '1px solid var(--color-border)' }}>
                  <span>TOTAL</span>
                  <span style={{ color: 'var(--color-accent)' }}>₹{total}</span>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                {['Cash', 'UPI', 'Card'].map(pm => (
                  <Button key={pm}
                    size="sm"
                    variant={paymentMethod === pm ? 'accent' : 'surface'}
                    style={{ flex: 1 }}
                    onClick={() => setPaymentMethod(pm)}>
                    {pm === 'Cash' ? '💵' : pm === 'UPI' ? '📲' : '💳'} {pm}
                  </Button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="surface" style={{ flex: 1 }} onClick={clearCart} disabled={cart.length === 0}>Clear</Button>
                <Button
                  variant="accent"
                  style={{ flex: 2, fontSize: 14 }}
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0}
                >
                  Place Order ₹{total}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
