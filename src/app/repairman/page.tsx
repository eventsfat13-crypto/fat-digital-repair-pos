'use client';
import { motion } from 'framer-motion';
import { HardHat, Wrench, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn, formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function RepairmanPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/repairs?limit=100').then(r => r.json()).then(d => {
      setRepairs(d.repairs.filter((r: any) => !r.isDraft));
      setLoading(false);
    });
  }, []);

  const active = repairs.filter(r => !['COMPLETED', 'CANCELLED', 'DELIVERED'].includes(r.status));
  const completed = repairs.filter(r => r.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-surface-900">Repair Workbench</h1><p className="text-surface-500">Technician work view</p></div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4 text-center"><p className="text-3xl font-bold text-primary">{active.length}</p><p className="text-xs text-surface-500">Active</p></div>
        <div className="card-premium p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{completed.length}</p><p className="text-xs text-surface-500">Completed</p></div>
        <div className="card-premium p-4 text-center"><p className="text-3xl font-bold text-surface-900">{repairs.length}</p><p className="text-xs text-surface-500">Total</p></div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-surface-100 bg-surface-50/50">
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Order</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Device</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Customer</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Status</th>
          <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Cost</th>
        </tr></thead><tbody>
          {repairs.slice(0, 20).map(r => (
            <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50/50">
              <td className="py-3 px-4"><p className="text-sm font-mono font-medium">{r.repairOrderId}</p></td>
              <td className="py-3 px-4"><p className="text-sm">{r.model?.name || '—'}</p></td>
              <td className="py-3 px-4"><p className="text-sm">{r.customer?.name || r.customerName || '—'}</p></td>
              <td className="py-3 px-4"><span className={cn('badge text-[10px]', getStatusColor(r.status))}>{getStatusLabel(r.status)}</span></td>
              <td className="py-3 px-4 text-right"><p className="text-sm font-semibold">{formatCurrency(r.grandTotal)}</p></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  );
}
