"use client";

import { motion } from "framer-motion";
import { Terminal, ArrowRight, Zap, Shield, Cpu, Activity } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Terminal, title: "Visual Fluency",  desc: "Cinematic dashboards built for real-time financial clarity." },
  { icon: Shield,   title: "Secure Nodes",    desc: "Institutional-grade isolation and multi-sig controls." },
  { icon: Zap,      title: "AI Narrative",    desc: "Claude-powered intelligence woven into every metric." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-8 py-16 relative ">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-400/3 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full">


        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-6">
            <Cpu size={28} className="text-emerald-400" />
            <span className="text-xs uppercase tracking-[0.4em] text-zinc-500">Operating System for Money</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.88] mb-8">
            Sort<span className="text-emerald-400">IT</span><br />
            <span className="text-zinc-600">Operating</span><br />
            <span className="text-zinc-700">System</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed">
            A cinematic command center for high-stakes financial intelligence.
            Visual fluency for founders who build the future.
          </p>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link href="/login"
              className="inline-flex items-center gap-3 bg-emerald-400 text-black font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-emerald-300 transition-all active:scale-95 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
              Initialize Terminal
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center gap-3 border border-zinc-700 text-zinc-300 text-sm uppercase tracking-widest px-8 py-4 hover:border-zinc-500 hover:text-white transition-all">
              View Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Live stat bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex gap-8 mb-16 pb-10 border-b border-zinc-800/60">
          {[
            { label: "AUM", value: "$14.2M" },
            { label: "Runway", value: "34 Mo" },
            { label: "Burn / Mo", value: "$124k" },
            { label: "Yield APY", value: "3.4%" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-zinc-600">{s.label}</span>
              <span className="text-xl font-black text-white">{s.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="p-6 bg-zinc-900 border border-zinc-800 hover:border-emerald-400/40 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-emerald-400/10 border border-emerald-400/20 rounded flex items-center justify-center mb-4 group-hover:bg-emerald-400/20 transition-colors">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-black text-sm uppercase tracking-wider mb-2 group-hover:text-emerald-400 transition-colors">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
