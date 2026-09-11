"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import {
  Settings,
  X,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NAV_ITEMS } from "../lib/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

function getSubscriptionDaysLeft(user) {
  try {
    const end = user?.businesses?.[0]?.subscription_ends_at;
    if (!end) return null;
    const diff = new Date(end) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const daysLeft = getSubscriptionDaysLeft(user);
  const showWarning = daysLeft !== null && daysLeft <= 10;

  const navItems = NAV_ITEMS;
  const [expandedMenus, setExpandedMenus] = useState({});
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (onCloseRef.current) onCloseRef.current();
  }, [pathname]);

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="z-[100] inset-0 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 md:relative z-[50] h-screen w-64 shrink-0 bg-[#0A0D14] flex flex-col transition-transform duration-400 cubic-bezier(0.4, 0, 0.2, 1) border-r border-white/5 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-[88px] items-center justify-between px-6 shrink-0 relative overflow-hidden">
          {/* Subtle glow behind logo */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-brand-primary/20 blur-[30px] rounded-full pointer-events-none" />

          <div className="flex items-center gap-3.5 z-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary via-[#6D28D9] to-brand-primaryDark flex items-center justify-center shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] border border-white/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] tracking-tight text-white leading-none">
                POS Owner
              </span>
              <span className="text-[11px] font-medium text-brand-muted/70 mt-1 uppercase tracking-widest">
                Workspace
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5 custom-scrollbar scrollbar-none">
          {navItems.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isMainActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const isExpanded = expandedMenus[item.label] || isMainActive;

            return (
              <div key={item.label} className="flex flex-col">
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-[14px] px-2.5 py-2 text-[14px] font-semibold transition-all duration-300 ease-out group relative overflow-hidden",
                      isMainActive
                        ? "text-white bg-white/[0.06] border border-white/[0.05]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]",
                    )}
                  >
                    {isMainActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-brand-primary shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.6)]" />
                    )}
                    <div className="flex items-center gap-3.5 relative z-10">
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isMainActive
                            ? "text-brand-primary"
                            : "text-white/40 group-hover:text-white/80",
                        )}
                        strokeWidth={isMainActive ? 2.5 : 2}
                      />
                      {item.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300 relative z-10",
                        isExpanded
                          ? "rotate-180 text-white/80"
                          : "text-white/30 group-hover:text-white/60",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3.5 rounded-[14px] px-2.5 py-2 text-[14px] font-semibold transition-all duration-300 ease-out group relative overflow-hidden",
                      isMainActive
                        ? "text-white bg-white/[0.06] border border-white/[0.05]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]",
                    )}
                  >
                    {isMainActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-brand-primary shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.6)]" />
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300 relative z-10",
                        isMainActive
                          ? "text-brand-primary"
                          : "text-white/40 group-hover:text-white/80",
                      )}
                      strokeWidth={isMainActive ? 2.5 : 2}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )}

                {/* Submenu rendering */}
                {hasSubmenu && (
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out overflow-hidden",
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-1 mb-2"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 flex flex-col gap-1 pl-8 pr-2 relative">
                      {/* Decorative Line */}
                      <div className="absolute left-[26px] top-2 bottom-2 w-[1px] bg-white/5 rounded-full" />

                      {item.submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={cn(
                              "relative text-[13px] py-2.5 px-4 rounded-xl font-medium transition-all duration-200",
                              isSubActive
                                ? "text-white bg-white/[0.04]"
                                : "text-white/50 hover:text-white hover:bg-white/[0.02]",
                            )}
                          >
                            {isSubActive && (
                              <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-brand-primary shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.8)]" />
                            )}
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Subscription Warning */}

        {/* Footer Area */}
        <div className="p-4 bg-[#0A0D14] border-t border-white/5 shrink-0">
          {showWarning && (
            <div className="pb-4 shrink-0">
              <div
                className={cn(
                  "rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden backdrop-blur-md border",
                  daysLeft <= 3
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-orange-500/10 border-orange-500/20",
                )}
              >
                {/* Subtle background icon */}
                <AlertTriangle
                  className={cn(
                    "absolute -right-2 -top-2 w-16 h-16 opacity-[0.03]",
                    daysLeft <= 3 ? "text-red-500" : "text-orange-500",
                  )}
                />

                <div className="flex items-center gap-2 relative z-10">
                  <AlertTriangle
                    className={cn(
                      "h-4 w-4 shrink-0",
                      daysLeft <= 3 ? "text-red-400" : "text-orange-400",
                    )}
                  />
                  <p
                    className={cn(
                      "text-[12px] font-bold tracking-wide uppercase",
                      daysLeft <= 3 ? "text-red-400" : "text-orange-400",
                    )}
                  >
                    {daysLeft <= 0 ? "Expired" : "Expiring Soon"}
                  </p>
                </div>
                <div className="relative z-10">
                  <p className="text-white font-semibold text-sm">
                    {daysLeft <= 0
                      ? "Service interrupted"
                      : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
                  </p>
                  <p className="text-white/50 text-[11px] mt-0.5 leading-tight">
                    Renew your plan to maintain access to your workspace.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3.5 rounded-[14px] px-2.5 py-2 text-[14px] font-semibold transition-all duration-300 ease-out group",
                pathname === "/settings"
                  ? "text-white bg-white/[0.06] border border-white/[0.05]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]",
              )}
            >
              <Settings
                className={cn(
                  "h-5 w-5 transition-all duration-500",
                  pathname === "/settings"
                    ? "text-brand-primary rotate-90"
                    : "text-white/40 group-hover:text-white/80 group-hover:rotate-45",
                )}
                strokeWidth={pathname === "/settings" ? 2.5 : 2}
              />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 rounded-[14px] px-3.5 py-3 text-[14px] font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 ease-out group"
            >
              <LogOut
                className="h-5 w-5 text-red-400/60 group-hover:text-red-400 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2}
              />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
