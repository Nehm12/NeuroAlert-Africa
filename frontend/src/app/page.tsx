"use client";
import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Phone, MapPin, Activity, Globe, HeartPulse,
  ArrowRight, CheckCircle, Zap, Shield, ChevronRight, Play,
  TrendingUp, Users, Clock
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

/* ── Animated Counter ── */
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref     = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed  = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── USSD Terminal ── */
function USSDTerminal() {
  const lines = [
    { delay: 0,    text: "Bienvenue sur NeuroAlert AI" },
    { delay: 700,  text: "Composez *789# pour commencer" },
    { delay: 1400, text: "" },
    { delay: 1800, text: "1. Dépistage AVC" },
    { delay: 2200, text: "2. Hôpital le plus proche" },
    { delay: 2600, text: "3. Alerter un médecin" },
    { delay: 3000, text: "" },
    { delay: 3400, text: "> Entrez votre choix: _" },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    lines.forEach((_, i) => setTimeout(() => setVisible(i + 1), lines[i].delay + 500));
    const id = setInterval(() => {
      setVisible(0);
      lines.forEach((_, i) => setTimeout(() => setVisible(i + 1), lines[i].delay + 500));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ussd-screen w-full max-w-xs mx-auto relative" style={{ minHeight: 480 }}>
      {/* Notch */}
      <div className="h-7 flex items-center justify-center pt-2">
        <div className="w-28 h-4 bg-black rounded-b-xl opacity-80" />
      </div>
      {/* Status bar */}
      <div className="px-6 pt-2 pb-1 flex justify-between items-center">
        <span className="text-[10px] text-[#5DD6A8]/60 font-mono">9:41</span>
        <div className="flex gap-0.5 items-end">
          {[2, 3, 4, 4, 4].map((h, i) => (
            <div key={i} className="w-0.5 rounded-sm bg-[#5DD6A8]/60" style={{ height: h * 2 }} />
          ))}
          <div className="w-5 h-2.5 border border-[#5DD6A8]/40 rounded-sm ml-1 relative">
            <div className="absolute left-0.5 top-0.5 bottom-0.5 w-3 bg-[#5DD6A8]/60 rounded-[1px]" />
          </div>
        </div>
      </div>
      {/* Screen area */}
      <div
        className="mx-4 mt-3 rounded-xl p-4"
        style={{ minHeight: 340, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(93,214,168,0.1)' }}
      >
        <div className="text-[10px] text-[#5DD6A8]/40 font-mono mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5DD6A8] animate-pulse inline-block" />
          MTN USSD · *789#
        </div>
        <div className="space-y-0.5">
          {lines.slice(0, visible).map((line, i) => (
            <div key={i} className="ussd-text">{line.text || '\u00A0'}</div>
          ))}
        </div>
      </div>
      {/* Home bar */}
      <div className="flex justify-center mt-4 mb-2">
        <div className="w-24 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </div>
  );
}

/* ── Floating Badge ── */
function FloatingBadge({ className = "", anim = "animate-float", children }: { className?: string; anim?: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute glass-card rounded-xl px-4 py-3 shadow-2xl ${anim} ${className}`}
      style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {children}
    </div>
  );
}

/* ── Section Reveal ── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref     = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function Home() {
  const { t }      = useTranslation();
  const { isDark } = useTheme();

  /* light-mode section backgrounds */
  const sectionBg = isDark
    ? 'transparent'
    : 'rgba(255,255,255,0.5)';

  const statsGradient = isDark
    ? 'linear-gradient(135deg, rgba(5,25,18,0.8), rgba(2,10,7,0.9))'
    : 'linear-gradient(135deg, #E8F4EE, #F0F7F3)';

  const features = [
    { icon: Phone,     color: '#5DD6A8',  bg: 'rgba(93,214,168,0.1)',  tag: 'USSD',  title: t.home_features.card1_title, desc: t.home_features.card1_desc },
    { icon: Activity,  color: '#F5A623',  bg: 'rgba(245,166,35,0.1)', tag: 'AI',    title: t.home_features.card2_title, desc: t.home_features.card2_desc },
    { icon: HeartPulse,color: '#E84040',  bg: 'rgba(232,64,64,0.1)',  tag: 'FAST',  title: t.home_features.card3_title, desc: t.home_features.card3_desc },
    { icon: Globe,     color: '#5DD6A8',  bg: 'rgba(93,214,168,0.1)',  tag: 'AFRICA',title: t.home_features.card4_title, desc: t.home_features.card4_desc },
    { icon: Zap,       color: '#F5A623',  bg: 'rgba(245,166,35,0.1)', tag: '60s',   title: t.home_features.card5_title, desc: t.home_features.card5_desc },
    { icon: MapPin,    color: '#E84040',  bg: 'rgba(232,64,64,0.1)',  tag: 'GEO',   title: t.home_features.card6_title, desc: t.home_features.card6_desc },
  ];

  const steps = [
    { icon: Phone,     num: '01', color: '#5DD6A8', title: t.how_it_works.step1_title, desc: t.how_it_works.step1_desc },
    { icon: Activity,  num: '02', color: '#F5A623', title: t.how_it_works.step2_title, desc: t.how_it_works.step2_desc },
    { icon: HeartPulse,num: '03', color: '#E84040', title: t.how_it_works.step3_title, desc: t.how_it_works.step3_desc },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ═══ HERO ═══ */}
      <section
        className="relative min-h-screen flex flex-col justify-center hero-grid overflow-hidden"
        style={{ paddingTop: 130 }}
      >
        {/* Orbs */}
        <div className="orb w-[600px] h-[600px] -top-40 -left-40 opacity-20"
             style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
        <div className="orb w-[350px] h-[350px] top-1/3 right-0 opacity-10"
             style={{ background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)' }} />
        <div className="orb w-[300px] h-[300px] bottom-0 left-1/3 opacity-08"
             style={{ background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 w-full py-16 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div className="space-y-8" style={{ animation: 'slide-up 0.6s ease forwards' }}>
            <div>
              <div className="section-tag mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5DD6A8] animate-pulse" />
                Détection précoce d'AVC en Afrique
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Chaque{' '}
                <span className="text-gradient-green">minute</span>
                <br />
                compte pour{' '}
                <br />
                <span className="text-gradient-gold">le cerveau.</span>
              </h1>
            </div>

            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)', opacity: 0, animation: 'slide-up 0.8s ease 0.2s forwards' }}>
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4" style={{ opacity: 0, animation: 'slide-up 0.8s ease 0.4s forwards' }}>
              <Link href="/product" className="btn-primary text-sm gap-2">
                Commencer maintenant <ArrowRight size={16} />
              </Link>
              <button className="btn-outline text-sm gap-2">
                <Play size={14} /> Voir la démo
              </button>
            </div>

            {/* Trust metrics */}
            <div className="flex flex-wrap gap-6 pt-2" style={{ opacity: 0, animation: 'slide-up 0.8s ease 0.6s forwards' }}>
              {[
                { label: 'Pays couverts', value: '12+' },
                { label: 'Opérateurs Telco', value: '80+' },
                { label: 'Dépistages', value: '250K+' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone */}
          <div className="relative flex justify-center items-center" style={{ opacity: 0, animation: 'fade-in 1s ease 0.3s forwards' }}>
            <div
              className="absolute w-80 h-80 rounded-full animate-pulse-glow"
              style={{ background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)' }}
            />
            <div className="relative transform -rotate-2">
              <USSDTerminal />
            </div>

            <FloatingBadge className="-top-4 -right-4">
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <span className="w-2 h-2 rounded-full bg-[#5DD6A8] animate-pulse" />
                <span style={{ color: 'var(--primary-light)' }}>*789#</span>
                <span style={{ color: 'var(--text-muted)' }}>Actif</span>
              </div>
            </FloatingBadge>

            <FloatingBadge className="-bottom-4 -left-8" anim="animate-float-alt">
              <div className="flex items-center gap-2 text-xs font-bold">
                <MessageSquare size={14} style={{ color: 'var(--accent-gold)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Alerte envoyée</span>
                <CheckCircle size={12} style={{ color: 'var(--primary-light)' }} />
              </div>
            </FloatingBadge>

            <FloatingBadge className="top-1/3 -right-14">
              <div className="text-center">
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Réponse IA</div>
                <div className="text-lg font-black" style={{ color: 'var(--primary-light)' }}>58s</div>
                <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>temps moyen</div>
              </div>
            </FloatingBadge>
          </div>
        </div>

        {/* Fade out bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-base))' }}
        />
      </section>

      {/* ═══ PARTENAIRES ═══ */}
      <section className="py-12" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-8" style={{ color: 'var(--text-muted)' }}>
            Opérateurs & Partenaires
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {['MTN', 'Orange', 'Airtel', 'Moov', 'Vodacom', 'Glo'].map((n) => (
              <div key={n} className="partner-badge">{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="section-tag mx-auto mb-6">Fonctionnalités</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
            {t.home_features.title}
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: 'var(--text-secondary)' }}>
            {t.home_features.desc}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="feature-card h-full group cursor-default">
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: feat.bg, border: `1px solid ${feat.color}25` }}
                  >
                    <feat.icon size={22} style={{ color: feat.color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-widest px-2 py-1 rounded-full"
                    style={{ background: feat.bg, color: feat.color }}
                  >
                    {feat.tag}
                  </span>
                </div>
                <h3
                  className="font-bold text-base mb-2 group-hover:transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feat.desc}</p>
                <div
                  className="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--primary-light)' }}
                >
                  En savoir plus <ChevronRight size={12} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        className="py-28 relative overflow-hidden"
        style={{ background: isDark ? 'rgba(5,18,12,0.5)' : 'rgba(232,244,238,0.5)' }}
      >
        <div
          className="orb w-96 h-96 -left-20 top-1/2 -translate-y-1/2 opacity-10"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Steps */}
            <div>
              <Reveal>
                <div className="section-tag mb-6">Comment ça marche</div>
                <h2 className="text-4xl md:text-5xl font-black mb-12" style={{ color: 'var(--text-primary)' }}>
                  {t.how_it_works.title}
                </h2>
              </Reveal>

              <div className="relative pl-10">
                <div className="timeline-line" />
                {steps.map((step, i) => (
                  <Reveal key={i} delay={i * 150}>
                    <div className="relative flex gap-6 mb-10 group">
                      <div
                        className="absolute -left-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${step.color}15`, border: `1.5px solid ${step.color}50` }}
                      >
                        <step.icon size={18} style={{ color: step.color }} />
                        <div
                          className="absolute inset-0 rounded-full animate-beacon"
                          style={{ border: `1px solid ${step.color}`, animationDelay: `${i * 0.4}s` }}
                        />
                      </div>
                      <div
                        className="glass-card rounded-2xl p-5 flex-1"
                        style={{ background: 'var(--bg-card)' }}
                      >
                        <span className="text-xs font-black tracking-widest block mb-2" style={{ color: step.color }}>
                          ÉTAPE {step.num}
                        </span>
                        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Dashboard */}
            <Reveal delay={200}>
              <div className="relative">
                <div
                  className="glass-card rounded-3xl p-6"
                  style={{ boxShadow: 'var(--shadow-glow)', background: 'var(--bg-card)' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                        Dashboard Médecin
                      </div>
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>Tableau de bord en temps réel</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#5DD6A8] animate-pulse" />
                      <span className="text-xs" style={{ color: 'var(--primary-light)' }}>Live</span>
                    </div>
                  </div>

                  {/* Bar chart */}
                  <div className="mb-5">
                    <div className="flex items-end gap-1 h-28">
                      {[40,65,45,80,55,90,70,85,60,95,75,100].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm chart-bar"
                          style={{ height: `${h}%`, opacity: 0.6 + i / 25 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'].map((m, i) => (
                        <span key={i} className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Users,     label: 'Patients',   value: '1,248', color: '#5DD6A8' },
                      { icon: Clock,     label: 'Rép. moy.',  value: '58s',   color: '#F5A623' },
                      { icon: TrendingUp,label: 'Précision',  value: '97%',   color: '#E84040' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="glass-card rounded-xl p-3 text-center"
                        style={{ background: 'var(--bg-card)' }}
                      >
                        <item.icon size={14} style={{ color: item.color }} className="mx-auto mb-1" />
                        <div className="text-base font-black" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                        <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alert floating */}
                <FloatingBadge className="-bottom-6 -right-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,64,64,0.15)' }}>
                        <HeartPulse size={14} style={{ color: '#E84040' }} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E84040] animate-beacon" />
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Alerte AVC</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Dakar · il y a 12s</div>
                    </div>
                  </div>
                </FloatingBadge>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-24" style={{ background: statsGradient }}>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="section-tag mx-auto mb-6">Impact</div>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
              NeuroAlert en chiffres
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Globe,     value: 12,     suffix: '+', label: 'Pays couverts',      color: '#5DD6A8', desc: "À travers l'Afrique subsaharienne" },
              { icon: Activity,  value: 80,     suffix: '+', label: 'Opérateurs Telco',   color: '#F5A623', desc: 'Partenariats opérateurs mobiles' },
              { icon: Users,     value: 250000, suffix: '+', label: 'Dépistages réalisés',color: '#E84040', desc: 'Patients dépistés via USSD' },
              { icon: Clock,     value: 58,     suffix: 's', label: 'Temps de réponse',   color: '#5DD6A8', desc: "Durée moyenne d'analyse IA" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="stat-card group">
                  <div
                    className="mb-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}
                  >
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                    <AnimatedCounter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <div
            className="text-7xl font-serif mb-6"
            style={{ color: 'var(--primary-light)', opacity: 0.2 }}
          >"</div>
          <p className="text-xl md:text-2xl font-light leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Grâce à NeuroAlert, nous avons réduit de{' '}
            <span className="font-bold" style={{ color: 'var(--primary-light)' }}>43%</span>{' '}
            le délai entre l'apparition des symptômes et la prise en charge hospitalière dans nos établissements partenaires.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(13,122,95,0.2)' : 'rgba(13,122,95,0.1)',
                border: '1px solid var(--border-mid)',
              }}
            >
              <span className="text-lg font-black" style={{ color: 'var(--primary-light)' }}>D</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Dr. Amina Diallo</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Neurologue — CHU de Dakar</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div
              className="glass-card rounded-3xl p-12"
              style={{ border: '1px solid var(--border-mid)', boxShadow: isDark ? 'var(--shadow-md)' : 'var(--shadow-md)' }}
            >
              <div className="section-tag mx-auto mb-8">Rejoignez-nous</div>
              <h2 className="text-4xl md:text-5xl font-black mb-5" style={{ color: 'var(--text-primary)' }}>
                Prêt à sauver des vies<br />avec l'IA ?
              </h2>
              <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
                Déployez NeuroAlert dans votre établissement de santé ou intégrez notre API.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/product" className="btn-primary text-sm gap-2">
                  Démarrer gratuitement <ArrowRight size={15} />
                </Link>
                <Link href="/developers" className="btn-outline text-sm gap-2">
                  Documentation API
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
