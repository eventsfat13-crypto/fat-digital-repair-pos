'use client';
import { motion } from 'framer-motion';
import { Gift, Download, Printer, Mail, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function VouchersPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-surface-900">VIP E-Vouchers</h1><p className="text-surface-500">Premium digital vouchers for customers</p></div>
      <div className="card-premium p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <Gift size={48} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">VIP E-Voucher Generator</h2>
        <p className="text-surface-500 max-w-md mx-auto mb-6">
          Generate premium digital vouchers with QR codes, barcodes, and customer details. Available for any completed repair.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary gap-2"><Download size={18} /> Download PDF</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-outline gap-2"><Printer size={18} /> Print</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-outline gap-2"><Mail size={18} /> Email</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-outline gap-2"><Share2 size={18} /> WhatsApp</motion.button>
        </div>
      </div>
    </div>
  );
}
