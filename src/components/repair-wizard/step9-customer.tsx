'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function Step9Customer({
  customerId, customerData, onSelectCustomer, onChangeCustomerData
}: {
  customerId: string | null;
  customerData: any;
  onSelectCustomer: (id: string, data: any) => void;
  onChangeCustomerData: (data: any) => void;
}) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const searchCustomers = async (q: string) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    const res = await fetch(`/api/customers?q=${encodeURIComponent(q)}&limit=5`);
    if (res.ok) { const d = await res.json(); setResults(d.customers); }
  };

  const selectCustomer = (c: any) => {
    setSelected(c);
    onSelectCustomer(c.id, { name: c.name, mobile: c.mobile, email: c.email });
    setResults([]);
    setSearch('');
  };

  const clear = () => {
    setSelected(null);
    onSelectCustomer('', {});
    onChangeCustomerData({});
  };

  const update = (f: string, v: string) => onChangeCustomerData({ ...customerData, [f]: v });

  if (selected) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Customer Information</h2>
        <div className="p-5 rounded-2xl bg-surface-50 border border-surface-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xl font-bold text-surface-900">{selected.name}</p>
              <p className="text-sm text-surface-500">{selected.customerId} · {selected.mobile} · {selected.email}</p>
            </div>
            <button onClick={clear} className="text-sm text-red-500 hover:underline">Change</button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-white"><p className="text-surface-400 text-xs">Total Repairs</p><p className="font-bold text-surface-900">{selected.totalRepairs}</p></div>
            <div className="p-3 rounded-xl bg-white"><p className="text-surface-400 text-xs">Total Spent</p><p className="font-bold text-surface-900">Rs. {selected.totalSpent?.toLocaleString()}</p></div>
            <div className="p-3 rounded-xl bg-white"><p className="text-surface-400 text-xs">Customer Since</p><p className="font-bold text-surface-900">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Customer Information</h2>
      <p className="text-surface-500 mb-4">Search existing customer or create new</p>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search by name, phone, or ID..."
          value={search} onChange={e => searchCustomers(e.target.value)}
          className="input-premium pl-10" />
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
            {results.map(c => (
              <button key={c.id} onClick={() => selectCustomer(c)}
                className="w-full text-left px-4 py-3 hover:bg-surface-50 transition-colors flex items-center justify-between">
                <div><p className="font-medium text-surface-900 text-sm">{c.name}</p><p className="text-xs text-surface-400">{c.customerId} · {c.mobile}</p></div>
                <span className="text-xs text-surface-400">{c.totalRepairs} repairs</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'name', label: 'Customer Name *' },
          { key: 'mobile', label: 'Mobile Number' },
          { key: 'whatsapp', label: 'WhatsApp' },
          { key: 'email', label: 'Email' },
          { key: 'cnic', label: 'CNIC / National ID' },
          { key: 'address', label: 'Address' },
          { key: 'city', label: 'City' },
          { key: 'postalCode', label: 'Postal Code' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
            <input type={key === 'email' ? 'email' : 'text'} value={customerData?.[key] || ''}
              onChange={e => update(key, e.target.value)}
              className="input-premium" placeholder={label} />
          </div>
        ))}
      </div>
    </div>
  );
}
