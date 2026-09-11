import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  QrCode,
  Search,
  Hash,
  Copy,
  Check,
  Download,
} from "lucide-react";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";

export default function TablesTab({
  tables,
  zones,
  openEditTable,
  deleteTable,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [origin, setOrigin] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [qrModal, setQrModal] = useState({
    isOpen: false,
    url: "",
    title: "",
    tableName: "",
  });

  const { user } = useSelector((state) => state.auth);
  const activeBranch = useSelector((state) => state.branch?.activeBranch);

  // Determine the restaurant or branch name
  const restaurantName =
    activeBranch?.name || user?.businesses?.[0]?.name || "Our Restaurant";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? zone.name : "Unknown";
  };

  const copyToClipboard = (url, tableId) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(tableId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredTables = tables.filter(
    (table) =>
      table.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getZoneName(table.zone_id)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const downloadPDF = () => {
    if (!qrModal.url) return;
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 130],
      });

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(restaurantName, 50, 20, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Table: ${qrModal.tableName}`, 50, 30, { align: "center" });

      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        pdf.addImage(img, "PNG", 20, 40, 60, 60);
        pdf.save(`Table_${qrModal.tableName.replace(/\s+/g, "_")}_QR.pdf`);
      };
      img.src = qrModal.url;
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

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
                  <td
                    colSpan={5}
                    className="py-12 text-center text-brand-muted/70"
                  >
                    <Hash
                      size={36}
                      className="mx-auto mb-2 text-brand-placeholder"
                    />
                    <p className="font-bold text-brand-muted">
                      No tables found
                    </p>
                    <p className="text-xs mt-1">
                      Try adjusting your search criteria
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTables.map((table) => {
                  const tableUrl = origin
                    ? `${origin}/order/${table.id}`
                    : `/order/${table.id}`;

                  return (
                    <tr
                      key={table.id}
                      className="hover:bg-brand-bg/50 transition-colors"
                    >
                      <td className="py-3 px-6">
                        <div className="font-semibold text-brand-dark">
                          {table.name}
                        </div>
                        <div
                          className="text-[10px] text-brand-primary font-medium mt-0.5 select-all truncate max-w-[200px]"
                          title={tableUrl}
                        >
                          {tableUrl}
                        </div>
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
                            onClick={() => copyToClipboard(tableUrl, table.id)}
                            className={`p-1.5 rounded-lg transition-colors ${copiedId === table.id ? "text-brand-success bg-brand-successLight" : "text-brand-muted/70 hover:text-brand-primary hover:bg-brand-light"}`}
                            title="Copy URL"
                          >
                            {copiedId === table.id ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const customerUrl = tableUrl;
                              const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(customerUrl)}`;

                              setQrModal({
                                isOpen: true,
                                url: qrCodeUrl,
                                title: `QR Code for ${table.name}`,
                                tableName: table.name,
                              });
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ ...qrModal, isOpen: false })}
        title={qrModal.title}
      >
        <div className="flex flex-col items-center justify-center py-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-brand-border/50 mb-6">
            <img
              src={qrModal.url}
              alt="QR Code"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>
          <p className="text-sm text-brand-muted text-center max-w-xs mb-6">
            Customers can scan this QR code to view the menu and place orders
            directly.
          </p>
          <Button
            onClick={downloadPDF}
            className="w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
}
