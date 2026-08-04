"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Settings, X, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NAV_ITEMS } from "../../lib/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Decide which nav items to show
  const navItems = NAV_ITEMS;

  // Track expanded submenus
  const [expandedMenus, setExpandedMenus] = useState({});

  // Close sidebar on route change on mobile
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-tooltip bg-brand-dark/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed md:relative left-0 top-0 z-modal h-screen w-64 border-r border-slate-800 bg-brand-dark flex flex-col transition-transform duration-300 ease-spring ease-in-out md:translate-x-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-brand-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-float shadow-indigo-500/20">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              POS Owner
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Restaurant Management
          </p>

          {navItems.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isMainActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const isExpanded = expandedMenus[item.label];

            return (
              <div key={item.label}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring group overflow-hidden",
                      isMainActive || isExpanded
                        ? "text-white bg-slate-800/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/30",
                    )}
                  >
                    <div className="flex items-center gap-3 relative">
                      {isMainActive && (
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-500 rounded-r-full" />
                      )}
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-300 ease-spring group-hover:scale-110",
                          isMainActive
                            ? "text-indigo-400"
                            : "text-slate-500 group-hover:text-slate-300",
                        )}
                      />
                      {item.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isExpanded ? "rotate-180 text-white" : "text-slate-500",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring relative group overflow-hidden",
                      isMainActive
                        ? "text-white bg-slate-800/50 shadow-inset-white-soft"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/30",
                    )}
                  >
                    {isMainActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-500 rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-300 ease-spring group-hover:scale-110",
                        isMainActive
                          ? "text-indigo-400"
                          : "text-slate-500 group-hover:text-slate-300",
                      )}
                    />
                    {item.label}
                  </Link>
                )}

                {/* Submenu rendering */}
                {hasSubmenu && (
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-spring overflow-hidden",
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-1"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 flex flex-col gap-1 pl-11 pr-2">
                      {item.submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={cn(
                              "text-xs py-2 px-3 rounded-lg font-medium transition-all duration-200",
                              isSubActive
                                ? "text-indigo-400 bg-indigo-500/10"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                            )}
                          >
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

        <div className="p-4 border-t border-slate-800 bg-brand-dark space-y-1 shrink-0">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring group relative overflow-hidden",
              pathname === "/settings"
                ? "text-white bg-slate-800/50 shadow-inset-white-soft"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50",
            )}
          >
            {pathname === "/settings" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-500 rounded-r-full" />
            )}
            <Settings
              className={cn(
                "h-5 w-5 transition-transform duration-300 ease-spring",
                pathname === "/settings"
                  ? "text-indigo-400 rotate-90"
                  : "text-slate-500 group-hover:text-slate-300 group-hover:rotate-90",
              )}
            />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 ease-spring group"
          >
            <LogOut className="h-5 w-5 text-red-400/60 group-hover:text-red-400 transition-transform duration-300 ease-spring group-hover:-translate-x-1" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
