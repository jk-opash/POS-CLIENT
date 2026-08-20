"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../../../store/slices/branchSlice";
import { fetchReconciliations } from "../../../store/slices/reconciliationSlice";
import { Building2, UploadCloud, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from "lucide-react";

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
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "Discrepancy":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "Missing":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <RefreshCcw size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header & Global Actions */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Aggregator Reconciliation
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Match online orders from delivery partners with your POS data.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Selector */}
              <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <Building2 size={14} className="text-slate-500 shrink-0" />
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer pr-2"
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
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <UploadCloud size={16} /> Upload Settlement CSV
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Gross Platform Sales</p>
              <h3 className="text-2xl font-black text-slate-800">₹{metrics.gross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Deductions</p>
              <h3 className="text-2xl font-black text-red-600">-₹{metrics.deductions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Net Payouts</p>
              <h3 className="text-2xl font-black text-green-600">₹{metrics.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm bg-amber-50/50">
              <p className="text-sm font-medium text-amber-700 mb-1">Discrepancy (Missing)</p>
              <h3 className="text-2xl font-black text-amber-600">₹{metrics.discrepancy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
          </div>

          {/* Pos-admin Tabs */}
          <div className="border-b border-slate-200 bg-white/50 flex flex-row gap-2 backdrop-blur-md rounded-t-2xl px-2">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* TABLE CONTENT */}
          <div className="space-y-4 md:space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Order ID</th>
                      <th className="py-3.5 px-4">Platform</th>
                      <th className="py-3.5 px-4 text-right">Gross Amt</th>
                      <th className="py-3.5 px-4 text-right">Deductions</th>
                      <th className="py-3.5 px-4 text-right">Net Payout</th>
                      <th className="py-3.5 px-6 text-center">Match Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <RefreshCcw
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="font-bold text-slate-600">
                            No Reconciliation Data
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Upload a settlement report from your delivery partner to begin.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 font-medium text-slate-900">
                            {item.order_id || `#ORD-${item.id}`}
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                              {new Date(item.date || item.created_at).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                              item.platform?.toLowerCase() === "zomato" ? "bg-red-50 text-red-700" :
                              item.platform?.toLowerCase() === "swiggy" ? "bg-orange-50 text-orange-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {item.platform || "Unknown"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700 text-right">
                            ₹{Number(item.gross_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-red-500 font-medium text-right">
                            -₹{Number(item.deductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 font-bold text-green-700 text-right">
                            ₹{Number(item.net_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {getStatusIcon(item.status)}
                              <span className={`font-semibold text-xs ${
                                item.status === "Matched" ? "text-green-600" :
                                item.status === "Discrepancy" ? "text-amber-600" :
                                "text-red-600"
                              }`}>
                                {item.status || "Pending"}
                              </span>
                            </div>
                            {(item.status === "Discrepancy" || item.status === "Missing") && item.discrepancy_amount && (
                              <span className="block text-[10px] text-amber-500 font-bold mt-1">
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
