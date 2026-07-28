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
  const dropdownRef = useRef(null);

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
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
          }}
          className="md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Page title */}
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            width: 1,
            height: 24,
            background: "var(--color-border)",
            margin: "0 8px",
          }}
        />

        {/* Modern Outlet Selector */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setShowOutletDropdown(!showOutletDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: showOutletDropdown
                ? "var(--color-surface2)"
                : "transparent",
              padding: "6px 12px",
              borderRadius: 8,
              cursor: "pointer",
              border: "1px solid transparent",
              color: "var(--color-text-primary)",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!showOutletDropdown)
                e.currentTarget.style.background = "var(--color-surface2)";
            }}
            onMouseLeave={(e) => {
              if (!showOutletDropdown)
                e.currentTarget.style.background = "transparent";
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

          {/* Dropdown Menu */}
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
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                border: "1px solid var(--color-border)",
                padding: 6,
                zIndex: 50,
              }}
            >
              {OUTLETS.map((outlet) => (
                <div
                  key={outlet}
                  onClick={() => {
                    setSelectedOutlet(outlet);
                    setShowOutletDropdown(false);
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    background:
                      selectedOutlet === outlet
                        ? "var(--color-accent-dim)"
                        : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedOutlet !== outlet)
                      e.currentTarget.style.background =
                        "var(--color-surface2)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOutlet !== outlet)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: selectedOutlet === outlet ? 600 : 500,
                      color:
                        selectedOutlet === outlet
                          ? "var(--color-accent)"
                          : "var(--color-text-primary)",
                    }}
                  >
                    {outlet === "ALL" ? "All Outlets (Global)" : outlet}
                  </span>
                  {selectedOutlet === outlet && (
                    <Check size={16} color="var(--color-accent)" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Search */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            color="var(--color-text-muted)"
            style={{ position: "absolute", left: 12 }}
          />
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
              e.currentTarget.style.boxShadow =
                "0 0 0 2px var(--color-accent-dim)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "var(--color-surface2)";
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <div
          style={{ width: 1, height: 24, background: "var(--color-border)" }}
        />

        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            className="live-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-emerald)",
              boxShadow: "0 0 0 2px rgba(16,185,129,0.2)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "var(--color-emerald)",
              fontWeight: 600,
            }}
          >
            LIVE
          </span>
        </div>

        {/* Pending Orders Alert */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-surface2)",
              color: "var(--color-text-secondary)",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-dim)";
              e.currentTarget.style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-surface2)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <Bell size={18} />
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
                minWidth: 18,
                height: 18,
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

        {/* Datetime */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            marginLeft: 8,
          }}
        >
          {now}
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 99,
            background: "linear-gradient(135deg, var(--color-accent), #60a5fa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
            marginLeft: 8,
            border: "2px solid #fff",
          }}
        >
          AD
        </div>
      </div>
    </header>
  );
}
