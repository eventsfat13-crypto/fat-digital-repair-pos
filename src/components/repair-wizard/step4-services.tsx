'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step4Services({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(d => {
      setServices(d.services.filter((s: any) => s.isActive));
      setLoading(false);
    });
  }, []);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Select Repair Services</h2>
      <p className="text-surface-500 mb-4">{selected.length} service(selected.length !== 1 ? 's' : '') selected</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto">
        {services.map(sv => (
          <motion.button key={sv.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => toggle(sv.id)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all text-left',
              selected.includes(sv.id) ? 'border-primary/40 bg-primary/[0.04] shadow-sm' : 'border-surface-100 hover:border-surface-200 bg-white'
)
          }>
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all',
                selected.includes(sv.id) ? 'bg-primary border-primary' : 'border-surface-300'
)
              }>
                {selected.includes(sv.id) && <Check size={12} className="text-white" />}
              </div>
              <div>
                <p className="font-medium text-surface-900 text-sm">{sv.name}</p>
                {sv.category && <p className="text-xs text-surface-400">{sv.category}</p>}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
