'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }) {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isAuthRoute = pathname === '/login';

    if (!token && !isAuthRoute) {
      router.push('/login');
    } else if (token && isAuthRoute) {
      router.push('/pos');
    }
  }, [token, pathname, router, mounted]);

  // Don't render until mounted to prevent hydration errors,
  // and don't render protected content if no token (unless on login page)
  if (!mounted) return null;
  if (!token && pathname !== '/login') return null;

  return <>{children}</>;
}
