'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Package,
  UserCog,
  HardHat,
  ShoppingCart,
  FileBarChart,
  MapPin,
  FileText,
  Gift,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wrench, label: 'Repair POS', href: '/repairs' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: UserCog, label: 'Technicians', href: '/technicians' },
  { icon: HardHat, label: 'Repairman', href: '/repairman' },
  { icon: ShoppingCart, label: 'Sales', href: '/sales' },
  { icon: FileBarChart, label: 'Reports', href: '/reports' },
  { icon: MapPin, label: 'Tracking', href: '/tracking' },
  { icon: FileText, label: 'Invoices', href: '/invoices' },
  { icon: Gift, label: 'VIP E-Vouchers', href: '/vouchers' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isLoading, checkSession, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-surface-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          x: mobileOpen ? 0 : (collapsed ? 80 : 280),
        }}
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-surface-100',
          'lg:translate-x-0',
          !mobileOpen && '-translate-x-full'
        )}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-surface-100',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">FAT</span>
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="font-bold text-surface-900 text-sm">FAT Digital</p>
              <p className="text-xs text-surface-400">Repair POS</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-surface-100">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut size={20} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-surface-100 flex items-center px-4 lg:px-6 sticky top-0 z-30 gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <button
            className="hidden lg:flex p-2 rounded-lg hover:bg-surface-100 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="flex-1" />

          <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <Bell size={20} className="text-surface-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-xs">
                {user?.displayName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-surface-900">{user?.displayName}</p>
              <p className="text-xs text-surface-400">{user?.role?.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
