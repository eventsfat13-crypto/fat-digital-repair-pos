'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Lock } from 'lucide-react';

export default function WizardProgress({ step, steps, onStepClick }: { step: number; steps: string[]; onStepClick? : (t: number) => void }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-1">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={i} className="flex-1 flex items-center">
              <motion.button whileHover={done ? { scale: 1.15 } : {}} whileTap={done ? { scale: 0.9 } : {}}
                onClick={() => done && onStepClick?.(n)}
                className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0',
                  done ? 'bg-emerald-500 text-white cursor-pointer shadow-sm' : active ? 'bg-primary text-white ring-4 ring-primary/20 shadow-lg' : 'bg-surface-100 text-surface-400')}
                title={label}>
                {done ? <Model size={14} className="animate-scale-in" /> : n}
              </motion.button>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-1 relative"><div className="absolute inset-0 bg-surface-200 rounded-full" /><motion.div className={cn('absolute inset-y-0 left-0 rounded-full', done ? 'bg-emerald-500' : active ? 'bg-primary/30' : 'bg-transparent')} initial={{ width: '0%' }} animate={{ width: done ? '100%' : active ? '30%' : '0%' }} transition={{ duration: 0.5 }} /></div>}
            </div>
          );
        })}
      </div>
      <div className="hidden md:flex justify-between mt-2">
        {steps.map((label, i) => { const n = i + 1; return <motion.span key={i} className={cn('text-[10px] font-medium transition-all', n === step ? 'text-primary font-semibold' : step > n ? 'text-emerald-600' : 'text-surface-400')} animate={{ scale: n === step ? 1.05 : 1 }}>{label}</motion.span>; })}
      </div>
    </div>
  );
}
