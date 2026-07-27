'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shield, Lock, AlertTriangle, Info, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step5DeviceInfo({ data, onChange }: { data: any; onChange: (info: any) => void }) {
  const update = (field: string, value: any) => onChange({ ...(data || {}), [field]: value });
  const toggle = (field: string) => update(field, !data?.[field]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Device Information</h2>
      <p className="text-surface-500 mb-6">Record complete device details and customer complaint</p>

      <div className="space-y-6">
        {/* Identification */}
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone size={16} /> Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'imei1', label: 'IMEI 1', placeholder: 'Dial *#06# to find IMEI' },
              { key: 'imei2', label: 'IMEI 2 (Dual SIM)', placeholder: 'Leave blank if single SIM' },
              { key: 'serialNumber', label: 'Serial Number', placeholder: 'Found in Settings or on box' },
              { key: 'passcode', label: 'Device Passcode', placeholder: 'For testing purposes' },
              { key: 'pin', label: 'PIN Code', placeholder: 'If different from passcode' },
              { key: 'pattern', label: 'Screen Lock Pattern', placeholder: 'Describe pattern if known' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
                <input
                  type="text" value={data?.[key] || ''}
                  onChange={e => update(key, e.target.value)}
                  className="input-premium"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Device Specs */}
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Info size={16} /> Device Specs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'storage', label: 'Storage Capacity', placeholder: 'e.g. 128GB, 256GB' },
              { key: 'batteryHealth', label: 'Battery Health %', placeholder: 'e.g. 85% (if known)' },
              { key: 'color', label: 'Color', placeholder: 'e.g. Graphite, Sierra Blue' },
              { key: 'warranty', label: 'Warranty Status', placeholder: 'Under warranty / Expired / AppleCare' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
                <input
                  type="text" value={data?.[key] || ''}
                  onChange={e => update(key, e.target.value)}
                  className="input-premium"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Locks */}
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lock size={16} /> Security Locks
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'googleLock', label: 'Google Lock (FRP)', desc: 'Google account protection active' },
              { key: 'icloudLock', label: 'iCloud Lock', desc: 'iCloud / Find My iPhone active' },
            ].map(({ key, label, desc }) => (
              <motion.button
                key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => toggle(key)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-left',
                  data?.[key]
                    ? 'border-red-200 bg-red-50/50'
                    : 'border-emerald-200 bg-emerald-50/50'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-surface-900 text-sm">{label}</span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-lg text-xs font-bold',
                    data?.[key] ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  )}>
                    {data?.[key] ? 'LOCKED' : 'CLEAR'}
                  </span>
                </div>
                <p className="text-xs text-surface-500">{desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Accessories Received */}
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield size={16} /> Accessories Received
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'simCard', label: 'SIM Card' },
              { key: 'memoryCard', label: 'SD / Memory Card' },
              { key: 'charger', label: 'Charger' },
              { key: 'cable', label: 'USB Cable' },
              { key: 'case', label: 'Phone Case' },
              { key: 'screenGuard', label: 'Screen Guard' },
              { key: 'box', label: 'Original Box' },
              { key: 'earphones', label: 'Earphones' },
            ].map(({ key, label }) => (
              <motion.button
                key={key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => toggle(key)}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all text-center',
                  data?.[key]
                    ? 'border-primary/30 bg-primary/[0.04]'
                    : 'border-surface-100 hover:border-surface-200 bg-white'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {data?.[key] ? (
                    <Check size={16} className="text-primary" />
                  ) : (
                    <X size={16} className="text-surface-300" />
                  )}
                  <span className={cn('text-sm font-medium',
                    data?.[key] ? 'text-surface-900' : 'text-surface-400')}>
                    {label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Other Accessories</label>
            <input
              type="text" value={data?.accessories || ''}
              onChange={e => update('accessories', e.target.value)}
              className="input-premium"
              placeholder="Specify other accessories received..."
            />
          </div>
        </div>

        {/* Complaint & Notes */}
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle size={16} /> Issue Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Customer Complaint <span className="text-red-400">*</span>
              </label>
              <textarea
                value={data?.complaint || ''}
                onChange={e => update('complaint', e.target.value)}
                className="input-premium min-h-[80px]"
                placeholder="Describe what the customer reported — what's wrong with the device? Be specific."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Internal Repair Notes</label>
              <textarea
                value={data?.repairNotes || ''}
                onChange={e => update('repairNotes', e.target.value)}
                className="input-premium min-h-[80px]"
                placeholder="Technician notes — initial diagnosis, observations, approach plan (not visible to customer)"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
