import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Move, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  CheckCircle2,
  ExternalLink,
  Youtube
} from 'lucide-react';

export default function MovementView({ t }) {
  const [activeRoutine, setActiveRoutine] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(40);
  const [isPaused, setIsPaused] = useState(false);

  const poses = [
    {
      id: 1,
      name: t.pose1Name,
      benefit: t.pose1Benefit,
      step: t.pose1Step,
      duration: "45 seconds",
      color: "from-sky-50 to-indigo-50",
      iconColor: "text-sky-600",
      borderColor: "border-sky-100",
      videoUrl: "https://www.youtube.com/watch?v=qUtXTCGSuB8",
      videoLabel: "Child's Pose tutorial",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-sky-600 fill-none stroke-2">
          <path d="M 20 50 Q 30 25 50 30 Q 70 35 85 48" strokeLinecap="round" />
          <circle cx="85" cy="48" r="6" className="fill-sky-200 stroke-sky-600" />
          <path d="M 15 52 L 90 52" stroke="#BAE6FD" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 2,
      name: t.pose2Name,
      benefit: t.pose2Benefit,
      step: t.pose2Step,
      duration: "40 seconds",
      color: "from-teal-50 to-emerald-50",
      iconColor: "text-teal-600",
      borderColor: "border-teal-100",
      videoUrl: "https://www.youtube.com/watch?v=uEMTe7PVKCI",
      videoLabel: "Cat-Cow stretch tutorial",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-teal-600 fill-none stroke-2">
          <path d="M 30 45 L 30 25 Q 50 15 70 25 L 70 45" strokeLinecap="round" />
          <circle cx="75" cy="22" r="5" className="fill-teal-200 stroke-teal-600" />
          <path d="M 20 48 L 85 48" stroke="#99F6E4" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 3,
      name: t.pose3Name,
      benefit: t.pose3Benefit,
      step: t.pose3Step,
      duration: "60 seconds",
      color: "from-indigo-50 to-purple-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-100",
      videoUrl: "https://www.youtube.com/watch?v=NzO4r4KeWUw",
      videoLabel: "Legs up the wall pose",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-indigo-600 fill-none stroke-2">
          <path d="M 25 48 L 60 48 L 60 12" strokeLinecap="round" />
          <circle cx="22" cy="48" r="5" className="fill-indigo-200 stroke-indigo-600" />
          <path d="M 60 5 L 60 52" stroke="#C7D2FE" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 4,
      name: t.pose4Name,
      benefit: t.pose4Benefit,
      step: t.pose4Step,
      duration: "45 seconds",
      color: "from-rose-50 to-orange-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-100",
      videoUrl: "https://www.youtube.com/watch?v=BaRgfr0pB7I",
      videoLabel: "Butterfly pose tutorial",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-rose-600 fill-none stroke-2">
          <path d="M 25 48 L 50 48 Q 65 35 75 48 Q 65 52 50 48" strokeLinecap="round" />
          <circle cx="20" cy="48" r="5" className="fill-rose-200 stroke-rose-600" />
          <path d="M 10 52 L 90 52" stroke="#FECDD3" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 5,
      name: t.pose5Name,
      benefit: t.pose5Benefit,
      step: t.pose5Step,
      duration: "40 seconds",
      color: "from-amber-50 to-orange-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-100",
      videoUrl: "https://www.youtube.com/watch?v=M2llOLPL7sg",
      videoLabel: "Neck release stretches",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-amber-600 fill-none stroke-2">
          <path d="M 35 50 L 50 30 L 50 22" strokeLinecap="round" />
          <circle cx="53" cy="16" r="6" className="fill-amber-200 stroke-amber-600" />
          <path d="M 25 50 L 75 50" stroke="#FDE68A" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 6,
      name: t.pose6Name,
      benefit: t.pose6Benefit,
      step: t.pose6Step,
      duration: "45 seconds",
      color: "from-sky-50 to-blue-50",
      iconColor: "text-sky-700",
      borderColor: "border-sky-100",
      videoUrl: "https://www.youtube.com/watch?v=J8_N-zRu1Js",
      videoLabel: "Bridge pose tutorial",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-sky-700 fill-none stroke-2">
          <path d="M 25 48 Q 50 25 75 48" strokeLinecap="round" />
          <circle cx="20" cy="48" r="5" className="fill-sky-200 stroke-sky-700" />
          <path d="M 10 52 L 90 52" stroke="#BAE6FD" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 7,
      name: t.pose7Name,
      benefit: t.pose7Benefit,
      step: t.pose7Step,
      duration: "45 seconds",
      color: "from-teal-50 to-cyan-50",
      iconColor: "text-teal-700",
      borderColor: "border-teal-100",
      videoUrl: "https://www.youtube.com/watch?v=_b6xnkNjI3c",
      videoLabel: "Supine spinal twist",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-teal-700 fill-none stroke-2">
          <path d="M 30 48 L 55 48 Q 70 38 60 25" strokeLinecap="round" />
          <circle cx="25" cy="48" r="5" className="fill-teal-200 stroke-teal-700" />
          <path d="M 15 52 L 85 52" stroke="#99F6E4" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 8,
      name: t.pose8Name,
      benefit: t.pose8Benefit,
      step: t.pose8Step,
      duration: "60 seconds",
      color: "from-slate-50 to-indigo-50",
      iconColor: "text-slate-600",
      borderColor: "border-slate-100",
      videoUrl: "https://www.youtube.com/watch?v=1VYlOKUdylM",
      videoLabel: "Savasana / corpse pose",
      svg: (
        <svg viewBox="0 0 100 60" className="w-full h-20 stroke-slate-600 fill-none stroke-2">
          <line x1="25" y1="48" x2="80" y2="48" strokeLinecap="round" strokeWidth="3" />
          <circle cx="20" cy="47" r="6" className="fill-slate-200 stroke-slate-600" />
          <path d="M 10 52 L 90 52" stroke="#CBD5E1" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    let interval = null;
    if (activeRoutine && !isPaused) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (currentPoseIndex < poses.length - 1) {
              setCurrentPoseIndex((i) => i + 1);
              return 40;
            } else {
              setActiveRoutine(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRoutine, isPaused, currentPoseIndex, poses.length]);

  const startSequence = () => {
    setActiveRoutine(true);
    setCurrentPoseIndex(0);
    setTimerSeconds(40);
    setIsPaused(false);
  };

  const nextPose = () => {
    if (currentPoseIndex < poses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1);
      setTimerSeconds(40);
    } else {
      setActiveRoutine(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/3 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Move className="w-5 h-5 text-sky-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
              Somatic Movement
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.movementTitle}
          </h1>
          <p className="mt-1.5 text-sm text-sky-100 leading-relaxed">
            {t.movementSub}
          </p>

          <div className="mt-5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startSequence}
              className="px-6 py-3 rounded-2xl bg-white text-sky-700 font-bold text-sm shadow-md flex items-center gap-2 hover:bg-sky-50 transition-colors"
            >
              <Play className="w-4 h-4 fill-sky-700" />
              <span>{t.startRoutine}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Active Sequence Banner */}
      <AnimatePresence>
        {activeRoutine && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-3xl p-6 bg-slate-900 text-white shadow-xl border border-slate-700 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  Active Sequence ({currentPoseIndex + 1} of {poses.length})
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {poses[currentPoseIndex].name}
                </h2>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <span className="text-2xl font-black">{timerSeconds}s</span>
                <div className="text-[9px] uppercase tracking-wider text-sky-300">
                  {t.timerRemaining}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {poses[currentPoseIndex].step}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? "Resume" : "Pause"}</span>
                </button>
                <button
                  onClick={nextPose}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Next</span>
                </button>
                <a
                  href={poses[currentPoseIndex].videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Watch</span>
                </a>
              </div>

              <button
                onClick={() => setActiveRoutine(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                End
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pose Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {poses.map((pose) => (
          <motion.div
            key={pose.id}
            whileHover={{ y: -3 }}
            className={`bg-white rounded-3xl border-2 ${pose.borderColor} shadow-sm hover:shadow-md transition-all overflow-hidden`}
          >
            {/* SVG Preview */}
            <div className={`p-5 bg-gradient-to-br ${pose.color} flex items-center justify-center`}>
              {pose.svg}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1.5">
                <span>Pose {pose.id}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-full">{pose.duration}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {pose.name}
              </h3>
              
              <p className={`text-xs font-semibold mt-1 ${pose.iconColor}`}>
                {pose.benefit}
              </p>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-100">
                {pose.step}
              </div>

              {/* Watch Video Button */}
              <a
                href={pose.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-xs font-semibold transition-all group"
              >
                <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Watch: {pose.videoLabel}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
