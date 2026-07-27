'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TrackingListPage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) router.push(`/track/${encodeURIComponent(trackingId.trim())}`);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
        <MapPin size={32} className="text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Repair Tracking</h1>
        <p className="text-surface-500 mt-2">Enter a tracking ID to check repair status</p>
      </div>
      <form onSubmit={handleTrack} className="flex gap-3">
        <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)}
          placeholder="FAT-2026-000001" className="input-premium flex-1 font-mono text-center text-lg" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary">
          <Search size={18} /> Track
        </motion.button>
      </form>
    </div>
  );
}
