'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step3Model({ brandId, selectedId, onSelect }: { brandId:? string; selectedId:? string; onSelect: (id: string) => void }) {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!brandId) return;
    setLoading(true);
    fetch(`/api/devices?type=models&brandId=${brandId}`).then(r => r.json()).then(d => { setModels(d.filter((m: any) => m.isActive)); setLoading(false); });
  }, [brandId]);

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;

  const filtered = models.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Select Model</h2>
      <p className="text-surface-500 mb-4">Choose the exact device model</p>
      <div className="relative mb-5"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" /><input type="text" placeholder="Search models..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all bg-white" /></div>
      {filtered.length === 0 ? <div className="text-center py-12 text-surface-400"><Search size={36} className="mx-auto mb-2 opacity-40" /><p>No models found</p></div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[450px] overflow-y-auto">{filtered.map(m => { const act = m.id === selectedId; return <motion.button key={m.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(m.id)} className={cn('p-3 rounded-xl border-2 transition-all text-left relative',act?'border-primary/40 bg-primary/[0.04] shadow-sm':'border-surface-100 hover:border-primary/30 bg-white')}><div className="flex items-center gap-2">{act && <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Check size={10} className="text-white" /></div>}<div className="min-w-0"><p className={cn('font-medium text-sm truncate',act?'text-primary':'text-surface-900')}>{m.name}</p>{m.series && <p className="text-xs text-surface-400 mt-0.5">{m.series}</p>}</div></div></motion.button>; })}</div>}
    </div>
  );
}
