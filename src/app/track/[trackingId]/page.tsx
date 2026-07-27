'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, MapPin, CheckCircle2, Wrench, User, Phone, Package, AlertCircle,
  ArrowLeft, QrCode, Barcode, Gift, Share2, Printer,
} from 'lucide-react';
import { cn, formatDate, formatCurrency, getStatusLabel, calculateCountdown } from '@/lib/utils';

const STATUS_FLOW = [
  'PENDING', 'DEVICE_RECEIVED', 'DIAGNOSING', 'WAITING_APPROVAL', 'WAITING_PARTS',
  'IN_PROGRESS', 'TESTING', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'DELIVERED', 'COMPLETED',
];

export default function TrackingPage() {
  const params = useParams();
  const trackingId = params?.trackingId as string;
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState({ remaining: 0, percent: 0, isExpired: false });

  useEffect(() => {
    if (!trackingId) return;
    loadRepair();
  }, [trackingId]);

  useEffect(() => {
    if (!repair?.estimatedDuration || !repair?.countdownStartedAt) return;
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(repair.estimatedDuration, repair.countdownStartedAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [repair]);

  const loadRepair = async () => {
    const res = await fetch(`/api/tracking?trackingId=${encodeURIComponent(trackingId)}`);
    if (res.ok) {
      setRepair(await res.json());
    } else {
      setError('Repair not found. Please check your tracking ID.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !repair) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-50 flex items-center justify-center">
            <AlertCircle size={36} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Not Found</h1>
          <p className="text-surface-500 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(repair.status);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-surface-500 hover:text-surface-900">
            <ArrowLeft size={18} /> Home
          </Link>
          <h1 className="text-lg font-bold text-surface-900">Repair Tracking</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors" title="QR Code"><QrCode size={20} className="text-surface-500" /></button>
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors" title="Barcode"><Barcode size={20} className="text-surface-500" /></button>
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors" title="Share"><Share2 size={20} className="text-surface-500" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Tracking ID Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-surface-900 text-white text-center">
          <p className="text-white/60 text-sm mb-1">Tracking ID</p>
          <p className="text-3xl font-bold font-mono tracking-wider">{repair.trackingId}</p>
          <p className="text-white/40 text-sm mt-2">Order: {repair.repairOrderId}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card-premium p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Repair Status</h2>

            {/* Status timeline */}
            <div className="space-y-1">
              {STATUS_FLOW.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-3 h-3 rounded-full border-2 transition-all',
                      i < currentIdx ? 'bg-emerald-500 border-emerald-500' :
                      i === currentIdx ? 'bg-primary border-primary ring-4 ring-primary/20' :
                      'bg-white border-surface-300'
                    )} />
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={cn('w-0.5 h-6', i < currentIdx ? 'bg-emerald-500' : 'bg-surface-200')} />
                    )}
                  </div>
                  <span className={cn('text-sm font-medium py-2',
                    i <= currentIdx ? 'text-surface-900' : 'text-surface-400')}>
                    {getStatusLabel(s)}
                    {i === currentIdx && (
                      <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="card-premium p-6 text-center">
            <Clock size={28} className="mx-auto mb-3 text-primary" />
            <h3 className="text-lg font-semibold text-surface-900 mb-1">Estimated Time</h3>
            {repair.estimatedDuration ? (
              <>
                <p className="text-3xl font-bold text-surface-900 font-mono mt-2">
                  {countdown.isExpired ? 'Completed' : `${Math.floor(countdown.remaining / 3600)}h ${Math.floor((countdown.remaining % 3600) / 60)}m`}
                </p>
                <div className="mt-3 h-2 bg-surface-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${countdown.percent}%` }}
                    className={cn('h-full rounded-full', countdown.isExpired ? 'bg-emerald-500' : 'bg-primary')}
                  />
                </div>
                <p className="text-xs text-surface-400 mt-1">{countdown.percent}% complete</p>
              </>
            ) : (
              <p className="text-surface-400 mt-2">Not specified</p>
            )}
            {repair.expectedDeliveryAt && (
              <p className="text-sm text-surface-500 mt-3">
                Expected: {formatDate(repair.expectedDeliveryAt)}
              </p>
            )}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Device Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card-premium p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Wrench size={18} className="text-primary" /> Device</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-surface-400">Model:</span> <span className="font-medium">{repair.model?.name || '—'}</span></p>
              <p><span className="text-surface-400">Brand:</span> <span className="font-medium">{repair.brand?.name || '—'}</span></p>
              <p><span className="text-surface-400">Category:</span> <span className="font-medium">{repair.brand?.category?.name || '—'}</span></p>
            </div>
          </motion.div>

          {/* Technician */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="card-premium p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><User size={18} className="text-primary" /> Technician</h3>
            {repair.primaryTechnician ? (
              <div>
                <p className="font-medium text-surface-900">{repair.primaryTechnician.name}</p>
                <p className="text-xs text-surface-400 mt-1">{repair.primaryTechnician.skills?.join(', ')}</p>
              </div>
            ) : (
              <p className="text-surface-400 text-sm">Waiting for assignment</p>
            )}
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="card-premium p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Package size={18} className="text-primary" /> Services</h3>
            {repair.services?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {repair.services.map((s: any) => (
                  <span key={s.id} className="px-2 py-0.5 rounded-lg bg-surface-50 text-xs text-surface-700">{s.service?.name}</span>
                ))}
              </div>
            ) : (
              <p className="text-surface-400 text-sm">No services selected</p>
            )}
          </motion.div>
        </div>

        {/* Parts & Cost */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Parts & Pricing</h3>
            <p className="text-2xl font-bold text-surface-900">{formatCurrency(repair.grandTotal)}</p>
          </div>
          {repair.parts?.length > 0 ? (
            <div className="space-y-2">
              {repair.parts.map((p: any) => (
                <div key={p.id} className="flex justify-between text-sm py-2 border-b border-surface-50">
                  <span>{p.name} x{p.quantity}</span>
                  <span className="font-medium">{formatCurrency(p.cost * p.quantity)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-400 text-sm">No parts listed</p>
          )}
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="btn-outline gap-2"><Printer size={18} /> Print</button>
          <button className="btn-outline gap-2"><Gift size={18} /> VIP E-Voucher</button>
          <button className="btn-outline gap-2"><Share2 size={18} /> Share via WhatsApp</button>
          <button className="btn-primary gap-2"><FileText size={18} /> Download Invoice</button>
        </div>
      </div>
    </div>
  );
}

function FileText(props: any) { return <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>; }
