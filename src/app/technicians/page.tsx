'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HardHat, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/technicians?limit=100').then(r => r.json()).then(d => {
      setTechnicians(d.technicians);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-surface-900">Technicians</h1><p className="text-surface-500">{technicians.length} technicians</p></div>
      </div>
      <div className="card-premium overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div> :
          technicians.length === 0 ? <div className="text-center py-20 text-surface-400"><HardHat size={48} className="mx-auto mb-4 opacity-30" /><p>No technicians found</p></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {technicians.map(tech => (
              <motion.div key={tech.id} whileHover={{ y: -2 }}
                className="p-5 rounded-2xl border border-surface-100 bg-white hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg',
                    tech.isAvailable ? 'bg-emerald-500' : 'bg-red-400')}>
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">{tech.name}</p>
                    <p className="text-xs text-surface-400">{tech.experience || 'New'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tech.skills?.slice(0, 3).map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded-lg bg-surface-50 text-xs text-surface-600">{s}</span>
                  ))}
                  {tech.skills?.length > 3 && <span className="text-xs text-surface-400">+{tech.skills.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-500">{tech.completedRepairs} repairs</span>
                  <span className={cn('badge text-[10px]', tech.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                    {tech.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
