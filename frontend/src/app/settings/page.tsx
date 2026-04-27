"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Bell, Key, Monitor, Activity, Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Monitor },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <div className="p-6 w-full max-w-4xl mx-auto min-h-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">
          System <span className="text-emerald-400 italic">Settings</span>
        </h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Configure your SortIT environment</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 flex flex-col gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                  isActive
                    ? "bg-emerald-400/10 text-emerald-400 border-l-2 border-emerald-400"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border-l-2 border-transparent"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3 bg-zinc-900 border border-zinc-800 p-6"
        >
          {activeTab === "general" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2">Preferences</h2>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">Default Currency</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Base currency for portfolio metrics</div>
                </div>
                <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 outline-none focus:border-emerald-400/50 transition-colors">
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>BTC - Bitcoin</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">Theme Mode</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Institutional Dark is enforced</div>
                </div>
                <div className="px-3 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Check size={10} /> Active
                </div>
              </div>

              <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2 mt-4">Node Configuration</h2>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">Data Refresh Rate</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Interval for pulling live asset prices</div>
                </div>
                <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 outline-none focus:border-emerald-400/50 transition-colors">
                  <option>Real-time (WebSocket)</option>
                  <option>1 Minute</option>
                  <option>5 Minutes</option>
                </select>
              </div>

            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2">Access Control</h2>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">Two-Factor Authentication</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Secure your account with TOTP</div>
                </div>
                <button className="bg-emerald-400 text-black px-4 py-2 text-[10px] uppercase tracking-wider font-bold hover:bg-emerald-300 transition-colors shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                  Enable 2FA
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">Active Sessions</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Manage connected devices</div>
                </div>
                <button className="border border-red-500/50 text-red-400 px-4 py-2 text-[10px] uppercase tracking-wider font-bold hover:bg-red-500/10 transition-colors">
                  Revoke All
                </button>
              </div>

              <div className="p-4 bg-black/50 border border-zinc-800 mt-2">
                <div className="flex items-center gap-3">
                  <Monitor size={16} className="text-emerald-400" />
                  <div>
                    <div className="text-xs text-white">Windows 11 • Chrome</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Current Session • IP: 192.168.1.1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2 flex justify-between items-center">
                <span>API Keys</span>
                <button className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">Generate New Key</button>
              </h2>
              
              <div className="bg-black/50 border border-zinc-800 p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs font-bold text-white">Production Quant Key</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Created on 2026-01-14</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[8px] uppercase tracking-wider">Active</span>
                </div>
                <div className="flex gap-2">
                  <code className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs px-3 py-2 font-mono">
                    sk_live_***************************89f2
                  </code>
                  <button className="bg-zinc-800 text-white px-3 py-2 text-[10px] uppercase tracking-wider hover:bg-zinc-700 transition-colors">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
             <div className="flex flex-col gap-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2">Alerts</h2>
              
              {[
                { title: "Large Transactions", desc: "Notify when transfers exceed $10,000" },
                { title: "Margin Calls", desc: "Critical alerts for vault health factor" },
                { title: "System Updates", desc: "SortIT platform maintenance and upgrades" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.desc}</div>
                  </div>
                  <div className="w-10 h-5 bg-emerald-400/20 border border-emerald-400/50 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-emerald-400 absolute right-0.5 top-0.5 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
