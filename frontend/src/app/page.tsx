"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Phone, MapPin, Activity, Globe, HeartPulse, PlayCircle } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="34" fill="currentColor" />
    <path d="M14 36 Q20 24 26 36 Q32 48 38 36 Q44 24 50 36 Q56 48 58 36" stroke="#9FE1CB" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="36" cy="20" r="5" fill="#EF9F27" />
    <path d="M36 25 L36 47" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29 36 L43 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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

          <div className="lg:w-7/12 relative mt-10 lg:mt-0">
            <div className="relative z-10 w-full max-w-sm mx-auto transform rotate-[2deg] shadow-2xl rounded-[3rem] overflow-hidden border-8 border-white bg-[#04342C]">
              <div className="h-4 bg-[#1a1a18] w-40 mx-auto rounded-b-xl mb-2"></div>
              <img
                src="https://placehold.co/400x800/04342C/FFFFFF/png?text=TELEPHONE+USSD"
                alt="Feature phone USSD"
                className="w-full h-auto object-cover opacity-90"
              />
            </div>

            <div className="absolute -top-10 -right-4 bg-white p-4 rounded-xl shadow-xl transform rotate-[10deg] animate-bounce-slow text-[#1a1a18]">
              <div className="text-xs font-bold flex items-center gap-2">
                <span className="text-[#1D9E75]">*789#</span>
                Active USSD
              </div>
            </div>
            <div className="absolute bottom-10 -left-10 bg-white p-4 rounded-xl shadow-xl transform rotate-[-15deg] text-[#1a1a18]">
              <div className="text-xs font-bold flex items-center gap-2">
                <MessageSquare size={16} className="text-[#EF9F27]" />
                SMS Alert Sent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 relative z-10 -mt-20">
        <div className="lg:w-1/3 pt-10">
          <h2 className="font-serif text-3xl font-bold text-[#085041] mb-6">{t.nav.features}</h2>
          <p className="text-[#5F5E5A] leading-relaxed font-light mb-8">
            Nous fournissons une suite d'outils de communication et de diagnostic IA. Notre plateforme permet de construire des expériences d'engagement patient supérieures sans la complexité liée aux opérateurs mobiles.
          </p>
        </div>

        <div className="lg:w-2/3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "USSD Triage", icon: Phone, desc: "Des menus interactifs accessibles sur tous les types de téléphones mobiles." },
            { title: "FAST AI Agent", icon: Activity, desc: "Évaluez les symptômes d'AVC instantanément avec nos modèles Gemini intégrés." },
            { title: "SMS Alerts", icon: MessageSquare, desc: "Communiquez efficacement avec les patients et les équipes d'urgence par SMS." },
            { title: "Multilingual", icon: Globe, desc: "Support automatique du Hausa, Yoruba, Igbo, Français et Anglais." },
            { title: "Institution Data", icon: HeartPulse, desc: "Synchronisation en temps réel des données patients vers les dashboards." },
            { title: "Geo-Mapping", icon: MapPin, desc: "Localisation des clusters d'urgence par triangulation des antennes relais." }
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
      <section className="bg-[#0F6E56] py-20 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-white">
            <h2 className="font-serif text-3xl font-bold mb-8">{t.how_it_works.title}</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white text-[#0F6E56] flex items-center justify-center shadow-lg shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{t.how_it_works.step1_title}</h3>
                  <p className="font-light text-[#E1F5EE] leading-relaxed text-sm">{t.how_it_works.step1_desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white text-[#0F6E56] flex items-center justify-center shadow-lg shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{t.how_it_works.step2_title}</h3>
                  <p className="font-light text-[#E1F5EE] leading-relaxed text-sm">{t.how_it_works.step2_desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white text-[#0F6E56] flex items-center justify-center shadow-lg shrink-0">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{t.how_it_works.step3_title}</h3>
                  <p className="font-light text-[#E1F5EE] leading-relaxed text-sm">{t.how_it_works.step3_desc}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20 bg-[#04342C] flex items-center justify-center transform hover:scale-105 transition-transform duration-500 w-full max-w-md">
              <img src="https://placehold.co/800x600/04342C/FFFFFF/png?text=MEDECIN+HOPITAL" alt="Doctor Reviewing Dashbaord" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Map/Stats Section */}
      <section className="py-24 bg-[#F8F7F3] border-b border-[#e8e6e0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative min-h-[300px] w-full opacity-40">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-2 p-10">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${Math.random() > 0.6 ? 'bg-[#1D9E75]' : Math.random() > 0.8 ? 'bg-[#EF9F27]' : 'bg-transparent'}`}></div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F1EFE8] flex items-center gap-6">
              <div className="w-16 h-16 bg-[#E1F5EE] rounded-full flex items-center justify-center">
                <Activity className="text-[#1D9E75]" size={32} />
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-[#085041]">80+</div>
                <div className="text-[#5F5E5A] font-light">Telco Connections</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F1EFE8] flex items-center gap-6">
              <div className="w-16 h-16 bg-[#E1F5EE] rounded-full flex items-center justify-center">
                <MapPin className="text-[#1D9E75]" size={32} />
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-[#085041]">250,000+</div>
                <div className="text-[#5F5E5A] font-light">Screenings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
