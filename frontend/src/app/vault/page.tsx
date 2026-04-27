"use client";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Key, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const policies = [
  { label: "Multi-Signature Policy", status: "ACTIVE", detail: "3-of-5 signers required", icon: <ShieldCheck size={16} />, ok: true },
  { label: "Treasury Guard",         status: "ENABLED", detail: "Auto-halt on anomaly", icon: <Lock size={16} />, ok: true },
  { label: "Spending Limit (Daily)", status: "SET",     detail: "$250,000 / day", icon: <Key size={16} />, ok: true },
  { label: "Pending Approvals",      status: "2 REQUIRED", detail: "TXN-8815 & TXN-8814", icon: <AlertTriangle size={16} />, ok: false },
];

const keys = [
  { label: "Supabase Service Key",    value: "sk_live_••••••••••••••••••YZ3k", updated: "14 days ago" },
  { label: "Fireblocks API Key",      value: "fb_••••••••••••••••••••••A91B", updated: "30 days ago" },
  { label: "Internal Signing Key",    value: "isk_••••••••••••••••DELTA-01",  updated: "7 days ago" },
];

export default function VaultPage() {
  const [revealed, setRevealed] = useState<number[]>([]);
  const toggle = (i: number) => setRevealed(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  return (
    <div className="p-6 w-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">Security <span className="text-emerald-400 italic">Vault</span></h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Access controls · signing policies · credential store</p>
      </motion.div>

      {/* Security Score */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-zinc-900 border border-emerald-400/20 p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent" />
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <span className="text-2xl font-black text-emerald-400">94</span>
          </div>
          <div>
            <h2 className="font-black text-2xl">Security Score</h2>
            <p className="text-sm text-zinc-400 mt-0.5">Excellent posture — 1 pending action required</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[9px] px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 uppercase tracking-wider">MFA Active</span>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 uppercase tracking-wider">Encrypted at Rest</span>
              <span className="text-[9px] px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 uppercase tracking-wider">2 Pending</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policies */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Access Policies</h2>
          <div className="space-y-3">
            {policies.map((p, i) => (
              <div key={i} className={`p-3 border flex items-start gap-3 ${p.ok ? "border-zinc-800" : "border-amber-400/30 bg-amber-400/5"}`}>
                <span className={p.ok ? "text-emerald-400" : "text-amber-400"}>{p.icon}</span>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-white">{p.label}</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">{p.detail}</div>
                </div>
                <span className={`text-[9px] uppercase px-2 py-0.5 border rounded-sm ${p.ok ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10" : "border-amber-400/30 text-amber-400 bg-amber-400/10"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Credential Store */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-zinc-500">Credential Store</h2>
            <button className="text-[9px] bg-emerald-400 text-black font-bold px-3 py-1.5 hover:bg-emerald-300 transition-colors uppercase">
              + New Secret
            </button>
          </div>
          <div className="space-y-3">
            {keys.map((k, i) => (
              <div key={i} className="border border-zinc-800 p-3 hover:border-zinc-600 transition-colors group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-white">{k.label}</span>
                  <button onClick={() => toggle(i)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                    {revealed.includes(i) ? <EyeOff size={12}/> : <Eye size={12}/>}
                  </button>
                </div>
                <div className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {revealed.includes(i) ? k.value.replace(/•+/, "REDACTED_IN_DEMO") : k.value}
                </div>
                <div className="text-[9px] text-zinc-700 mt-1">Updated {k.updated}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
