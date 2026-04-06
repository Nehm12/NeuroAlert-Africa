"use client";
import React from "react";
import { useTranslation } from "@/context/LanguageContext";

export default function FaqPage() {
  const { t } = useTranslation();

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 }
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#F8F7F3]">
      <section className="max-w-3xl mx-auto px-6 mb-16 text-center">
        <h1 className="font-serif text-5xl text-[#085041] mb-6">{t.faq.title}</h1>
        <p className="text-lg text-[#5F5E5A] font-light leading-relaxed">
          {t.faq.desc}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E1F5EE]">
              <h3 className="font-bold text-[#1a1a18] text-xl mb-3 flex gap-4">
                <span className="text-[#1D9E75] font-serif">Q.</span>
                {faq.q}
              </h3>
              <p className="text-[#5F5E5A] text-sm leading-relaxed pl-10 font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
