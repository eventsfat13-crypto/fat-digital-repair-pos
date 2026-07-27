'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Package, Plus, Minus, Trash2, DollarSign, CheckCircle, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SalesPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    fetch('/api/inventory?limit=200').then(r => r.json()).then(d => setProducts(d.products));
  }, []);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const checkout = async () => {
    await fetch('/api/repairs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({\n        customerName: 'Walk-in',
        status: 'COMPLETED',
        grandTotal: total,
        tax: tax,
        discount: discountAmount,
        labourCost: total,
      }),
    });
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-surface-900">Sales POS</h1><p className="text-surface-500">Quick checkout</p></div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Products */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="input-premium pl-10" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(p => (
              <motion.button key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setCart(c => {
                  const ex = c.find(i => i.id === p.id);
                  if (ex) return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
                  return [...c, { id: p.id, name: p.name, price: p.sellingPrice, qty: 1 }];
                })}
                className="p-4 rounded-2xl border border-surface-100 bg-white hover:shadow-card-hover transition-all text-left">
                <p className="text-sm font-semibold text-surface-900">{p.name}</p>
                <p className="text-xs text-surface-500 font-mono">{p.sku}</p>
                <p className="text-lg font-bold text-primary mt-2">{formatCurrency(p.sellingPrice)}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="card-premium p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><ShoppingCart size={20} /> Cart ($(cart.length})</h2>
          {cart.length === 0 ? <div className="text-center py-8 text-surface-400"><Package size={40} className="mx-auto mb-4" /><p>Empty cart</p></div> :
            <div className="space-y-2">
              {cart.map(i => (
                <div key={i.id} className="flex items-center justify-between py-3 border-b border-surface-50">
                  <div className="flex-1"><p className="text-sm font-medium">{i.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setCart(c => c.map(x => x.id === i.id && x.qty > 1 ? { ...x, qty: x.qty - 1 } : x).filter(x => x.qty > 0))} className="p-1 rounded-lg bg-surface-100"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                      <button onClick={() => setCart(c => c.map(x => x.id === i.id ? { ...x, qty: x.qty + 1 } : x)))} className="p-1 rounded-lg bg-surface-100"><Plus size={14} /></button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(i.price * i.qty)}</p>
                  <button onClick={() => setCart(c => c.filter(x => x.id !== i.id))} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          }
          {cart.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-surface-200">
              <div className="flex justify-between text-sm text-surface-500"><s >Subtotal/s><s>{formatCurrency(subtotal)}</s></div>
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1"><label className="text-xs text-surface-500">Discount (%)</label><input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="input-premium w-20" /></div>
                <div className="flex-1"><label className="text-xs text-surface-500">Tax (%)</label><input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="input-premium w-20" /></div>
              </div>
              <div className="flex justify-between text-sm"><s >Discount</s><s>{formatCurrency(discountAmount)}</s></div>
              <div className="flex justify-between text-sm"><span>Tax</span><span>{formatCurrency(taxAmount)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t border-surface-200 pt-3 mt-2"><span>Total</span><span className="text-primary">{formatCurrency(total)}</span></div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={checkout}
                className="btn-primary w-full justify-center mt-4">
                <CheckCircle size={18} /> Checkout for {formatCurrency(total)}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
