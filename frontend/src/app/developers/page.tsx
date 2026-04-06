"use client";
import { useTranslation } from "@/context/LanguageContext";

export default function DevelopersPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#04342C] text-white">
      <section className="max-w-4xl mx-auto px-6 text-center mb-16">
        <span className="inline-block bg-[#1D9E75] text-[#E1F5EE] font-bold px-4 py-1.5 rounded-full mb-6 text-xs uppercase tracking-wider">{t.developers.badge}</span>
        <h1 className="font-serif text-5xl mb-6">{t.developers.title}</h1>
        <p className="text-lg text-[#9FE1CB] font-light leading-relaxed">
          {t.developers.desc}
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center mb-24">
        {/* Left Code Area */}
        <div className="bg-[#1a1a18] text-[#E1F5EE] w-full rounded-2xl shadow-2xl p-8 font-mono text-sm leading-relaxed overflow-x-auto border border-[#085041]">
          <span className="text-[#1D9E75]"># import package</span>{"\n"}
          <span className="text-[#EF9F27]">import</span> neuroalert{"\n\n"}
          <span className="text-[#1D9E75]"># initialize SDK</span>{"\n"}
          client = neuroalert.Client(<span className="text-[#E1F5EE]">"NA_API_KEY"</span>){"\n\n"}
          <span className="text-[#1D9E75]"># Connect Hospital Webhook</span>{"\n"}
          client.webhooks.subscribe({"{"}{"\n"}
          {"  "}hospital_id: <span className="text-[#E1F5EE]">"LAGOS_GENERAL_01"</span>,{"\n"}
          {"  "}events: [<span className="text-[#E1F5EE]">"stroke_alert.critical"</span>]{"\n"}
          {"}"}){"\n\n"}
          <span className="text-[#9FE1CB]">print</span>(<span className="text-[#E1F5EE]">"✓ Webhook Actif"</span>)
        </div>
        
        {/* Right Info Area */}
        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-2xl mb-2">{t.developers.sdk_title}</h3>
            <p className="text-[#9FE1CB] font-light text-sm">{t.developers.sdk_desc}</p>
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-2">{t.developers.github_title}</h3>
            <p className="text-[#9FE1CB] font-light text-sm">{t.developers.github_desc}</p>
          </div>
          <div className="flex gap-4 pt-4">
            <button className="bg-white text-[#04342C] px-6 py-3 rounded-xl font-bold hover:bg-[#E1F5EE] transition-colors">{t.developers.doc_btn}</button>
            <button className="bg-transparent border border-[#1D9E75] text-[#9FE1CB] px-6 py-3 rounded-xl font-bold hover:bg-[#1D9E75] hover:text-white transition-colors">{t.developers.github_btn}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
