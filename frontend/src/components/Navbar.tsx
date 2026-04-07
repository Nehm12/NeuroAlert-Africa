"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, ArrowRight, Moon, Sun } from "lucide-react";

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="34" fill="currentColor" opacity="0.15" />
    <circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <path
      d="M14 36 Q20 24 26 36 Q32 48 38 36 Q44 24 50 36 Q56 48 58 36"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="36" cy="20" r="5" fill="#F5A623" />
    <path d="M36 25 L36 47" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29 36 L43 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const navLinks = (t: any) => [
  { href: "/product",      label: t.nav.features },
  { href: "/pricing",      label: t.nav.pricing },
  { href: "/institutions", label: t.nav.institutions },
  { href: "/developers",   label: t.nav.developers },
  { href: "/about",        label: t.nav.about },
  { href: "/faq",          label: "FAQ" },
];

/* ── Theme Toggle Button ── */
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      title={isDark ? "Thème clair" : "Thème sombre"}
    >
      <span className="theme-toggle-knob">
        {isDark ? (
          <Moon size={11} style={{ color: '#042E22' }} strokeWidth={2.5} />
        ) : (
          <Sun size={11} style={{ color: '#F5F4EF' }} strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [bannerVisible, setBanner]    = useState(true);
  const [menuOpen, setMenuOpen]       = useState(false);
  const pathname                       = usePathname();
  const { t }                          = useTranslation();
  const { isDark }                     = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > 60) setBanner(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase = isDark
    ? "text-white/60 hover:text-white"
    : "text-[#2D5245]/70 hover:text-[#0D7A5F]";
  const linkActive = "text-[#5DD6A8]";
  const linkDarkActive = isDark ? linkActive : "text-[#0D7A5F] font-semibold";

  return (
    <>
      {/* ── Top Banner ── */}
      <div
        style={{
          maxHeight: bannerVisible ? '48px' : '0',
          opacity: bannerVisible ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.5s ease, opacity 0.5s ease',
          background: 'linear-gradient(90deg, #042E22, #0D7A5F, #042E22)',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 6s ease infinite',
          position: 'relative',
          zIndex: 50,
        }}
      >
        <div className="flex items-center justify-center gap-4 py-3 px-6 text-xs">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5DD6A8] animate-pulse" />
            <span className="font-bold text-white">Notre USSD IA est maintenant actif en Afrique.</span>
            <span className="text-white/50 hidden md:inline">Dépistage automatisé en langues locales.</span>
          </span>
          <Link
            href="/product"
            className="flex items-center gap-1 text-[#5DD6A8] font-bold hover:text-white transition-colors border border-[#5DD6A8]/30 px-3 py-0.5 rounded-full hover:bg-[#5DD6A8]/10 whitespace-nowrap"
          >
            Commencer <ArrowRight size={10} />
          </Link>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav
        className={scrolled ? 'navbar-scrolled' : ''}
        style={{
          position: 'fixed',
          top: bannerVisible ? 48 : 0,
          left: 0,
          right: 0,
          zIndex: 40,
          transition: 'top 0.5s ease, background 0.4s ease, border-color 0.4s ease',
          background: scrolled ? undefined : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ color: 'var(--primary-light)' }}
            >
              <Logo className="w-8 h-8" />
            </div>
            <span
              className="font-black text-lg tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Neuro<span style={{ color: 'var(--primary-light)' }}>Alert</span>{" "}
              <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>Africa</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks(t).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href ? linkDarkActive : linkBase
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — theme toggle + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {t.nav.login}
            </Link>
            <Link
              href="/product"
              className="btn-primary text-sm py-2.5 px-5 gap-2"
              style={{ fontSize: '0.8rem' }}
            >
              Essai gratuit <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile: theme toggle + burger */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="transition-colors p-2"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          style={{
            maxHeight: menuOpen ? '420px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.35s ease',
            background: 'var(--navbar-bg)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div className="px-6 py-4 space-y-1">
            {navLinks(t).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ color: 'var(--text-muted)' }}
              >
                {link.label}
              </Link>
            ))}
            <div
              className="pt-4 flex flex-col gap-3"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <Link
                href="/login"
                className="text-center text-sm py-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {t.nav.login}
              </Link>
              <Link href="/product" className="btn-primary text-center text-sm py-3 justify-center">
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
