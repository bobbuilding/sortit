"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Shield, Cpu, Activity, PieChart } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function AllocationModal() {
  const { isAllocationModalOpen, setAllocationModalOpen } = useAppStore();
  const [formData, setFormData] = useState({
    name: "",
    type: "Equity",
    value: "",
    node: "ND-774-ALPHA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock simulation of "blockchain/ledger synchronization"
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setAllocationModalOpen(false);
    setFormData({ name: "", type: "Equity", value: "", node: "ND-774-ALPHA" });
  };

  return (
    <AnimatePresence>
      {isAllocationModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAllocationModalOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-lg min-w-[320px] shadow-[0_0_100px_rgba(0,0,0,0.9)] pointer-events-auto overflow-hidden"
            >
              {/* Header with scanline effect */}
              <div className="relative bg-zinc-900/50 p-6 border-b border-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-400/10 border border-emerald-400/30 rounded flex items-center justify-center">
                      <PieChart size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tighter text-white">
                        Asset <span className="text-emerald-400">Allocation</span>
                      </h2>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Initialize New Ledger Entry</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAllocationModalOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Asset Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Asset Identifier</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. BTC-STASH-01 or AAPL EQUITY"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-400/50 text-sm text-zinc-200 placeholder-zinc-700 px-4 py-3 outline-none transition-all font-mono"
                    />
                  </div>

                  {/* Asset Type & Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Class Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-400/50 text-sm text-zinc-200 px-4 py-3 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option>Equity</option>
                        <option>Crypto</option>
                        <option>Fixed Income</option>
                        <option>Cash</option>
                        <option>Real Estate</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Initial Value ($)</label>
                      <input
                        required
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-400/50 text-sm text-zinc-200 placeholder-zinc-700 px-4 py-3 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Node Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Target Execution Node</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["TREASURY", "VAULT", "LEDGER"].map((node) => (
                        <button
                          key={node}
                          type="button"
                          onClick={() => setFormData({ ...formData, node })}
                          className={`py-2 text-[9px] uppercase tracking-widest font-black border transition-all ${
                            formData.node === node
                              ? "bg-emerald-400/10 border-emerald-400 text-emerald-400"
                              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                          }`}
                        >
                          {node}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex flex-col gap-3">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-emerald-400 text-black font-black uppercase tracking-widest py-4 text-xs hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Activity size={14} className="animate-spin" />
                        Synchronizing...
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Confirm Allocation
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-4 text-[9px] text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Shield size={10} className="text-emerald-400/50" /> End-to-End Encrypted</span>
                    <span className="flex items-center gap-1"><Cpu size={10} className="text-emerald-400/50" /> Node: {formData.node}</span>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
