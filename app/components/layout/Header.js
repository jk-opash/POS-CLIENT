"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  Menu,
  Search,
  Bell,
  Store,
  Check,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";
import Badge from "../ui/Badge";
import { cn } from "../../lib/utils";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/pos": "POS Billing",
  "/tables": "Tables & Floor",
  "/orders": "Order Queue",
  "/kds": "Kitchen Display",
  "/menu": "Menu Management",
  "/inventory": "Inventory & Stock",
  "/purchase-orders": "Purchase Orders",
  "/suppliers": "Suppliers",
  "/invoices": "Invoices",
  "/crm": "CRM & Loyalty",
  "/reports": "Reports",
  "/staff": "Staff Management",
  "/settings": "Settings",
  "/hyperpure": "Explore Hyperpure",
  "/logs": "User Logs",
  "/zone": "Create Zone",
  "/apps": "Marketplace Apps",
  "/help": "Help Center",
};



export function Header({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { branches } = useSelector((state) => state.branch);

  const [showOutletDropdown, setShowOutletDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOutletDropdown(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const title =
    Object.entries(PAGE_TITLES).find(([k]) =>
      pathname === "/" ? k === "/" : pathname.startsWith(k) && k !== "/",
    )?.[1] || "POS Manager";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/60 bg-white/70 px-4 md:px-8 backdrop-blur-xl shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight truncate">
          {title}
        </h1>

        {/* Outlet Selector (Desktop) */}
        <div className="hidden md:block relative ml-4" ref={dropdownRef}>
          <button
            onClick={() => setShowOutletDropdown(!showOutletDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Store className="h-4 w-4 text-indigo-500" />
            <span className="max-w-[150px] truncate">
              {selectedOutlet ? selectedOutlet.name : "All Outlets"}
            </span>
          </button>

          {showOutletDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-glass border border-white/60 p-2 z-50">
              <div className="text-xs font-semibold text-slate-400 px-3 py-2 uppercase tracking-wider">
                Select Outlet
              </div>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => {
                    setSelectedOutlet(null);
                    setShowOutletDropdown(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    !selectedOutlet
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <span className="truncate">All Outlets</span>
                  {!selectedOutlet && (
                    <Check className="h-4 w-4 text-indigo-500 shrink-0" />
                  )}
                </button>
                {branches?.map((branch) => {
                  const isActive = selectedOutlet?.id === branch.id;

                  return (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setSelectedOutlet(branch);
                        setShowOutletDropdown(false);
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      <span className="truncate">{branch.name}</span>
                      {isActive && (
                        <Check className="h-4 w-4 text-indigo-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden lg:block group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search orders, items..."
            className="w-64 rounded-full bg-slate-50/80 border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all duration-300 ease-spring shadow-inset-subtle focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:w-80"
          />
        </div>

        {/* Mobile Search Icon */}
        <button className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors">
          <Search className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 md:gap-4 border-l border-slate-200 pl-4 md:pl-6">
          <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative" ref={profileDropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[120px]">
                  {user?.name || "Admin"}
                </span>
                <Badge
                  variant="purple"
                  className="text-[9px] py-0 border-indigo-100 uppercase"
                >
                  {user?.businesses?.[0]?.subscription_plan?.plan?.replace(
                    "_",
                    " ",
                  ) || "Pro Plan"}
                </Badge>
              </div>
              <Avatar
                name={user?.name || "Admin"}
                size="sm"
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-glass border border-white/60 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-2">
                  <p
                    className="text-sm font-bold text-slate-800 truncate"
                    title={user?.businesses?.[0]?.name}
                  >
                    {user?.businesses?.[0]?.name || "Restaurant Owner"}
                  </p>
                  <p
                    className="text-xs text-slate-500 truncate"
                    title={user?.email}
                  >
                    {user?.email || "owner@example.com"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
