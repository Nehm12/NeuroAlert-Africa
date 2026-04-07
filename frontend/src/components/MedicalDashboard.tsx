"use client";
import { Activity, MapPin, Globe, Bell } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export default function MedicalDashboard({ compact = false }) {
  const { t } = useTranslation();
  const alerts = [
    { id: "PX-204", status: t.dashboard.status_critical, fast: "3/3", time: "12 mins ago", zone: "Zone A" },
    { id: "PX-205", status: t.dashboard.status_stable, fast: "1/3", time: "45 mins ago", zone: "Zone B" },
    { id: "PX-206", status: t.dashboard.status_pending, fast: "0/3", time: "1 hr ago", zone: "Zone C" },
  ];

  return (
    <div className={`w-full bg-[#0a0a0b] rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col ${compact ? 'h-[400px]' : 'h-[500px]'} font-sans translate-z-0`}>
      {/* Top Bar */}
      <div className="h-16 bg-[#111114] border-b border-white/5 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E24B4A] animate-pulse shadow-[0_0_10px_rgba(226,75,74,0.5)]"></div>
          <span className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">{t.dashboard.title}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]"></div>
            <span className="text-[9px] font-bold text-[#1D9E75] uppercase tracking-widest">{t.dashboard.master_node}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
            <Bell size={16} className="text-white/60" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-20 bg-[#0c0c0e] border-r border-white/5 flex flex-col items-center py-8 gap-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1D9E75]/20 flex items-center justify-center text-[#1D9E75] border border-[#1D9E75]/20">
            <Activity size={24} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors cursor-pointer">
            <MapPin size={24} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors cursor-pointer">
            <Globe size={24} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-1">{t.dashboard.queue}</h4>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">{t.dashboard.triage_feed_desc}</p>
            </div>
            <span className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 text-white/60 font-mono border border-white/10 transition-all hover:bg-white/10 cursor-default">ID: 04-LAG-GEN</span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-[#1D9E75]/40 hover:bg-white/[0.08] transition-all cursor-pointer backdrop-blur-sm">
                <div className="flex items-center gap-6">
                  <div className={`w-1.5 h-12 rounded-full ${alert.status === t.dashboard.status_critical ? 'bg-[#E24B4A] shadow-[0_0_15px_rgba(226,75,74,0.3)]' : 'bg-white/10'}`}></div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1 group-hover:text-[#1AEEAF] transition-colors">{alert.id}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest leading-none font-black opacity-60">
                      {alert.zone} • {alert.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="text-[9px] text-white/30 uppercase font-bold mb-1 tracking-widest">{t.dashboard.fast_score}</div>
                    <div className={`text-sm font-mono font-black ${alert.status === t.dashboard.status_critical ? 'text-[#E24B4A]' : 'text-white/60'}`}>{alert.fast}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] border transition-all ${
                    alert.status === t.dashboard.status_critical 
                      ? 'bg-[#E24B4A]/10 border-[#E24B4A]/30 text-[#E24B4A]' 
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {alert.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Dispatch Telemetry */}
          <div className="p-6 rounded-[2rem] bg-gradient-to-r from-[#1D9E75]/10 to-transparent border border-[#1D9E75]/20 flex items-center gap-6 group hover:border-[#1D9E75]/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#1D9E75] flex items-center justify-center text-white shadow-[0_10px_20px_rgba(29,158,117,0.3)] shrink-0 transition-transform group-hover:scale-105">
              <MapPin size={28} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <div className="text-[11px] font-black text-[#1AEEAF] uppercase tracking-widest">{t.dashboard.dispatch}</div>
                <div className="text-[10px] text-[#1AEEAF]/60 font-mono font-bold">{t.dashboard.eta}</div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-[#1D9E75] to-[#1AEEAF] animate-shimmer relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 h-full animate-sweep"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
