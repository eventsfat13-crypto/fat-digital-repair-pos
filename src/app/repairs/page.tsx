'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Wrench, Loader2, ChevronLeft, ChevronRight, ExternalLink,
} from 'lucide-react';
import { cn, formatDate, formatCurrency, getStatusColor, getStatusLabel, getPriorityColor } from '@/lib/utils';

const STATUS_FILTERS = [
  'ALL', 'PENDING', 'DEVICE_RECEIVED', 'DIAGNOSING', 'IN_PROGRESS', 'TESTING',
  'QUALITY_CHECK', 'READY_FOR_PICKUP', 'COMPLETED', 'DELIVERED', 'CANCELLED',
];

export default function RepairsPage() {
  const router = useRouter();
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const limit = 20;

  useEffect(() => {
    loadRepairs();
  }, [page, statusFilter]);

  const loadRepairs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('q', search);
    const res = await fetch(`/api/repairs?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRepairs(data.repairs);
      setPagination(data.pagination);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); loadRepairs(); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Repairs</h1>
          <p className="text-surface-500">{pagination?.total || 0} total repairs</p>
        </div>
        <Link href="/repairs/new">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <Plus size={18} /> New Repair
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" placeholder="Search by order ID, customer, phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-premium pl-10" />
        </form>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn('px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                statusFilter === s ? 'bg-surface-900 text-white' : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50')}>
              {s === 'ALL' ? 'All' : getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : repairs.length === 0 ? (
          <div className="text-center py-20 text-surface-400">
            <Wrench size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No repairs found</p>
            <p className="text-sm mt-1">Create your first repair order to get started</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Device</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Technician</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Priority</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Total</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.map((repair, i) => (
                    <motion.tr
                      key={repair.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => router.push(`/repairs/${repair.id}`)}
                      className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-surface-900 font-mono">{repair.repairOrderId}</p>
                          <p className="text-[11px] text-surface-400 font-mono">{repair.trackingId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-surface-900">{repair.model?.name || '—'}</p>
                        <p className="text-xs text-surface-400">{repair.brand?.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-surface-900">{repair.customer?.name || repair.customerName || 'Walk-in'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-surface-900">{repair.primaryTechnician?.name || '—'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('badge text-[10px]', getStatusColor(repair.status))}>
                          {getStatusLabel(repair.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('badge text-[10px]', getPriorityColor(repair.priority))}>
                          {repair.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm font-semibold text-surface-900">{formatCurrency(repair.grandTotal)}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm text-surface-500">{formatDate(repair.createdAt)}</p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100">
                <p className="text-sm text-surface-500">
                  Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 rounded-lg hover:bg-surface-100 disabled:opacity-30 transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                    className="p-2 rounded-lg hover:bg-surface-100 disabled:opacity-30 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
