"use client";
import { motion } from "framer-motion";
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { nodes } from "@/lib/mockData";

const statusColor: Record<string, string> = {
  ACTIVE: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  MONITORING: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  IDLE: "text-zinc-500 border-zinc-700 bg-zinc-800/50",
};
const statusIcon: Record<string, React.ReactNode> = {
  ACTIVE: <CheckCircle size={10} />,
  MONITORING: <AlertTriangle size={10} />,
  IDLE: <Clock size={10} />,
};
const riskColor: Record<string, string> = { LOW: "text-emerald-400", MEDIUM: "text-amber-400", HIGH: "text-red-400" };

const fmt = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(2)}M` : `$${(n/1_000).toFixed(0)}k`;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function NodesPage() {
  return (
    <div className="p-6 w-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">Capital <span className="text-emerald-400 italic">Nodes</span></h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Financial routing topology · {nodes.length} nodes registered</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <motion.div key={node.id} variants={card}
            className="bg-zinc-900 border border-zinc-800 p-6 hover:border-emerald-400/40 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/3 rounded-bl-full -mr-16 -mt-16 group-hover:bg-emerald-400/8 transition-all duration-700" />
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">{node.id}</div>
                <h2 className="font-black text-xl tracking-tight">{node.name}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{node.type}</p>
              </div>
              <span className={`text-[9px] px-2 py-1 border rounded-sm uppercase tracking-wider flex items-center gap-1 ${statusColor[node.status]}`}>
                {statusIcon[node.status]} {node.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-zinc-800/60 p-3 border border-zinc-700/50">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Liquidity</div>
                <div className="font-bold text-sm text-white">{fmt(node.liquidity)}</div>
              </div>
              <div className="bg-zinc-800/60 p-3 border border-zinc-700/50">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Yield APY</div>
                <div className={`font-bold text-sm ${node.yield > 0 ? "text-emerald-400" : "text-zinc-500"}`}>
                  {node.yield > 0 ? `${node.yield}%` : "—"}
                </div>
              </div>
              <div className="bg-zinc-800/60 p-3 border border-zinc-700/50">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Risk</div>
                <div className={`font-bold text-sm ${riskColor[node.risk]}`}>{node.risk}</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-zinc-600 flex items-center gap-1"><Activity size={9} /> Last sync: {node.lastSync}</span>
              <button className="text-[9px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-wider">
                Inspect <TrendingUp size={10} />
              </button>
            </div>
            {/* Pulse bar */}
            <div className="mt-4 h-0.5 bg-zinc-800 overflow-hidden">
              <div className={`h-full ${node.status === "ACTIVE" ? "bg-emerald-400 animate-pulse w-full" : node.status === "MONITORING" ? "bg-amber-400 w-2/3" : "bg-zinc-700 w-1/4"}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
