'use client';
import { motion } from 'framer-motion';
import { FileBarChart, TrendingUp, DollarSign, Wrench, Users, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(setData); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-surface-900">Reports</h1><p className="text-surface-500">Analytics & business insights</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Daily Sales', value: formatCurrency(data?.dailySales || 0) },
          { label: 'Weekly Sales', value: formatCurrency(data?.weeklySales || 0) },
          { label: 'Monthly Sales', value: formatCurrency(data?.monthlySales || 0) },
          { label: 'Yearly Sales', value: formatCurrency(data?.yearlySales || 0) },
          { label: 'Total Repairs', value: data?.totalRepairs || 0 },
          { label: 'Completed', value: data?.completedRepairs || 0 },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ y: -2 }} className="card-premium p-4 text-center">
            <p className="text-xs text-surface-400 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-surface-900">{s.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {['PDF Export', 'Excel Export', 'CSV Export'].map(label => (
          <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="card-premium p-6 text-center hover:shadow-card-hover">
            <FileBarChart size={32} className="mx-auto mb-3 text-primary" />
            <p className="font-semibold text-surface-900">{label}</p>
            <p className="text-xs text-surface-400 mt-1">Download report</p>
          </motion.button>
        ))}
      </div>
      </div>
  );
}
