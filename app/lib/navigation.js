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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/pos",
    label: "Orders And Billing",
    icon: Receipt,
    submenu: [
      { href: "/pos", label: "All Orders" },
      // { href: "/pos/online", label: "Online Orders" },
      { href: "/pos/kot", label: "KOT" },
    ],
  },
  { href: "/outlet", label: "Business Configuration", icon: Settings },
  { href: "/menu", label: "Menu Management", icon: MenuSquare },
  { href: "/inventory", label: "Inventory", icon: Package },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    submenu: [
      { href: "/reports/day-end", label: "Day End Summary" },
      { href: "/reports/other", label: "Other Reports" },
    ],
  },
  {
    href: "/invoices",
    label: "Accounting",
    icon: Receipt,
    submenu: [
      { href: "/Accounting/payments", label: "Payments" },
      {
        href: "/Accounting/reconciliation",
        label: "Online Order Reconciliation",
      },
      { href: "/Accounting/expense", label: "Expense & Withdrawal" },
    ],
  },
  { href: "/suppliers", label: "Suppliers Hub", icon: Truck },
  { href: "/logs", label: "User Logs", icon: ClipboardList },
  { href: "/help", label: "Help Manual", icon: HelpCircle },
];
