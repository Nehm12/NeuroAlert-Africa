"use client";
import { useTranslation } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-white text-[#1a1a18]">
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <h1 className="font-serif text-5xl text-[#085041] mb-6">{t.about.title}</h1>
        <p className="text-lg text-[#5F5E5A] font-light leading-relaxed">
          {t.about.desc}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl text-[#085041] mb-4">{t.about.problem_title}</h2>
            <p className="text-[#5F5E5A] font-light leading-relaxed mb-4">
              {t.about.problem_p1}
            </p>
            <p className="text-[#5F5E5A] font-light leading-relaxed">
              {t.about.problem_p2}
            </p>
          </div>
          <div className="h-64 bg-[#E1F5EE] rounded-3xl p-8 flex items-center justify-center text-center">
             <div className="font-serif text-6xl text-[#E24B4A]">80%<div className="font-sans text-sm text-[#085041] mt-4 font-light">{t.about.stats_problem}</div></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center flex-row-reverse">
          <div className="order-2 md:order-1 h-64 bg-[#04342C] rounded-3xl p-8 flex items-center justify-center text-center">
             <div className="font-serif text-6xl text-[#1D9E75]">USSD<div className="font-sans text-sm text-[#E1F5EE] mt-4 font-light text-center">{t.about.stats_solution}</div></div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-3xl text-[#085041] mb-4">{t.about.solution_title}</h2>
            <p className="text-[#5F5E5A] font-light leading-relaxed mb-4">
              {t.about.solution_p1}
            </p>
            <p className="text-[#5F5E5A] font-light leading-relaxed">
              {t.about.solution_p2}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
