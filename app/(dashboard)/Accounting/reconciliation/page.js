"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../../../store/slices/branchSlice";
import { fetchReconciliations } from "../../../store/slices/reconciliationSlice";
import { Building2, UploadCloud, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from "lucide-react";
import LottieLoader from "../../../components/common/LottieLoader";

export default function ReconciliationPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;
  
  const { reconciliations, loading } = useSelector((state) => state.reconciliation);
  const { branches } = useSelector((state) => state.branch);

  const [branchFilter, setBranchFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (businessId) {
      dispatch(fetchBranches(businessId));
    }
  }, [businessId, dispatch]);

  useEffect(() => {
    if (!branchFilter && branches && branches.length > 0) {
      setBranchFilter(branches[0].id);
    }
  }, [branches, branchFilter]);

  useEffect(() => {
    if (branchFilter) {
      dispatch(fetchReconciliations(branchFilter));
    }
  }, [branchFilter, dispatch]);

  const filteredData = useMemo(() => {
    const rawData = Array.isArray(reconciliations) ? reconciliations : reconciliations?.data || [];
    return rawData.filter(item => {
      if (activeTab === "all") return true;
      if (activeTab === "zomato") return item.platform?.toLowerCase() === "zomato";
      if (activeTab === "swiggy") return item.platform?.toLowerCase() === "swiggy";
      return true;
    }).sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
  }, [reconciliations, activeTab]);

  const metrics = useMemo(() => {
    let gross = 0;
    let deductions = 0;
    let net = 0;
    let discrepancy = 0;

    filteredData.forEach(item => {
      gross += Number(item.gross_amount || 0);
      deductions += Number(item.deductions || 0);
      net += Number(item.net_amount || 0);
      if (item.status === "Discrepancy" || item.status === "Missing") {
        discrepancy += Number(item.discrepancy_amount || 0);
      }
    });

    return { gross, deductions, net, discrepancy };
  }, [filteredData]);

  const tabs = [
    { id: "all", label: "All Platforms" },
    { id: "zomato", label: "Zomato" },
    { id: "swiggy", label: "Swiggy" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Matched":
        return <CheckCircle2 size={16} className="text-brand-success" />;
      case "Discrepancy":
        return <AlertTriangle size={16} className="text-brand-warning" />;
      case "Missing":
        return <XCircle size={16} className="text-brand-danger" />;
      default:
        return <RefreshCcw size={16} className="text-brand-muted/70" />;
    }
  };

  return (
    <div className="flex flex-col bg-brand-bg font-sans min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header & Global Actions */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">
                Aggregator Reconciliation
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                Match online orders from delivery partners with your POS data.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Selector */}
              <div className="relative flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 shadow-sm">
                <Building2 size={14} className="text-brand-muted shrink-0" />
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="text-sm font-semibold text-brand-dark outline-none bg-transparent cursor-pointer pr-2"
                >
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={!branchFilter}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-light text-brand-dark border border-brand-border transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <UploadCloud size={16} /> Upload Settlement CSV
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
              <p className="text-sm font-medium text-brand-muted mb-1">Gross Platform Sales</p>
              <h3 className="text-2xl font-black text-brand-dark">₹{metrics.gross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
              <p className="text-sm font-medium text-brand-muted mb-1">Total Deductions</p>
              <h3 className="text-2xl font-black text-brand-danger">-₹{metrics.deductions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
              <p className="text-sm font-medium text-brand-muted mb-1">Net Payouts</p>
              <h3 className="text-2xl font-black text-brand-success">₹{metrics.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-brand-warningLight shadow-sm bg-brand-warningLight/50">
              <p className="text-sm font-medium text-brand-warning mb-1">Discrepancy (Missing)</p>
              <h3 className="text-2xl font-black text-brand-warning">₹{metrics.discrepancy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
          </div>

          {/* Pos-admin Tabs */}
          <div className="border-b border-brand-border bg-white/50 flex flex-row gap-2 backdrop-blur-md rounded-t-2xl px-2">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring ${
                    activeTab === tab.id
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* TABLE CONTENT */}
          <div className="space-y-4 md:space-y-5">
            <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg/80 text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Order ID</th>
                      <th className="py-3.5 px-4">Platform</th>
                      <th className="py-3.5 px-4 text-right">Gross Amt</th>
                      <th className="py-3.5 px-4 text-right">Deductions</th>
                      <th className="py-3.5 px-4 text-right">Net Payout</th>
                      <th className="py-3.5 px-6 text-center">Match Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex justify-center min-h-[200px]">
                            <LottieLoader text="Loading reconciliation data..." />
                          </div>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-brand-muted/70">
                          <RefreshCcw
                            size={36}
                            className="mx-auto mb-2 text-brand-muted/70"
                          />
                          <p className="font-bold text-brand-dark">
                            No Reconciliation Data
                          </p>
                          <p className="text-xs text-brand-muted/70 mt-0.5">
                            Upload a settlement report from your delivery partner to begin.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-brand-bg/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 font-medium text-brand-dark">
                            {item.order_id || `#ORD-${item.id}`}
                            <span className="block text-[10px] text-brand-muted/70 font-normal mt-0.5">
                              {new Date(item.date || item.created_at).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                              item.platform?.toLowerCase() === "zomato" ? "bg-brand-dangerLight text-brand-danger" :
                              item.platform?.toLowerCase() === "swiggy" ? "bg-orange-50 text-orange-700" :
                              "bg-brand-light text-brand-dark"
                            }`}>
                              {item.platform || "Unknown"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-brand-dark text-right">
                            ₹{Number(item.gross_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-brand-danger font-medium text-right">
                            -₹{Number(item.deductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 font-bold text-brand-success text-right">
                            ₹{Number(item.net_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {getStatusIcon(item.status)}
                              <span className={`font-semibold text-xs ${
                                item.status === "Matched" ? "text-brand-success" :
                                item.status === "Discrepancy" ? "text-brand-warning" :
                                "text-brand-danger"
                              }`}>
                                {item.status || "Pending"}
                              </span>
                            </div>
                            {(item.status === "Discrepancy" || item.status === "Missing") && item.discrepancy_amount && (
                              <span className="block text-[10px] text-brand-warning font-bold mt-1">
                                diff: ₹{Number(item.discrepancy_amount).toLocaleString()}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
