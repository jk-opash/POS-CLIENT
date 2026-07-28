'use client';

import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DataTable from '../components/DataTable';
import { useMenu } from '../components/Providers';
import MenuItemModal from '../components/MenuItemModal';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function MenuPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { categories, items, addItem, updateItem, toggleAvailable, addCategory, updateCategory } = useMenu();
  const [activeTab, setActiveTab] = useState('items'); // 'categories', 'items', 'combos'
  
  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  const handleSaveItem = (item) => {
    if (editItem) updateItem(editItem.id, item);
    else addItem(item);
    setShowItemModal(false);
  };
  
  const openEditItem = (item) => { setEditItem(item); setShowItemModal(true); };
  const openAddItem = () => { setEditItem(null); setShowItemModal(true); };



  const itemColumns = [
    {
      key: 'name',
      label: 'Item Name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block', width: 10, height: 10, borderRadius: 2,
            background: row.vegetarian ? 'var(--color-emerald)' : 'var(--color-rose)',
          }} />
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{val}</span>
          {row.spicy > 0 && <span>{'🌶'.repeat(row.spicy)}</span>}
        </div>
      ),
    },
    {
      key: 'categoryId',
      label: 'Category',
      render: (val) => <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{categories.find(c => c.id === val)?.name || 'Unknown'}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>₹{val}</span>,
    },
    {
      key: 'variants',
      label: 'Variants/Addons',
      render: (val, row) => (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {row.variants?.length > 0 && <span style={{ background: 'var(--color-surface2)', padding: '2px 6px', borderRadius: 4, fontSize: 11, border: '1px solid var(--color-sky)', color: 'var(--color-sky)' }}>{row.variants.length} Variants</span>}
          {row.addonGroups?.length > 0 && <span style={{ background: 'var(--color-surface2)', padding: '2px 6px', borderRadius: 4, fontSize: 11, border: '1px solid var(--color-violet)', color: 'var(--color-violet)' }}>{row.addonGroups.length} Add-ons</span>}
          {row.recipe?.length > 0 && <span style={{ background: 'var(--color-surface2)', padding: '2px 6px', borderRadius: 4, fontSize: 11, border: '1px solid var(--color-emerald)', color: 'var(--color-emerald)' }}>Linked</span>}
        </div>
      ),
    },
    {
      key: 'available',
      label: 'Availability',
      render: (val, row) => (
        <Button
          size="sm"
          variant={val ? 'surface' : 'accent'}
          onClick={(e) => { e.stopPropagation(); toggleAvailable(row.id); }}
          style={{ padding: '4px 8px', fontSize: 12 }}
        >
          {val ? '🚫 86 (Hide)' : '✅ Enable'}
        </Button>
      ),
    },
  ];

  const categoryColumns = [
    { key: 'name', label: 'Category Name', render: (val) => <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{val}</span> },
    { key: 'id', label: 'Item Count', render: (val) => <span style={{ color: 'var(--color-text-secondary)' }}>{items.filter(i => i.categoryId === val).length} items</span> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-text-primary)' }}>Menu & Catalog</h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>Manage categories, items, and inventory linking.</p>
            </div>
          </div>

          <Tabs 
            tabs={[
              { id: 'categories', label: 'Categories' },
              { id: 'items', label: 'Menu Items' },
              { id: 'combos', label: 'Combos (Coming Soon)' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-5"
            style={{ marginBottom: 20 }}
          />

          {activeTab === 'items' && (
            <DataTable 
              data={items}
              columns={itemColumns}
              searchKeys={['name']}
              onAdd={openAddItem}
              addLabel="Add Item"
              onRowClick={openEditItem}
            />
          )}

          {activeTab === 'categories' && (
            <DataTable 
              data={categories}
              columns={categoryColumns}
              searchKeys={['name']}
              onAdd={() => alert('Add Category clicked')}
              addLabel="Add Category"
            />
          )}

          {activeTab === 'combos' && (
            <Card style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🍔🍟</div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>Combo Builder</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: 14 }}>Create value meals and combo offers to boost average order value.</p>
              <Button variant="surface" disabled>Coming Soon</Button>
            </Card>
          )}

        </main>
      </div>

      {showItemModal && (
        <MenuItemModal
          item={editItem}
          onSave={handleSaveItem}
          onClose={() => setShowItemModal(false)}
        />
      )}
    </div>
  );
}
