import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, PhoneCall, X, ShieldAlert } from 'lucide-react';

export default function CrisisModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-center space-y-5"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
          <HeartHandshake className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            {t.crisisAlertTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {t.crisisAlertBody}
          </p>
        </div>

        {/* Rapid Call Action */}
        <div className="space-y-2 pt-2">
          <a
            href="tel:988"
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.callHelpAction} (Dial 988)</span>
          </a>

          <div className="text-[11px] text-slate-400">
            Available 24 hours a day • 100% Free & Confidential
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            {t.dismissSafety}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
