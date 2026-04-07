"use client";
import React from "react";
import { MapPin, BellRing, Users, ShieldCheck, Activity, Globe, Building2, Zap, Cpu, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import MedicalDashboard from "@/components/MedicalDashboard";

export default function InstitutionsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen font-sans overflow-x-hidden bg-[#F8F7F3]">
      
      {/* Institutions Hero Section */}
      <section className="bg-gradient-to-br from-[#085041] to-[#1D9E75] pt-32 pb-48 text-white relative hero-diagonal">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <span className="inline-block bg-[#04342C]/40 text-[#9FE1CB] text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full mb-8 border border-white/10 uppercase">
            {t.institutions.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-8 leading-[1.1] max-w-4xl italic">
            {t.institutions.title1} <br /> {t.institutions.title2}
          </h1>
          <p className="text-xl text-[#E1F5EE] leading-relaxed font-light max-w-2xl mb-12">
            {t.institutions.desc}
          </p>
          
          <Link href="/contact" className="bg-white text-[#085041] px-10 py-4 rounded-2xl font-bold hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1">
             {t.institutions.demo_btn}
          </Link>
        </div>
      </section>

      {/* Main Feature / Dashboard Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 mb-32 relative z-20">
        <div className="bg-[#0a0a0b] rounded-[3rem] p-10 lg:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1D9E75]/10 to-transparent pointer-events-none"></div>
           
           <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <div className="lg:w-1/2 space-y-8">
                 <div className="bg-[#E24B4A] text-white text-[10px] font-black px-4 py-1.5 rounded-full inline-block animate-pulse tracking-widest">{t.institutions.alert_badge}</div>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                    {t.institutions.alert_patient}
                 </h2>
                 <p className="text-white/50 text-lg font-light leading-relaxed">
                    {t.institutions.alert_zone}
                 </p>
                 
                 <div className="space-y-4 pt-6">
                    {[
                      { text: t.institutions.feature1, icon: ShieldCheck },
                      { text: t.institutions.feature2, icon: Building2 },
                      { text: t.institutions.feature3, icon: Zap }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-white/70">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#1AEEAF]">
                            <item.icon size={18} />
                         </div>
                         <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="lg:w-1/2 w-full">
                 <MedicalDashboard compact={false} />
              </div>
           </div>
        </div>
      </section>

      {/* Partners / Logos Section */}
      <section className="py-24 bg-white border-y border-[#F1EFE8]">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-[10px] font-black text-[#1D9E75] tracking-[0.5em] uppercase mb-12">{t.institutions.partners_title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center opacity-40 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
               <img src="/logos/who.png" className="h-10 object-contain mx-auto" alt="WHO" />
               <img src="/logos/mtn.png" className="h-10 object-contain mx-auto" alt="MTN" />
               <img src="/logos/orange.png" className="h-10 object-contain mx-auto" alt="Orange" />
               <img src="/logos/airtel.png" className="h-6 object-contain mx-auto" alt="Airtel" />
               <img src="/logos/icrc.png" className="h-12 object-contain mx-auto" alt="ICRC" />
               <img src="/logos/unicef.png" className="h-8 object-contain mx-auto" alt="UNICEF" />
            </div>
            <p className="mt-16 text-[#5F5E5A] font-light text-sm max-w-2xl mx-auto italic">
              {t.institutions.partners_desc}
            </p>
         </div>
      </section>

      {/* Feature Grid - Technical Specs */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {[
          { title: t.institutions.card1_title, desc: t.institutions.card1_desc, icon: BellRing, color: "text-[#EF9F27]" },
          { title: t.institutions.card2_title, desc: t.institutions.card2_desc, icon: MapPin, color: "text-[#1D9E75]" },
          { title: t.institutions.card3_title, desc: t.institutions.card3_desc, icon: Users, color: "text-[#085041]" }
        ].map((item, i) => (
          <div key={i} className="group p-10 rounded-[3rem] bg-white border border-[#F1EFE8] hover:border-[#1D9E75]/20 hover:shadow-2xl transition-all duration-500">
             <div className={`w-16 h-16 rounded-2xl bg-[#F8F7F3] flex items-center justify-center ${item.color} mb-8 group-hover:bg-[#1D9E75] group-hover:text-white transition-all duration-500`}>
                <item.icon size={32} />
             </div>
             <h3 className="text-2xl font-bold text-[#085041] mb-4">{item.title}</h3>
             <p className="text-[#5F5E5A] font-light leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Technical Interop Section */}
      <section className="py-24 bg-[#F8F7F3]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
           <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-serif font-bold text-[#085041]">{t.institutions.interop_title}</h2>
              <p className="text-[#5F5E5A] font-light leading-relaxed">
                 {t.institutions.interop_desc}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-[#F1EFE8] text-[#085041]">HL7 FHIR</span>
                 <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-[#F1EFE8] text-[#085041]">DHIS2 Sync</span>
                 <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-[#F1EFE8] text-[#085041]">OpenMRS Core</span>
              </div>
           </div>
           <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-8 rounded-[2rem] bg-white border border-[#F1EFE8] text-center space-y-4 shadow-sm">
                 <Cpu size={32} className="mx-auto text-[#1D9E75]" />
                 <div className="text-[10px] font-black uppercase tracking-widest text-[#5F5E5A]">{t.institutions.node_inference}</div>
              </div>
              <div className="p-8 rounded-[2rem] bg-white border border-[#F1EFE8] text-center space-y-4 shadow-sm transform translate-y-10">
                 <HeartPulse size={32} className="mx-auto text-[#E24B4A]" />
                 <div className="text-[10px] font-black uppercase tracking-widest text-[#5F5E5A]">{t.institutions.vitals_sync}</div>
              </div>
           </div>
        </div>
      </section>

    </main>
  );
}
