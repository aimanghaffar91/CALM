import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Key, 
  Server, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Code 
} from 'lucide-react';
import { deriveKeyFromPassphrase, encryptText } from '../services/cryptoService';

export default function PrivacyGuideModal({ isOpen, onClose }) {
  const [testPlaintext, setTestPlaintext] = useState("I felt an overwhelming surge of anxiety today about my job.");
  const [encryptedOutput, setEncryptedOutput] = useState(null);
  const [simulatedStep, setSimulatedStep] = useState(1);

  if (!isOpen) return null;

  const runTestEncryption = async () => {
    const key = await deriveKeyFromPassphrase("user_secret_session_pass");
    const result = await encryptText(testPlaintext, key);
    setEncryptedOutput(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">
                Database & Privacy Architecture
              </h2>
              <p className="text-xs text-slate-500">
                How to connect mental health apps to databases with Zero-Knowledge security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Core Problem & Solution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
            <strong className="block font-bold text-rose-800 mb-1">
              ⚠️ The Traditional Danger:
            </strong>
            Ordinary apps send raw journal text directly to a backend API (PostgreSQL/Firebase). If the database is breached, or an employee inspects rows, the user's deepest private fears and mental trauma are exposed in plain English.
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <strong className="block font-bold text-emerald-800 mb-1">
              🛡️ The Zero-Knowledge Solution:
            </strong>
            The browser encrypts every thought using <strong>AES-GCM 256-bit</strong> locally with the user's secret key BEFORE sending it over the network. The cloud database only ever holds random ciphertext.
          </div>
        </div>

        {/* 3-Step Architecture Pipeline */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Recommended Cloud Database Implementation (e.g. Supabase / Postgres)
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
              <div>
                <strong>Client-Side Encryption:</strong> Use the browser's native <code className="bg-slate-200 px-1 rounded">window.crypto.subtle</code> to encrypt the journal payload into an AES-GCM ciphertext string.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
              <div>
                <strong>Store Encrypted Blob:</strong> In your database table (e.g., Supabase <code className="bg-slate-200 px-1 rounded">user_vault</code>), create columns: <code className="bg-slate-200 px-1 rounded">id, user_id, encrypted_payload, iv, created_at</code>.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">3</div>
              <div>
                <strong>Row Level Security (RLS):</strong> Enable PostgreSQL RLS so users can only fetch rows where <code className="bg-slate-200 px-1 rounded">user_id = auth.uid()</code>. Decryption happens purely in the user's local browser memory.
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Encryption Simulator */}
        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-purple-600" />
              Live Encryption Playground
            </span>
            <button
              onClick={runTestEncryption}
              className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
            >
              Run AES-256 Test
            </button>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Plaintext Journal Input (In Browser Memory):
            </label>
            <input
              type="text"
              value={testPlaintext}
              onChange={(e) => setTestPlaintext(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          {encryptedOutput && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 block">
                What the Database / Cloud Server Sees (Ciphertext):
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] break-all">
                {JSON.stringify(encryptedOutput, null, 2)}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium block">
                ✓ Proven Zero-Knowledge: Impossible to decrypt without the user's local key.
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
}
