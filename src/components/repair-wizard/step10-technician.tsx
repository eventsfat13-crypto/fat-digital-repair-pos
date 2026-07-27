'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HardHat, Clock, AlertTriangle } from 'lucide-react';

const ESTIMATED_TIMES = [
  { label: '30 Minutes', mins: 30 },
  { label: '1 Hour', mins: 60 },
  { label: '2 Hours', mins: 120 },
  { label: '4 Hours', mins: 240 },
  { label: '6 Hours', mins: 360 },
  { label: '12 Hours', mins: 720 },
  { label: '24 Hours', mins: 1440 },
  { label: '2 Days', mins: 2880 },
  { label: '3 Days', mins: 4320 },
  { label: '1 Week', mins: 10080 },
];

const PRIORITIES = [
  { value: 'NORMAL', label: 'Normal', color: 'bg-slate-100 text-slate-700' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'EMERGENCY', label: 'Emergency', color: 'bg-red-100 text-red-700' },
];

export default function Step10Technician({
  technicianId, estimatedMinutes, customTime, priority,
  onSelectTechnician, onSelectTime, onPriorityChange,
}: {
  technicianId: string | null; estimatedMinutes: number | null; customTime: string; priority: string;
  onSelectTechnician: (id: string) => void; onSelectTime: (mins: number | null, custom: string) => void;
  onPriorityChange: (p: string) => void;
}) {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [customMin, setCustomMin] = useState(customTime);

  useEffect(() => {
    fetch('/api/technicians').then(r => r.json()).then(d => setTechnicians(d.technicians.filter((t: any) => t.isActive)));
  }, []);

  return (
    <div className="space-y-8">
      {/* Technician */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 mb-1">Assign Technician</h2>
        <p className="text-surface-500 mb-4">Select the technician for this repair</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {technicians.map(tech => (
            <motion.button key={tech.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTechnician(tech.id)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-left',
                technicianId === tech.id ? 'border-primary/40 bg-primary/[0.04]' : 'border-surface-100 hover:border-surface-200 bg-white'
              )}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                  <HardHat size={20} className="text-surface-500" />
                </div>
                <div>
                  <p className="font-semibold text-surface-900 text-sm">{tech.name}</p>
                  <p className="text-xs text-surface-400">{tech.skills?.slice(0, 2).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-500">
                <span>{tech.completedRepairs} completed</span>
                <span>·</span>
                <span>{tech.experience}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Repair Time */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 mb-1">Estimated Repair Time</h2>
        <p className="text-surface-500 mb-4">How long will this take?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ESTIMATED_TIMES.map(t => (
            <motion.button key={t.mins} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTime(t.mins, '')}
              className={cn(
                'p-3 rounded-xl border-2 transition-all text-center font-medium text-sm',
                estimatedMinutes === t.mins ? 'border-primary/40 bg-primary/[0.04] text-primary' : 'border-surface-100 hover:border-surface-200 bg-white text-surface-700'
              )}>
              <Clock size={18} className="mx-auto mb-1" />
              {t.label}
            </motion.button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-surface-500">Custom (minutes):</span>
          <input type="number"
            value={customMin} onChange={e => { setCustomMin(e.target.value); onSelectTime(null, e.target.value); }}
            className="input-premium w-32" placeholder="e.g. 90" min="1" />
        </div>
      </div>

      {/* Priority */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 mb-1">Priority</h2>
        <p className="text-surface-500 mb-3">Set repair urgency</p>
        <div className="flex gap-3">
          {PRIORITIES.map(p => (
            <motion.button key={p.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onPriorityChange(p.value)}
              className={cn(
                'px-6 py-3 rounded-xl border-2 transition-all font-semibold text-sm',
                priority === p.value
                  ? p.color.replace('bg-', 'border-').replace('100', '400').replace('700', '600') + ' ' + p.color
                  : 'border-surface-100 text-surface-500 bg-white'
              )}>
              <AlertTriangle size={16} className="inline mr-1.5" />
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
