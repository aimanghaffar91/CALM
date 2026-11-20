import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ShieldAlert, 
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StressCheckView({ t, setActiveTab, onTriggerCrisis }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    { id: 1, text: t.q1 },
    { id: 2, text: t.q2 },
    { id: 3, text: t.q3 },
    { id: 4, text: t.q4 },
    { id: 5, text: t.q5 },
    { id: 6, text: t.q6 },
    { id: 7, text: t.q7 },
    { id: 8, text: t.q8 },
  ];

  const options = [
    { value: 0, label: t.optNever },
    { value: 1, label: t.optSometimes },
    { value: 2, label: t.optOften },
    { value: 3, label: t.optAlways },
  ];

  const handleSelectOption = (value) => {
    const updated = { ...answers, [currentStep]: value };
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishAssessment(updated);
    }
  };

  const finishAssessment = (finalAnswers) => {
    setIsCompleted(true);
    const sum = Object.values(finalAnswers).reduce((acc, curr) => acc + curr, 0);
    const percentage = Math.round((sum / (questions.length * 3)) * 100);

    if (percentage <= 30) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else if (percentage >= 75) {
      // Trigger emergency care prompt if > 75%
      setTimeout(() => {
        if (onTriggerCrisis) onTriggerCrisis();
      }, 800);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Score calculation
  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const percentage = Math.round((totalScore / (questions.length * 3)) * 100);

  // Determine classification
  let level = 'low';
  let levelTitle = t.lowStressTitle;
  let levelDesc = t.lowStressDesc;
  let strokeColor = '#10B981'; // emerald-500
  let bgColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';

  if (percentage > 60) {
    level = 'high';
    levelTitle = t.highStressTitle;
    levelDesc = t.highStressDesc;
    strokeColor = '#F43F5E'; // rose-500
    bgColor = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (percentage > 30) {
    level = 'moderate';
    levelTitle = t.moderateStressTitle;
    levelDesc = t.moderateStressDesc;
    strokeColor = '#F59E0B'; // amber-500
    bgColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  // SVG circular progress metrics
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Title Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/50"
      >
        <div className="flex items-center gap-2 mb-2 text-sky-600">
          <Activity className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Clinical Self-Assessment
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.assessTitle}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-sky-100 leading-relaxed">
          {t.assessSubtitle}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          /* Step-by-Step Question Interface */
          <motion.div
            key="question-box"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-sm space-y-6"
          >
            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(((currentStep) / questions.length) * 100)}% complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full bg-sky-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="min-h-[90px] flex items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
                {questions[currentStep].text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {options.map((opt) => (
                <motion.button
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-slate-50/60 hover:bg-sky-50/40 text-slate-700 font-medium text-sm text-left flex items-center justify-between transition-all"
                >
                  <span>{opt.label}</span>
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-purple-500" />
                </motion.button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="pt-2 flex justify-start">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-700"
                >
                  Go to previous question
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* Comprehensive Results Screen with Animated Percentage Circle */
          <motion.div
            key="result-box"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-md space-y-6 text-center"
          >
            <h2 className="text-xl font-bold text-slate-800">
              {t.assessScoreTitle}
            </h2>

            {/* Animated SVG Circular Progress Ring */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  fill="none"
                />
                {/* Dynamic Progress Ring */}
                <motion.circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>

              {/* Inside Score Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-extrabold text-slate-800 tracking-tight"
                >
                  {percentage}%
                </motion.span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Autonomic Load
                </span>
              </div>
            </div>

            {/* Classification Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`p-5 rounded-3xl border text-left ${bgColor}`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-bold text-base">
                {level === 'high' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                <span>{levelTitle}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                {levelDesc}
              </p>
            </motion.div>

            {/* Action Recommendations */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab('breathe')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-all"
              >
                <Wind className="w-4 h-4" />
                <span>{t.viewProtocol}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={resetAssessment}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.retakeAssess}</span>
              </motion.button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
