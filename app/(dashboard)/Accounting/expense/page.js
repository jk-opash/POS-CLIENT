"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../../store/slices/expenseSlice";
import { fetchWithdrawals } from "../../../store/slices/withdrawalSlice";
import { fetchUtilityBills } from "../../../store/slices/utilityBillSlice";
import { fetchBranches } from "../../../store/slices/branchSlice";
import ExpenseModal from "../../../components/Accounting/ExpenseModal";
import WithdrawalModal from "../../../components/Accounting/WithdrawalModal";
import UtilityModal from "../../../components/Accounting/UtilityModal";
import {
  Plus,
  Wallet,
  Zap,
  ArrowDownToLine,
  FileText,
  Building2,
} from "lucide-react";

export default function ExpensePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;

  const { expenses, loading: expensesLoading } = useSelector(
    (state) => state.expense,
  );
  const { withdrawals, loading: withdrawalsLoading } = useSelector(
    (state) => state.withdrawal,
  );
  const { bills: utilityBills, loading: utilityLoading } = useSelector(
    (state) => state.utilityBill,
  );
  const { branches } = useSelector((state) => state.branch);

  const [branchFilter, setBranchFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isUtilityModalOpen, setIsUtilityModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

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
      dispatch(fetchWithdrawals(branchFilter));
      dispatch(fetchUtilityBills(branchFilter));
    }
  }, [branchFilter, dispatch]);

  const combinedData = useMemo(() => {
    const arr = [];
    const expensesArray = Array.isArray(expenses)
      ? expenses
      : expenses?.data || [];
    const utilityBillsArray = Array.isArray(utilityBills)
      ? utilityBills
      : utilityBills?.data || [];
    const withdrawalsArray = Array.isArray(withdrawals)
      ? withdrawals
      : withdrawals?.data || [];

    expensesArray.forEach((e) =>
      arr.push({ ...e, _type: "Expense", _date: new Date(e.expense_date) }),
    );
    utilityBillsArray.forEach((u) =>
      arr.push({ ...u, _type: "Utility", _date: new Date(u.created_at) }),
    );
    withdrawalsArray.forEach((w) =>
      arr.push({
        ...w,
        _type: "Withdrawal",
        _date: new Date(w.withdrawal_date),
      }),
    );
    return arr
      .sort((a, b) => b._date - a._date)
      .filter((item) => {
        if (activeTab === "all") return true;
        if (activeTab === "expenses") return item._type === "Expense";
        if (activeTab === "utilities") return item._type === "Utility";
        if (activeTab === "withdrawals") return item._type === "Withdrawal";
        return true;
      });
  }, [expenses, utilityBills, withdrawals, activeTab]);

  const loading = expensesLoading || withdrawalsLoading || utilityLoading;

  const tabs = [
    { id: "all", label: "All Transactions" },
    { id: "expenses", label: "Expenses" },
    { id: "utilities", label: "Utility Bills" },
    { id: "withdrawals", label: "Withdrawals" },
  ];

  const getBadgeStyle = (type) => {
    switch (type) {
      case "Expense":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Utility":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Withdrawal":
        return "bg-red-50 text-red-700 border border-red-200";
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
                Accounting & Expenses
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage all expenses, bills, and cash withdrawals.
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
                onClick={() => setIsExpenseModalOpen(true)}
                disabled={!branchFilter}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <Wallet size={16} /> Add Expense
              </button>

              <button
                onClick={() => setIsUtilityModalOpen(true)}
                disabled={!branchFilter}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <Zap size={16} /> Add Utility
              </button>

              <button
                onClick={() => setIsWithdrawalModalOpen(true)}
                disabled={!branchFilter}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowDownToLine size={16} /> Withdrawal
              </button>
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
                      <th className="py-3.5 px-6">Type</th>
                      <th className="py-3.5 px-4">Category / Details</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-6 text-right">
                        Initiated By / Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-slate-400"
                        >
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : combinedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-slate-400"
                        >
                          <FileText
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="font-bold text-slate-600">
                            No Transactions Yet
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Keep track of your business spending by adding a
                            transaction.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      combinedData.map((item) => (
                        <tr
                          key={`${item._type}-${item.id}`}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6">
                            <span
                              className={`px-2 py-1 rounded-md text-[10px] font-bold ${getBadgeStyle(item._type)}`}
                            >
                              {item._type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {item._type === "Expense"
                              ? item.category
                              : item._type === "Utility"
                                ? `${item.utility_type} - ${item.vendor}`
                                : item.description || "Cash Withdrawal"}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                            ₹
                            {Number(item.amount).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {item._date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-6 text-right text-slate-600">
                            {item._type === "Withdrawal" && item.team_member
                              ? `${item.team_member.first_name} ${item.team_member.last_name || ""}`
                              : "System/Admin"}
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

      {isExpenseModalOpen && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          branchId={branchFilter}
        />
      )}
      {isUtilityModalOpen && (
        <UtilityModal
          isOpen={isUtilityModalOpen}
          onClose={() => setIsUtilityModalOpen(false)}
          branchId={branchFilter}
        />
      )}
      {isWithdrawalModalOpen && (
        <WithdrawalModal
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          branchId={branchFilter}
          businessId={businessId}
        />
      )}
    </div>
  );
}
