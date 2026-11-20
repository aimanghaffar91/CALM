import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  Moon, 
  Eye, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { soundEngine } from '../services/audioService';

export default function BreathingView({ t }) {
  const [activeTab, setActiveTab] = useState('box'); // 'box', '478', 'emdr', 'grounding'

  // Breathing state
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale', 'rest'
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // EMDR state
  const [emdrSpeed, setEmdrSpeed] = useState(2.2); // seconds per sweep

  // 5-4-3-2-1 Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingChecked, setGroundingChecked] = useState({});

  // Cycle timing configs
  const protocols = {
    box: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      rest: 4,
      name: t.tabBox,
      color: 'from-sky-500/20 via-teal-500/20 to-indigo-500/20',
      orbBg: 'bg-gradient-to-tr from-sky-400 to-teal-300'
    },
    '478': {
      inhale: 4,
      hold: 7,
      exhale: 8,
      rest: 0,
      name: t.tab478,
      color: 'from-indigo-500/20 via-blue-500/20 to-sky-500/20',
      orbBg: 'bg-gradient-to-tr from-indigo-400 to-sky-300'
    }
  };

  const currentProtocol = protocols[activeTab] || protocols.box;

  useEffect(() => {
    let interval = null;

    if (isRunning && (activeTab === 'box' || activeTab === '478')) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            let nextPhase = 'inhale';
            let nextDuration = currentProtocol.inhale;

            if (phase === 'inhale') {
              nextPhase = 'hold';
              nextDuration = currentProtocol.hold;
              soundEngine.playBreathChime('hold');
            } else if (phase === 'hold') {
              nextPhase = 'exhale';
              nextDuration = currentProtocol.exhale;
              soundEngine.playBreathChime('exhale');
            } else if (phase === 'exhale') {
              if (currentProtocol.rest > 0) {
                nextPhase = 'rest';
                nextDuration = currentProtocol.rest;
              } else {
                nextPhase = 'inhale';
                nextDuration = currentProtocol.inhale;
                setCycleCount((c) => c + 1);
                soundEngine.playBreathChime('inhale');
              }
            } else if (phase === 'rest') {
              nextPhase = 'inhale';
              nextDuration = currentProtocol.inhale;
              setCycleCount((c) => c + 1);
              soundEngine.playBreathChime('inhale');
            }

            setPhase(nextPhase);
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, phase, activeTab, currentProtocol]);

  const toggleBreathing = () => {
    if (!isRunning) {
      setPhase('inhale');
      setSecondsLeft(currentProtocol.inhale);
      soundEngine.playBreathChime('inhale');
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetBreathing = () => {
    setIsRunning(false);
    setPhase('inhale');
    setSecondsLeft(currentProtocol.inhale);
    setCycleCount(0);
  };

  // Phase instructional label
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return t.phaseInhale;
      case 'hold': return t.phaseHold;
      case 'exhale': return t.phaseExhale;
      case 'rest': return t.phaseRest;
      default: return t.phaseInhale;
    }
  };

  // Orb scale based on phase
  const getOrbScale = () => {
    if (!isRunning) return 1;
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 0.9;
      case 'rest': return 0.9;
      default: return 1;
    }
  };

  // 5-4-3-2-1 items
  const groundingItems = [
    { count: 5, prompt: "5 things you can visually observe in your current environment (notice texture, color, light)" },
    { count: 4, prompt: "4 physical sensations you can feel right now (feet on floor, clothes on skin, air on face)" },
    { count: 3, prompt: "3 distinct sounds you can detect around you (distant traffic, humming fan, your breath)" },
    { count: 2, prompt: "2 aromas or scents you can identify in the air" },
    { count: 1, prompt: "1 taste or somatic feeling of stillness inside your mouth" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/50"
      >
        <div className="flex items-center gap-2 mb-2 text-sky-100">
          <Wind className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Nervous System Regulation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.breatheTitle}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-sky-100 leading-relaxed">
          {t.breatheSub}
        </p>
      </motion.div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl max-w-xl mx-auto">
        <button
          onClick={() => { setActiveTab('box'); resetBreathing(); }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'box' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabBox}
        </button>

        <button
          onClick={() => { setActiveTab('478'); resetBreathing(); }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === '478' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tab478}
        </button>

        <button
          onClick={() => { setActiveTab('emdr'); resetBreathing(); }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'emdr' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabEMDR}
        </button>

        <button
          onClick={() => { setActiveTab('grounding'); resetBreathing(); }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'grounding' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabGround}
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 bg-white border border-slate-200 shadow-sm min-h-[420px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* Breathing Orb Interface */}
        {(activeTab === 'box' || activeTab === '478') && (
          <div className="space-y-8 w-full flex flex-col items-center">
            
            {/* Phase Instructions */}
            <div className="min-h-[48px]">
              <motion.h2
                key={phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight"
              >
                {isRunning ? getPhaseText() : "Press Begin to synchronize breath"}
              </motion.h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.cyclesCompleted}: {cycleCount}
              </p>
            </div>

            {/* Framer Motion Breathing Orb */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              
              {/* Outer Radiant Glow */}
              <motion.div
                animate={{
                  scale: getOrbScale(),
                  opacity: isRunning ? [0.4, 0.7, 0.4] : 0.3,
                }}
                transition={{
                  duration: isRunning ? (phase === 'inhale' ? currentProtocol.inhale : currentProtocol.exhale) : 2,
                  ease: 'easeInOut',
                }}
                className={`absolute w-56 h-56 rounded-full blur-2xl ${currentProtocol.orbBg} opacity-40`}
              />

              {/* Pulsing Guide Ring */}
              <motion.div
                animate={{ scale: getOrbScale() }}
                transition={{
                  duration: isRunning ? (phase === 'inhale' ? currentProtocol.inhale : currentProtocol.exhale) : 1.5,
                  ease: 'easeInOut',
                }}
                className="w-48 h-48 rounded-full border-2 border-purple-300/60 flex items-center justify-center shadow-inner relative"
              >
                {/* Central Core */}
                <motion.div
                  animate={{ scale: isRunning ? (phase === 'hold' ? [1, 1.05, 1] : 1) : 1 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-36 h-36 rounded-full shadow-lg flex flex-col items-center justify-center ${currentProtocol.orbBg} text-white`}
                >
                  <span className="text-3xl font-extrabold tracking-tight">
                    {isRunning ? secondsLeft : '0'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    {isRunning ? phase : 'Ready'}
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleBreathing}
                className="px-7 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-200 flex items-center gap-2"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? t.pauseBreath : t.startBreath}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetBreathing}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title={t.resetTimer}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* EMDR Bilateral Eye Tapper */}
        {activeTab === 'emdr' && (
          <div className="space-y-6 w-full max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {t.emdrTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {t.emdrSub}
              </p>
            </div>

            {/* Bilateral Track Area */}
            <div className="w-full h-32 bg-slate-50 rounded-3xl border border-slate-200/80 relative flex items-center px-6 overflow-hidden">
              <div className="w-full h-1 bg-slate-200/80 rounded-full" />

              {/* Oscillating Sphere */}
              <motion.div
                animate={{ x: ['0%', '100%', '0%'] }}
                transition={{
                  duration: emdrSpeed,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute left-6 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-teal-400 shadow-md shadow-purple-200 flex items-center justify-center -ml-6"
              >
                <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
              </motion.div>
            </div>

            {/* Speed Control */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 mr-2">
                {t.emdrSpeed}:
              </span>
              {[
                { label: 'Slow (Gentle)', val: 3.0 },
                { label: 'Standard', val: 2.2 },
                { label: 'Dynamic', val: 1.5 },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setEmdrSpeed(s.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    emdrSpeed === s.val 
                      ? 'bg-sky-600 text-white font-semibold' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5-4-3-2-1 Sensory Grounding Matrix */}
        {activeTab === 'grounding' && (
          <div className="space-y-4 w-full max-w-lg text-left">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                5-4-3-2-1 Somatic Orientation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ground your nervous system in physical reality by checking off each sensory anchor.
              </p>
            </div>

            <div className="space-y-2.5">
              {groundingItems.map((item, idx) => {
                const isChecked = !!groundingChecked[idx];
                return (
                  <motion.button
                    key={idx}
                    onClick={() => setGroundingChecked({ ...groundingChecked, [idx]: !isChecked })}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isChecked 
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-600' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                      isChecked 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                      {item.prompt}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-3 flex justify-center">
              <button
                onClick={() => setGroundingChecked({})}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Reset Checklist
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
