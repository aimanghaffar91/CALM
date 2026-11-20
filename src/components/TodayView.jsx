import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SunMedium,
  Anchor,
  Zap,
  CloudDrizzle,
  Wind,
  Eye,
  Layers,
  Snowflake,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function TodayView({ t, setActiveTab, onRecordMood }) {
  const [selectedState, setSelectedState] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  const quadrants = [
    {
      id: 'energized',
      title: t.stateEnergized,
      subtitle: t.stateEnergizedSub,
      icon: SunMedium,
      gradient: 'from-orange-50 to-amber-50',
      border: 'border-orange-100',
      activeRing: 'ring-orange-400',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badgeBg: 'bg-orange-50 text-orange-600 border-orange-100',
      badge: 'Sympathetic / Pleasant',
      advice: 'Channel this vital energy into mindful creativity or gentle movement today.',
      dot: 'bg-orange-400'
    },
    {
      id: 'calm',
      title: t.stateCalm,
      subtitle: t.stateCalmSub,
      icon: Anchor,
      gradient: 'from-teal-50 to-emerald-50',
      border: 'border-teal-100',
      activeRing: 'ring-teal-400',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      badgeBg: 'bg-teal-50 text-teal-600 border-teal-100',
      badge: 'Ventral Vagal (Safe)',
      advice: 'Your nervous system is in restorative equilibrium. Soak in this quiet clarity.',
      dot: 'bg-teal-400'
    },
    {
      id: 'tense',
      title: t.stateTense,
      subtitle: t.stateTenseSub,
      icon: Zap,
      gradient: 'from-rose-50 to-pink-50',
      border: 'border-rose-100',
      activeRing: 'ring-rose-400',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: 'Sympathetic Arousal',
      advice: 'Your body is on alert. Box breathing and bilateral eye tracking can help signal safety.',
      dot: 'bg-rose-400'
    },
    {
      id: 'depleted',
      title: t.stateDepleted,
      subtitle: t.stateDepletedSub,
      icon: CloudDrizzle,
      gradient: 'from-sky-50 to-blue-50',
      border: 'border-sky-100',
      activeRing: 'ring-sky-400',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-600 border-sky-100',
      badge: 'Dorsal Vagal Shutdown',
      advice: 'Offer yourself tenderness today. Rest, hydrate, and warm your physical body.',
      dot: 'bg-sky-400'
    }
  ];

  const handleSelectState = (state) => {
    setSelectedState(state);
    setHasCheckedIn(true);
    if (onRecordMood) onRecordMood(state.id, state.title);
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12
    ? t.greetingMorning
    : currentHour < 18
      ? t.greetingAfternoon
      : t.greetingEvening;

  return (
    <div className="space-y-5 sm:space-y-7 pb-24">

      {/* Greeting Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/3 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-800/20 translate-y-1/2 -translate-x-1/4 blur-xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-sky-100 bg-white/15 px-3 py-1 rounded-full mb-3">
            {t.badgeSanctuary}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            {greeting}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl">
            {t.greetingSub}
          </p>
        </div>
      </motion.div>

      {/* Affective Check-In */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="px-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.emotionalMatrixTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.emotionalMatrixDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quadrants.map((quad) => {
            const Icon = quad.icon;
            const isSelected = selectedState?.id === quad.id;

            return (
              <motion.button
                key={quad.id}
                onClick={() => handleSelectState(quad)}
                whileHover={{ scale: 1.018, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative text-left p-5 rounded-2xl transition-all border-2 ${
                  isSelected
                    ? `bg-gradient-to-br ${quad.gradient} ring-2 ${quad.activeRing} ring-offset-1 ${quad.border} shadow-md`
                    : `bg-white ${quad.border} hover:bg-gradient-to-br hover:${quad.gradient} shadow-sm hover:shadow-md`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl ${quad.iconBg} ${quad.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${quad.badgeBg}`}>
                    {quad.badge}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {quad.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {quad.subtitle}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700 font-medium leading-relaxed"
                  >
                    {quad.advice}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Grounding Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-100">
            {t.dailyAffirmationTitle}
          </span>
          <blockquote className="mt-2 text-base sm:text-lg font-medium leading-relaxed text-white">
            {t.dailyAffirmation}
          </blockquote>
        </div>
        <div className="bg-white px-6 py-4 space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            How does this land for you today?
          </label>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write a thought, notice a sensation, or simply name what you feel right now..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white resize-none transition-all leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Stored only on your device</span>
            <button
              onClick={() => setActiveTab('breathe')}
              className="flex items-center gap-1 text-xs text-sky-600 font-semibold hover:text-sky-700 transition-colors"
            >
              <span>{t.groundingPrompt}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Interventions */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-bold text-slate-900 tracking-tight px-1">
          {t.quickReliefTitle}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Wind, label: t.quickReliefBreathe, tab: 'breathe', bg: 'bg-sky-50 hover:bg-sky-100', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', border: 'border-sky-100' },
            { icon: Eye, label: t.quickReliefEMDR, tab: 'breathe', bg: 'bg-teal-50 hover:bg-teal-100', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', border: 'border-teal-100' },
            { icon: Layers, label: t.quickReliefGround, tab: 'breathe', bg: 'bg-indigo-50 hover:bg-indigo-100', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', border: 'border-indigo-100' },
            { icon: Snowflake, label: t.quickReliefCold, tab: 'movement', bg: 'bg-orange-50 hover:bg-orange-100', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', border: 'border-orange-100' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={i}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(item.tab)}
                className={`p-4 rounded-2xl ${item.bg} border ${item.border} shadow-sm flex flex-col items-center text-center gap-2.5 transition-all`}
              >
                <div className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
