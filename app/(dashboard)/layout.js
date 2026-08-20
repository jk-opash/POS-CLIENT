"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const isAuth = localStorage.getItem("user");
    if (!isAuth) {
      router.replace("/login");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-brand-dark">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
}
