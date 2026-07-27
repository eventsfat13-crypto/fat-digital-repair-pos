'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step2Brand({ categoryId, selectedId, onSelect }: { categoryId:? string; selectedId:? string; onSelect: (id: string) => void }) {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    fetch(`/api/devices?type=brands&categoryId=${categoryId}`).then(r => r.json()).then(d => { setBrands(d.filter((b: any) => b.isActive)); setLoading(false); });
  }, [categoryId]);

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Select Brand</h2>
      <p className="text-surface-500 mb-4">Choose the manufacturer</p>
      <div className="relative mb-5"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" /><input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all bg-white" /></div>
      {filtered.length === 0 ? <div className="text-center py-12 text-surface-400"><Search size={36} className="mx-auto mb-2 opacity-40" /><p>No brands found</p></div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">{filtered.map(b => { const act = b.id === selectedId; return <motion.button key={b.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(b.id)} className={cn('p-4 rounded-xl border-2 transition-all text-center relative',act?'border-primary/40 bg-primary/[0.04] shadow-sm':'border-surface-100 hover:border-primary/30 bg-white')}>{act && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center"><Check size={10} className="text-white" /></div>}<p className={cn('font-semibold text-sm',act?'text-primary':'text-surface-900')}>{b.name}</p><p className="text-xs text-surface-400 mt-0.5">{b._count?.models || 0} models</p></motion.button>; })}</div>}
    </div>
  );
}
