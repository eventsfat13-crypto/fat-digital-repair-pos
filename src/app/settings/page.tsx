'use client';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Building2, Palette, Smartphone, Wrench, Bell, Shield, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setSettings(d.settings || {});
      setLoading(false);
    });
  }, []);

  const saveCompanySettings = async () => {
    const res = await fetch('/api/settings?section=company', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) toast.success('Settings saved');
    else toast.error('Failed to save');
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
  </div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-surface-900">Settings</h1><p className="text-surface-500">Manage your repair shop configuration</p></div>

      {/* Company Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Building2 size={20} className="text-primary" /> Company Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Company Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'website', label: 'Website' },
            { key: 'address', label: 'Address' },
            { key: 'currency', label: 'Currency (PKR/USD/etc)' },
            { key: 'currencySymbol', label: 'Currency Symbol (Rs./$)' },
            { key: 'timezone', label: 'Timezone' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
              <input type="text" value={settings?.[key] || ''}
                onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                className="input-premium" />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Terms & Conditions</label>
            <textarea value={settings?.termsAndConditions || ''}
              onChange={e => setSettings({ ...settings, termsAndConditions: e.target.value })}
              className="input-premium min-h-[80px]" rows={3} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-surface-100">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveCompanySettings} className="btn-primary">
            Save Settings
          </motion.button>
        </div>
      </motion.div>

      {/* Other settings cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Palette, label: 'Theme & Branding', desc: 'Logo, colors, layout' },
          { icon: Smartphone, label: 'Device Models', desc: 'Manage device database' },
          { icon: Wrench, label: 'Repair Services', desc: 'Services & pricing' },
          { icon: Bell, label: 'Notifications', desc: 'SMS, Email, WhatsApp' },
          { icon: Shield, label: 'Security', desc: 'Users, roles, audit' },
          { icon: FileText, label: 'Templates', desc: 'Invoice & voucher design' },
        ].map(item => (
          <motion.button key={item.label} whileHover={{ y: -2 }}
            className="card-premium p-5 text-left hover:shadow-card-hover">
            <item.icon size={22} className="text-primary mb-3" />
            <p className="font-semibold text-surface-900 text-sm">{item.label}</p>
            <p className="text-xs text-surface-400 mt-0.5">{item.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
