"use client";
import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Clock, MapPin, Smartphone, Laptop, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-6 w-full max-w-4xl mx-auto min-h-full">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-black text-4xl tracking-tighter uppercase">
          Operator <span className="text-emerald-400 italic">Profile</span>
        </h1>
        <p className="text-xs mt-1 uppercase tracking-widest text-zinc-500">Identity and Access Management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-1 bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-emerald-400/10 border border-emerald-400/30 rounded-full flex items-center justify-center mb-4 relative">
            <User size={40} className="text-emerald-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border border-zinc-900 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Admin User</h2>
          <p className="text-xs text-zinc-500 mt-1">Level 5 Clearance</p>
          
          <div className="mt-6 w-full flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
              <Mail size={14} /> admin@sortit.finance
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
              <ShieldCheck size={14} /> Identity Verified
            </div>
          </div>

          <button className="mt-8 w-full border border-zinc-700 text-zinc-300 px-4 py-2 text-[10px] uppercase tracking-wider font-bold hover:border-zinc-500 transition-colors">
            Edit Profile
          </button>
        </motion.div>

        {/* Details & Activity */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Operator Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Node Assignment</div>
                <div className="text-sm text-white font-mono mt-1">NODE_01</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Join Date</div>
                <div className="text-sm text-white mt-1">October 12, 2024</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Department</div>
                <div className="text-sm text-white mt-1">Quantitative Strategy</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Account Status</div>
                <div className="text-sm text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 size={14}/> Active</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Recent Activity</h3>
            <div className="flex flex-col gap-4">
              {[
                { action: "Login Successful", time: "2 mins ago", ip: "192.168.1.1", icon: Laptop },
                { action: "Executed Trade (AAPL)", time: "1 hour ago", ip: "192.168.1.1", icon: CheckCircle2 },
                { action: "Mobile Session Started", time: "Yesterday, 14:20", ip: "10.0.0.5", icon: Smartphone },
                { action: "Location Change", time: "Yesterday, 09:00", ip: "London, UK", icon: MapPin },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center shrink-0">
                    <log.icon size={12} className="text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white">{log.action}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1 flex items-center gap-2">
                      <Clock size={10} /> {log.time} • {log.ip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
