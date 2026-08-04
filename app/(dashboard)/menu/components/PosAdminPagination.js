import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

export default function PosAdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  itemsPerPageOptions = [10, 20, 30, 40, 50],
}) {
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#4B5563]">
            Rows per page:
          </span>
          <div className="w-20">
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <select
                  value={itemsPerPage.toString()}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] px-4 py-2 pr-10 text-sm text-[#0F172A] transition-all duration-300 ease-[cubic-bezier(0.43,0.13,0.23,0.96)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] hover:bg-white hover:border-[#CBD5E1] focus:outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 focus:bg-white focus:shadow-none disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:hover:border-[#E2E8F0]"
                >
                  {itemsPerPageOptions.map((opt) => (
                    <option key={opt} value={opt.toString()}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <span className="text-sm text-[#4B5563]">
          Showing{" "}
          <span className="font-semibold text-[#0F172A]">
            {startItem}–{endItem}
          </span>{" "}
          of <span className="font-semibold text-[#0F172A]">{totalItems}</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] border border-transparent h-8 w-8 p-0 text-xs"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] border border-transparent h-8 w-8 p-0 text-xs"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <div
                key={`ellipsis-${i}`}
                className="w-8 flex items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-8 w-8 p-0 text-xs rounded-lg ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:from-[#4F46E5] hover:to-violet-600 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] border-transparent"
                    : "bg-transparent text-[#4B5563] hover:bg-slate-100 hover:text-[#0F172A] border border-transparent"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] border border-transparent h-8 w-8 p-0 text-xs"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] border border-transparent h-8 w-8 p-0 text-xs"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
