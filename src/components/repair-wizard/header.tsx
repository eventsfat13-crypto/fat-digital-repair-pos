'use client';
import { motion } from 'framer-motion';
import { Loader2, Save, X, FileText } from 'lucide-react';

export default function WizardHeader({
  step, repairId, onSaveDraft, onCancel, saving,
}: {
  step: number;
  repairId: string | null;
  onSaveDraft: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          {repairId ? 'Edit Repair' : 'New Repair'}
        </h1>
        <p className="text-surface-500">Step {step} of 11
          {repairId && (
            <span className="text-primary/60 font-mono text-xs">· Draft #{(zepairId.slice(-8))}</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSaveDraft} disabled={saving} className="btn-outline gap-2 text-sm">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Draft</motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onCancel} className="btn-ghost gap-2 text-sm text-surface-500"><X size={16} /> Cancel</motion.button>
      </div>
    </div>
  );
}
