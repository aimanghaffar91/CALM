import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from './constants/translations';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TodayView from './components/TodayView';
import StressCheckView from './components/StressCheckView';
import BreathingView from './components/BreathingView';
import MovementView from './components/MovementView';
import CompanionView from './components/CompanionView';
import VaultView from './components/VaultView';
import DoctorView from './components/DoctorView';
import CrisisModal from './components/CrisisModal';
import PrivacyGuideModal from './components/PrivacyGuideModal';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('compass');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRtl = lang === 'urdu' || lang === 'arabic' || lang === 'persian';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const handleRecordMood = (stateId, stateTitle) => {
    const newEntry = {
      id: Date.now(),
      stateId,
      stateTitle,
      timestamp: new Date().toISOString(),
    };
    setMoodHistory(prev => [newEntry, ...prev]);
  };

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-white text-slate-800 flex flex-col font-sans transition-colors duration-300 selection:bg-sky-100 selection:text-sky-900 ${
        lang === 'urdu' ? 'font-urdu' : lang === 'arabic' ? 'font-arabic' : lang === 'persian' ? 'font-persian' : ''
      }`}
    >
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 rounded-full bg-orange-50/60 blur-3xl" />
      </div>

      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenCrisis={() => setShowCrisisModal(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'compass' && (
              <TodayView t={t} setActiveTab={setActiveTab} onRecordMood={handleRecordMood} />
            )}
            {activeTab === 'check' && (
              <StressCheckView t={t} setActiveTab={setActiveTab} onTriggerCrisis={() => setShowCrisisModal(true)} />
            )}
            {activeTab === 'breathe' && <BreathingView t={t} />}
            {activeTab === 'movement' && <MovementView t={t} />}
            {activeTab === 'companion' && (
              <CompanionView t={t} lang={lang} onTriggerCrisis={() => setShowCrisisModal(true)} />
            )}
            {activeTab === 'vault' && <VaultView t={t} moodHistory={moodHistory} />}
            {activeTab === 'doctor' && <DoctorView t={t} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} t={t} />
      <PrivacyGuideModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
