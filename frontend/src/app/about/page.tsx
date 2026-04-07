"use client";
import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import Image from "next/image";
import { Globe, ShieldCheck, Zap, Activity, Users, Target, HeartPulse, GraduationCap, Building2 } from "lucide-react";

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TeamCard = ({ name, role, img, linkedIn = "#", variant = "default" }: { name: string, role: string, img: string, linkedIn?: string, variant?: "large" | "default" | "small" }) => (
  <div className={`group relative bg-white rounded-[2rem] border border-black/5 p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 overflow-hidden ${variant === 'large' ? 'md:p-10' : ''}`}>
    {/* Decorative Bio-Metric background element */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1D9E75]/5 rounded-full blur-3xl group-hover:bg-[#EF9F27]/10 transition-colors"></div>
    
    <div className="relative z-10">
      <div className={`relative mb-6 rounded-2xl overflow-hidden shadow-lg aspect-square bg-gradient-to-br from-[#085041]/10 to-[#1D9E75]/10 ${variant === 'large' ? 'w-full max-w-[240px] mx-auto' : 'w-24 h-24'}`}>
        <Image 
          src={img} 
          alt={name}
          width={400}
          height={400}
          className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
        />
        {/* Fallback Initial if no image is found (handled by next/image or styling) */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-serif text-[#085041]/20 -z-10 bg-white">
          {name.charAt(0)}
        </div>
      </div>
      
      <div className={variant === 'large' ? 'text-center mt-6' : ''}>
        <h3 className={`font-bold text-[#085041] leading-tight mb-2 ${variant === 'large' ? 'text-3xl' : 'text-xl'}`}>{name}</h3>
        <p className="text-[#5F5E5A] text-sm font-light mb-6 leading-relaxed uppercase tracking-wider">{role}</p>
        
        <a 
          href={linkedIn} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#085041]/60 hover:text-[#EF9F27] transition-colors group/link"
        >
          <LinkedInIcon className="w-5 h-5 opacity-40 group-hover/link:opacity-100 transition-opacity" />
          <span className="text-xs font-bold uppercase tracking-widest">Connect</span>
        </a>
      </div>
    </div>
  </div>
);

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen font-sans bg-[#FBFBFA] overflow-hidden">
      
      {/* About Hero Section */}
      <section className="bg-gradient-to-br from-[#085041] to-[#04342C] pt-32 pb-48 text-white relative">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1D9E75] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <span className="inline-block bg-[#04342C]/40 text-[#9FE1CB] text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full mb-8 border border-white/10 uppercase">
            {t.about.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-8 leading-[1.1] max-w-4xl italic">
            {t.about.title}
          </h1>
          <p className="text-lg md:text-xl text-[#9FE1CB] font-light max-w-2xl leading-relaxed opacity-80">
            {t.about.desc}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-32">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.05)] border border-black/5 hover:border-[#1D9E75]/30 transition-all group">
            <div className="w-16 h-16 bg-[#F0FAF7] text-[#1D9E75] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#085041] mb-6 font-serif">{t.about.mission_title}</h2>
            <p className="text-[#5F5E5A] text-base font-light leading-relaxed">
              {t.about.mission_p1}
            </p>
          </div>
          
          <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.05)] border border-black/5 hover:border-[#EF9F27]/30 transition-all group">
            <div className="w-16 h-16 bg-[#FFF9F2] text-[#EF9F27] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#085041] mb-6 font-serif">{t.about.vision_title}</h2>
            <p className="text-[#5F5E5A] text-base font-light leading-relaxed">
              {t.about.vision_p1}
            </p>
          </div>
        </div>
      </section>

      {/* Co-Founders Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#085041] font-serif italic mb-4">{t.team.founders_title}</h2>
          <div className="w-24 h-1.5 bg-[#EF9F27] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <TeamCard name={t.team.founder1_name} role={t.team.founder1_role} img="/team/founders/founder1.png" variant="large" />
          <TeamCard name={t.team.founder2_name} role={t.team.founder2_role} img="/team/founders/founder2.png" variant="large" />
        </div>
      </section>

      {/* Team Builders Section */}
      <section className="bg-[#085041] py-32 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1D9E75]/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 italic">{t.team.builders_title}</h2>
            <p className="text-[#9FE1CB] font-light max-w-xl text-base">{t.home_features.desc}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamCard name={t.team.builder1_name} role={t.team.builder1_role} img="/team/builders/builder1.png" />
            <TeamCard name={t.team.builder2_name} role={t.team.builder2_role} img="/team/builders/builder2.png" />
            <TeamCard name={t.team.builder3_name} role={t.team.builder3_role} img="/team/builders/builder3.png" />
            <TeamCard name={t.team.builder4_name} role={t.team.builder4_role} img="/team/builders/builder4.png" />
          </div>
        </div>
      </section>

      {/* Experts & Mentors Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-20">
          
          {/* Clinical Experts */}
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-[#E1F5EE] text-[#1D9E75] rounded-xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#085041] font-serif italic">{t.team.experts_title}</h2>
            </div>
            <div className="grid gap-6">
              <TeamCard name={t.team.expert1_name} role={t.team.expert1_role} img="/team/experts/expert1.png" variant="small" />
              <TeamCard name={t.team.expert2_name} role={t.team.expert2_role} img="/team/experts/expert2.png" variant="small" />
            </div>
          </div>

          {/* Mentors */}
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-[#FFF9F2] text-[#EF9F27] rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#085041] font-serif italic">{t.team.mentors_title}</h2>
            </div>
            <div className="grid gap-6">
              <TeamCard name={t.team.mentor1_name} role={t.team.mentor1_role} img="/team/mentors/mentor1.png" variant="small" />
              <TeamCard name={t.team.mentor2_name} role={t.team.mentor2_role} img="/team/mentors/mentor2.png" variant="small" />
            </div>
          </div>

        </div>
      </section>

      {/* Call to Collaboration CTA */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <div className="bg-[#04342C] p-16 rounded-[4rem] text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Building2 className="w-16 h-16 text-[#EF9F27] mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-6 font-serif">{t.contact.title}</h2>
          <p className="text-[#9FE1CB] text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-3 bg-[#EF9F27] text-[#04342C] px-12 py-6 rounded-3xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(239,159,39,0.3)]"
          >
            {t.contact.form_submit}
          </a>
        </div>
      </section>

    </main>
  );
}
