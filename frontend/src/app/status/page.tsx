"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { systemApi } from "@/lib/api";
import { useTranslation } from "@/context/LanguageContext";
import { Activity, Database, Zap, ArrowLeft, RefreshCw, Cpu, Globe } from "lucide-react";

export default function StatusPage() {
  const { t } = useTranslation();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await systemApi.getHealth();
      setHealth(data);
      setLastCheck(new Date());
    } catch (e) {
      console.error("Health fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "connected" || status === "ready" || status === "healthy" || status === "initialized") return "text-[#1AEEAF]";
    return "text-[#E24B4A]";
  };

  const getStatusBg = (status: string) => {
    if (status === "connected" || status === "ready" || status === "healthy" || status === "initialized") return "bg-[#1AEEAF]/10 border-[#1AEEAF]/30";
    return "bg-[#E24B4A]/10 border-[#E24B4A]/30";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-[#1AEEAF]/30 selection:text-white">
      {/* Glow effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1D9E75]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E24B4A]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.status.back}</span>
        </Link>

        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#1D9E75]/20 flex items-center justify-center border border-[#1D9E75]/30">
                <Activity className="text-[#1AEEAF]" size={20} />
              </div>
              <h1 className="text-4xl font-bold tracking-tighter">{t.status.title}</h1>
            </div>
            <p className="text-white/40 text-lg max-w-xl">
              {t.status.desc}
            </p>
          </div>
          <button 
            onClick={fetchHealth}
            disabled={loading}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <RefreshCw size={20} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <ComponentCard 
            icon={Cpu} 
            title={t.status.ia_engine} 
            status={health?.components.ai_engine || "unknown"} 
            color={getStatusColor(health?.components.ai_engine)} 
            bg={getStatusBg(health?.components.ai_engine)}
            desc={t.status.ia_desc}
          />
          <ComponentCard 
            icon={Database} 
            title={t.status.database} 
            status={health?.components.database || "unknown"} 
            color={getStatusColor(health?.components.database)} 
            bg={getStatusBg(health?.components.database)}
            desc={t.status.database_desc}
          />
          <ComponentCard 
            icon={Globe} 
            title={t.status.telecom} 
            status={health?.components.telecom || "unknown"} 
            color={getStatusColor(health?.components.telecom)} 
            bg={getStatusBg(health?.components.telecom)}
            desc={t.status.telecom_desc}
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${health?.status === "healthy" ? "bg-[#1AEEAF]" : "bg-[#EF9F27]"} animate-ping absolute inset-0 opacity-40`} />
                <div className={`w-4 h-4 rounded-full ${health?.status === "healthy" ? "bg-[#1AEEAF]" : "bg-[#EF9F27]"} relative`} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">{t.status.global}</div>
                <div className="text-2xl font-bold">
                  {health?.status === "healthy" ? t.status.operational : loading ? "..." : t.status.maintenance}
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden md:block" />

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">{t.status.last_check}</div>
              <div className="text-xl font-mono text-white/60">
                {lastCheck.toLocaleTimeString()}
              </div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden md:block" />

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">{t.status.version}</div>
              <div className="text-xl font-mono text-[#1AEEAF]">
                v{health?.version || "1.0.2"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.6em]">Powered by Vanguard Cloud Infrastructure</p>
        </div>
      </div>
    </div>
  );
}

function ComponentCard({ icon: Icon, title, status, color, bg, desc }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-start gap-6 hover:translate-y-[-4px] transition-all hover:bg-white/[0.07]">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
        <Icon className="text-white/40" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-xs text-white/30 leading-relaxed font-medium">{desc}</p>
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${color} ${bg}`}>
        {status}
      </div>
    </div>
  );
}
