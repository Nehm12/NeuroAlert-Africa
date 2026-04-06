"use client";
import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export default function PricingPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-white">
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <h1 className="font-serif text-5xl text-[#085041] mb-6">{t.pricing.title}</h1>
        <p className="text-lg text-[#5F5E5A] font-light leading-relaxed">
          {t.pricing.desc}
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="bg-[#F8F7F3] rounded-[2rem] border-2 border-[#E1F5EE] p-10 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="absolute top-0 right-0 bg-[#1D9E75] text-white text-xs font-bold px-5 py-2 rounded-bl-2xl rounded-tr-[1.8rem] text-center uppercase tracking-widest">{t.pricing.free_badge}</div>
          <h3 className="font-serif text-3xl text-[#085041] mb-3">{t.pricing.free_title}</h3>
          <div className="text-[#5F5E5A] mb-8 font-light">{t.pricing.free_subtitle}</div>
          <div className="font-serif text-6xl text-[#1a1a18] mb-10">0 FCFA</div>
          <ul className="space-y-5 mb-10">
            <li className="flex items-center gap-4 text-[#5F5E5A]"><Check className="text-[#1D9E75]" size={24} /> {t.how_it_works.step1_title}</li>
            <li className="flex items-center gap-4 text-[#5F5E5A]"><Check className="text-[#1D9E75]" size={24} /> {t.how_it_works.step2_title}</li>
            <li className="flex items-center gap-4 text-[#5F5E5A]"><Check className="text-[#1D9E75]" size={24} /> Envoi SMS d'urgence 100% gratuit</li>
            <li className="flex items-center gap-4 text-[#5F5E5A]"><Check className="text-[#1D9E75]" size={24} /> Recommandation GPS des hôpitaux</li>
          </ul>
          <button className="w-full bg-white border border-[#E1F5EE] text-[#085041] py-4 rounded-xl font-bold hover:bg-[#E1F5EE] transition-colors">
            {t.pricing.btn_free}
          </button>
        </div>
        
        {/* Premium Plan */}
        <div className="bg-[#04342C] rounded-[2rem] p-10 shadow-2xl text-white transform md:-translate-y-6">
          <h3 className="font-serif text-3xl mb-3 text-white">{t.pricing.premium_title}</h3>
          <div className="text-[#9FE1CB] mb-8 font-light">{t.pricing.premium_subtitle}</div>
          <div className="font-serif text-6xl mb-10">{t.pricing.premium_price}</div>
          <ul className="space-y-5 mb-10">
            <li className="flex items-center gap-4 text-[#E1F5EE]"><Check className="text-[#9FE1CB]" size={24} /> {t.institutions.card1_title}</li>
            <li className="flex items-center gap-4 text-[#E1F5EE]"><Check className="text-[#9FE1CB]" size={24} /> {t.institutions.card2_title}</li>
            <li className="flex items-center gap-4 text-[#E1F5EE]"><Check className="text-[#9FE1CB]" size={24} /> Communication et envoi SMS ciblés</li>
            <li className="flex items-center gap-4 text-[#E1F5EE]"><Check className="text-[#9FE1CB]" size={24} /> Accès à l'API Data & Intelligence</li>
            <li className="flex items-center gap-4 text-[#E1F5EE]"><Check className="text-[#9FE1CB]" size={24} /> Formation du personnel soignant</li>
          </ul>
          <button className="w-full bg-[#1D9E75] text-white py-4 rounded-xl font-bold hover:bg-[#EF9F27] transition-colors shadow-lg">
            {t.pricing.btn_premium}
          </button>
        </div>
      </section>
      
      <section className="max-w-3xl mx-auto px-6 mt-24 text-center">
        <h3 className="font-serif text-2xl text-[#085041] mb-4">{t.pricing.ong_title}</h3>
        <p className="text-[#5F5E5A] font-light">
          {t.pricing.ong_desc}
        </p>
      </section>
    </main>
  );
}
