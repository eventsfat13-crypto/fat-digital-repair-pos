'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Receipt, Tag } from 'lucide-react';

export default function Step11Review({
  data, labourCost, discount, advancePayment,
  onLabourCostChange, onDiscountChange, onAdvancePaymentChange,
}: {
  data: any; labourCost: number; discount: number; advancePayment: number;
  onLabourCostChange: (v: number) => void; onDiscountChange: (v: number) => void; onAdvancePaymentChange: (v: number) => void;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [catRes, servRes, techRes] = await Promise.all([
        fetch('/api/devices?type=categories'), fetch('/api/services'), fetch('/api/technicians'),
      ]);
      const cats = (await catRes.json()).filter((c: any) => c.isActive);
      const serv = (await servRes.json());
      const tech = (await techRes.json());
      setCategories(cats);
      setServices(serv.services.filter((s: any) => s.isActive));
      setTechnicians(tech.technicians.filter((t: any) => t.isActive));
    };
    load();
  }, []);

  useEffect(() => {
    if (data.categoryId) fetch(`/api/devices?type=brands&categoryId=${data.categoryId}`).then(r => r.json()).then(d => setBrands(d));
  }, [data.categoryId]);

  useEffect(() => {
    if (data.brandId) fetch(`/api/devices?type=models&brandId=${data.brandId}`).then(r => r.json()).then(d => setModels(d));
  }, [data.brandId]);

  const cat = categories.find(c => c.id === data.categoryId);
  const brand = brands.find(b => b.id === data.brandId);
  const model = models.find(m => m.id === data.modelId);
  const tech = technicians.find(t => t.id === data.technicianId);
  const selectedServices = services.filter(s => data.serviceIds?.includes(s.id));
  const partsTotal = (data.parts || []).reduce((sum: number, p: any) => sum + p.cost * p.quantity, 0);
  const tax = (labourCost + partsTotal) * 0.16;
  const grandTotal = labourCost + partsTotal + tax - discount;
  const remaining = grandTotal - advancePayment;

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-1">Review & Cost</h2>
      <p className="text-surface-500 mb-6">Review details and set pricing</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">Repair Summary</h3>
          <div className="space-y-2">
            <SummaryRow label="Device" value={[cat?.name, brand?.name, model?.name].filter(Boolean).join(' → ')} />
            <SummaryRow label="Services" value={selectedServices.map(s => s.name).join(', ') || 'None'} />
            <SummaryRow label="Parts" value={`${(data.parts || []).length} parts`} />
            <SummaryRow label="Customer" value={data.customerData?.name || 'Walk-in'} />
            <SummaryRow label="Technician" value={tech?.name || 'Not assigned'} />
            <SummaryRow label="Priority" value={data.priority} />
          </div>
        </div>

        {/* Cost */}
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Pricing</h3>
          <div className="space-y-3 p-5 rounded-2xl bg-surface-50 border border-surface-200">
            <div>
              <label className="block text-sm text-surface-600 mb-1">Labour Cost</label>
              <input type="number" value={labourCost} onChange={e => onLabourCostChange(parseFloat(e.target.value) || 0)}
                className="input-premium" />
            </div>
            <div>
              <label className="block text-sm text-surface-600 mb-1">Discount</label>
              <input type="number" value={discount} onChange={e => onDiscountChange(parseFloat(e.target.value) || 0)}
                className="input-premium" />
            </div>
            <div>
              <label className="block text-sm text-surface-600 mb-1">Advance Payment</label>
              <input type="number" value={advancePayment} onChange={e => onAdvancePaymentChange(parseFloat(e.target.value) || 0)}
                className="input-premium" />
            </div>
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-surface-900 text-white space-y-2">
            <div className="flex justify-between text-white/70 text-sm">
              <span>Labour</span><span>Rs. {labourCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>Parts</span><span>Rs. {partsTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>Tax (16%)</span><span>Rs. {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>Discount</span><span>- Rs. {discount.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
              <span>Grand Total</span><span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>Advance</span><span>Rs. {advancePayment.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
              <span>Remaining</span><span>Rs. {remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-surface-100 text-sm">
      <span className="text-surface-500">{label}</span>
      <span className="text-surface-900 font-medium text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );
}
