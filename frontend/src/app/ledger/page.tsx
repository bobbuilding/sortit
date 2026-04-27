"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Search, CheckCircle, Clock } from "lucide-react";
import { API_URL } from "@/lib/api";

const fmt = (n: number) => {
  const abs = Math.abs(n);
  const str = abs >= 1_000_000 ? `$${(abs/1_000_000).toFixed(2)}M` : abs >= 1_000 ? `$${(abs/1_000).toFixed(1)}k` : `$${abs}`;
  return n > 0 ? `+${str}` : `-${str}`;
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const row = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } };

export default function LedgerPage() {
  const [filter, setFilter] = useState<"ALL" | "INBOUND" | "OUTBOUND">("ALL");
  const [search, setSearch] = useState("");
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/ledger`)
      .then(res => res.json())
      .then(data => setLedger(data))
      .catch(err => console.error("Ledger fetch error", err));
  }, []);

  const filtered = ledger.filter(t => {
    const type = t.amount > 0 ? "INBOUND" : "OUTBOUND";
    return (filter === "ALL" || type === filter) &&
    (t.description.toLowerCase().includes(search.toLowerCase()) || t.id.toString().includes(search.toLowerCase()))
  });

  const totalIn  = ledger.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = ledger.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="p-6 w-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">Transaction <span className="text-emerald-400 italic">Ledger</span></h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Immutable audit trail · {ledger.length} records</p>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Total Inflows</div>
          <div className="text-2xl font-black text-emerald-400">+{totalIn >= 1000000 ? `${(totalIn/1_000_000).toFixed(2)}M` : `${(totalIn/1000).toFixed(1)}k`}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Total Outflows</div>
          <div className="text-2xl font-black text-red-400">-${totalOut >= 1000000 ? `${(totalOut/1_000_000).toFixed(2)}M` : `${(totalOut/1000).toFixed(1)}k`}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Net Position</div>
          <div className="text-2xl font-black text-white">{totalIn - totalOut >= 0 ? "+" : "-"}${Math.abs(totalIn - totalOut) >= 1000000 ? `${(Math.abs(totalIn - totalOut)/1_000_000).toFixed(2)}M` : `${(Math.abs(totalIn - totalOut)/1000).toFixed(1)}k`}</div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 flex-1 focus-within:border-emerald-400/50 transition-colors">
          <Search size={12} className="text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="bg-transparent text-[11px] text-zinc-300 placeholder-zinc-600 outline-none flex-1" />
        </div>
        {(["ALL", "INBOUND", "OUTBOUND"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] uppercase border tracking-wider transition-colors ${filter === f ? "border-emerald-400 text-emerald-400 bg-emerald-400/10" : "border-zinc-800 text-zinc-500 hover:border-zinc-600"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800">
        <div className="grid grid-cols-[90px_60px_1fr_100px_100px_90px] text-[9px] uppercase tracking-widest text-zinc-600 px-4 py-3 border-b border-zinc-800">
          <span>TXN ID</span><span>Type</span><span>Description</span><span>Category</span><span>Amount</span><span>Status</span>
        </div>
        <motion.div variants={container} initial="hidden" animate="show">
          {filtered.length > 0 ? filtered.map((txn) => (
            <motion.div key={txn.id} variants={row}
              className="grid grid-cols-[90px_60px_1fr_100px_100px_90px] items-center px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
              <span className="text-[9px] text-zinc-500 font-mono">#{txn.id}</span>
              <span>
                {txn.amount > 0
                  ? <ArrowDownLeft size={14} className="text-emerald-400" />
                  : <ArrowUpRight size={14} className="text-red-400" />}
              </span>
              <span className="text-[11px] text-zinc-300 group-hover:text-white transition-colors">{txn.description}</span>
              <span className="text-[9px] text-zinc-600 uppercase">{txn.category || "General"}</span>
              <span className={`text-[11px] font-bold ${txn.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {fmt(txn.amount)}
              </span>
              <span className={`flex items-center gap-1 text-[9px] uppercase text-emerald-400/70`}>
                <CheckCircle size={9}/> SETTLED
              </span>
            </motion.div>
          )) : (
            <div className="p-10 text-center text-zinc-600 uppercase text-[10px] tracking-widest">No transactions found</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
