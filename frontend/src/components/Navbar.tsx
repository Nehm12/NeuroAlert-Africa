"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="34" fill="currentColor"/>
    <path d="M14 36 Q20 24 26 36 Q32 48 38 36 Q44 24 50 36 Q56 48 58 36" stroke="#9FE1CB" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="36" cy="20" r="5" fill="#EF9F27"/>
    <path d="M36 25 L36 47" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M29 36 L43 36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 44);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHomepage = pathname === '/';
  const navWhiteActive = isScrolled || !isHomepage;

  return (
    <>
      {/* Top Banner - Only on Homepage */}
      {isHomepage && (
        <div className="bg-[#04342C] text-white py-3 px-6 flex justify-center items-center gap-6 text-sm relative z-[60]">
          <div>
            <span className="font-bold text-[11px] sm:text-sm">AI through USSD is now live across the world.</span>
            <span className="ml-2 font-light hidden lg:inline">Automated stroke diagnostics in local languages.</span>
          </div>
          <Link href="/product" className="border border-white/40 px-4 py-1 rounded-full hover:bg-white/10 transition-colors text-[10px] whitespace-nowrap tracking-widest font-bold">
            {t.nav.features}
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${navWhiteActive ? 'top-0 bg-white/95 backdrop-blur-md shadow-lg text-[#1a1a18] py-4' : (isHomepage ? 'top-[44px]' : 'top-0') + ' bg-transparent text-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`transition-all duration-500 transform group-hover:rotate-12 ${navWhiteActive ? 'text-[#04342C]' : 'text-[#085041]'}`}>
              <Logo className={`w-8 h-8 ${navWhiteActive ? 'text-[#085041]' : 'text-[#04342C] bg-white rounded-full p-0.5'}`} />
            </div>
            <span className="font-bold text-xl tracking-tighter">NeuroAlert <span className="font-light opacity-70">Africa</span></span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-8 text-[13px] font-medium">
            <Link href="/product" className={`transition-colors ${navWhiteActive ? 'text-gray-500 hover:text-[#1D9E75]' : 'text-white/70 hover:text-white'}`}>{t.nav.features}</Link>
            <Link href="/pricing" className={`transition-colors ${navWhiteActive ? 'text-gray-500 hover:text-[#1D9E75]' : 'text-white/70 hover:text-white'}`}>{t.nav.pricing}</Link>
            <Link href="/institutions" className={`transition-colors ${navWhiteActive ? 'text-gray-500 hover:text-[#1D9E75]' : 'text-white/70 hover:text-white'}`}>{t.nav.institutions}</Link>
            <Link href="/developers" className={`transition-colors ${navWhiteActive ? 'text-gray-500 hover:text-[#1D9E75]' : 'text-white/70 hover:text-white'}`}>{t.nav.developers}</Link>
            <Link href="/about" className={`transition-colors ${navWhiteActive ? 'text-gray-500 hover:text-[#1D9E75]' : 'text-white/70 hover:text-white'}`}>{t.nav.about}</Link>
            <Link href="/faq" className={`transition-colors ${navWhiteActive ? 'text-gray-500 hover:text-[#1D9E75]' : 'text-white/70 hover:text-white'}`}>FAQ</Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Language Toggle */}
            <div className={`hidden lg:flex items-center gap-2 text-[10px] font-black tracking-[0.2em] transition-colors ${navWhiteActive ? 'text-[#085041]' : 'text-white'}`}>
              <span 
                className={`cursor-pointer hover:text-[#1D9E75] transition-colors ${language === 'fr' ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => setLanguage('fr')}
              >FR</span>
              <span className="opacity-20">|</span>
              <span 
                className={`cursor-pointer hover:text-[#1D9E75] transition-colors ${language === 'en' ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => setLanguage('en')}
              >EN</span>
            </div>

            <Link href="/login" className={`hidden sm:block px-8 py-2.5 rounded-full font-bold text-xs shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${navWhiteActive ? 'bg-[#085041] text-white' : 'bg-white text-[#085041]'}`}>
              {t.nav.login}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${navWhiteActive ? 'text-[#085041] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`absolute right-0 top-0 h-full w-[80%] max-w-[400px] bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col pt-32 p-10`}>
          <div className="flex flex-col gap-8 text-lg font-serif">
            <Link href="/product" className="text-[#085041] hover:text-[#1D9E75] transition-colors">{t.nav.features}</Link>
            <Link href="/pricing" className="text-[#085041] hover:text-[#1D9E75] transition-colors">{t.nav.pricing}</Link>
            <Link href="/institutions" className="text-[#085041] hover:text-[#1D9E75] transition-colors">{t.nav.institutions}</Link>
            <Link href="/developers" className="text-[#085041] hover:text-[#1D9E75] transition-colors">{t.nav.developers}</Link>
            <Link href="/about" className="text-[#085041] hover:text-[#1D9E75] transition-colors">{t.nav.about}</Link>
            <Link href="/faq" className="text-[#085041] hover:text-[#1D9E75] transition-colors">FAQ</Link>
          </div>

          <div className="mt-auto pt-10 border-t border-gray-100">
            <div className="flex items-center gap-6 mb-8 text-sm font-black tracking-widest text-[#085041]">
              <span onClick={() => { setLanguage('fr'); setIsMenuOpen(false); }} className={language === 'fr' ? 'text-[#1D9E75]' : 'opacity-40'}>FRANÇAIS</span>
              <span className="opacity-10">|</span>
              <span onClick={() => { setLanguage('en'); setIsMenuOpen(false); }} className={language === 'en' ? 'text-[#1D9E75]' : 'opacity-40'}>ENGLISH</span>
            </div>
            
            <Link href="/login" className="w-full bg-[#085041] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg active:scale-95 transition-all">
              {t.nav.login}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
