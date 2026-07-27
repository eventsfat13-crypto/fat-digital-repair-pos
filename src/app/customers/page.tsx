'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    const res = await fetch('/api/customers?limit=100');
    if (res.ok) setCustomers((await res.json()).customers);
    setLoading(false);
  };

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search) || c.customerId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-surface-900">Customers</h1><p className="text-surface-500">{customers.length} total</p></div>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="input-premium pl-10" />
      </div>
      <div className="card-premium overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div> :
          filtered.length === 0 ? <div className="text-center py-20 text-surface-400"><Users size={48} className="mx-auto mb-4 opacity-30" /><p>No customers found</p></div> :
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-surface-100 bg-surface-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">ID</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Name</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Mobile</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Email</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Repairs</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Total Spent</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Joined</th>
          </tr></thead><tbody>
            {filtered.map(c => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-surface-50 hover:bg-surface-50/50 cursor-pointer">
                <td className="py-3 px-4"><p className="text-sm font-mono font-medium text-primary">{c.customerId}</p></td>
                <td className="py-3 px-4"><p className="text-sm font-medium text-surface-900">{c.name}</p></td>
                <td className="py-3 px-4"><p className="text-sm text-surface-500">{c.mobile || '—'}</p></td>
                <td className="py-3 px-4"><p className="text-sm text-surface-500">{c.email || '—'}</p></td>
                <td className="py-3 px-4 text-center"><p className="text-sm font-semibold text-surface-900">{c.totalRepairs}</p></td>
                <td className="py-3 px-4 text-right"><p className="text-sm font-medium">{formatCurrency(c.totalSpent)}</p></td>
                <td className="py-3 px-4 text-right"><p className="text-sm text-surface-500">{formatDate(c.createdAt)}</p></td>
              </motion.tr>
            ))}
          </tbody></table></div>
        }
      </div>
    </div>
  );
}
