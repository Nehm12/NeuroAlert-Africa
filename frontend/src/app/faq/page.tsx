"use client";
import React, { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { ChevronDown, Plus, Minus, HelpCircle } from "lucide-react";

export default function FaqPage() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Ouvrir la première question par défaut

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
    { q: t.faq.q7, a: t.faq.a7 },
    { q: t.faq.q8, a: t.faq.a8 },
    { q: t.faq.q9, a: t.faq.a9 },
    { q: t.faq.q10, a: t.faq.a10 },
    { q: t.faq.q11, a: t.faq.a11 },
    { q: t.faq.q12, a: t.faq.a12 }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#04342C] text-white selection:bg-[#EF9F27] selection:text-[#04342C]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-[#1D9E75] blur-[160px] opacity-10 pointer-events-none"></div>

      <section className="max-w-4xl mx-auto px-6 mb-24 text-center relative">
        <span className="inline-flex items-center gap-2 bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-[#9FE1CB] font-bold px-4 py-1.5 rounded-full mb-8 text-[10px] uppercase tracking-[0.2em] animate-pulse">
          <HelpCircle className="w-3 h-3 text-[#EF9F27]" />
          Knowledge Base
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-6 leading-tight">
          {t.faq.title}
        </h1>
        <p className="text-xl text-[#9FE1CB] font-light leading-relaxed max-w-2xl mx-auto">
          {t.faq.desc}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20 relative">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`group border rounded-3xl transition-all duration-500 overflow-hidden ${
                openIndex === i 
                  ? "bg-white/5 border-[#1D9E75] shadow-[0_0_40px_-15px_rgba(29,158,117,0.3)]" 
                  : "bg-transparent border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full px-8 py-7 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-6">
                  <span className={`font-serif text-2xl transition-colors duration-300 ${openIndex === i ? "text-[#EF9F27]" : "text-white/20"}`}>
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className={`font-bold text-lg md:text-xl transition-colors duration-300 ${openIndex === i ? "text-[#1D9E75]" : "text-white"}`}>
                    {faq.q}
                  </h3>
                </div>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === i ? "bg-[#EF9F27] rotate-180" : "bg-white/5"
                }`}>
                  {openIndex === i ? (
                    <Minus className="w-5 h-5 text-[#04342C]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#9FE1CB]" />
                  )}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out px-8 ${
                  openIndex === i ? "max-h-[500px] py-8 border-t border-white/5" : "max-h-0 py-0"
                } overflow-hidden`}
              >
                <div className="pl-14 relative">
                  {/* Decorative line */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1D9E75] to-transparent rounded-full opacity-50"></div>
                  <p className="text-[#9FE1CB] text-lg leading-[1.8] font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-[#085041] to-[#04342C] border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">{t.faq.support_title}</h2>
          <p className="text-[#9FE1CB] font-light mb-8 max-w-md mx-auto">
            {t.faq.support_desc}
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-[#1D9E75] text-[#E1F5EE] px-10 py-5 rounded-2xl font-bold hover:bg-[#EF9F27] hover:text-[#04342C] transition-all transform hover:-translate-y-1 shadow-xl"
          >
            {t.faq.support_cta}
          </a>
        </div>
      </section>
    </main>
  );
}
