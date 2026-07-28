"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useOutlet } from "./Providers";
import {
  LayoutDashboard,
  LineChart,
  MenuSquare,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Users,
  Store,
  Truck,
  ClipboardList,
  Map,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Heart,
  Grid,
} from "lucide-react";

const NAV_ITEMS_ALL = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dynamic-reports", label: "Dynamic Reports", icon: LineChart },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    submenu: [
      { href: "/reports/day-end", label: "Day End Summary" },
      { href: "/reports/other", label: "Other Reports" },
      { href: "/reports/notifications", label: "Report Notifications" },
    ],
  },
  { href: "/logs", label: "User Logs", icon: ClipboardList },
  { href: "/zone", label: "Create Zone", icon: Map },
  { href: "/help", label: "Help Manual", icon: HelpCircle },
];

const NAV_ITEMS_SPECIFIC = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/pos",
    label: "Orders And Billing",
    icon: Receipt,
    submenu: [
      { href: "/pos", label: "All Orders" },
      { href: "/pos/online", label: "Online Orders" },
      { href: "/pos/kot", label: "KOT" },
    ],
  },
  { href: "/menu", label: "Menu Management", icon: MenuSquare },
  { href: "/inventory", label: "Inventory", icon: Package },
  {
    href: "/invoices",
    label: "Accounting",
    icon: Receipt,
    submenu: [
      { href: "/invoices/payments", label: "Payments" },
      {
        href: "/invoices/reconciliation",
        label: "Online Order Reconciliation",
      },
      { href: "/invoices/gst", label: "GST Information" },
      { href: "/invoices/bank", label: "Bank Details" },
      { href: "/invoices/utility", label: "Utility Bill" },
      { href: "/invoices/expense", label: "Expense & Withdrawal" },
    ],
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    submenu: [
      { href: "/reports/day-end", label: "Day End Summary" },
      { href: "/reports/other", label: "Other Reports" },
      { href: "/reports/notifications", label: "Report Notifications" },
    ],
  },
  {
    href: "/settings",
    label: "Configuration",
    icon: Settings,
    submenu: [
      { href: "/settings/sub-order", label: "Sub Order Type" },
      { href: "/settings/outlet", label: "Outlet Configuration" },
    ],
  },
  { href: "/staff", label: "User Management", icon: Users },
  { href: "/purchase-orders", label: "Suppliers Hub", icon: Truck },
  { href: "/logs", label: "User Logs", icon: ClipboardList },
  { href: "/help", label: "Help Manual", icon: HelpCircle },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const { selectedOutlet } = useOutlet();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // On mobile, collapsed=false means CLOSED (default state), collapsed=true means OPEN.
  const handleLinkClick = () => {
    if (isMobile && collapsed) {
      onToggle();
    }
  };

  const NAV_ITEMS =
    selectedOutlet === "ALL" ? NAV_ITEMS_ALL : NAV_ITEMS_SPECIFIC;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && collapsed && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 49,
            backdropFilter: "blur(2px)",
          }}
        />
      )}
      <aside
        style={{
          width: isMobile ? 260 : collapsed ? 72 : 260,
          minWidth: isMobile ? 260 : collapsed ? 72 : 260,
          background: "var(--color-sidebar-bg)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          transform: isMobile
            ? collapsed
              ? "translateX(0)"
              : "translateX(-100%)"
            : "none",
          transition:
            "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          zIndex: 50,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 64,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: !isMobile && collapsed ? "center" : "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {!isMobile && collapsed ? null : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, var(--color-accent), #60a5fa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                P
              </div>
              <span
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  whiteSpace: "nowrap",
                }}
              >
                POS Manager
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-sidebar-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              borderRadius: 6,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-sidebar-text)";
            }}
          >
            {!isMobile && collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={!isMobile && collapsed}
              isExpanded={expandedMenus[item.label]}
              onToggle={() => toggleSubmenu(item.label)}
              pathname={pathname}
              onClick={handleLinkClick}
            />
          ))}
        </nav>

        {/* Footer User Profile (Optional) */}
        {!isMobile && collapsed ? null : (
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  background: "#334155",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                AD
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  Admin User
                </div>
                <div
                  style={{ color: "var(--color-sidebar-text)", fontSize: 11 }}
                >
                  Manager
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function NavItem({
  item,
  isActive,
  collapsed,
  isExpanded,
  onToggle,
  pathname,
  onClick,
}) {
  const Icon = item.icon;
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  // A menu is active if it's strictly matched OR if one of its submenus is active
  const isMenuOrSubmenuActive =
    isActive || (hasSubmenu && item.submenu.some((s) => pathname === s.href));

  const textColor =
    isMenuOrSubmenuActive && !hasSubmenu
      ? "#ffffff"
      : "var(--color-sidebar-text)";
  const iconColor = isMenuOrSubmenuActive
    ? "var(--color-accent)"
    : "var(--color-sidebar-text)";
  const bgColor =
    isMenuOrSubmenuActive && !hasSubmenu
      ? "var(--color-sidebar-active-bg)"
      : "transparent";

  const content = (
    <div
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        padding: collapsed ? "10px" : "10px 14px",
        justifyContent: collapsed ? "center" : "space-between",
        background: bgColor,
        borderRadius: 8,
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={(e) => {
        if (hasSubmenu) {
          e.preventDefault();
          onToggle();
        }
      }}
      onMouseEnter={(e) => {
        if (!isMenuOrSubmenuActive || hasSubmenu) {
          e.currentTarget.style.background = "var(--color-sidebar-hover)";
          e.currentTarget.style.color = "#ffffff";
          const iconEl = e.currentTarget.querySelector(".nav-icon");
          if (iconEl && !isMenuOrSubmenuActive) iconEl.style.color = "#ffffff";
        }
      }}
      onMouseLeave={(e) => {
        if (!isMenuOrSubmenuActive || hasSubmenu) {
          e.currentTarget.style.background = bgColor;
          e.currentTarget.style.color = textColor;
          const iconEl = e.currentTarget.querySelector(".nav-icon");
          if (iconEl && !isMenuOrSubmenuActive)
            iconEl.style.color = "var(--color-sidebar-text)";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          className="nav-icon"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            transition: "color 0.2s ease",
          }}
        >
          <Icon size={20} strokeWidth={isMenuOrSubmenuActive ? 2.5 : 2} />
        </div>
        {!collapsed && (
          <span
            style={{
              fontSize: 14,
              fontWeight: isMenuOrSubmenuActive ? 600 : 500,
              color: isMenuOrSubmenuActive
                ? "#fff"
                : "var(--color-sidebar-text)",
              whiteSpace: "nowrap",
              transition: "color 0.2s ease",
            }}
          >
            {item.label}
          </span>
        )}
      </div>

      {!collapsed && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {item.badge && (
            <span
              style={{
                background: "var(--color-accent)",
                color: "#ffffff",
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {item.badge}
            </span>
          )}
          {hasSubmenu &&
            (isExpanded ? (
              <ChevronDown size={14} color="var(--color-sidebar-text)" />
            ) : (
              <ChevronRight size={14} color="var(--color-sidebar-text)" />
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: 4 }}>
      {hasSubmenu ? (
        content
      ) : (
        <Link
          href={item.href}
          style={{ textDecoration: "none", display: "block" }}
          onClick={onClick}
        >
          {content}
        </Link>
      )}

      {/* Render Submenu */}
      {!collapsed && hasSubmenu && isExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 2,
            marginBottom: 8,
            background: "rgba(0,0,0,0.1)",
            borderRadius: 8,
            padding: "6px 0",
          }}
        >
          {item.submenu.map((subItem) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                style={{ textDecoration: "none", display: "block" }}
                onClick={onClick}
              >
                <div
                  style={{
                    padding: "8px 12px 8px 48px",
                    fontSize: 13,
                    fontWeight: isSubActive ? 600 : 500,
                    color: isSubActive ? "#fff" : "var(--color-sidebar-text)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "color 0.2s, background 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubActive) e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubActive)
                      e.currentTarget.style.color = "var(--color-sidebar-text)";
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isSubActive
                        ? "var(--color-accent)"
                        : "var(--color-sidebar-text)",
                      transition: "background 0.2s",
                    }}
                  />
                  {subItem.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
