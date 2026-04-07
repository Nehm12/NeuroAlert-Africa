"use client";
import Link from "next/link";
import { MessageSquare, Globe, ExternalLink, Code2, Users2, Mail, ArrowRight, Heart } from "lucide-react";
import { Logo } from "./Navbar";
import { useTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const columns = [
  {
    title: "Produit",
    links: [
      { label: "SMS & USSD",  href: "/product" },
      { label: "IA de triage", href: "/product" },
      { label: "Dashboards",   href: "/institutions" },
      { label: "API REST",     href: "/developers" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Documentation", href: "/developers" },
      { label: "FAQ",           href: "/faq" },
      { label: "GitHub",        href: "#" },
      { label: "Statut",        href: "#" },
    ],
  },
  {
    title: "Mission",
    links: [
      { label: "Notre histoire", href: "/about" },
      { label: "Institutions",   href: "/institutions" },
      { label: "Contact",        href: "/about" },
      { label: "Carrières",      href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGU",            href: "#" },
      { label: "Confidentialité",href: "#" },
      { label: "Mentions légales",href: "#" },
    ],
  },
];

export default function Footer() {
  const { t, language, setLanguage } = useTranslation();
  const { isDark } = useTheme();

  const footerBg = isDark
    ? 'linear-gradient(180deg, #040F0C 0%, #020A07 100%)'
    : 'linear-gradient(180deg, #EBF4EF 0%, #E2EFE9 100%)';

  const stripBg = isDark
    ? 'rgba(13, 122, 95, 0.06)'
    : 'rgba(13, 122, 95, 0.05)';

  return (
    <footer style={{ background: footerBg, borderTop: '1px solid var(--border-subtle)' }}>

      {/* Newsletter strip */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: stripBg }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--primary-light)', opacity: isDark ? 0.6 : 0.8 }}>
              Newsletter
            </div>
            <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
              Restez informé des avancées
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Recevez nos mises à jour sur NeuroAlert Africa.
            </p>
          </div>
          <form className="flex gap-3 w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                border: '1px solid var(--border-mid)',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" className="btn-primary text-sm py-3 px-5 gap-2 whitespace-nowrap">
              S'inscrire <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div style={{ color: 'var(--primary-light)' }}>
                <Logo className="w-8 h-8" />
              </div>
              <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Neuro<span style={{ color: 'var(--primary-light)' }}>Alert</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Solution IA de dépistage précoce de l'AVC accessible via USSD partout en Afrique, sans internet.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: ExternalLink, href: '#', label: 'Twitter' },
                { icon: Code2,        href: '#', label: 'GitHub' },
                { icon: Users2,       href: '#', label: 'LinkedIn' },
                { icon: Mail,         href: '#', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-all hover:translate-x-1 inline-block"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-5 pt-8"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>© {new Date().getFullYear()} NeuroAlert Africa.</span>
            <span className="mx-1">Fait avec</span>
            <Heart size={10} className="text-[#E84040]" fill="#E84040" />
            <span className="ml-1">pour l'Afrique.</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'var(--glass)', border: '1px solid var(--border-subtle)' }}
            >
              <Globe size={12} style={{ color: 'var(--primary-light)' }} />
              {(['fr', 'en'] as const).map((lang, i) => (
                <>
                  {i > 0 && <span key="sep" style={{ color: 'var(--text-muted)' }}>|</span>}
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className="font-bold uppercase transition-colors"
                    style={{ color: language === lang ? 'var(--primary-light)' : 'var(--text-muted)' }}
                  >
                    {lang}
                  </button>
                </>
              ))}
            </div>

            {/* Chat */}
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all hover:-translate-y-0.5"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <MessageSquare size={12} />
              <span>Chat support</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
