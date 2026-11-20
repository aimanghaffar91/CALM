import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  HeartHandshake, 
  Globe, 
  Lock, 
  Waves, 
  CloudRain, 
  Activity
} from 'lucide-react';
import { soundEngine } from '../services/audioService';

export default function Header({ lang, setLang, t, onOpenPrivacy, onOpenCrisis, streak = 3 }) {
  const [activeSound, setActiveSound] = useState(null);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleSound = (mode) => {
    if (activeSound === mode) {
      soundEngine.stop();
      setActiveSound(null);
    } else {
      soundEngine.play(mode);
      setActiveSound(mode);
    }
    setShowSoundMenu(false);
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'urdu', label: 'Urdu', native: 'اردو' },
    { code: 'hindi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'arabic', label: 'Arabic', native: 'العربية' },
    { code: 'persian', label: 'Persian', native: 'فارسی' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-600" />
            <span className="relative z-10 text-white font-black text-lg tracking-tight">C</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900">
                {t.appName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Lock className="w-2.5 h-2.5" />
                {t.zeroKnowledge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              {t.appSub}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Sound */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeSound 
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-200' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {activeSound ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {activeSound ? (activeSound === 'theta' ? 'Theta 6Hz' : activeSound === 'rainfall' ? 'Rain' : '432Hz') : 'Sound'}
              </span>
            </motion.button>

            <AnimatePresence>
              {showSoundMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 z-50"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Ambient Audio
                  </p>
                  
                  <button
                    onClick={() => toggleSound('theta')}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      activeSound === 'theta' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Waves className="w-4 h-4 text-sky-500" />
                    <div>
                      <div>Theta Wave (6 Hz)</div>
                      <span className="text-[10px] text-slate-400">Deep vagal calming</span>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleSound('rainfall')}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      activeSound === 'rainfall' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CloudRain className="w-4 h-4 text-teal-500" />
                    <div>
                      <div>Gentle Rainfall</div>
                      <span className="text-[10px] text-slate-400">Synthesized pink noise</span>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleSound('solfeggio432')}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      activeSound === 'solfeggio432' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-orange-500" />
                    <div>
                      <div>432 Hz Resonance</div>
                      <span className="text-[10px] text-slate-400">Acoustic harmonic sine</span>
                    </div>
                  </button>

                  {activeSound && (
                    <button
                      onClick={() => toggleSound(activeSound)}
                      className="w-full mt-1 pt-1 border-t border-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                    >
                      Mute Audio
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Privacy */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenPrivacy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">{t.privacyArch}</span>
          </motion.button>

          {/* Crisis */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenCrisis}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-all"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">{t.crisisButton}</span>
          </motion.button>

          {/* Language */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase font-semibold">{lang}</span>
            </motion.button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-1.5 z-50"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        lang === l.code ? 'bg-sky-50 text-sky-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{l.native}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
