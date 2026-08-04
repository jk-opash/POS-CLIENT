import {
  LayoutDashboard,
  LineChart,
  MenuSquare,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Users,
  Truck,
  ClipboardList,
  Map,
  HelpCircle,
} from "lucide-react";

export const NAV_ITEMS = [
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
    ],
  },
  { href: "/outlet", label: "Business Configuration", icon: Settings },
  { href: "/purchase-orders", label: "Suppliers Hub", icon: Truck },
  { href: "/logs", label: "User Logs", icon: ClipboardList },
  { href: "/help", label: "Help Manual", icon: HelpCircle },
];
