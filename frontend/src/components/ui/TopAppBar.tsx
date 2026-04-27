"use client";
import { motion } from "framer-motion";
import { Search, Bell, Settings, User, Cpu, BrainCircuit } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function TopAppBar() {
  const { toggleAIDrawer, setCommandPaletteOpen } = useAppStore();
  return (
    <motion.header
      initial={{ y: -52, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 h-[52px] border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-emerald-400" />
          <span className="font-black text-lg tracking-widest uppercase text-white">SORT<span className="text-emerald-400">IT</span></span>
        </div>
        <nav className="hidden md:flex gap-1 h-[52px] items-center">
          {[
            { label: "Portfolio", href: "/portfolio" },
            { label: "Ledger",    href: "/ledger" },
            { label: "Flows",     href: "/flows" },
          ].map(n => (
            <a key={n.href} href={n.href}
              className="px-3 h-full flex items-center text-[10px] uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors border-b-2 border-transparent hover:border-emerald-400">
              {n.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-zinc-500 text-[10px] hover:border-zinc-600 transition-colors group">
          <Search size={11} className="group-hover:text-emerald-400 transition-colors" />
          <span>Search...</span>
          <div className="ml-2 flex gap-0.5">
            <kbd className="px-1 border border-zinc-700 text-[8px] bg-zinc-800">ALT</kbd>
            <kbd className="px-1 border border-zinc-700 text-[8px] bg-zinc-800">K</kbd>
          </div>
        </button>

        {/* AI Copilot */}
        <button onClick={toggleAIDrawer}
          className="flex items-center gap-1.5 text-[10px] text-emerald-400 border border-emerald-400/30 px-3 py-1.5 hover:bg-emerald-400/10 transition-colors uppercase tracking-wider shadow-[0_0_12px_rgba(52,211,153,0.15)]">
          <BrainCircuit size={12} />
          AI
        </button>

        <div className="flex gap-3 text-zinc-500">
          <button className="hover:text-emerald-400 transition-colors"><Bell size={16} /></button>
          <a href="/settings" className="hover:text-emerald-400 transition-colors"><Settings size={16} /></a>
        </div>

        <a href="/profile" className="w-7 h-7 bg-emerald-400/10 border border-emerald-400/30 rounded flex items-center justify-center cursor-pointer hover:bg-emerald-400/20 transition-colors">
          <User size={14} className="text-emerald-400" />
        </a>
      </div>
    </motion.header>
  );
}
