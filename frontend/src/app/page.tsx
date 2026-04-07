"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Phone, MapPin, Activity, Globe, HeartPulse, PlayCircle, Clock, Zap, Bell, User, ChevronRight, Users, Building2, Cpu } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import MedicalDashboard from "@/components/MedicalDashboard";
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="34" fill="currentColor" />
    <path d="M14 36 Q20 24 26 36 Q32 48 38 36 Q44 24 50 36 Q56 48 58 36" stroke="#9FE1CB" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="36" cy="20" r="5" fill="#EF9F27" />
    <path d="M36 25 L36 47" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29 36 L43 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const USSDProcessFlow = () => {
  const { t } = useTranslation();
  const steps = [
    { id: 1, title: t.ussd_flow.step1, detail: t.ussd_flow.step1_detail, icon: Phone, color: "text-[#9FE1CB]" },
    { id: 2, title: t.ussd_flow.step2, detail: t.ussd_flow.step2_detail, icon: User, color: "text-[#EF9F27]" },
    { id: 3, title: t.ussd_flow.step3, detail: t.ussd_flow.step3_detail, icon: Activity, color: "text-[#EF9F27]" },
    { id: 4, title: t.ussd_flow.step4, detail: t.ussd_flow.step4_detail, icon: MessageSquare, color: "text-[#EF9F27]" },
    { id: 5, title: t.ussd_flow.step5, detail: t.ussd_flow.step5_detail, icon: Clock, color: "text-[#E24B4A]" },
    { id: 6, title: t.ussd_flow.step6, detail: t.ussd_flow.step6_detail, icon: Zap, color: "text-[#9FE1CB]" },
    { id: 7, title: t.ussd_flow.step7, detail: t.ussd_flow.step7_detail, icon: Bell, color: "text-white" },
  ];

  return (
    <div className="relative group perspective-1000 py-10">
      <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-4xl mx-auto p-10 rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform transition-all duration-700 hover:rotate-x-2 md:hover:rotate-y-2">
        
        {/* Phone Mockup with 3D Effect */}
        <div className="relative shrink-0 w-56 h-[460px] bg-[#0c0c0c] rounded-[3rem] border-[8px] border-[#1a1a18] shadow-[20px_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center pt-8 overflow-hidden transform md:-rotate-y-12">
          {/* Internal Screen Glow */}
          <div className="absolute inset-0 bg-[#1D9E75]/5 z-0"></div>
          {/* Top Notch */}
          <div className="absolute top-0 w-28 h-6 bg-[#1a1a18] rounded-b-3xl z-30">
            <div className="w-8 h-1 bg-white/10 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="mt-16 text-center px-6 space-y-6 relative z-10 w-full">
            <div className="flex justify-between items-center px-4 mb-4">
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">MTN Mobile</div>
              <div className="flex gap-1">
                <div className="w-1 h-2 bg-white/60 rounded-full"></div>
                <div className="w-1 h-3 bg-white/60 rounded-full"></div>
                <div className="w-1 h-4 bg-[#9FE1CB] rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shadow-inner">
              <div className="text-[9px] text-[#9FE1CB] font-mono tracking-widest uppercase mb-1">USSD Dialog</div>
              <div className="text-3xl font-bold text-white font-mono drop-shadow-[0_0_8px_rgba(159,225,203,0.5)]">*789#</div>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="text-[11px] font-bold text-white leading-tight">NeuroAlert Africa</div>
              <div className="text-[10px] text-[#9FE1CB] leading-relaxed">
                Stroke Assessment Mode<br/>
                System is monitoring...
              </div>
            </div>
            
            <div className="flex gap-2 pt-6">
              <div className="flex-1 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold border border-white/5">Cancel</div>
              <div className="flex-1 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center text-[10px] font-bold shadow-lg">Send</div>
            </div>
          </div>
          
          {/* Glass Reflection */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent z-20 pointer-events-none"></div>
          
          {/* Bottom Button */}
          <div className="absolute bottom-6 w-12 h-1 bg-white/10 rounded-full"></div>
        </div>

        {/* Steps Flow with Premium Styling */}
        <div className="flex-1 w-full space-y-3 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative group/item">
              <div className={`flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:translate-x-3 shadow-xl ${step.id === 7 ? 'bg-gradient-to-r from-[#1D9E75]/30 to-transparent border-[#1D9E75]/40 text-white' : ''}`}>
                <div className={`shrink-0 w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shadow-2xl transition-transform group-hover/item:rotate-12 ${step.color}`}>
                  <step.icon size={24} className="drop-shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-0.5 tracking-tight">{step.title}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{step.detail}</div>
                </div>
                <div className="shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <ChevronRight size={16} className="text-[#9FE1CB]" />
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="absolute -bottom-3.5 left-10 w-0.5 h-4 bg-gradient-to-b from-[#1D9E75]/50 to-transparent z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Glow Decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#1D9E75]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
};

const WorldHeatmap = () => {
  // Clinical Burden Proportions (Simplified data map)
  const regions = [
    { name: "Africa", x: 45, y: 30, w: 20, h: 35, intensity: 1.0, label: "CRITICAL: 316/100k" },
    { name: "SE Asia", x: 65, y: 35, w: 20, h: 20, intensity: 0.6, label: "MONITORED: 210/100k" },
    { name: "Europe", x: 45, y: 15, w: 15, h: 15, intensity: 0.3, label: "STABLE: 150/100k" },
    { name: "Americas", x: 10, y: 15, w: 30, h: 60, intensity: 0.4, label: "STABLE: 180/100k" },
    { name: "Oceania", x: 75, y: 60, w: 15, h: 15, intensity: 0.2, label: "STABLE: 120/100k" },
  ];

  return (
    <div className="relative w-full aspect-[2/1] flex items-center justify-center p-4 group select-none">
      {/* The "Segmented" Map Backdrop */}
      <svg viewBox="0 0 100 50" className="w-full h-full opacity-80 transition-all duration-1000">
        <defs>
          <pattern id="grid" width="1.5" height="1.5" patternUnits="userSpaceOnUse">
            <rect width="1.2" height="1.2" rx="0.3" fill="currentColor" fillOpacity="0.2" className="text-white/20" />
          </pattern>
          {/* Mask for the world landmasses */}
          <mask id="worldMask">
            <path d="M15,10 C10,12 8,20 12,30 L25,35 L40,30 L38,15 Z" fill="white" /> {/* N America */}
            <path d="M35,35 L45,40 L40,55 L30,50 Z" fill="white" /> {/* S America */}
            <path d="M45,10 L55,8 L58,18 L48,22 Z" fill="white" /> {/* Europe */}
            <path d="M48,20 L58,25 L65,40 L62,50 L50,55 L42,45 L42,30 Z" fill="white" /> {/* Africa */}
            <path d="M58,10 L85,15 L95,40 L70,45 L60,30 Z" fill="white" /> {/* Asia */}
            <path d="M80,45 L95,50 L90,65 L78,60 Z" fill="white" /> {/* Oceania */}
          </mask>
        </defs>

        {/* Base Grid Layer (The "Segments") */}
        <rect width="100" height="50" fill="url(#grid)" mask="url(#worldMask)" className="text-white/30" />

        {/* Proportion Overlays (Heatmap Segments) */}
        {regions.map((region, i) => (
          <rect
            key={i}
            x={region.x}
            y={region.y}
            width={region.w}
            height={region.h}
            fill="url(#grid)"
            mask="url(#worldMask)"
            className={`${region.name === 'Africa' ? 'text-[#1D9E75]' : 'text-[#EF9F27]'} transition-all duration-700`}
            style={{ opacity: region.intensity }}
          />
        ))}
      </svg>

      {/* Pulsing Hotspots (Proportion Labels) */}
      {regions.map((region, i) => (
        <div 
          key={i} 
          className="absolute group/spot cursor-help transition-transform hover:scale-110" 
          style={{ top: `${region.y + region.h/2}%`, left: `${region.x + region.w/2}%` }}
        >
          <div className={`w-3 h-3 rounded-full ${region.name === 'Africa' ? 'bg-[#1D9E75]' : 'bg-[#EF9F27]'} shadow-xl ${region.intensity > 0.5 ? 'animate-ping' : ''} opacity-60`}></div>
          <div className={`absolute top-0 left-0 w-3 h-3 rounded-full ${region.name === 'Africa' ? 'bg-[#1D9E75]' : 'bg-[#EF9F27]'} shadow-2xl`}></div>
          
          {/* Detailed Data Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-[#0a0a0b]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl opacity-0 group-hover/spot:opacity-100 transition-all scale-90 group-hover/spot:scale-100 whitespace-nowrap z-50">
            <div className="text-[#1AEEAF] text-[10px] font-black tracking-widest uppercase mb-1">{region.name}</div>
            <div className="text-sm font-mono font-bold text-white mb-2">{region.label}</div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#1D9E75]" style={{ width: `${region.intensity * 100}%` }}></div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#1D9E75]/5 rounded-full blur-[100px] -z-10 opacity-40"></div>
    </div>
  );
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen font-sans overflow-x-hidden bg-[#F8F7F3]">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#085041] to-[#1D9E75] hero-diagonal pb-40 text-white relative pt-24">
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 pt-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-5/12 space-y-8">
            <span className="inline-block bg-[#04342C]/40 text-[#9FE1CB] text-xs font-semibold px-4 py-1.5 rounded-full">
              {t.hero.badge}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] font-serif whitespace-pre-line">
              {t.hero.title}
            </h1>
            <p className="text-lg text-[#E1F5EE] leading-relaxed font-light">
              {t.hero.subtitle}
            </p>
            <button className="bg-white text-[#085041] px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-lg transition-transform hover:-translate-y-0.5">
              {t.hero.cta}
            </button>
          </div>

          <div className="lg:w-7/12 relative mt-10 lg:mt-0 flex justify-center">
            <USSDProcessFlow />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 relative z-10 -mt-20">
        <div className="lg:w-1/3 pt-10">
          <h2 className="font-serif text-3xl font-bold text-[#085041] mb-6">{t.home_features.title}</h2>
          <p className="text-[#5F5E5A] leading-relaxed font-light mb-8">
            {t.home_features.desc}
          </p>
        </div>

        <div className="lg:w-2/3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: t.home_features.card1_title, icon: Cpu, desc: t.home_features.card1_desc },
            { title: t.home_features.card2_title, icon: MapPin, desc: t.home_features.card2_desc },
            { title: t.home_features.card3_title, icon: MessageSquare, desc: t.home_features.card3_desc },
            { title: t.home_features.card4_title, icon: Building2, desc: t.home_features.card4_desc },
            { title: t.home_features.card5_title, icon: Globe, desc: t.home_features.card5_desc },
            { title: t.home_features.card6_title, icon: Activity, desc: t.home_features.card6_desc }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F1EFE8] hover:shadow-md transition-all group">
              <div className="h-24 w-20 bg-[#E1F5EE] rounded-xl mb-6 mx-auto relative flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <item.icon size={32} className="text-[#1D9E75]" />
                <div className="absolute -top-2 -right-2 bg-[#E24B4A] rounded-full w-2 h-2"></div>
                <div className="absolute -bottom-2 -left-2 bg-[#EF9F27] rounded-full w-2 h-2"></div>
              </div>
              <h3 className="font-bold text-[#1a1a18] mb-2">{item.title}</h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed mb-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* How It Works Section */}
      <section className="bg-[#042823] py-32 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="lg:w-5/12 text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1D9E75]/20 text-[#1AEEAF] text-xs font-black tracking-widest uppercase mb-6 border border-[#1D9E75]/30">
              System Flow
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-10 leading-tight">
              {t.how_it_works.title}
            </h2>
            
            <div className="relative">
              {/* Vertical Connector Line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-[#1D9E75] via-[#1D9E75]/20 to-transparent"></div>
              
              <div className="space-y-12">
                {[
                  { title: t.how_it_works.step1_title, desc: t.how_it_works.step1_desc, icon: Phone },
                  { title: t.how_it_works.step2_title, desc: t.how_it_works.step2_desc, icon: Activity },
                  { title: t.how_it_works.step3_title, desc: t.how_it_works.step3_desc, icon: HeartPulse }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#083d34] border border-white/10 text-[#1AEEAF] flex items-center justify-center shadow-2xl group-hover:bg-[#1D9E75] group-hover:text-white transition-all duration-500">
                      <item.icon size={24} />
                      <div className="absolute -inset-2 bg-[#1D9E75]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-xl mb-2 text-white group-hover:text-[#1AEEAF] transition-colors">{item.title}</h3>
                      <p className="font-light text-white/60 leading-relaxed text-base max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:w-7/12 flex flex-col items-center relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#1D9E75]/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#EF9F27]/5 rounded-full blur-[100px]"></div>
            
            <div className="relative transform hover:-translate-y-2 transition-transform duration-700">
              <MedicalDashboard compact={true} />
              
              {/* Floating Status Badge - Enhanced Telemetry */}
              <div className="absolute -bottom-8 -right-8 bg-[#0a0a0b] p-6 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 flex items-center gap-5 transform rotate-3 animate-float hidden md:flex backdrop-blur-3xl z-40">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1D9E75]/20 to-[#1D9E75]/5 flex items-center justify-center text-[#1D9E75] border border-[#1D9E75]/30">
                  <Activity size={28} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#1AEEAF] rounded-full border-2 border-[#0a0a0b] animate-pulse"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Network Uptime</div>
                    <div className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#1D9E75]/20 text-[#1AEEAF] font-bold">99.9%</div>
                  </div>
                  <div className="text-xl font-bold text-white flex items-center gap-2 leading-none">
                    45ms <span className="text-[10px] text-white/30 font-light tracking-normal">Latency Avg</span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#1D9E75] animate-progress"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Grade Security • AES-256 Encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Stats Section - WHO CLINICAL DATA */}
      <section className="py-32 bg-[#080808] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-24">
          
          {/* Stylized Visual Representation */}
          <div className="lg:w-1/2 w-full">
            <WorldHeatmap />
          </div>

          {/* Clinical Statistics based on WHO/OMS Data */}
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-[#1AEEAF] uppercase border-l-2 border-[#1AEEAF] pl-4">Clinical Burden in Africa</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">Quantifying the stroke <span className="text-white/40">health crisis.</span></h2>
              <p className="text-white/50 font-light leading-relaxed max-w-xl">
                Stroke is the second leading cause of death on the continent. Through universal USSD access, we address the critical gap between awareness and specialist care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Annual Incidence", value: "316", unit: "per 100k", desc: "Estimated incidence in Sub-Saharan Africa (SSA).", icon: Activity },
                { label: "Global Death Toll", value: "87%", unit: "Mortality", desc: "Deaths occurring in low & middle-income countries.", icon: Globe },
                { label: "Specialist Gap", value: "3", unit: "/ 10M pop.", desc: "Neurologists available in critical regions.", icon: User },
                { label: "Golden Hour", value: "60", unit: "seconds", desc: "Triage window required to maximize recovery.", icon: Clock },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 hover:border-[#1D9E75]/30 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] group-hover:bg-[#1D9E75] group-hover:text-white transition-all">
                      <stat.icon size={20} />
                    </div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">{stat.label}</div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-4xl font-serif font-bold text-white">{stat.value}</div>
                    <div className="text-xs font-bold text-[#1AEEAF] uppercase tracking-wider">{stat.unit}</div>
                  </div>
                  <p className="text-[10px] text-white/30 leading-relaxed font-light">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center gap-6">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] shrink-0">Official Source</div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/60 font-black">WHO / OMS</span>
                <span className="text-[10px] text-white/20">•</span>
                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/60 font-black">WORLD STROKE ORGANIZATION</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* Artistic background blur */}
        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-[#1D9E75]/10 blur-[150px] -z-10 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </section>

      {/* Impact & Results Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-[#1D9E75] uppercase bg-[#E1F5EE] px-4 py-1.5 rounded-full inline-block">
              {t.impact.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#085041] leading-tight">
              {t.impact.title} <br />
              <span className="text-[#1D9E75]">{t.impact.subtitle}</span>
            </h2>
            <p className="text-[#5F5E5A] font-light leading-relaxed text-lg">
              {t.impact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: t.impact.screenings, value: "250,000+", desc: t.impact.screenings_desc, icon: Users },
              { label: t.impact.triage, value: "85%", desc: t.impact.triage_desc, icon: Zap },
              { label: t.impact.partners, value: "1,200+", desc: t.impact.partners_desc, icon: Building2 },
              { label: t.impact.reach, value: "40+", desc: t.impact.reach_desc, icon: Globe },
            ].map((impact, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#F8F7F3] border border-[#F1EFE8] hover:border-[#1D9E75]/30 hover:shadow-[0_20px_50px_rgba(29,158,117,0.1)] transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1D9E75] mb-8 group-hover:scale-110 group-hover:bg-[#1D9E75] group-hover:text-white transition-all duration-500">
                  <impact.icon size={28} />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-serif font-bold text-[#085041] group-hover:text-[#1D9E75] transition-colors">{impact.value}</div>
                  <div className="text-[10px] font-black tracking-widest text-[#1D9E75] uppercase">{impact.label}</div>
                  <p className="text-sm text-[#5F5E5A] font-light leading-relaxed pt-2">
                    {impact.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Note */}
          <div className="mt-20 pt-12 border-t border-[#F1EFE8] flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div>
              <span className="text-xs font-bold text-[#085041] uppercase tracking-widest">{t.impact.validated}</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] font-bold text-[#5F5E5A] uppercase tracking-[0.2em]">{t.impact.note}</p>
            </div>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#E1F5EE] rounded-full blur-[120px] -z-10 opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#1D9E75]/10 rounded-full blur-[120px] -z-10 opacity-40"></div>
      </section>

    </main>
  );
}
