import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertTriangle, 
  HeartHandshake, 
  Info, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';

export default function DoctorView({ t }) {
  const signs = [
    { id: 1, text: t.docSign1 },
    { id: 2, text: t.docSign2 },
    { id: 3, text: t.docSign3 },
    { id: 4, text: t.docSign4 },
    { id: 5, text: t.docSign5, critical: true },
  ];

  const helplines = [
    { country: "International / US Lifeline", number: "988", desc: "Free, confidential 24/7 suicide & crisis lifeline", tel: "988" },
    { country: "United Kingdom", number: "111 or 116 123", desc: "NHS Mental Health & Samaritans 24/7 service", tel: "111" },
    { country: "Pakistan", number: "0311-7786264 / 1122", desc: "Umang Mental Health Helpline & Emergency Rescue", tel: "03117786264" },
    { country: "India", number: "9152987821 / 14416", desc: "Vandrevala Foundation & Tele-MANAS 24/7 Helpline", tel: "9152987821" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 sm:p-7 border border-rose-200/80 bg-gradient-to-br from-white via-rose-50/30 to-amber-50/20 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2 text-rose-700">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Clinical Safety Guidelines
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {t.doctorTitle}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.doctorSub}
        </p>

        {/* Disclaimer */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Medical Disclaimer:</strong> CALM is an emotional wellness and somatic regulation tool designed for stress reduction. It does not provide medical diagnosis, psychotherapy, or clinical crisis treatment. If you are in acute distress, reach out to a licensed medical professional immediately.
          </div>
        </div>
      </motion.div>

      {/* When to see a doctor list */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-6 sm:p-7 bg-white border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-800">
            {t.whenToSeeDoc}
          </h2>
        </div>

        <div className="space-y-3">
          {signs.map((sign) => (
            <div 
              key={sign.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${
                sign.critical 
                  ? 'bg-rose-50/70 border-rose-300 text-rose-900 font-semibold' 
                  : 'bg-slate-50 border-slate-200/90 text-slate-700'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                sign.critical ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {sign.id}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {sign.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 24/7 International Crisis Helplines */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-6 sm:p-7 bg-white border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-800">
            {t.hotlinesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((h, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col justify-between gap-3"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {h.country}
                </span>
                <span className="text-lg font-black text-sky-800 tracking-tight block mt-0.5">
                  {h.number}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {h.desc}
                </p>
              </div>

              <a
                href={`tel:${h.tel}`}
                className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {h.number.split(' ')[0]} Now</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center">
          {t.hotlineEmergency}
        </div>
      </motion.div>

    </div>
  );
}
