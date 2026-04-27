"use client";
import { motion } from "framer-motion";
import { ResponsiveSankey } from "@nivo/sankey";
import { sankeyData } from "@/lib/mockData";

const THEME = {
  background: "transparent", textColor: "#6B7280", fontSize: 11,
  tooltip: { container: { background: "#111827", border: "1px solid #374151", color: "#F9FAFB", fontSize: 11 } },
};

export default function FlowsPage() {
  return (
    <div className="p-6 w-full min-h-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">Capital <span className="text-emerald-400 italic">Flows</span></h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Real-time capital routing · Sankey topology</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="bg-zinc-900 border border-zinc-800 p-6 h-[520px]">
        <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-6">Fund Allocation Sankey</h2>
        <div className="h-[420px]">
          <ResponsiveSankey
            data={sankeyData}
            theme={THEME}
            margin={{ top: 10, right: 120, bottom: 10, left: 120 }}
            align="justify"
            colors={["#34D399","#10B981","#059669","#F59E0B","#EF4444","#6B7280","#3B7A6B"]}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderRadius={2}
            linkOpacity={0.3}
            linkHoverOthersOpacity={0.1}
            linkContract={3}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={12}
            labelTextColor={{ from: "color", modifiers: [["brighter", 1]] }}
          />
        </div>
      </motion.div>

      {/* Flow summary cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[
          { label: "Total Inflows",  value: "$2.08M",  sub: "Revenue + Funding" },
          { label: "Total Outflows", value: "$0.73M",  sub: "All categories" },
          { label: "Net Retained",   value: "$25k",    sub: "From revenue" },
          { label: "Payroll Share",  value: "77.6%",   sub: "Of total burn" },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 hover:border-emerald-400/40 transition-colors">
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">{s.label}</div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-[9px] text-zinc-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
