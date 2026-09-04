"use client";

import { useState, useMemo } from 'react';

export default function DataTable({ 
  data = [], 
  columns = [], 
  searchPlaceholder = "Search...",
  onAdd,
  addLabel = "Add New",
  CustomFilters = null,
  emptyMessage = "No data found",
  emptyIcon = "📄"
}) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Global Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item => {
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerSearch)
        );
      });
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, sortConfig]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
        <input 
          className="input" 
          placeholder={searchPlaceholder} 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ width: 260 }} 
        />
        
        {CustomFilters && <CustomFilters />}

        {onAdd && (
          <button className="btn btn-accent" style={{ marginLeft: 'auto' }} onClick={onAdd}>
            + {addLabel}
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)' }}>
        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface2)', zIndex: 1, boxShadow: '0 1px 0 var(--color-border)' }}>
              <tr>
                {columns.map((col, idx) => (
                  <th 
                    key={col.key || idx} 
                    onClick={() => col.sortable !== false && col.key ? handleSort(col.key) : null}
                    style={{ 
                      padding: '12px 16px', 
                      color: 'var(--color-text-secondary)', 
                      fontWeight: 600, 
                      cursor: col.sortable !== false && col.key ? 'pointer' : 'default',
                      whiteSpace: 'nowrap',
                      width: col.width || 'auto'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                      {col.label}
                      {col.sortable !== false && col.key && (
                        <span style={{ fontSize: 10, opacity: sortConfig.key === col.key ? 1 : 0.3 }}>
                          {sortConfig.key === col.key 
                            ? (sortConfig.direction === 'asc' ? '▲' : '▼') 
                            : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.length > 0 ? (
                processedData.map((row, rowIndex) => (
                  <tr 
                    key={row.id || rowIndex} 
                    style={{ 
                      borderBottom: '1px solid var(--color-border)',
                      background: rowIndex % 2 === 0 ? 'transparent' : 'var(--color-surface3)',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border)'}
                    onMouseLeave={e => e.currentTarget.style.background = rowIndex % 2 === 0 ? 'transparent' : 'var(--color-surface3)'}
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} style={{ padding: '12px 16px', color: 'var(--color-text-primary)', textAlign: col.align || 'left' }}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-brand-muted" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{emptyIcon}</div>
                    <div>{emptyMessage}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--color-text-secondary)', flexShrink: 0 }}>
          <span>Showing {processedData.length} records</span>
        </div>
      </div>
    </div>
  );
}
