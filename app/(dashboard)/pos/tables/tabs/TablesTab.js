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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search tables by name or zone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2 bg-white/70 backdrop-blur-lg border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Name/Number</th>
                <th className="py-3.5 px-4">Zone</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Hash size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">No tables found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredTables.map((table) => (
                  <tr key={table.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-6 font-semibold text-slate-800">
                      {table.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {getZoneName(table.zone_id)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {table.capacity || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          table.status === "Available"
                            ? "bg-emerald-100/80 text-emerald-700"
                            : table.status === "Occupied"
                            ? "bg-amber-100/80 text-amber-700"
                            : table.status === "Reserved"
                            ? "bg-blue-100/80 text-blue-700"
                            : "bg-slate-100/80 text-slate-700"
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
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View/Download QR"
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          onClick={() => openEditTable(table)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Table"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTable(table)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
