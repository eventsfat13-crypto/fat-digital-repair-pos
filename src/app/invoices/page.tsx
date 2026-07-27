'use client';
import { motion } from 'framer-motion';
import { FileText, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDate, formatCurrency, getStatusLabel, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/repairs?limit=50').then(r => r.json()).then(d => { setRepairs(d.repairs.filter((r: any) => !r.isDraft)); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-surface-900">Invoices</h1><p className="text-surface-500">{repairs.length} invoices</p></div>
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-surface-100 bg-surface-50/50">
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Invoice #</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Customer</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Device</th>
          <th className="text-center py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Status</th>
          <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Total</th>
          <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Date</th>
        </tr></thead><tbody>
          {repairs.map(r => (
            <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50/50">
              <td className="py-3 px-4"><p className="text-sm font-mono font-medium">{r.repairOrderId}</p></td>
              <td className="py-3 px-4"><p className="text-sm">{r.customer?.name || r.customerName || 'Walk-in'}</p></td>
              <td className="py-3 px-4"><p className="text-sm text-surface-500">{r.model?.name || '—'}</p></td>
              <td className="py-3 px-4 text-center"><span className={cn('badge text-[10px]', getStatusColor(r.status))}>{getStatusLabel(r.status)}</span></td>
              <td className="py-3 px-4 text-right"><p className="text-sm font-semibold">{formatCurrency(r.grandTotal)}</p></td>
              <td className="py-3 px-4 text-right"><p className="text-sm text-surface-500">{formatDate(r.createdAt)}</p></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  );
}
