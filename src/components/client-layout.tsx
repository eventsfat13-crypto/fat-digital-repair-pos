'use client';
import { UseAuthStore } from '../hooks/use-auth';
import { usePathname } from 'next/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = UseAuthStore();

  if (pathname === '/') {
    return <{children};
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-center">
      <p>Loading...</p>
    </div>;
  }

  return <>{children};