'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import SessionConflictModal from './components/common/SessionConflictModal';

export default function DashboardLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    if (user) {
      dispatch({ type: 'socket/init' });
    }
  }, [dispatch, user]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-brand-dark">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden w-full md:pl-64 transition-all duration-300 ease-spring">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">
          <div className="w-full h-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <SessionConflictModal />
    </div>
  );
}
