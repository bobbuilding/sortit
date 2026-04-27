"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResponsiveLine } from "@nivo/line";
import { TrendingUp, TrendingDown, Eye, Activity, Wallet, PieChart, ArrowUpRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { API_URL } from "@/lib/api";

const NIVO_THEME = {
  background: "transparent",
  textColor: "#6B7280",
  fontSize: 10,
  axis: { ticks: { text: { fill: "#6B7280", fontSize: 9 } }, legend: { text: { fill: "#9CA3AF" } } },
  grid: { line: { stroke: "#1F2937", strokeWidth: 1 } },
  crosshair: { line: { stroke: "#00FF89", strokeWidth: 1, strokeOpacity: 0.5 } },
  tooltip: { container: { background: "#111827", border: "1px solid #374151", color: "#F9FAFB", fontSize: 11 } },
};

const fmt = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(2)}M` : `$${(n).toLocaleString("en-US")}`;

export default function PortfolioPage() {
  const [period, setPeriod] = useState("1M");
  const { setAllocationModalOpen } = useAppStore();
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/assets`)
      .then(res => res.json())
      .then(data => setAssets(data))
      .catch(err => console.error("Portfolio assets fetch error", err));
  }, []);

  const totalNAV = assets.reduce((s, a) => s + a.balance, 0);
  const topHolding = assets.length > 0 ? assets.reduce((prev, current) => (prev.balance > current.balance) ? prev : current) : null;
  const concentration = topHolding ? ((topHolding.balance / totalNAV) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 w-full min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-black text-4xl tracking-tighter uppercase">
            Portfolio <span className="text-emerald-400 italic">Matrix</span>
          </h1>
          <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            Live Tracking
          </p>
        </div>
        <div className="flex gap-2 text-[10px] uppercase tracking-wider font-bold">
          <button className="border border-zinc-700 text-zinc-300 px-4 py-2 hover:border-zinc-500 transition-colors">Rebalance</button>
          <button 
            onClick={() => setAllocationModalOpen(true)}
            className="bg-emerald-400 text-black px-4 py-2 hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            Execute Trade
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Net Asset Value", val: fmt(totalNAV), change: "Real-time", icon: Wallet },
          { label: "Unrealized PnL", val: "+$0.00", change: "0.0% All Time", icon: TrendingUp },
          { label: "Portfolio Yield", val: "0.0%", change: "Trailing 12M", icon: Activity },
          { label: "Concentration", val: `${concentration}%`, change: topHolding ? `${topHolding.name} (Top)` : "None", icon: PieChart },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-5 hover:border-emerald-400/40 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">{k.label}</span>
              <k.icon size={14} className="text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="text-2xl font-black text-white">{k.val}</div>
            <div className="text-[10px] text-zinc-400 mt-2 uppercase tracking-wide">{k.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart & Active Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 min-h-[360px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Historical Performance</div>
              <div className="text-emerald-400 text-xs font-bold mt-1 flex items-center gap-1"><ArrowUpRight size={12}/> +0.0% This Month</div>
            </div>
            <div className="flex gap-1">
              {(["1W", "1M", "YTD", "1Y", "ALL"]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-2 py-1 text-[10px] uppercase border transition-colors ${period === p ? "border-emerald-400 text-emerald-400 bg-emerald-400/10" : "border-zinc-700 text-zinc-500"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs uppercase tracking-widest border border-dashed border-zinc-800">
            Awaiting Performance Metrics Endpoint
          </div>
        </motion.div>

        {/* Holdings Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 p-0 flex flex-col">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Asset Holdings</div>
            <button className="text-[10px] text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"><Eye size={12}/></button>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {assets.length > 0 ? assets.map((h, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <div>
                  <div className="text-[11px] font-bold text-white flex items-center gap-2">
                    {h.name}
                    <span className="text-[8px] font-normal text-zinc-500 uppercase px-1.5 py-0.5 border border-zinc-700 rounded-sm">{h.type}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">{h.currency} · #{h.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white">{fmt(h.balance)}</div>
                  <div className={`text-[10px] mt-1 flex justify-end items-center gap-1 text-emerald-400`}>
                    <TrendingUp size={10} /> 0.0%
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-zinc-600 uppercase text-[10px] tracking-widest">No assets found</div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
