import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryLedger } from "../../store/slices/inventorySlice";
import {
  ClipboardList,
  Clock,
  RotateCcw,
  ArrowUpCircle,
  Trash2,
  Plus,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import LottieLoader from "../../components/common/LottieLoader";

export default function AuditLogTab({ branchId }) {
  const dispatch = useDispatch();
  const {
    ledger,
    ledgerLoading: loading,
    ledgerError: error,
  } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (branchId) {
      dispatch(fetchInventoryLedger(branchId));
    }
  }, [branchId, dispatch]);

  const typeIcon = (type) => {
    switch (type) {
      case "ADJUSTMENT":
        return <RotateCcw size={14} className="text-brand-warning" />;
      case "RECEIVED":
        return <ArrowUpCircle size={14} className="text-brand-success" />;
      case "SALE":
        return <ShoppingCart size={14} className="text-brand-primary" />;
      case "DELETION":
        return <Trash2 size={14} className="text-brand-danger" />;
      case "ITEM_CREATED":
        return <Plus size={14} className="text-brand-purple" />;
      default:
        return <ClipboardList size={14} className="text-brand-muted/70" />;
    }
  };

  return (
    <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          style={{ minWidth: 900 }}
        >
          <thead>
            <tr className="border-b border-brand-border bg-brand-bg/80 text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Log ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                User / System
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <LottieLoader text="Loading audit log..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-brand-danger">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <div>{error}</div>
                </td>
              </tr>
            ) : ledger.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-brand-muted/70"
                >
                  <ClipboardList
                    size={40}
                    className="mx-auto mb-3 opacity-30"
                  />
                  <div>No stock movements recorded yet.</div>
                </td>
              </tr>
            ) : (
              ledger.map((item, i) => {
                const qtyChange = Number(item.quantity_change);
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-brand-border hover:bg-brand-bg transition-colors ${i % 2 === 1 ? "bg-brand-bg/50" : ""}`}
                  >
                    <td
                      className="px-4 py-3 text-brand-muted/70 font-mono text-xs truncate max-w-[100px]"
                      title={item.id}
                    >
                      {item.id.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-brand-muted text-xs">
                        <Clock size={12} />
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold bg-brand-light text-brand-dark px-2 py-1 rounded-md border border-brand-border">
                        {item.performed_by || "System"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {typeIcon(item.movement_type)}
                        <span className="font-bold text-brand-dark text-xs">
                          {item.movement_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs">
                      <span className="font-bold text-brand-dark">
                        {item.item?.name || "Unknown Item"}
                      </span>{" "}
                      (
                      <span
                        className={
                          qtyChange > 0
                            ? "text-brand-success font-bold"
                            : qtyChange < 0
                              ? "text-brand-danger font-bold"
                              : "text-brand-muted font-bold"
                        }
                      >
                        {qtyChange > 0 ? "+" : ""}
                        {qtyChange}
                      </span>
                      ){" – "}
                      {item.reason || "No reason provided"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
