import React from "react";
import { Edit2, Trash2, Mail, Phone, Building2, AlertTriangle } from "lucide-react";
import PosAdminBadge from "../../menu/components/PosAdminBadge";
import PosAdminPagination from "../../menu/components/PosAdminPagination";

export default function SupplierTabTable({
  paginatedItems,
  filteredItems,
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
}) {
  return (
    <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-brand-bg/80 text-[11px] font-black text-brand-muted uppercase tracking-wider">
              <th className="py-3.5 px-6">Company Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">GST Number</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-brand-muted">
                  <Building2
                    size={36}
                    className="mx-auto mb-2 text-brand-muted/50"
                  />
                  <p className="font-bold text-brand-dark">
                    No suppliers found
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Try resetting filters or adding a new supplier.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((sup) => {
                const isAvailable = sup.status === "Active";
                let statusVariant = "muted";
                if (sup.status === "Active") statusVariant = "success";
                if (sup.status === "Archived") statusVariant = "muted";
                if (sup.status === "Blocked") statusVariant = "danger";

                return (
                  <tr
                    key={sup.id}
                    className="hover:bg-brand-bg/60 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="py-3 px-6 font-medium text-brand-dark">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-light border border-brand-border flex items-center justify-center shrink-0 text-brand-muted">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <span className="font-bold text-brand-dark text-sm block">
                            {sup.name}
                          </span>
                          {sup.business_name && (
                            <span className="text-[10px] text-brand-muted font-medium block mt-0.5">
                              {sup.business_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PosAdminBadge variant="muted">
                        {sup.category || "General"}
                      </PosAdminBadge>
                    </td>
                    <td className="py-3 px-4">
                      <PosAdminBadge variant={statusVariant} dot>
                        {sup.status.toUpperCase()}
                      </PosAdminBadge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {sup.contact?.person && (
                          <div className="text-brand-dark font-medium">
                            {sup.contact.person}
                          </div>
                        )}
                        {sup.contact?.mobile && (
                          <div className="flex items-center text-[10px] text-brand-muted gap-1.5">
                            <Phone size={10} /> {sup.contact.mobile}
                          </div>
                        )}
                        {sup.contact?.email && (
                          <div className="flex items-center text-[10px] text-brand-muted gap-1.5">
                            <Mail size={10} /> {sup.contact.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-brand-dark font-medium">
                      {sup.tax?.gst || <span className="text-brand-muted">-</span>}
                    </td>
                    <td
                      className="py-3 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(sup)}
                          className="p-1.5 text-brand-muted hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors"
                          title="Edit Supplier"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(sup)}
                          className="p-1.5 text-brand-muted hover:text-brand-danger hover:bg-brand-dangerLight rounded-lg transition-colors"
                          title="Delete Supplier"
                        >
                          <Trash2 size={15} />
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

      {filteredItems.length > 0 && (
        <div className="p-4 border-t border-brand-border">
          <PosAdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={filteredItems.length}
          />
        </div>
      )}
    </div>
  );
}
