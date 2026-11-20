import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquareHeart, 
  Send, 
  ShieldAlert, 
  Heart, 
  RotateCcw,
  Compass
} from 'lucide-react';

export default function CompanionView({ t, lang, onTriggerCrisis }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'companion',
      text: "I am here with you in complete stillness. Whatever you are feeling right now, whether heavy, scattered, restless, or numb, it is safe to express it here. You do not have to perform or find the right words.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'want to die', 'end my life', 'end it all', 'self harm', 
    'hurt myself', 'hang myself', 'overdose', 'cut my wrists', 'no reason to live',
    'خودکشی', 'مرنا چاہتا', 'جان لینا', 'زندگی ختم',
    'आत्महत्या', 'मरना चाहता', 'जान देना',
    'انتحار', 'أريد الموت', 'أنهي حياتي', 'قتل نفسي',
    'خودکشی', 'میخوام بمیرم', 'پایان زندگی'
  ];

  const checkSafetyKeywords = (text) => {
    const lower = text.toLowerCase();
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
  };

  const handleSend = (textToSend = inputText) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    if (checkSafetyKeywords(cleanText)) {
      onTriggerCrisis();
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateSomaticReflection(cleanText, lang);
      const companionMsg = {
        id: Date.now() + 1,
        sender: 'companion',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, companionMsg]);
      setIsTyping(false);
    }, 900);
  };

  const generateSomaticReflection = (input, currentLang) => {
    const lower = input.toLowerCase();

    if (lower.includes('chest') || lower.includes('tight') || lower.includes('breath') || lower.includes('سینے') || lower.includes('سانس')) {
      return "Notice that tightness in your chest right now. It is your body's ancient protective system trying to brace you against perceived danger. You do not have to push it away. Place one warm palm gently over your heart. Feel the subtle rise and fall. Just for this breath, let your shoulders drop a fraction of an inch.";
    }

    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('exhausted') || lower.includes('نیند') || lower.includes('نوم') || lower.includes('خواب')) {
      return "When your body is exhausted but your thoughts refuse to quiet down, your nervous system is likely stuck in vigilance. Give yourself permission to stop trying to force sleep. Just resting your physical weight onto the mattress is restorative. You do not have to resolve tomorrow's problems tonight.";
    }

    if (lower.includes('alone') || lower.includes('lonely') || lower.includes('isolated') || lower.includes('تنہا') || lower.includes('अकेला') || lower.includes('وحيد')) {
      return "Loneliness can feel like a heavy physical weight in the throat and belly. Even across a screen, please know that your presence in this world is real and valued. You are human, and the desire to feel understood is one of our most tender needs. I am here listening to you with unconditional warmth.";
    }

    if (lower.includes('reframe') || lower.includes('anxious') || lower.includes('overthink') || lower.includes('پریشان') || lower.includes('قلق')) {
      return "Thoughts can be convincing storytellers, but they are not absolute facts. When an anxious thought screams 'what if everything goes wrong?', pause and ask: 'Is this thought serving my well-being right now, or is it just fear talking?' What is one small, grounded fact you know to be true in this exact room?";
    }

    const empatheticReflections = [
      "I hear how much weight you are carrying in these words. Take a gentle breath. You do not have to have everything figured out today.",
      "Thank you for sharing that with me. It takes real courage to pause and acknowledge how you truly feel instead of numbing it out.",
      "Your nervous system has been working so hard to protect you. What is one small kindness you can grant yourself in the next ten minutes?",
      "Whatever storm is playing out in your mind right now, remember that you are the quiet sky beneath it. The storm passes; the sky remains."
    ];

    return empatheticReflections[Math.floor(Math.random() * empatheticReflections.length)];
  };

  const quickPrompts = [
    { label: t.promptStressed, text: t.promptStressed },
    { label: t.promptSleep, text: t.promptSleep },
    { label: t.promptLonely, text: t.promptLonely },
    { label: t.promptReflect, text: t.promptReflect },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200/50 relative overflow-hidden flex items-center justify-between"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 text-sky-100">
            <MessageSquareHeart className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Empathetic Sanctuary
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.chatTitle}
          </h1>
          <p className="text-xs text-sky-100 mt-0.5">
            {t.chatSub}
          </p>
        </div>

        <button
          onClick={() => setMessages([{
            id: Date.now(),
            sender: 'companion',
            text: "The space is refreshed. What is resting in your heart right now?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])}
          className="relative z-10 p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Clear Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Messages Thread Container */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 bg-white border border-slate-100 shadow-sm min-h-[460px] flex flex-col justify-between">
        
        {/* Messages List */}
        <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                )}

                <div className={`max-w-[82%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-tr-sm shadow-md shadow-sky-200' 
                    : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-100'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1.5 font-medium ${
                    isUser ? 'text-sky-100 text-right' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-400 text-xs pl-11"
            >
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1 font-medium">Listening with presence...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Input Area */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          
          {/* Quick reply pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p.text)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-semibold border border-sky-200/60 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.chatPlaceholder}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-40 text-white font-semibold transition-all shadow-md shadow-sky-200"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

      </div>

    </div>
  );
}
