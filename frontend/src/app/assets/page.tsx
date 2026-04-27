"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Search, Filter } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { API_URL } from "@/lib/api";

const riskBadge: Record<string, string> = {
  LOW:  "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  HIGH: "text-red-400 bg-red-400/10 border-red-400/30",
};
const fmt = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(2)}M` : `$${(n/1_000).toFixed(0)}k`;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const row = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } };

export default function AssetsPage() {
  const { setAllocationModalOpen } = useAppStore();
  const [search, setSearch] = useState("");
  const [assetsList, setAssetsList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/assets`)
      .then(res => res.json())
      .then(data => setAssetsList(data))
      .catch(err => console.error("Assets fetch error", err));
  }, []);

  const filtered = assetsList.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );
  const totalAUM = assetsList.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="p-6 w-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">Asset <span className="text-emerald-400 italic">Registry</span></h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Total AUM: {fmt(totalAUM)} · {assetsList.length} instruments</p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 focus-within:border-emerald-400/50 transition-colors">
          <Search size={12} className="text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none flex-1 text-[11px]" />
        </div>
        <button className="border border-zinc-800 px-4 py-2 text-zinc-500 hover:border-zinc-600 transition-colors flex items-center gap-2 text-[10px] uppercase">
          <Filter size={11} /> Filter
        </button>
        <button 
          onClick={() => setAllocationModalOpen(true)}
          className="bg-emerald-400 text-black text-[10px] uppercase font-bold px-4 py-2 hover:bg-emerald-300 transition-colors">
          + Add Asset
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_80px_100px_80px] text-[9px] uppercase tracking-widest text-zinc-600 px-4 py-3 border-b border-zinc-800">
          <span>Name</span><span>Category</span><span>Value</span><span>Yield</span><span>Custodian</span><span>Risk</span>
        </div>
        <motion.div variants={container} initial="hidden" animate="show">
          {filtered.length > 0 ? filtered.map((asset) => (
            <motion.div key={asset.id} variants={row}
              className="grid grid-cols-[1fr_120px_120px_80px_100px_80px] items-center px-4 py-4 border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors cursor-pointer group">
              <div>
                <div className="text-[11px] font-semibold text-white group-hover:text-emerald-400 transition-colors">{asset.name}</div>
                <div className="text-[9px] text-zinc-600 mt-0.5">#{asset.id}</div>
              </div>
              <span className="text-[10px] text-zinc-400">{asset.type}</span>
              <span className="text-[11px] font-bold text-white">{fmt(asset.balance)}</span>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${asset.yield_rate > 0 ? "text-emerald-400" : "text-zinc-600"}`}>
                {asset.yield_rate > 0 ? <TrendingUp size={9}/> : <TrendingDown size={9}/>}
                {asset.yield_rate > 0 ? `${asset.yield_rate}%` : "—"}
              </span>
              <span className="text-[10px] text-zinc-500">{asset.custodian || "Unknown"}</span>
              <span className={`text-[9px] px-2 py-0.5 border rounded-sm inline-flex items-center ${(asset.risk_level && riskBadge[asset.risk_level]) || "text-zinc-400 border-zinc-800"}`}>{asset.risk_level || "N/A"}</span>
            </motion.div>
          )) : (
            <div className="p-10 text-center text-zinc-600 uppercase text-[10px] tracking-widest">No assets found in registry</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
