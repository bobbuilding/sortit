"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Send, X, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "What is our current burn multiple?",
  "Which node has the highest yield?",
  "Show me pending transactions",
  "Summarize our treasury health",
];

const mockResponses: Record<string, string> = {
  default: "Analyzing your financial data... Based on your current treasury of $14.2M and monthly burn of $124k, your burn multiple is 0.55x — extremely efficient for a Series A stage company. Runway extends to 34 months at current velocity.",
};

export function AIDrawer() {
  const { isAIDrawerOpen, toggleAIDrawer } = useAppStore();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "NODE_01 is online. I have full visibility into your treasury, nodes, and ledger. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMsgs(p => [...p, { role: "user", text }]);
    setInput("");
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    setTyping(false);
    setMsgs(p => [...p, { role: "ai", text: mockResponses.default }]);
  };

  return (
    <AnimatePresence>
      {isAIDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleAIDrawer}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-[400px] z-50 bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-400/10 border border-emerald-400/30 rounded flex items-center justify-center">
                  <BrainCircuit size={14} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white">AI Copilot</div>
                  <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready
                  </div>
                </div>
              </div>
              <button onClick={toggleAIDrawer} className="text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "ai" && (
                    <div className="w-5 h-5 rounded bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <Sparkles size={10} className="text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] text-[11px] leading-relaxed p-3 ${
                    m.role === "user"
                      ? "bg-zinc-800 text-zinc-200 rounded-sm"
                      : "bg-emerald-400/5 border border-emerald-400/20 text-zinc-300 rounded-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={10} className="text-emerald-400" />
                  </div>
                  <div className="bg-emerald-400/5 border border-emerald-400/20 p-3 rounded-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {msgs.length < 2 && (
              <div className="px-4 pb-2">
                <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-2">Suggested</div>
                <div className="flex flex-col gap-1">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => send(s)}
                      className="text-left text-[10px] text-zinc-500 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-400/30 px-3 py-2 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send(input)}
                  placeholder="Ask your AI Copilot..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-emerald-400/50 text-[11px] text-zinc-300 placeholder-zinc-600 px-3 py-2 outline-none transition-colors" />
                <button onClick={() => send(input)}
                  className="bg-emerald-400 text-black px-3 py-2 hover:bg-emerald-300 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
