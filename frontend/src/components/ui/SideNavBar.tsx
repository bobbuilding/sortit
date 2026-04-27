"use client";
import { motion } from "framer-motion";
import { Terminal, LayoutGrid, ArrowLeftRight, Wallet, Lock, FileText, HelpCircle, Activity, Plug, PieChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { icon: Terminal,       label: "Dashboard", href: "/dashboard" },
  { icon: LayoutGrid,     label: "Nodes",     href: "/nodes" },
  { icon: ArrowLeftRight, label: "Flows",     href: "/flows" },
  { icon: Wallet,         label: "Assets",    href: "/assets" },
  { icon: PieChart,       label: "Portfolio",  href: "/portfolio" },
  { icon: Lock,           label: "Vault",     href: "/vault" },
  { icon: FileText,       label: "Ledger",    href: "/ledger" },
  { icon: Plug,           label: "Connect",   href: "/integrations" },
];

export function SideNavBar() {
  const pathname = usePathname();
  return (
    <motion.aside
      initial={{ x: -64, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-0 top-[52px] h-[calc(100vh-52px)] w-16 z-40 flex flex-col items-center border-r border-zinc-800 bg-zinc-950">
      {/* Node indicator */}
      <div className="w-full flex flex-col items-center py-4 border-b border-zinc-800 mb-1">
        <div className="w-8 h-8 bg-emerald-400/10 border border-emerald-400/30 rounded flex items-center justify-center mb-1">
          <Activity size={12} className="text-emerald-400" />
        </div>
        <div className="text-[7px] uppercase text-emerald-400 tracking-wider leading-none">NODE_01</div>
        <div className="text-[7px] uppercase text-zinc-600 tracking-wider mt-0.5">Active</div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col w-full flex-1">
        {nav.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} title={label}
              className={`relative w-full flex flex-col items-center py-3 gap-1 transition-all border-l-2 group ${active ? "border-emerald-400 bg-emerald-400/5 text-emerald-400" : "border-transparent text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900"}`}>
              {active && (
                <motion.div layoutId="nav-indicator"
                  className="absolute inset-0 bg-emerald-400/5" />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="text-[7px] uppercase tracking-wider relative z-10">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="w-full border-t border-zinc-800 pb-4 pt-2">
        <Link href="/support" title="Support"
          className="w-full flex flex-col items-center py-3 text-zinc-600 hover:text-zinc-300 gap-1 transition-colors">
          <HelpCircle size={18} />
          <span className="text-[7px] uppercase tracking-wider">Help</span>
        </Link>
      </div>
    </motion.aside>
  );
}
