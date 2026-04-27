"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug, Check, AlertTriangle, Loader2, X, RefreshCw,
  FileSpreadsheet, BookOpen, Calculator, FileText, Layers,
  CreditCard, Zap, DollarSign, Receipt, Landmark, Shield,
} from "lucide-react";
import { API_URL } from "@/lib/api";

/* ─── Icon Mapping (driven by backend registry) ────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  FileSpreadsheet, BookOpen, Calculator, FileText, Layers,
  CreditCard, Zap, DollarSign, Receipt, Landmark, Shield,
};

const TYPE_LABELS: Record<string, string> = {
  accounting: "Accounting & ERP",
  payment_gateway: "Payment Gateways",
  banking: "Banking & Aggregators",
};

const TYPE_COLORS: Record<string, string> = {
  accounting: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  payment_gateway: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  banking: "text-violet-400 border-violet-400/30 bg-violet-400/10",
};

interface Provider {
  name: string;
  display_name: string;
  type: string;
  auth_type: string;
  required_fields: string[];
  description: string;
  icon: string;
}

interface ConnectedIntegration {
  id: number;
  provider_name: string;
  provider_type: string;
  is_active: boolean;
  created_at: string;
  last_sync_at: string | null;
  last_sync_status: string | null;
  sync_error: string | null;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function IntegrationsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [connected, setConnected] = useState<ConnectedIntegration[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [provRes, conRes] = await Promise.all([
        fetch(`${API_URL}/integrations/providers`),
        fetch(`${API_URL}/integrations/`),
      ]);
      setProviders(await provRes.json());
      setConnected(await conRes.json());
    } catch (e) {
      console.error("Failed to load integrations data", e);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const connectedNames = new Set(connected.filter(c => c.is_active).map(c => c.provider_name));

  const handleConnect = async () => {
    if (!selectedProvider) return;
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/integrations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_name: selectedProvider.name,
          provider_type: selectedProvider.type,
          credentials,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Connection failed");
      }
      setSuccessMsg(`${selectedProvider.display_name} connected successfully!`);
      setSelectedProvider(null);
      setCredentials({});
      fetchData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async (id: number) => {
    setSyncing(id);
    try {
      const res = await fetch(`${API_URL}/integrations/${id}/sync`, { method: "POST" });
      const data = await res.json();
      setSuccessMsg(data.message);
      fetchData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (id: number) => {
    try {
      await fetch(`${API_URL}/integrations/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error("Disconnect failed", e);
    }
  };

  const groupedProviders = providers.reduce<Record<string, Provider[]>>((acc, p) => {
    if (!acc[p.type]) acc[p.type] = [];
    acc[p.type].push(p);
    return acc;
  }, {});

  return (
    <div className="w-full min-h-full p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-black text-4xl tracking-tighter uppercase">
            Integration <span className="text-emerald-400 italic">Hub</span>
          </h1>
          <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Plug size={11} className="text-emerald-400" />
            Connect your platforms · Auto-sync enabled
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {connected.filter(c => c.is_active).length} Connected
          </span>
        </div>
      </motion.div>

      {/* Success Banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-3 bg-emerald-400/10 border border-emerald-400/30 flex items-center gap-2"
          >
            <Check size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Integrations */}
      {connected.filter(c => c.is_active).length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-bold">Active Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {connected.filter(c => c.is_active).map((integ) => {
              const providerInfo = providers.find(p => p.name === integ.provider_name);
              const IconComp = providerInfo ? ICON_MAP[providerInfo.icon] || Plug : Plug;
              const isSyncing = syncing === integ.id;
              return (
                <motion.div
                  key={integ.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-emerald-400/30 p-4 relative group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center">
                        <IconComp size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{providerInfo?.display_name || integ.provider_name}</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{integ.provider_type.replace("_", " ")}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[8px] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-3">
                    {integ.last_sync_at
                      ? `Last sync: ${new Date(integ.last_sync_at).toLocaleString()}`
                      : "Never synced"}
                    {integ.last_sync_status === "FAILED" && (
                      <span className="text-red-400 ml-2 flex items-center gap-1 inline-flex">
                        <AlertTriangle size={9} /> {integ.sync_error}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSync(integ.id)}
                      disabled={isSyncing}
                      className="flex-1 bg-zinc-800 text-zinc-300 text-[10px] uppercase tracking-wider font-bold px-3 py-2 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1"
                    >
                      {isSyncing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                      {isSyncing ? "Syncing..." : "Sync Now"}
                    </button>
                    <button
                      onClick={() => handleDisconnect(integ.id)}
                      className="bg-zinc-800 text-red-400 text-[10px] uppercase tracking-wider font-bold px-3 py-2 hover:bg-red-500/10 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Providers */}
      {Object.entries(groupedProviders).map(([type, provs]) => (
        <div key={type} className="mb-8">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-bold flex items-center gap-2">
            <span className={`px-2 py-0.5 border text-[8px] ${TYPE_COLORS[type] || "text-zinc-400 border-zinc-700"}`}>
              {TYPE_LABELS[type] || type}
            </span>
          </h2>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {provs.map((prov) => {
              const isConnected = connectedNames.has(prov.name);
              const IconComp = ICON_MAP[prov.icon] || Plug;
              return (
                <motion.div
                  key={prov.name}
                  variants={item}
                  onClick={() => !isConnected && (setSelectedProvider(prov), setCredentials({}), setError(null))}
                  className={`bg-zinc-900 border p-4 cursor-pointer group transition-all ${
                    isConnected
                      ? "border-emerald-400/20 opacity-50 cursor-default"
                      : "border-zinc-800 hover:border-emerald-400/40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 border flex items-center justify-center ${
                      isConnected ? "border-emerald-400/30 bg-emerald-400/10" : "border-zinc-700 bg-zinc-800 group-hover:border-emerald-400/30 group-hover:bg-emerald-400/5"
                    } transition-colors`}>
                      <IconComp size={16} className={isConnected ? "text-emerald-400" : "text-zinc-400 group-hover:text-emerald-400 transition-colors"} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{prov.display_name}</div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{prov.auth_type === "oauth2" ? "OAuth 2.0" : "API Key"}</div>
                    </div>
                    {isConnected && (
                      <span className="ml-auto px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[8px] uppercase tracking-wider">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{prov.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ))}

      {/* Connection Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProvider(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 w-[90vw] sm:w-[500px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Plug size={14} className="text-emerald-400" />
                    Connect {selectedProvider.display_name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">{selectedProvider.description}</p>
                </div>
                <button onClick={() => setSelectedProvider(null)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Credential Fields */}
              <div className="p-6 flex flex-col gap-4">
                {selectedProvider.required_fields.map((field) => (
                  <div key={field}>
                    <label className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">
                      {field.replace(/_/g, " ")}
                    </label>
                    <input
                      type={field.includes("secret") || field.includes("key") || field.includes("password") ? "password" : "text"}
                      value={credentials[field] || ""}
                      onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs px-3 py-3 outline-none focus:border-emerald-400/50 transition-colors font-mono"
                    />
                  </div>
                ))}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                    <AlertTriangle size={12} className="text-red-400" />
                    <span className="text-[10px] text-red-400 uppercase tracking-wider">{error}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="border border-zinc-700 text-zinc-300 text-[10px] uppercase tracking-wider px-4 py-2 hover:border-zinc-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={connecting || selectedProvider.required_fields.some(f => !credentials[f])}
                  className="bg-emerald-400 text-black text-[10px] uppercase tracking-wider font-bold px-6 py-2 hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {connecting ? <Loader2 size={12} className="animate-spin" /> : <Plug size={12} />}
                  {connecting ? "Authenticating..." : "Connect & Sync"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
