"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  Activity, 
  Building, 
  UserCircle, 
  Database,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const steps = [
  { id: 1, title: "Entity Registry", icon: Building },
  { id: 2, title: "Key Personnel", icon: UserCircle },
  { id: 3, title: "System Modules", icon: Database },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    industry: "FINTECH",
    founderName: "",
    founderRole: "CEO",
    modules: {
      treasury: true,
      ledger: true,
      vault: false,
    }
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleModule = (moduleName: keyof typeof formData.modules) => {
    setFormData(prev => ({
      ...prev,
      modules: { ...prev.modules, [moduleName]: !prev.modules[moduleName] }
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    // Mock API call
    await new Promise(r => setTimeout(r, 2000));
    router.push("/dashboard");
  };

  return (
    <div
      style={{ minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", position: "relative" }}
      className="bg-zinc-950"
    >
      {/* Background Effects */}
      <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "80%", height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      {/* Top Navbar */}
      <div style={{ padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a", position: "relative", zIndex: 10, background: "rgba(9,9,11,0.8)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={16} color="#34d399" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "white" }}>
            Sort<span style={{ color: "#34d399" }}>IT</span>
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px rgba(52,211,153,0.8)", display: "inline-block" }} />
          <span style={{ fontSize: 9, color: "#34d399", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
            Initialization Sequence
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", maxWidth: 800, background: "#09090b", border: "1px solid #27272a", display: "flex", flexDirection: "column" }}
        >
          {/* Header */}
          <div style={{ padding: "40px", borderBottom: "1px solid #27272a", background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={14} color="#34d399" />
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "white" }}>System Onboarding</div>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", color: "white", margin: 0 }}>
              Establish <span style={{ color: "#34d399" }}>Parameters</span>
            </h1>
          </div>

          <div style={{ display: "flex", flex: 1 }}>
            {/* Sidebar Steps */}
            <div style={{ width: 240, borderRight: "1px solid #27272a", padding: "32px 0", background: "#111113" }}>
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                return (
                  <div key={step.id} style={{ padding: "16px 32px", position: "relative", display: "flex", alignItems: "center", gap: 16, opacity: isActive ? 1 : isPast ? 0.7 : 0.4, transition: "all 0.3s" }}>
                    {isActive && (
                      <motion.div layoutId="activeStep" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#34d399" }} />
                    )}
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${isActive || isPast ? "#34d399" : "#3f3f46"}`, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "rgba(52,211,153,0.1)" : "transparent" }}>
                      {isPast ? <CheckCircle2 size={16} color="#34d399" /> : <Icon size={16} color={isActive ? "#34d399" : "#71717a"} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Step 0{step.id}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isActive || isPast ? "white" : "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form Area */}
            <div style={{ flex: 1, padding: 40, position: "relative", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", flexDirection: "column", gap: 24 }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Legal Entity Name</label>
                      <input
                        type="text" value={formData.companyName} onChange={e => updateFormData("companyName", e.target.value)}
                        placeholder="Acme Corp LLC"
                        style={{ width: "100%", background: "#18181b", border: "1px solid #3f3f46", color: "white", fontSize: 14, padding: "14px 16px", outline: "none", transition: "border-color 0.2s" }}
                        onFocus={e => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                        onBlur={e  => (e.target.style.borderColor = "#3f3f46")}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Registration Number</label>
                        <input
                          type="text" value={formData.registrationNumber} onChange={e => updateFormData("registrationNumber", e.target.value)}
                          placeholder="00-0000000"
                          style={{ width: "100%", background: "#18181b", border: "1px solid #3f3f46", color: "white", fontSize: 14, padding: "14px 16px", outline: "none", transition: "border-color 0.2s" }}
                          onFocus={e => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                          onBlur={e  => (e.target.style.borderColor = "#3f3f46")}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Industry Category</label>
                        <select
                          value={formData.industry} onChange={e => updateFormData("industry", e.target.value)}
                          style={{ width: "100%", background: "#18181b", border: "1px solid #3f3f46", color: "white", fontSize: 14, padding: "14px 16px", outline: "none", appearance: "none", transition: "border-color 0.2s", cursor: "pointer" }}
                          onFocus={e => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                          onBlur={e  => (e.target.style.borderColor = "#3f3f46")}
                        >
                          <option value="FINTECH">Fintech</option>
                          <option value="SAAS">SaaS</option>
                          <option value="CRYPTO">Crypto & Web3</option>
                          <option value="HARDWARE">Hardware / Deeptech</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", flexDirection: "column", gap: 24 }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Primary Admin Name</label>
                      <input
                        type="text" value={formData.founderName} onChange={e => updateFormData("founderName", e.target.value)}
                        placeholder="John Doe"
                        style={{ width: "100%", background: "#18181b", border: "1px solid #3f3f46", color: "white", fontSize: 14, padding: "14px 16px", outline: "none", transition: "border-color 0.2s" }}
                        onFocus={e => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                        onBlur={e  => (e.target.style.borderColor = "#3f3f46")}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 9, color: "#71717a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Authorization Role</label>
                      <div style={{ display: "flex", gap: 12 }}>
                        {["CEO", "CFO", "CTO", "Treasury Admin"].map(role => (
                          <button
                            key={role}
                            onClick={() => updateFormData("founderRole", role)}
                            style={{ flex: 1, padding: "12px", background: formData.founderRole === role ? "rgba(52,211,153,0.1)" : "#18181b", border: `1px solid ${formData.founderRole === role ? "#34d399" : "#3f3f46"}`, color: formData.founderRole === role ? "#34d399" : "white", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <h3 style={{ fontSize: 14, color: "white", margin: 0, marginBottom: 4, fontWeight: 600 }}>Select Core Modules</h3>
                      <p style={{ fontSize: 12, color: "#71717a", margin: 0 }}>Activate system components required for your operation.</p>
                    </div>

                    {[
                      { id: "treasury", name: "Treasury Sync", desc: "Real-time API connection to your primary banking institutions." },
                      { id: "ledger", name: "Automated Ledger", desc: "AI-driven transaction categorization and reconciliation." },
                      { id: "vault", name: "Yield Vault", desc: "Automated cash sweeps into short-term treasuries." }
                    ].map(mod => {
                      const isActive = formData.modules[mod.id as keyof typeof formData.modules];
                      return (
                        <div 
                          key={mod.id} 
                          onClick={() => toggleModule(mod.id as keyof typeof formData.modules)}
                          style={{ padding: "16px 20px", border: `1px solid ${isActive ? "#34d399" : "#3f3f46"}`, background: isActive ? "rgba(52,211,153,0.05)" : "#18181b", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s" }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? "white" : "#a1a1aa", marginBottom: 4 }}>{mod.name}</div>
                            <div style={{ fontSize: 11, color: "#71717a" }}>{mod.desc}</div>
                          </div>
                          <div style={{ width: 20, height: 20, border: `1px solid ${isActive ? "#34d399" : "#52525b"}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "#34d399" : "transparent" }}>
                            {isActive && <CheckCircle2 size={14} color="black" />}
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: "24px 40px", borderTop: "1px solid #27272a", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0b" }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              style={{ padding: "12px 24px", background: "transparent", border: "1px solid #3f3f46", color: "white", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: currentStep === 1 ? "not-allowed" : "pointer", opacity: currentStep === 1 ? 0.3 : 1, display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}
              onMouseOver={e => { if(currentStep !== 1) e.currentTarget.style.background = "#18181b" }}
              onMouseOut={e => { e.currentTarget.style.background = "transparent" }}
            >
              <ArrowLeft size={14} /> Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                style={{ padding: "12px 32px", background: "#34d399", border: "none", color: "black", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 0 20px rgba(52,211,153,0.2)" }}
              >
                Proceed <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                style={{ padding: "12px 32px", background: loading ? "#059669" : "#34d399", border: "none", color: "black", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 0 20px rgba(52,211,153,0.3)" }}
              >
                {loading ? (
                  <><Activity size={14} style={{ animation: "pulse 1s infinite" }} /> Initializing...</>
                ) : (
                  <>Complete Setup <ArrowRight size={14} /></>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ position: "absolute", bottom: 24, left: 24, fontSize: 9, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.2em", display: "flex", gap: 16 }}>
        <Link href="/login" style={{ color: "#71717a", textDecoration: "none" }}>Return to Login</Link>
        <span>•</span>
        <span>Secure HTTPS Connection</span>
      </div>
    </div>
  );
}
