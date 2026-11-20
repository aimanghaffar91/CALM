import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Activity, 
  Wind, 
  Move, 
  MessageSquareHeart, 
  Lock, 
  ShieldAlert 
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, t }) {
  const tabs = [
    { id: 'compass', label: t.navCompass, icon: Compass },
    { id: 'check', label: t.navCheck, icon: Activity },
    { id: 'breathe', label: t.navBreathe, icon: Wind },
    { id: 'movement', label: t.navMovement, icon: Move },
    { id: 'companion', label: t.navCompanion, icon: MessageSquareHeart },
    { id: 'vault', label: t.navVault, icon: Lock },
    { id: 'doctor', label: t.navDoctor, icon: ShieldAlert },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-3 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-white/96 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-1.5 pointer-events-auto flex items-center justify-around gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.86 }}
              className={`relative flex flex-col items-center justify-center py-2 px-1.5 sm:px-3 rounded-2xl transition-all min-w-0 flex-1 ${
                isActive ? 'text-sky-700' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl -z-10 shadow-sm border border-sky-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              
              <Icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110 text-sky-600' : ''}`} />
              <span className={`text-[9px] sm:text-[10px] mt-1 tracking-tight truncate font-medium ${isActive ? 'text-sky-700 font-semibold' : ''}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
