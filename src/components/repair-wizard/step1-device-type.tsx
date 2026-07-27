'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Smartphone, Tablet, Watch, Monitor, Gamepad2, Headphones, Laptop, Cpu, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEVICE_TYPES = [
  { name: 'Phone', icon: Smartphone },
  { name: 'Tablet', icon: Tablet },
  { name: 'iPad', icon: Tablet },
  { name: 'Apple Watch', icon: Watch },
  { name: 'AirPods', icon: Headphones },
  { name: 'MacBook', icon: Laptop },
  { name: 'Laptop', icon: Monitor },
  { name: 'Desktop', icon: Monitor },
  { name: 'Gaming Console', icon: Gamepad2 },
  { name: 'Smart Watch', icon: Watch },
  { name: 'Smart Device', icon: Cpu },
  { name: 'Other', icon: Wrench },
];

export default function Step1DeviceType({ selectedId, onSelect }: { selectedId?: string; onSelect: (id: string) => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/devices?type=categories').then(r => r.json()).then(d => {
      setCategories(d.filter((c: any) => c.isActive));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Select Device Type</h2>
      <p className="text-surface-500 mb-6">Choose the device category for this repair</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {DEVICE_TYPES.map((tt) => {
          const cat = categories.find(c => c.name === dt.name);
          if (!cat) return null;
          const isActive = cat.id === selectedId;
          return (<motion.button key={tt. name} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(cat.id)} className={cn("p-6 rounded-2xl border-2 transition-all text-center relative",isActive?'border-primary/40 bg-primary/[0.04] shadow-sm':'border-surface-100 hover:border-primary/30 bg-white')}>{isActive && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check size={12} className="text-white" /></div>}<motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.3 }} className={cn('w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors',isActive?'bg-primary/10':'bg-surface-50 group-hover:bg-primary/5')}><motion.div className={cn('transition-colors',isActive?'text-primary':'text-surface-500 group-hover:text-primary')}><dt.icon size={32} /></motion.div></div><p className={cn("font-semibold text-sm",isActive?'text-primary':'text-surface-900')}>{dt.name}</p><p className="text-xs text-surface-400 mt-1">{cat._count?.brands || 0} brands</p></motion.button>);
        })}
      </div>
    </div>
  );
}
