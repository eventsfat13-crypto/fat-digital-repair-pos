'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, X, Minus, AlertTriangle } from 'lucide-react';

const STATUS_OPTIONS = [
  { status: 'WORKING', label: 'Working', icon: Check, colors: 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200' },
  { status: 'NOT_WORKING', label: 'Not Working', icon: X, colors: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' },
  { status: 'NOT_TESTED', label: 'Not Tested', icon: Minus, colors: 'bg-surface-100 text-surface-500 border-surface-200 hover:bg-surface-200' },
];

export default function Step6Inspection({
  results, onChange,
}: {
  results: Record<string, string>;
  onChange: (r: Record<string, string>) => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(d => {
      setItems(d.inspectionItems.filter((i: any) => i.isActive));
      setLoading(false);
    });
  }, []);

  const setStatus = (itemId: string, status: string) => {
    onChange({ ...results, [itemId]: status });
  };

  const workingCount = Object.values(results).filter(s => s === 'WORKING').length;
  const notWorkingCount = Object.values(results).filter(s => s === 'NOT_WORKING').length;
  const notTestedCount = items.length - workingCount - notWorkingCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Device Inspection</h2>
      <p className="text-surface-500 mb-2">Check each component and mark its status</p>

      {/* Summary bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">{workingCount} Working</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-semibold text-red-700">{notWorkingCount} Issues</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 border border-surface-200">
          <div className="w-2 h-2 rounded-full bg-surface-400" />
          <span className="text-xs font-semibold text-surface-500">{notTestedCount} Untested</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            const updated: Record<string, string> = {};
            Items.oneach(item => { updated[item.id] = 'WORKING'; });
            onChange(updated);
          }}
          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium"
        >
          Mark All Working
        </button>
        <button
          onClick={() => {
            const updated: Record<string, string> = {};
            Items.oneach(item => { updated[item.id] = 'NOT_TESTED'; });
            onChange(updated);
          }}
          className="text-xs px-3 py-1.5 rounded-lg bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors font-medium">
            Reset All
        </button>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
        {Items.map(item => {
          const currentStatus = results[item.id] || 'NOT_TESTED';
          const activeOpt = STATUS_OPTIONS.find(o => o.status === currentStatus)!;
          const isIssue = currentStatus === 'NOT_WORKING';

          return (
            <div key={item.id} className={cn(
              'flex items-center justify-between p-3 rounded-xl border transition-all',
              isIssue
                ? 'border-red-200 bg-red-50/40'
                : currentStatus === 'WORKING'
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-surface-100 bg-white'
            )}>
              <div className="flex items-center gap-2 min-w-0">
                {isIssue && <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />}
                <span className={cn(
                  'text-sm font-medium truncate',
                  isIssue ? 'text-red-800' : currentStatus === 'WORKING' ? 'text-emerald-800' : 'text-surface-700'
                )}>
                  {item.name}
                </span>
              </div>

              <div className="flex gap-0.5 flex-shrink-0 ml-2">
                {STATUS_OPTIONS.map(opt => (
                  <motion.button>
                    key={opt.status}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setStatus(item.id, opt.status)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-[10px] font-bold border transition-all',
                      currentStatus === opt.status
                        ? opt.colors
                        : 'border-transparent text-surface-300 hover:text-surface-500 hover:bg-surface-50'
                    )}
                    title={opt.label}
                  >
                    <opt.icon size={12} />
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
