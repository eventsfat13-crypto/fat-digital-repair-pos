'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Package, Loader2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => { loadProducts(); }, [showLowStock]);

  const loadProducts = async () => {
    const params = showLowStock ? '?lowStock=true' : '?limit=200';
    const res = await fetch(`/api/inventory${params}`);
    if (res.ok) setProducts((await res.json()).products);
    setLoading(false);
  };

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-surface-900">Inventory</h1><p className="text-surface-500">{products.length} products</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowLowStock(!showLowStock)}
            className={showLowStock ? 'btn-primary gap-2' : 'btn-outline gap-2'}>
            <AlertTriangle size={16} /> {showLowStock ? 'Showing Low Stock' : 'Low Stock'}
          </button>
        </div>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="input-premium pl-10" />
      </div>
      <div className="card-premium overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div> :
          filtered.length === 0 ? <div className="text-center py-20 text-surface-400"><Package size={48} className="mx-auto mb-4 opacity-30" /><p>No products found</p></div> :
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filtered.map(p => {
                const isLow = p.quantity <= p.lowStockAlert;
                return (
                  <motion.div key={p.id} whileHover={{ y: -2 }} className="p-5 rounded-2xl border border-surface-100 bg-white hover:shadow-card-hover transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-surface-900">{p.name}</p>
                        <p className="text-xs text-surface-400 font-mono">{p.sku}</p>
                      </div>
                      {isLow && <span className="badge bg-red-100 text-red-700 text-[10px]">Low Stock</span>}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-surface-900">{p.quantity}</p>
                        <p className="text-xs text-surface-400">in stock</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-surface-900">{formatCurrency(p.sellingPrice)}</p>
                        <p className="text-xs text-surface-400">sell price</p>
                      </div>
                    </div>
                    {p.quantity <= p.lowStockAlert && (
                      <div className="mt-3 pt-3 border-t border-red-50">
                        <p className="text-xs text-red-600">⚠ Alert at {p.lowStockAlert} units</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
