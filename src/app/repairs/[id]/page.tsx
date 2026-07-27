'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Printer, Mail, Share2, QrCode, Barcode, FileText, Gift } from 'lucide-react';
import { cn, formatDate, formatCurrency, getStatusColor, getStatusLabel, getPriorityColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RepairDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) loadRepair();
  }, [params?.id]);

  const loadRepair = async () => {
    const res = await fetch(`/api/repairs/${params.id}`);
    if (res.ok) setRepair(await res.json());
    else router.push('/repairs');
    setLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`/api/repairs/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) { setRepair(await res.json()); toast.success('Status updated'); }
    else toast.error('Update failed');
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-primary" /></div>;
  if (!repair) return null;

  const ALL_STATUSES = ['PENDING', 'DEVICE_RECEIVED', 'DIAGNOSING', 'WAITING_APPROVAL', 'WAITING_PARTS', 'IN_PROGRESS', 'TESTING', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
  const currentIdx = ALL_STATUSES.indexOf(repair.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => router.push('/repairs')} className="flex items-center gap-2 text-surface-500 hover:text-surface-900 transition-colors">
        <ArrowLeft size={18} /> Back to Repairs
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 font-mono">{repair.repairOrderId}</h1>
            <span className={cn('badge', getStatusColor(repair.status))}>{getStatusLabel(repair.status)}</span>
            <span className={cn('badge', getPriorityColor(repair.priority))}>{repair.priority}</span>
          </div>
          <p className="text-surface-500 mt-1">Tracking: <span className="font-mono font-medium">{repair.trackingId}</span></p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline gap-1.5 text-sm"><Printer size={16} /> Print</button>
          <button className="btn-outline gap-1.5 text-sm"><QrCode size={16} /> QR</button>
          <button className="btn-outline gap-1.5 text-sm"><Barcode size={16} /> Barcode</button>
          <button className="btn-primary gap-1.5 text-sm"><Gift size={16} /> Voucher</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Flow */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold mb-4">Repair Status</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s, i) => (
                <button key={s}
                  onClick={() => updateStatus(s)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                    i < currentIdx ? 'bg-emerald-50 text-emerald-600' :
                    i === currentIdx ? 'bg-primary text-white shadow-sm' :
                    'bg-surface-50 text-surface-400 hover:bg-surface-100'
                  )}>
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Device & Services */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-semibold mb-4">Device & Services</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-surface-400">Category:</span> <span className="font-medium">{repair.category?.name || '—'}</span></div>
              <div><span className="text-surface-400">Brand:</span> <span className="font-medium">{repair.brand?.name || '—'}</span></div>
              <div><span className="text-surface-400">Model:</span> <span className="font-medium">{repair.model?.name || '—'}</span></div>
              <div><span className="text-surface-400">IMEI:</span> <span className="font-medium font-mono">{repair.deviceInfo?.imei1 || '—'}</span></div>
              <div><span className="text-surface-400">Serial:</span> <span className="font-medium font-mono">{repair.deviceInfo?.serialNumber || '—'}</span></div>
            </div>
            {repair.services?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-surface-100">
                <p className="text-sm text-surface-400 mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {repair.services.map((s: any) => (
                    <span key={s.id} className="px-2.5 py-1 rounded-lg bg-surface-50 text-sm text-surface-700">{s.service?.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer */}
          </div></div>
      </div>
    </div>
  );
}
