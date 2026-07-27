import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'Rs. '): string {
  return `${currency}${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  const now = new Date();

  if (format === 'relative') {
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateId(prefix: string, count: number): string {
  return `${prefix}-${new Date().getFullYear()}-${String(count).padStart(6, '0')}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-slate-100 text-slate-700',
    DEVICE_RECEIVED: 'bg-blue-100 text-blue-700',
    DIAGNOSING: 'bg-purple-100 text-purple-700',
    WAITING_APPROVAL: 'bg-amber-100 text-amber-700',
    WAITING_PARTS: 'bg-orange-100 text-orange-700',
    IN_PROGRESS: 'bg-sky-100 text-sky-700',
    TESTING: 'bg-indigo-100 text-indigo-700',
    QUALITY_CHECK: 'bg-violet-100 text-violet-700',
    READY_FOR_PICKUP: 'bg-emerald-100 text-emerald-700',
    DELIVERED: 'bg-teal-100 text-teal-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-slate-100 text-slate-700';
}

export function getStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    NORMAL: 'bg-slate-100 text-slate-700',
    HIGH: 'bg-orange-100 text-orange-700',
    EMERGENCY: 'bg-red-100 text-red-700',
  };
  return colors[priority] || 'bg-slate-100 text-slate-700';
}

export function calculateCountdown(estimatedDuration: number, startedAt: Date): {
  remaining: number;
  percent: number;
  isExpired: boolean;
} {
  const now = new Date().getTime();
  const start = new Date(startedAt).getTime();
  const total = estimatedDuration * 60 * 1000;
  const elapsed = now - start;
  const remaining = Math.max(0, total - elapsed);

  return {
    remaining: Math.floor(remaining / 1000),
    percent: Math.min(100, Math.floor((elapsed / total) * 100)),
    isExpired: remaining <= 0,
  };
}

export function maskIMEI(imei: string): string {
  if (!imei || imei.length < 8) return imei;
  return imei.slice(0, 4) + '****' + imei.slice(-4);
}
