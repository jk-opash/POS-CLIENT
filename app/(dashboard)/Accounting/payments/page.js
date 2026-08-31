"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../../../store/slices/branchSlice";
import { fetchExpenses } from "../../../store/slices/expenseSlice";
import { fetchUtilityBills } from "../../../store/slices/utilityBillSlice";
import { fetchWithdrawals } from "../../../store/slices/withdrawalSlice";
import { fetchAllOrders } from "../../../store/slices/orderSlice";
import { Building2, CreditCard, ArrowDownToLine, CheckCircle2, Clock } from "lucide-react";
import LottieLoader from "../../../components/common/LottieLoader";

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;
  
  const { expenses, loading: expensesLoading } = useSelector((state) => state.expense);
  const { bills: utilityBills, loading: utilityLoading } = useSelector((state) => state.utilityBill);
  const { withdrawals, loading: withdrawalsLoading } = useSelector((state) => state.withdrawal);
  const { allOrders, loading: ordersLoading } = useSelector((state) => state.order);
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
      dispatch(fetchExpenses(branchFilter));
      dispatch(fetchUtilityBills(branchFilter));
      dispatch(fetchWithdrawals(branchFilter));
      dispatch(fetchAllOrders(branchFilter));
    }
  }, [branchFilter, dispatch]);

  const loading = expensesLoading || utilityLoading || withdrawalsLoading || ordersLoading;

  const combinedData = useMemo(() => {
    const arr = [];
    
    // Vendor Payouts from Expenses
    const expensesArray = Array.isArray(expenses) ? expenses : expenses?.data || [];
    expensesArray.forEach(e => {
      arr.push({
        id: `exp-${e.id}`,
        reference_id: `EXP-${e.id.slice(0,6).toUpperCase()}`,
        type: "Vendor Payout",
        entity_name: e.category,
        amount: e.amount,
        date: e.expense_date,
        status: "Cleared"
      });
    });

    // Vendor Payouts from Utility Bills
    const billsArray = Array.isArray(utilityBills) ? utilityBills : utilityBills?.data || [];
    billsArray.forEach(u => {
      arr.push({
        id: `util-${u.id}`,
        reference_id: `UTL-${u.id.slice(0,6).toUpperCase()}`,
        type: "Vendor Payout",
        entity_name: `${u.utility_type} - ${u.vendor}`,
        amount: u.amount,
        date: u.created_at,
        status: "Cleared"
      });
    });

    // Accounts Receivable from unpaid Orders
    const ordersArray = Array.isArray(allOrders) ? allOrders : allOrders?.data || [];
    ordersArray.filter(o => o.payment_status !== "Paid").forEach(o => {
      arr.push({
        id: `ord-${o.id}`,
        reference_id: o.order_number,
        type: "Accounts Receivable",
        entity_name: o.customer_info?.name || "Walk-in Customer",
        amount: o.total_amount,
        date: o.created_at,
        status: "Pending"
      });
    });

    // Bank Deposits from Withdrawals (assuming Bank Transfers are deposits/transfers)
    const withdrawalsArray = Array.isArray(withdrawals) ? withdrawals : withdrawals?.data || [];
    withdrawalsArray.forEach(w => {
      if(w.payment_method === "Bank Transfer") {
        arr.push({
          id: `wth-${w.id}`,
          reference_id: `DEP-${w.id.slice(0,6).toUpperCase()}`,
          type: "Bank Deposit",
          entity_name: w.description || "Bank Deposit",
          amount: w.amount,
          date: w.withdrawal_date,
          status: "Cleared"
        });
      }
    });

    return arr.sort((a, b) => new Date(b.date) - new Date(a.date)).filter(item => {
      if (activeTab === "all") return true;
      if (activeTab === "vendor") return item.type === "Vendor Payout";
      if (activeTab === "customer") return item.type === "Accounts Receivable";
      if (activeTab === "deposit") return item.type === "Bank Deposit";
      return true;
    });
  }, [expenses, utilityBills, allOrders, withdrawals, activeTab]);

  const tabs = [
    { id: "all", label: "All Payments" },
    { id: "vendor", label: "Vendor Payouts" },
    { id: "customer", label: "Accounts Receivable" },
    { id: "deposit", label: "Bank Deposits" },
  ];

  const getBadgeStyle = (type) => {
    switch (type) {
      case "Vendor Payout":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Accounts Receivable":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "Bank Deposit":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
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
                Payments Ledger
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track vendor payouts, customer tabs, and bank deposits.
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
                      <th className="py-3.5 px-6">Reference / ID</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Entity</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex justify-center min-h-[200px]">
                            <LottieLoader text="Loading payments data..." />
                          </div>
                        </td>
                      </tr>
                    ) : combinedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <CreditCard
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="font-bold text-slate-600">
                            No Payments Found
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Once payouts or deposits are logged, they will appear here.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      combinedData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 font-medium text-slate-900">
                            {item.reference_id}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getBadgeStyle(item.type)}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {item.entity_name}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                            ₹{Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-6 text-right">
                            {item.status === "Cleared" || item.status === "Completed" ? (
                              <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs">
                                <CheckCircle2 size={14} /> {item.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-xs">
                                <Clock size={14} /> {item.status || "Pending"}
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
