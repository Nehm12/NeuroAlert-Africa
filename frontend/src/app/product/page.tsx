                                    "use client";
                                    import { MessageSquare, Phone, MapPin, Activity, Globe, Cpu, Building2, Zap, ShieldCheck } from "lucide-react";
                                    import { useTranslation } from "@/context/LanguageContext";
                                    import MedicalDashboard from "@/components/MedicalDashboard";

                                    export default function ProductPage() {
                                      const { t } = useTranslation();

                                      return (
                                        <main className="min-h-screen font-sans overflow-x-hidden bg-[#F8F7F3]">
                                          
                                          {/* Product Hero Section */}
                                          <section className="bg-gradient-to-br from-[#085041] to-[#1D9E75] pt-32 pb-48 text-white relative hero-diagonal">
                                            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                                              <span className="inline-block bg-[#04342C]/40 text-[#9FE1CB] text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full mb-8 border border-white/10 uppercase">
                                                {t.product.vanguard_badge}
                                              </span>
                                              <h1 className="text-4xl md:text-6xl font-bold font-serif mb-8 leading-[1.1] max-w-4xl">
                                                {t.product.title}
                                              </h1>
                                              <p className="text-xl text-[#E1F5EE] leading-relaxed font-light max-w-2xl mb-12">
                                                {t.product.desc}
                                              </p>
                                              
                                              <div className="flex flex-wrap justify-center gap-6">
                                                <div className="flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10">
                                                  <div className="w-2 h-2 rounded-full bg-[#1AEEAF] animate-pulse"></div>
                                                  <span className="text-xs font-bold tracking-widest uppercase">{t.product.gsm_protocol}</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10">
                                                  <ShieldCheck size={16} className="text-[#9FE1CB]" />
                                                  <span className="text-xs font-bold tracking-widest uppercase">{t.product.hipaa_compliant}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </section>

                                          {/* Feature Grid Section */}
                                          <section className="max-w-7xl mx-auto px-6 -mt-24 mb-32 relative z-20">
                                            <div className="grid md:grid-cols-3 gap-8">
                                              {[
                                                { title: t.product.card1_title, desc: t.product.card1_desc, icon: Cpu },
                                                { title: t.product.card2_title, desc: t.product.card2_desc, icon: MapPin },
                                                { title: t.product.card3_title, desc: t.product.card3_desc, icon: MessageSquare },
                                              ].map((card, i) => (
                                                <div key={i} className="group bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-[#F1EFE8] hover:border-[#1D9E75]/30 hover:shadow-[0_40px_80px_rgba(29,158,117,0.1)] transition-all duration-500">
                                                  <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-[#1D9E75] mb-8 group-hover:bg-[#1D9E75] group-hover:text-white transition-all duration-500 shadow-sm">
                                                    <card.icon size={32} />
                                                  </div>
                                                  <h3 className="text-2xl font-bold text-[#085041] mb-4 group-hover:text-[#1D9E75] transition-colors">{card.title}</h3>
                                                  <p className="text-[#5F5E5A] font-light leading-relaxed">{card.card_desc || card.desc}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </section>

                                          {/* The Command Center Section */}
                                          <section className="py-24 bg-[#0a0a0b] relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1D9E75]/5 blur-[120px] pointer-events-none"></div>
                                            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
                                              <div className="lg:w-1/2 space-y-10">
                                                  <span className="text-[#1AEEAF] text-[10px] font-black tracking-[0.4em] uppercase">{t.product.triage_feed}</span>
                                                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                                                    {t.product.cta_title}
                                                  </h2>
                                                  <p className="text-white/60 font-light text-lg leading-relaxed">
                                                    {t.product.cta_desc}
                                                  </p>
                                                  
                                                  <div className="grid grid-cols-2 gap-8 pt-6">
                                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                                      <div className="text-white font-bold text-xl mb-1">99.9%</div>
                                                      <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">{t.product.gsm_uptime}</div>
                                                    </div>
                                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                                      <div className="text-white font-bold text-xl mb-1">~40ms</div>
                                                      <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">{t.product.latency_avg}</div>
                                                    </div>
                                                  </div>

                                                  <button className="bg-[#1D9E75] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#11B281] transition-all hover:shadow-[0_15px_30px_rgba(29,158,117,0.3)]">
                                                    {t.product.cta_btn}
                                                  </button>
                                              </div>

                                              <div className="lg:w-1/2 relative">
                                                <MedicalDashboard compact={false} />
                                                {/* Floating Spec Detail */}
                                                <div className="absolute -top-10 -left-10 bg-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#F1EFE8] hidden xl:flex items-center gap-4 animate-float">
                                                    <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center text-[#1D9E75]">
                                                      <Building2 size={24} />
                                                    </div>
                                                    <div>
                                                      <div className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest">{t.product.inst_sync}</div>
                                                      <div className="text-sm font-bold text-[#085041]">{t.product.openmrs_reg}</div>
                                                    </div>
                                                </div>
                                              </div>
                                            </div>
                                          </section>

                                          {/* Mesh Infrastructure Section */}
                                          <section className="py-24 bg-white">
                                            <div className="max-w-7xl mx-auto px-6 text-center">
                                              <div className="mb-20 space-y-4">
                                                <h2 className="text-3xl font-serif font-bold text-[#085041]">{t.product.mesh_title}</h2>
                                                <p className="text-[#5F5E5A] font-light max-w-2xl mx-auto">
                                                  {t.product.mesh_desc}
                                                </p>
                                              </div>
                                              
                                              <div className="grid md:grid-cols-4 gap-4">
                                                {[
                                                  { label: t.product.level1, detail: t.product.level1_desc, icon: Phone },
                                                  { label: t.product.level2, detail: t.product.level2_desc, icon: Zap },
                                                  { label: t.product.level3, detail: t.product.level3_desc, icon: Cpu },
                                                  { label: t.product.level4, detail: t.product.level4_desc, icon: Building2 },
                                                ].map((level, i) => (
                                                  <div key={i} className="p-8 rounded-[2rem] bg-[#F8F7F3] border border-[#F1EFE8] flex flex-col items-center gap-4 transition-all hover:bg-white hover:scale-105 hover:shadow-xl">
                                                    <div className="text-[#1D9E75]"><level.icon size={32} /></div>
                                                    <div>
                                                        <div className="text-[9px] font-black uppercase text-[#1D9E75] tracking-widest">{level.label}</div>
                                                        <div className="text-sm font-bold text-[#085041]">{level.detail}</div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </section>

                                        </main>
                                      );
                                    }
