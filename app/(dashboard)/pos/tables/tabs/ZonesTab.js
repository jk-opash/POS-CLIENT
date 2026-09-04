import { useState } from "react";
import { Edit2, Trash2, Search, Hash } from "lucide-react";

export default function ZonesTab({ zones, openEditZone, deleteZone }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredZones = zones.filter((zone) =>
    zone.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
          size={16}
        />
        <input
          type="text"
          placeholder="Search zones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2 bg-white/70 backdrop-blur-lg border border-brand-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-light text-[11px] font-black text-brand-muted uppercase tracking-wider">
                <th className="py-3.5 px-6">Zone Name</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {filteredZones.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-brand-muted/70">
                    <Hash size={36} className="mx-auto mb-2 text-brand-placeholder" />
                    <p className="font-bold text-brand-muted">No zones found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="py-3 px-6 font-semibold text-brand-dark">
                      {zone.name}
                    </td>
                    <td className="py-3 px-4 text-brand-muted">
                      {zone.description || "-"}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditZone(zone)}
                          className="p-1.5 text-brand-muted/70 hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors"
                          title="Edit Zone"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteZone(zone)}
                          className="p-1.5 text-brand-muted/70 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Zone"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
