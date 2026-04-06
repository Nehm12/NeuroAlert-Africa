"use client";
import { Phone, Activity, Globe } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export default function ProductPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#F8F7F3]">
      <section className="max-w-4xl mx-auto px-6 text-center mb-16">
        <span className="inline-block bg-[#E1F5EE] text-[#1D9E75] font-bold px-4 py-1.5 rounded-full mb-6 text-xs uppercase tracking-wider">{t.product.badge}</span>
        <h1 className="font-serif text-5xl text-[#085041] mb-6">{t.product.title}</h1>
        <p className="text-lg text-[#5F5E5A] font-light leading-relaxed">
          {t.product.desc}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E1F5EE]">
          <div className="w-16 h-16 bg-[#04342C] text-white rounded-2xl flex items-center justify-center mb-6">
            <Phone size={32} />
          </div>
          <h3 className="font-bold text-[#1a1a18] text-xl mb-3">{t.product.card1_title}</h3>
          <p className="text-[#5F5E5A] text-sm leading-relaxed">{t.product.card1_desc}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E1F5EE]">
          <div className="w-16 h-16 bg-[#1D9E75] text-white rounded-2xl flex items-center justify-center mb-6">
            <Activity size={32} />
          </div>
          <h3 className="font-bold text-[#1a1a18] text-xl mb-3">{t.product.card2_title}</h3>
          <p className="text-[#5F5E5A] text-sm leading-relaxed">{t.product.card2_desc}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E1F5EE]">
          <div className="w-16 h-16 bg-[#EF9F27] text-white rounded-2xl flex items-center justify-center mb-6">
            <Globe size={32} />
          </div>
          <h3 className="font-bold text-[#1a1a18] text-xl mb-3">{t.product.card3_title}</h3>
          <p className="text-[#5F5E5A] text-sm leading-relaxed">{t.product.card3_desc}</p>
        </div>
      </section>
      
      <section className="max-w-5xl mx-auto px-6 mt-24">
        <div className="bg-[#04342C] rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-12 lg:p-16 text-white">
            <h2 className="font-serif text-4xl mb-6">{t.product.cta_title}</h2>
            <p className="text-[#9FE1CB] font-light leading-relaxed mb-8">{t.product.cta_desc}</p>
            <button className="bg-white text-[#085041] px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow-lg transition-transform hover:-translate-y-0.5">{t.product.cta_btn}</button>
          </div>
          <div className="md:w-1/2 h-full min-h-[400px]">
             <img src="https://placehold.co/1000x800/085041/FFFFFF/png?text=MEDECIN+TABLETTE" className="w-full h-full object-cover" alt="Clinician on tablet" />
          </div>
        </div>
      </section>
    </main>
  );
}
