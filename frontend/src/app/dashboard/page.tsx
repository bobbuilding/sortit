"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { Activity, ArrowUpRight, ArrowDownRight, Box, Zap, BarChart3, Shield, ChevronRight } from "lucide-react";
import { treasuryTimeseries, assetAllocation, burnByCategory, transactions } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}k`
  : `$${n.toLocaleString()}`;

const NIVO_THEME = {
  background: "transparent",
  textColor: "#6B7280",
  fontSize: 10,
  axis: { ticks: { text: { fill: "#6B7280", fontSize: 9 } }, legend: { text: { fill: "#9CA3AF" } } },
  grid: { line: { stroke: "#1F2937", strokeWidth: 1 } },
  crosshair: { line: { stroke: "#00FF89", strokeWidth: 1, strokeOpacity: 0.5 } },
  tooltip: { container: { background: "#111827", border: "1px solid #374151", color: "#F9FAFB", fontSize: 11 } },
};

const metrics = [
  { label: "Total Liquidity", value: "$14.2M", trend: "+2.4%", up: true, icon: <Box size={14} /> },
  { label: "Burn Rate (30D)", value: "$124k", trend: "-5.1%", up: false, icon: <Activity size={14} /> },
  { label: "Runway", value: "34 Months", trend: "Stable", up: true, icon: <BarChart3 size={14} /> },
  { label: "Yield Generated", value: "$42.1k", trend: "+12.1%", up: true, icon: <Zap size={14} /> },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const [period, setPeriod] = useState<"1W" | "1M" | "ALL">("1M");
  const { setAllocationModalOpen } = useAppStore();

  return (
    <div className="w-full min-h-full p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-black text-4xl tracking-tighter uppercase">
            Terminal <span className="text-emerald-400 italic">Overview</span>
          </h1>
          <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            Node: ND-774-ALPHA · Live Feed
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border border-zinc-700 text-zinc-300 text-[10px] uppercase tracking-wider px-4 py-2 hover:border-emerald-400/50 transition-colors">Export</button>
          <button 
            onClick={() => setAllocationModalOpen(true)}
            className="bg-emerald-400 text-black text-[10px] uppercase tracking-wider font-bold px-4 py-2 hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            New Allocation
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <motion.div key={i} variants={item}
            className="bg-zinc-900 border border-zinc-800 p-4 relative group hover:border-emerald-400/40 transition-all cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/5 transition-all duration-500" />
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{m.label}</span>
              <span className="text-emerald-400/40 group-hover:text-emerald-400 transition-colors">{m.icon}</span>
            </div>
            <div className="text-2xl font-black tracking-tight">{m.value}</div>
            <div className={`mt-2 text-[10px] flex items-center gap-1 ${m.up ? "text-emerald-400" : "text-red-400"}`}>
              {m.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {m.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Treasury Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 min-h-[340px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500">Treasury Performance</h2>
              <p className="text-zinc-300 text-sm font-bold mt-0.5">$14.2M AUM</p>
            </div>
            <div className="flex gap-1">
              {(["1W", "1M", "ALL"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-2 py-1 text-[10px] uppercase border transition-colors ${period === p ? "border-emerald-400 text-emerald-400 bg-emerald-400/10" : "border-zinc-700 text-zinc-500 hover:border-zinc-500"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveLine
              data={treasuryTimeseries}
              theme={NIVO_THEME}
              margin={{ top: 10, right: 20, bottom: 40, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              curve="monotoneX"
              colors={["#34D399", "#EF4444"]}
              lineWidth={2}
              pointSize={4}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea={true}
              areaOpacity={0.08}
              enableGridX={false}
              axisBottom={{ tickSize: 0, tickPadding: 8 }}
              axisLeft={{ tickSize: 0, tickPadding: 8, format: (v: number) => v >= 1000000 ? `$${v/1000000}M` : `$${v/1000}k` }}
              useMesh={true}
              enableCrosshair={true}
              legends={[{ anchor: "bottom-right", direction: "row", itemWidth: 80, itemHeight: 12, itemTextColor: "#6B7280", symbolSize: 8, symbolShape: "circle", translateY: 40 }]}
            />
          </div>
        </motion.div>

        {/* Asset Allocation Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 p-5 min-h-[340px] flex flex-col">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Asset Allocation</h2>
          <div className="flex-1">
            <ResponsivePie
              data={assetAllocation}
              theme={NIVO_THEME}
              margin={{ top: 10, right: 10, bottom: 90, left: 10 }}
              innerRadius={0.65}
              padAngle={2}
              cornerRadius={2}
              activeOuterRadiusOffset={6}
              colors={["#34d399", "#38bdf8", "#a78bfa", "#fbbf24", "#f472b6"]}
              borderWidth={0}
              enableArcLabels={false}
              enableArcLinkLabels={false}
              legends={[{ anchor: "bottom", direction: "column", itemWidth: 120, itemHeight: 16, itemTextColor: "#6B7280", translateY: 80, symbolSize: 8, symbolShape: "circle" }]}
            />
          </div>
        </motion.div>
      </div>

      {/* Burn + Ledger Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Burn Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 min-h-[280px] flex flex-col">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Monthly Burn by Category</h2>
          <div className="flex-1">
            <ResponsiveBar
              data={burnByCategory}
              keys={["Payroll", "Infra", "Marketing", "Ops"]}
              indexBy="month"
              theme={NIVO_THEME}
              margin={{ top: 10, right: 80, bottom: 36, left: 50 }}
              padding={0.35}
              valueScale={{ type: "linear" }}
              colors={["#34d399", "#38bdf8", "#a78bfa", "#fbbf24"]}
              borderWidth={0}
              axisBottom={{ tickSize: 0, tickPadding: 6 }}
              axisLeft={{ tickSize: 0, tickPadding: 6, format: (v: number) => `$${v/1000}k` }}
              enableLabel={false}
              legends={[{ dataFrom: "keys", anchor: "bottom-right", direction: "column", itemWidth: 70, itemHeight: 16, itemTextColor: "#6B7280", translateX: 80, symbolSize: 8, symbolShape: "square" }]}
            />
          </div>
        </motion.div>

        {/* Live Ledger Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-zinc-900 border border-zinc-800 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Shield size={11} className="text-emerald-400" /> Recent Ledger
            </h2>
            <button className="text-[9px] text-emerald-400 hover:underline flex items-center gap-1">
              View All <ChevronRight size={10} />
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {transactions.slice(0, 6).map((txn) => (
              <div key={txn.id}
                className="p-2 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-zinc-500">{txn.date}</span>
                  <span className={`text-[10px] font-bold ${txn.amount > 0 ? "text-emerald-400" : "text-zinc-300"}`}>
                    {txn.amount > 0 ? "+" : ""}{fmt(Math.abs(txn.amount))}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wide mt-0.5 text-zinc-300 group-hover:text-white transition-colors">
                  {txn.description}
                </div>
                <div className={`text-[9px] mt-0.5 ${txn.status === "SETTLED" ? "text-emerald-400/60" : "text-amber-400/60"}`}>
                  {txn.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
