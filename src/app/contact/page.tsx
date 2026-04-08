"use client";
import React, { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { Send, CheckCircle2, Building2, User, Globe, Activity, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<"citizen" | "institution">("institution");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8F7F3] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-[#F1EFE8] animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#1D9E75]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#1D9E75]">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#085041] mb-4">{t.contact.success_title}</h2>
          <p className="text-[#5F5E5A] font-light leading-relaxed mb-8">
            {t.contact.success_msg}
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-[#085041] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
          >
            {t.nav.about}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F3] font-sans overflow-x-hidden">
      {/* Hero Header */}
      <section className="bg-[#085041] pt-32 pb-48 text-white relative hero-diagonal">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="inline-block bg-white/10 text-[#9FE1CB] text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full mb-8 border border-white/10 uppercase">
            {t.contact.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-8 leading-[1.1] max-w-3xl italic">
            {t.contact.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
          </h1>
          <p className="text-xl text-[#E1F5EE] leading-relaxed font-light max-w-2xl">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Form Content */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 mb-32 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Form Card */}
          <div className="lg:w-2/3 bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_50px_100px_rgba(8,80,65,0.05)] border border-[#F1EFE8]">
            
            {/* Type Switcher */}
            <div className="mb-12">
              <label className="block text-[10px] font-black text-[#085041]/40 uppercase tracking-[0.2em] mb-6">
                {t.contact.type_label}
              </label>
              <div className="flex p-1.5 bg-[#F8F7F3] rounded-2xl border border-[#F1EFE8] w-full max-w-sm">
                <button 
                  onClick={() => setType("citizen")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${type === "citizen" ? "bg-white text-[#085041] shadow-md" : "text-[#085041]/40 hover:text-[#085041]"}`}
                >
                  <User size={16} />
                  {t.contact.type_citizen}
                </button>
                <button 
                  onClick={() => setType("institution")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${type === "institution" ? "bg-[#085041] text-white shadow-lg" : "text-[#085041]/40 hover:text-[#085041]"}`}
                >
                  <Building2 size={16} />
                  {t.contact.type_institution}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_name}</label>
                  <input type="text" required placeholder="John Doe" className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_email}</label>
                  <input type="email" required placeholder="john@example.com" className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              {type === "institution" && (
                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_institution}</label>
                    <input type="text" required placeholder="General Hospital" className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_role}</label>
                    <input type="text" required placeholder="Clinical Director" className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_type}</label>
                    <select required className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                      <option value="hospital">{t.contact.inst_types.hospital}</option>
                      <option value="ministry">{t.contact.inst_types.ministry}</option>
                      <option value="ngo">{t.contact.inst_types.ngo}</option>
                      <option value="telecom">{t.contact.inst_types.telecom}</option>
                      <option value="other">{t.contact.inst_types.other}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_scale}</label>
                    <select required className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                      <option value="local">{t.contact.scales.local}</option>
                      <option value="regional">{t.contact.scales.regional}</option>
                      <option value="national">{t.contact.scales.national}</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#085041]/60 uppercase tracking-widest pl-2">{t.contact.form_message}</label>
                <textarea required rows={5} className="w-full bg-[#F8F7F3] border border-[#F1EFE8] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#1D9E75] text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-[#085041] hover:shadow-2xl transition-all flex items-center justify-center gap-3 group">
                {t.contact.form_submit}
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Right Column: Info & Trust */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-[#0a0a0b] text-white rounded-[3rem] p-10 space-y-8 border border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9E75]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#1D9E75]/20 transition-all"></div>
              <h3 className="text-2xl font-serif font-bold italic">{t.nav.about}</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#1D9E75] shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Email</div>
                    <div className="text-sm font-medium">engineering@neuroalert.africa</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#EF9F27] shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Phone</div>
                    <div className="text-sm font-medium">+234 800 STROKE</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E24B4A] shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">HQ</div>
                    <div className="text-sm font-medium">Innovation Hub, Lagos, Nigeria</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border border-[#F1EFE8] space-y-6">
              <h4 className="text-[10px] font-black text-[#085041]/40 uppercase tracking-[0.3em]">{t.institutions.alert_badge}</h4>
              <div className="space-y-4">
                {[
                  { text: t.institutions.feature1, icon: ShieldCheck, color: "text-[#1D9E75]" },
                  { text: t.institutions.feature2, icon: Activity, color: "text-[#1D9E75]" },
                  { text: t.institutions.feature3, icon: Globe, color: "text-[#1D9E75]" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-8 h-8 rounded-lg bg-[#F8F7F3] flex items-center justify-center ${item.color} group-hover:bg-[#085041] group-hover:text-white transition-all`}>
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-[#085041]/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
