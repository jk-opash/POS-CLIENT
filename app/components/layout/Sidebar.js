"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Settings, X, LogOut, ChevronDown, AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NAV_ITEMS } from "../../lib/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

function getSubscriptionDaysLeft(user) {
  try {
    const end = user?.businesses?.[0]?.subscription_plan?.current_period_end;
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
          className="fixed z-[100] inset-0 z-tooltip bg-brand-dark/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed md:relative z-100 left-0 top-0 z-modal h-screen w-64 border-r border-brand-dark bg-brand-dark flex flex-col transition-transform duration-300 ease-spring ease-in-out md:translate-x-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-brand-dark bg-brand-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primaryDark flex items-center justify-center shadow-float shadow-brand-primary/20">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              POS Owner
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-brand-muted hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          <p className="px-2 text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-3">
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
                        ? "text-white bg-brand-dark/30"
                        : "text-brand-muted hover:text-white hover:bg-brand-dark/30",
                    )}
                  >
                    <div className="flex items-center gap-3 relative">
                      {isMainActive && (
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-1 bg-brand-primary rounded-r-full" />
                      )}
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-300 ease-spring group-hover:scale-110",
                          isMainActive
                            ? "text-brand-primaryLight"
                            : "text-brand-muted group-hover:text-brand-muted",
                        )}
                      />
                      {item.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isExpanded ? "rotate-180 text-white" : "text-brand-muted",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring relative group overflow-hidden",
                      isMainActive
                        ? "text-white bg-brand-dark/50 shadow-inset-white-soft"
                        : "text-brand-muted hover:text-white hover:bg-brand-dark/30",
                    )}
                  >
                    {isMainActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-brand-primary rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-300 ease-spring group-hover:scale-110",
                        isMainActive
                          ? "text-brand-primaryLight"
                          : "text-brand-muted group-hover:text-brand-muted",
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
                                ? "text-brand-primaryLight bg-brand-primary/10"
                                : "text-brand-muted hover:text-white hover:bg-brand-dark/50",
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

        {showWarning && (
          <div className={cn(
            "mx-3 mb-3 rounded-xl px-3 py-2.5 flex items-start gap-2.5 border shrink-0",
            daysLeft <= 3
              ? "bg-brand-danger/10 border-brand-danger/30 text-brand-dangerLight"
              : "bg-brand-warning/10 border-brand-warning/30 text-brand-warningLight"
          )}>
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold leading-tight">
                {daysLeft <= 0 ? "Subscription Expired" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
              </p>
              <p className="text-[10px] opacity-70 mt-0.5 leading-tight">
                {daysLeft <= 0
                  ? "Renew now to restore access"
                  : "Renew to avoid service interruption"}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-brand-dark bg-brand-dark space-y-1 shrink-0">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring group relative overflow-hidden",
              pathname === "/settings"
                ? "text-white bg-brand-dark/50 shadow-inset-white-soft"
                : "text-brand-muted hover:text-white hover:bg-brand-dark/50",
            )}
          >
            {pathname === "/settings" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-brand-primary rounded-r-full" />
            )}
            <Settings
              className={cn(
                "h-5 w-5 transition-transform duration-300 ease-spring",
                pathname === "/settings"
                  ? "text-brand-primaryLight rotate-90"
                  : "text-brand-muted group-hover:text-brand-muted group-hover:rotate-90",
              )}
            />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-dangerLight hover:text-brand-danger hover:bg-brand-danger/10 transition-all duration-300 ease-spring group"
          >
            <LogOut className="h-5 w-5 text-brand-danger/60 group-hover:text-brand-danger transition-transform duration-300 ease-spring group-hover:-translate-x-1" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
