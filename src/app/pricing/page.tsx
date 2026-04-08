"use client";
import React from "react";
import { Check, ShieldCheck, Zap, Building2, Globe, HeartPulse, Activity, Cpu, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export default function PricingPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen font-sans overflow-x-hidden bg-[#F8F7F3]">
      
      {/* Pricing Hero Section */}
      <section className="bg-gradient-to-br from-[#085041] to-[#1D9E75] pt-32 pb-48 text-white relative hero-diagonal">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <span className="inline-block bg-[#04342C]/40 text-[#9FE1CB] text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full mb-8 border border-white/10 uppercase">
            {t.pricing.free_badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-8 leading-[1.1] max-w-4xl">
            {t.pricing.title}
          </h1>
          <p className="text-xl text-[#E1F5EE] leading-relaxed font-light max-w-2xl mb-12">
            {t.pricing.desc}
          </p>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 mb-32 relative z-20">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Public Protocol Tier */}
          <div className="bg-white rounded-[3rem] border border-[#F1EFE8] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(29,158,117,0.05)] transition-all duration-500 relative flex flex-col pt-16">
            <div className="absolute top-0 right-0 bg-[#E1F5EE] text-[#1D9E75] text-[10px] font-black px-8 py-3 rounded-bl-[2rem] rounded-tr-[3rem] tracking-[0.2em] uppercase">CIVILIAN ACCESS</div>
            <div className="mb-8">
               <h3 className="font-serif text-3xl text-[#085041] mb-2">{t.pricing.free_title}</h3>
               <p className="text-[#5F5E5A] font-light italic">{t.pricing.free_subtitle}</p>
            </div>
            <div className="mb-12">
              <span className="text-6xl font-serif font-bold text-[#1a1a18]">$0</span>
            </div>
            
            <ul className="space-y-6 mb-12 flex-1">
              {[
                { text: t.ussd_flow.step1_detail, icon: Phone },
                { text: t.pricing.free_feat1, icon: Cpu },
                { text: t.pricing.free_feat2, icon: Check },
                { text: t.pricing.free_feat3, icon: MapPin },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-5 text-[#5F5E5A] text-sm">
                  <div className="w-6 h-6 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-[#1D9E75]">
                    {item.icon === Check ? <Check size={14} /> : React.createElement(item.icon, { size: 14 })}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-[#1D9E75] text-white py-5 rounded-[1.5rem] font-bold shadow-lg hover:shadow-xl hover:bg-[#11B281] transition-all transform hover:-translate-y-1">
              {t.pricing.btn_free}
            </button>
          </div>

          {/* Institutional Command Center Tier */}
          <div className="bg-[#0a0a0b] rounded-[3rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 text-white relative transform md:-translate-y-10 flex flex-col pt-16 group">
            <div className="absolute top-0 right-0 bg-[#E24B4A] text-white text-[10px] font-black px-8 py-3 rounded-bl-[2rem] rounded-tr-[3rem] tracking-[0.2em] uppercase">VANGUARD GRADE</div>
            <div className="mb-8">
               <h3 className="font-serif text-3xl mb-2">{t.pricing.premium_title}</h3>
               <p className="text-[#9FE1CB] font-light italic">{t.pricing.premium_subtitle}</p>
            </div>
            <div className="mb-12">
              <span className="text-xl font-bold tracking-[0.5em] text-white/40 uppercase">{t.pricing.premium_price}</span>
              <div className="mt-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#E24B4A] animate-pulse"></div>
                 <span className="text-[10px] text-white/50 font-black tracking-widest uppercase">Clinical Command Node</span>
              </div>
            </div>

            <ul className="space-y-6 mb-12 flex-1">
              {[
                { text: t.pricing.premium_feat1, icon: Activity },
                { text: t.pricing.premium_feat2, icon: ShieldCheck },
                { text: t.pricing.premium_feat3, icon: Building2 },
                { text: t.pricing.premium_feat4, icon: Globe },
                { text: t.pricing.premium_feat5, icon: HeartPulse },
                { text: t.pricing.premium_feat6, icon: ShieldCheck },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-5 text-white/60 text-sm group-hover:text-white/80 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[#1AEEAF] border border-white/10 group-hover:border-[#1AEEAF]/40 transition-colors">
                    {React.createElement(item.icon, { size: 14 })}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>

            <Link href="/contact" className="w-full bg-white text-[#085041] py-5 rounded-[1.5rem] font-bold shadow-lg hover:shadow-2xl hover:bg-[#E1F5EE] transition-all transform hover:-translate-y-1 block text-center">
              {t.pricing.btn_premium}
            </Link>
          </div>

        </div>
      </section>

      {/* NGO/Impact Section */}
      <section className="py-24 bg-[#04342C] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center text-white relative z-10">
           <div className="w-16 h-16 rounded-[1.5rem] bg-[#1D9E75]/20 flex items-center justify-center text-[#1AEEAF] mb-8 mx-auto border border-[#1D9E75]/30">
              <Globe size={32} />
           </div>
           <h3 className="font-serif text-2xl md:text-3xl font-bold mb-6">{t.pricing.ong_title}</h3>
           <p className="text-[#9FE1CB] font-light text-base leading-relaxed mb-10">
              {t.pricing.ong_desc}
           </p>
            <Link href="/contact" className="text-[10px] font-black tracking-[0.4em] uppercase border-b border-[#1AEEAF] pb-1 hover:text-[#1AEEAF] transition-colors">{t.footer.contact}</Link>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-[#1D9E75]/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

    </main>
  );
}
