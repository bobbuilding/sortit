"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, Eye, EyeOff, Shield, Activity, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/dashboard");
  };

  return (
    <div
      style={{ minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
      className="bg-zinc-950"
    >
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: "20%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      {/* Centered card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 960, margin: "0 auto", padding: "0 24px" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #27272a", background: "#09090b" }}>

          {/* ── LEFT: Brand ── */}
          <div style={{ padding: 56, borderRight: "1px solid #27272a", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 48, background: "linear-gradient(135deg,#111113 0%,#0a0a0b 100%)" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cpu size={20} color="#34d399" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "white" }}>
                Sort<span style={{ color: "#34d399" }}>IT</span>
              </span>
            </div>

            {/* Hero text */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px rgba(52,211,153,0.8)", display: "inline-block" }} />
                <span style={{ fontSize: 10, color: "#34d399", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>
                  NODE_01 · Live Connection
                </span>
              </div>
              <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em", textTransform: "uppercase", color: "white", margin: 0, marginBottom: 20 }}>
                Operating<br />
                System<br />
                <span style={{ color: "#34d399" }}>for Money.</span>
              </h1>
              <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
                Institutional-grade treasury intelligence. Built for founders who move fast.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[{ label: "AUM", value: "$14.2M" }, { label: "Runway", value: "34 Mo" }, { label: "Yield", value: "3.4%" }].map((s, i) => (
                <div key={i} style={{ border: "1px solid #27272a", padding: 16, background: "rgba(0,0,0,0.3)" }}>
                  <div style={{ fontSize: 9, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "white" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div style={{ padding: 56, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Form header */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={14} color="#34d399" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "white" }}>System Access</div>
                  <div style={{ fontSize: 9, color: "#52525b", letterSpacing: "0.15em", textTransform: "uppercase" }}>Authentication Required</div>
                </div>
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", color: "white", margin: 0, lineHeight: 1 }}>
                Initialize<br /><span style={{ color: "#34d399" }}>Terminal</span>
              </h2>
            </div>

            {/* Inputs */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                  Terminal Identifier
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="founder@startup.com"
                  style={{ width: "100%", background: "#18181b", border: "1px solid #3f3f46", color: "white", fontSize: 14, padding: "14px 16px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "#3f3f46")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                  Authorization Key
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••••••"
                    style={{ width: "100%", background: "#18181b", border: "1px solid #3f3f46", color: "white", fontSize: 14, padding: "14px 48px 14px 16px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                    onBlur={e  => (e.target.style.borderColor = "#3f3f46")}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#71717a", display: "flex", padding: 0 }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? "#059669" : "#34d399", color: "black", fontWeight: 900, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 24px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8, boxShadow: "0 0 30px rgba(52,211,153,0.25)", transition: "background 0.2s" }}>
                {loading ? (
                  <><Activity size={16} style={{ animation: "pulse 1s infinite" }} />Authenticating...</>
                ) : (
                  <><Lock size={14} />Authenticate<ArrowRight size={14} /></>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid #27272a" }}>
              <span style={{ fontSize: 9, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 6 }}>
                <Shield size={9} />Secure Environment
              </span>
              <Link href="#" style={{ fontSize: 10, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none" }}>
                Forgot Key?
              </Link>
            </div>

            <p style={{ textAlign: "center", fontSize: 11, color: "#52525b", marginTop: 20 }}>
              No account?{" "}
              <Link href="/onboarding" style={{ color: "#34d399", textDecoration: "none" }}>Request Access</Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
