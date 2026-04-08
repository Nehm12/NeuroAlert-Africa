"use client";
import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { Terminal, BookOpen, Code2, Cpu, Globe2, Layers, GitBranch, Zap } from "lucide-react";
import Link from "next/link";

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function DevelopersPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#04342C] text-white selection:bg-[#EF9F27] selection:text-[#04342C]">
      {/* Engineering Hero */}
      <section className="max-w-6xl mx-auto px-6 text-center mb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1D9E75] blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-[#1D9E75] font-bold px-4 py-1.5 rounded-full mb-8 text-[10px] uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3" />
            {t.developers.badge}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight tracking-tight">
            {t.developers.title.split('&')[0]} <span className="text-[#EF9F27]">&</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#9FE1CB]">
              {t.developers.title.split('&')[1]}
            </span>
          </h1>
          <p className="text-xl text-[#9FE1CB] font-light leading-relaxed max-w-2xl mx-auto mb-10">
            {t.developers.desc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="https://github.com/NeuroAlert" 
              className="flex items-center gap-3 bg-white text-[#04342C] px-8 py-4 rounded-xl font-bold hover:bg-[#EF9F27] hover:text-[#04342C] transition-all duration-300 transform hover:-translate-y-1 shadow-xl group"
            >
              <GitHubIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {t.developers.github_btn}
            </Link>
            <button className="flex items-center gap-3 bg-transparent border border-[#1D9E75]/50 text-[#9FE1CB] px-8 py-4 rounded-xl font-bold hover:bg-[#1D9E75]/10 hover:border-[#1D9E75] transition-all duration-300 group">
              <BookOpen className="w-5 h-5 opacity-70 group-hover:opacity-100" />
              {t.developers.doc_btn}
            </button>
          </div>
        </div>
      </section>

      {/* FAST AI Architecture Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Terminal UI */}
          <div className="relative group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#EF9F27] to-[#1D9E75] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#111111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="text-[10px] uppercase font-mono text-white/30 tracking-widest">{t.developers.terminal_header}</div>
              </div>
              <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto h-96">
                <div className="flex gap-4 mb-2">
                  <span className="text-[#EF9F27]">$</span>
                  <span className="text-white">fast-ai init --mesh-id <span className="text-[#1D9E75]">"AF-WEST-01"</span></span>
                </div>
                <div className="text-white/40 mb-6">[INFO] Initializing High-Precision Triage Bridge...</div>
                
                <div className="space-y-1 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[#1D9E75]">✓</span>
                    <span className="text-white/80">Connecting to Regional GSM Node... <span className="text-[#1D9E75]">SECURE</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1D9E75]">✓</span>
                    <span className="text-white/80">Loading Multi-Dialectal NLP Engine (Yoruba, Igbo, Hausa)...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1D9E75]">✓</span>
                    <span className="text-white/80">System Check: Gemini Pro Inference Proxy... <span className="text-[#1D9E75]">READY</span></span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded border border-white/10 mb-6">
                  <div className="text-[10px] text-white/30 mb-2 uppercase tracking-widest">Stack Core</div>
                  <div className="text-[#EF9F27]">{t.developers.stack_title}</div>
                  <div className="text-white/60 text-xs mt-1">{t.developers.stack_desc}</div>
                </div>

                <div className="flex gap-4">
                  <span className="text-[#EF9F27]">$</span>
                  <span className="text-white animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Details */}
          <div className="pt-8">
            <h2 className="font-serif text-4xl mb-8">{t.developers.fast_ai_title}</h2>
            <p className="text-[#9FE1CB] text-lg mb-12 font-light leading-relaxed">
              {t.developers.fast_ai_desc}
            </p>
            
            <div className="space-y-10">
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center text-[#1D9E75] group-hover:bg-[#1D9E75] group-hover:text-white transition-all">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{t.developers.sdk_title}</h4>
                  <p className="text-white/60 font-light text-sm italic">{t.developers.sdk_desc}</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EF9F27]/20 border border-[#EF9F27]/40 flex items-center justify-center text-[#EF9F27] group-hover:bg-[#EF9F27] group-hover:text-[#04342C] transition-all">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{t.developers.api_ref_title}</h4>
                  <p className="text-white/60 font-light text-sm italic">{t.developers.api_ref_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution & Open Source Section */}
      <section className="bg-white/5 border-y border-white/10 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl mb-6">{t.developers.contribute_title}</h2>
            <p className="text-[#9FE1CB] max-w-2xl mx-auto font-light">
              {t.developers.contribute_desc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#04342C] border border-white/10 rounded-2xl hover:border-[#1D9E75] transition-all group">
              <GitBranch className="w-8 h-8 text-[#1D9E75] mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-4">Core Engine</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Optimize the USSD-to-LLM bridge and reduce diagnostic latency for high-traffic regional clusters.
              </p>
            </div>
            <div className="p-8 bg-[#04342C] border border-white/10 rounded-2xl hover:border-[#EF9F27] transition-all group">
              <Code2 className="w-8 h-8 text-[#EF9F27] mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-4">Local NLP Models</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Help tune neuro-clinical detection models for local dialects and specialized medical terminologies.
              </p>
            </div>
            <div className="p-8 bg-[#04342C] border border-white/10 rounded-2xl hover:border-[#1D9E75] transition-all group">
              <Layers className="w-8 h-8 text-[#1D9E75] mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-4">HIS Integration</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Expand our library of hospital management system connectors (DHIS2, OpenMRS, and custom ERPs).
              </p>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center">
            <Link 
              href="https://github.com/NeuroAlert"
              className="px-10 py-5 bg-[#EF9F27] text-[#04342C] font-bold rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Contributing on GitHub
            </Link>
            <p className="mt-6 text-white/30 text-xs tracking-widest uppercase">MIT License • Built for Humanity</p>
          </div>
        </div>
      </section>
    </main>
  );
}
