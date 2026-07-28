"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useOrders, useOutlet } from "./Providers";
import { Menu, Store, ChevronDown, Bell, Search, Check } from "lucide-react";

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

const OUTLETS = [
  "ALL",
  "Main Branch (City Center)",
  "South Park Mall (Kiosk)",
  "Airport Terminal 2",
  "Downtown Plaza",
];

export default function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const { orders } = useOrders();
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const [showOutletDropdown, setShowOutletDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOutletDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pendingOrders = orders.filter(
    (o) => o.status === "received" || o.status === "preparing",
  ).length;

  const title =
    Object.entries(PAGE_TITLES).find(([k]) =>
      pathname === "/" ? k === "/" : pathname.startsWith(k) && k !== "/",
    )?.[1] || "POS Manager";

  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header
      style={{
        height: 64,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(12px, 3vw, 24px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        gap: 8,
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16, minWidth: 0, flex: 1 }}>
        {/* Hamburger — always visible, triggers mobile drawer OR desktop collapse */}
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            borderRadius: 8,
            flexShrink: 0,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        {/* Page title */}
        <h1
          style={{
            fontSize: isMobile ? 15 : 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            margin: 0,
            letterSpacing: "-0.3px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h1>

        {/* Divider — hide on mobile */}
        {!isMobile && (
          <div
            style={{
              width: 1,
              height: 24,
              background: "var(--color-border)",
              flexShrink: 0,
            }}
          />
        )}

        {/* Outlet Selector — hide on smallest screens */}
        {!isMobile && (
          <div style={{ position: "relative", flexShrink: 0 }} ref={dropdownRef}>
            <button
              onClick={() => setShowOutletDropdown(!showOutletDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: showOutletDropdown ? "var(--color-surface2)" : "transparent",
                padding: "6px 12px",
                borderRadius: 8,
                cursor: "pointer",
                border: "1px solid transparent",
                color: "var(--color-text-primary)",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!showOutletDropdown) e.currentTarget.style.background = "var(--color-surface2)";
              }}
              onMouseLeave={(e) => {
                if (!showOutletDropdown) e.currentTarget.style.background = "transparent";
              }}
            >
              <Store size={16} color="var(--color-text-secondary)" />
              {selectedOutlet === "ALL" ? "All Outlets" : selectedOutlet}
              <ChevronDown
                size={14}
                color="var(--color-text-muted)"
                style={{
                  transition: "transform 0.2s",
                  transform: showOutletDropdown ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {showOutletDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 8,
                  width: 240,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                  border: "1px solid var(--color-border)",
                  padding: 6,
                  zIndex: 50,
                }}
              >
                {OUTLETS.map((outlet) => (
                  <div
                    key={outlet}
                    onClick={() => { setSelectedOutlet(outlet); setShowOutletDropdown(false); }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      background: selectedOutlet === outlet ? "var(--color-accent-dim)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedOutlet !== outlet) e.currentTarget.style.background = "var(--color-surface2)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedOutlet !== outlet) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: selectedOutlet === outlet ? 600 : 500,
                        color: selectedOutlet === outlet ? "var(--color-accent)" : "var(--color-text-primary)",
                      }}
                    >
                      {outlet === "ALL" ? "All Outlets (Global)" : outlet}
                    </span>
                    {selectedOutlet === outlet && <Check size={16} color="var(--color-accent)" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14, flexShrink: 0 }}>
        {/* Search — full input on desktop, icon on mobile */}
        {isMobile ? (
          <button
            onClick={() => setShowSearch(s => !s)}
            style={{
              background: "var(--color-surface2)",
              border: "none",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <Search size={17} />
          </button>
        ) : (
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: "absolute", left: 12 }} />
            <input
              placeholder="Search..."
              style={{
                background: "var(--color-surface2)",
                border: "1px solid transparent",
                borderRadius: 99,
                padding: "6px 12px 6px 36px",
                fontSize: 13,
                width: 200,
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.border = "1px solid var(--color-border)";
                e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-accent-dim)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = "var(--color-surface2)";
                e.currentTarget.style.border = "1px solid transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        )}

        {/* Live badge — hide on small mobile */}
        {!isMobile && (
          <>
            <div style={{ width: 1, height: 24, background: "var(--color-border)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                className="live-dot"
                style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-emerald)", boxShadow: "0 0 0 2px rgba(16,185,129,0.2)" }}
              />
              <span style={{ fontSize: 12, color: "var(--color-emerald)", fontWeight: 600 }}>LIVE</span>
            </div>
          </>
        )}

        {/* Notifications bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-surface2)",
              color: "var(--color-text-secondary)",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-dim)"; e.currentTarget.style.color = "var(--color-accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface2)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
          >
            <Bell size={17} />
          </div>
          {pendingOrders > 0 && (
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                background: "var(--color-amber)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                minWidth: 17,
                height: 17,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              {pendingOrders}
            </div>
          )}
        </div>

        {/* Datetime — hide on mobile */}
        {!isMobile && (
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
            {now}
          </div>
        )}

        {/* Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 99,
            background: "linear-gradient(135deg, var(--color-accent), #60a5fa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(59,130,246,0.25)",
            border: "2px solid #fff",
            flexShrink: 0,
          }}
        >
          AD
        </div>
      </div>

      {/* Mobile search bar drop-down */}
      {isMobile && showSearch && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            borderBottom: "1px solid var(--color-border)",
            padding: "10px 16px",
            zIndex: 39,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Search size={16} color="var(--color-text-muted)" />
          <input
            autoFocus
            placeholder="Search..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "var(--color-text-primary)",
            }}
          />
        </div>
      )}
    </header>
  );
}
