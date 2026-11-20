import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff, 
  FileText, 
  Download, 
  Layers, 
  CheckCircle2, 
  Database
} from 'lucide-react';
import { deriveKeyFromPassphrase, encryptText, decryptText, DatabaseSyncSimulation } from '../services/cryptoService';

export default function VaultView({ t, moodHistory = [] }) {
  const [activeTab, setActiveTab] = useState('journal'); // 'journal', 'cbt', 'history'
  
  // Encryption state
  const [passphrase, setPassphrase] = useState('calm_sanctuary_key');
  const [cryptoKey, setCryptoKey] = useState(null);
  const [journalInput, setJournalInput] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  
  const [savedEntries, setSavedEntries] = useState([]);
  const [decryptedMap, setDecryptedMap] = useState({});
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // CBT Thought Record State
  const [cbtSituation, setCbtSituation] = useState('');
  const [cbtThought, setCbtThought] = useState('');
  const [cbtDistortion, setCbtDistortion] = useState('Catastrophizing');
  const [cbtBalanced, setCbtBalanced] = useState('');

  // Initialize encryption key on mount or passphrase change
  useEffect(() => {
    async function initKey() {
      try {
        const derived = await deriveKeyFromPassphrase(passphrase);
        setCryptoKey(derived);
      } catch (err) {
        console.error("Crypto init error", err);
      }
    }
    initKey();
  }, [passphrase]);

  // Load existing entries from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('calm_encrypted_vault');
      if (stored) {
        setSavedEntries(JSON.parse(stored));
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  const handleSaveJournal = async () => {
    if (!journalInput.trim() && !gratitude1.trim()) return;
    setIsEncrypting(true);

    try {
      const fullContent = JSON.stringify({
        journal: journalInput,
        gratitude: [gratitude1, gratitude2, gratitude3].filter(Boolean),
        date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
      });

      // Encrypt locally using Web Crypto API AES-GCM
      const encrypted = await encryptText(fullContent, cryptoKey);
      
      const newEntry = {
        id: Date.now(),
        iv: encrypted.iv,
        cipher: encrypted.cipher,
        timestamp: encrypted.timestamp,
        dateFormatted: new Date().toLocaleDateString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updated = [newEntry, ...savedEntries];
      setSavedEntries(updated);
      localStorage.setItem('calm_encrypted_vault', JSON.stringify(updated));

      // Simulate zero-knowledge database sync
      const syncResult = await DatabaseSyncSimulation.simulateCloudSync(encrypted);
      setSyncStatus(syncResult);

      // Reset form
      setJournalInput('');
      setGratitude1('');
      setGratitude2('');
      setGratitude3('');
    } catch (err) {
      console.error("Encryption error:", err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleToggleDecrypt = async (entry) => {
    if (decryptedMap[entry.id]) {
      const copy = { ...decryptedMap };
      delete copy[entry.id];
      setDecryptedMap(copy);
      return;
    }

    try {
      const decryptedPlain = await decryptText(entry, cryptoKey);
      const parsed = JSON.parse(decryptedPlain);
      setDecryptedMap(prev => ({ ...prev, [entry.id]: parsed }));
    } catch (err) {
      alert("Decryption failed. Please verify your secret passphrase.");
    }
  };

  const handleDeleteEntry = (id) => {
    const updated = savedEntries.filter(e => e.id !== id);
    setSavedEntries(updated);
    localStorage.setItem('calm_encrypted_vault', JSON.stringify(updated));
  };

  const exportEncryptedBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `calm_encrypted_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/50"
      >
        <div className="flex items-center gap-2 mb-2 text-sky-600">
          <Lock className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Client-Side Zero-Knowledge Cryptography
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.vaultTitle}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-sky-100 leading-relaxed">
          {t.vaultSub}
        </p>

        {/* Passphrase key banner */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Key className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Passphrase Key:</span>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            {t.passphraseNote}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'journal' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Private Encrypted Journal
        </button>

        <button
          onClick={() => setActiveTab('cbt')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'cbt' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cognitive Reframing (ACT)
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Weekly Analytics
        </button>
      </div>

      {/* Tab 1: Private Journal & Gratitude */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Expressive Somatic Writing
              </label>
              <textarea
                rows={5}
                value={journalInput}
                onChange={(e) => setJournalInput(e.target.value)}
                placeholder={t.journalPlaceholder}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-xs sm:text-sm text-slate-800 leading-relaxed resize-none"
              />
            </div>

            {/* Gratitude Triad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Three Somatic Anchors of Gratitude Today
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                  placeholder="1. A physical comfort you experienced today..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                <input
                  type="text"
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                  placeholder="2. A kind word or quiet moment you observed..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                <input
                  type="text"
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                  placeholder="3. Something your body did for you today without asking..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveJournal}
                disabled={isEncrypting || (!journalInput.trim() && !gratitude1.trim())}
                className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isEncrypting ? "Encrypting with AES-GCM..." : t.saveEntry}</span>
              </motion.button>

              {syncStatus && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synced Encrypted ({syncStatus.syncedAt})
                </span>
              )}
            </div>

          </div>

          {/* Stored Encrypted Archives */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-slate-800">
                {t.savedEntries} ({savedEntries.length})
              </h2>

              {savedEntries.length > 0 && (
                <button
                  onClick={exportEncryptedBackup}
                  className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Encrypted JSON</span>
                </button>
              )}
            </div>

            {savedEntries.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                {t.emptyVault}
              </div>
            ) : (
              <div className="space-y-3">
                {savedEntries.map((entry) => {
                  const isDecrypted = !!decryptedMap[entry.id];
                  const decryptedData = decryptedMap[entry.id];

                  return (
                    <div 
                      key={entry.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{entry.dateFormatted}</span>
                          <span>•</span>
                          <span>{entry.timeFormatted}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleDecrypt(entry)}
                            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-purple-100 text-purple-800 font-semibold transition-colors"
                          >
                            {isDecrypted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{isDecrypted ? "Re-Encrypt" : "Decrypt"}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display either plain decrypted or encrypted cipher block */}
                      {isDecrypted ? (
                        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-800">
                          {decryptedData.journal && (
                            <p className="leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-100/60">
                              {decryptedData.journal}
                            </p>
                          )}
                          {decryptedData.gratitude?.length > 0 && (
                            <div className="pt-1">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Anchors of Gratitude:
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                                {decryptedData.gratitude.map((g, i) => (
                                  <li key={i}>{g}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 font-mono text-[10px] text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-purple-600 font-bold mr-1">AES-256-GCM Cipher:</span>
                          {entry.cipher}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Cognitive Reframing Tool (ACT & CBT) */}
      {activeTab === 'cbt' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Cognitive Defusion & Perspective Reframe
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Break free from rigid cognitive loops by separating objective reality from catastrophic narratives.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                1. The Triggering Event (Facts Only)
              </label>
              <input
                type="text"
                value={cbtSituation}
                onChange={(e) => setCbtSituation(e.target.value)}
                placeholder="e.g. Received a brief email from my supervisor with no punctuation."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                2. The Automatic Catastrophic Thought
              </label>
              <input
                type="text"
                value={cbtThought}
                onChange={(e) => setCbtThought(e.target.value)}
                placeholder="e.g. They are furious with me and I am about to lose my credibility."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                3. Identified Cognitive Distortion
              </label>
              <select
                value={cbtDistortion}
                onChange={(e) => setCbtDistortion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
              >
                <option value="Catastrophizing">Catastrophizing (Assuming worst-case scenario)</option>
                <option value="Mind Reading">Mind Reading (Assuming you know others' negative thoughts)</option>
                <option value="All-or-Nothing">All-or-Nothing Thinking (Black and white extremes)</option>
                <option value="Emotional Reasoning">Emotional Reasoning (I feel terrified, so danger must be real)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                4. Grounded, Balanced Reality
              </label>
              <textarea
                rows={3}
                value={cbtBalanced}
                onChange={(e) => setCbtBalanced(e.target.value)}
                placeholder="e.g. A brief sentence does not mean anger; they were likely answering quickly from their phone. My worth does not fluctuate based on an email."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-medium">
              Somatic check: Take one slow breath. Has the physical constriction in your shoulders softened even 10%?
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Weekly Affective History */}
      {activeTab === 'history' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Weekly Autonomic State Tracking
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing trends over 7 days helps identify environmental triggers and recovery rhythms.
            </p>
          </div>

          {/* 7-day visual graph */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-slate-200 pb-2">
            {[
              { day: 'Mon', score: 45, label: 'Calm' },
              { day: 'Tue', score: 65, label: 'Tense' },
              { day: 'Wed', score: 30, label: 'Grounded' },
              { day: 'Thu', score: 55, label: 'Restless' },
              { day: 'Fri', score: 70, label: 'Overload' },
              { day: 'Sat', score: 25, label: 'Serene' },
              { day: 'Sun', score: 20, label: 'Radiant' },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`w-full max-w-[36px] rounded-t-xl transition-all ${
                    item.score > 60 
                      ? 'bg-rose-400' 
                      : item.score > 35 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                  }`}
                />
                <span className="text-[11px] font-semibold text-slate-600">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-around text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span>Regulated (0-30%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Mild Load (31-60%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span>High Alert (61%+)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
