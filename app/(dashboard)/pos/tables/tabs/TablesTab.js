import { useState } from "react";
import { Edit2, Trash2, QrCode, Search, Hash } from "lucide-react";
import api from "../../../../lib/api";

export default function TablesTab({
  tables,
  zones,
  openEditTable,
  deleteTable,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? zone.name : "Unknown";
  };

  const filteredTables = tables.filter(
    (table) =>
      table.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getZoneName(table.zone_id)?.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Search tables by name or zone..."
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
                <th className="py-3.5 px-6">Name/Number</th>
                <th className="py-3.5 px-4">Zone</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-muted/70">
                    <Hash size={36} className="mx-auto mb-2 text-brand-placeholder" />
                    <p className="font-bold text-brand-muted">No tables found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredTables.map((table) => (
                  <tr key={table.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="py-3 px-6 font-semibold text-brand-dark">
                      {table.name}
                    </td>
                    <td className="py-3 px-4 text-brand-muted">
                      {getZoneName(table.zone_id)}
                    </td>
                    <td className="py-3 px-4 text-brand-muted">
                      {table.capacity || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          table.status === "Available"
                            ? "bg-brand-successLight/80 text-brand-success"
                            : table.status === "Occupied"
                            ? "bg-brand-warningLight/80 text-brand-warning"
                            : table.status === "Reserved"
                            ? "bg-brand-primaryLight/80 text-brand-primary"
                            : "bg-brand-light/80 text-brand-muted"
                        }`}
                      >
                        {table.status || "Available"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            // URL that customers will scan (no auth required)
                            const customerUrl = `${window.location.origin}/order/${table.id}`;
                            // Generate QR code using a public API
                            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(customerUrl)}`;
                            
                            // Open QR code image in a new tab
                            window.open(qrCodeUrl, "_blank");
                          }}
                          className="p-1.5 text-brand-muted/70 hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors"
                          title="View/Download QR"
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          onClick={() => openEditTable(table)}
                          className="p-1.5 text-brand-muted/70 hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors"
                          title="Edit Table"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTable(table)}
                          className="p-1.5 text-brand-muted/70 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Table"
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
