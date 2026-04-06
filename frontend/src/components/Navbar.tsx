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
  const pathname = usePathname();
  const { t, language } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 44);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomepage = pathname === '/';
  const navWhiteActive = isScrolled || !isHomepage;

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#04342C] text-white py-3 px-6 flex justify-center items-center gap-6 text-sm">
        <div>
          <span className="font-bold">Our USSD AI is now live across Africa.</span>
          <span className="ml-2 font-light hidden md:inline">Take advantage of fully automated stroke diagnostics in local languages.</span>
        </div>
        <Link href="/product" className="border border-white/40 px-4 py-1 rounded-full hover:bg-white/10 transition-colors text-xs whitespace-nowrap">
          Get Started
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${navWhiteActive ? 'top-0 bg-white shadow-md text-[#1a1a18] py-4' : 'top-[44px] bg-transparent text-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className={`transition-colors ${navWhiteActive ? 'text-[#04342C]' : 'text-[#085041]'}`}>
              <Logo className={`w-8 h-8 ${navWhiteActive ? 'text-[#085041]' : 'text-[#04342C] bg-white rounded-full'}`} />
            </div>
            <span className="font-bold text-xl tracking-tight">NeuroAlert <span className="font-light">Africa</span></span>
          </Link>
          
          <div className="hidden lg:flex flex-1 justify-center items-center gap-8 text-sm font-medium">
            <Link href="/product" className={`transition-colors ${navWhiteActive ? 'text-gray-600 hover:text-[#1D9E75]' : 'text-white/90 hover:text-[#9FE1CB]'}`}>{t.nav.features}</Link>
            <Link href="/pricing" className={`transition-colors ${navWhiteActive ? 'text-gray-600 hover:text-[#1D9E75]' : 'text-white/90 hover:text-[#9FE1CB]'}`}>{t.nav.pricing}</Link>
            <Link href="/institutions" className={`transition-colors ${navWhiteActive ? 'text-gray-600 hover:text-[#1D9E75]' : 'text-white/90 hover:text-[#9FE1CB]'}`}>{t.nav.institutions}</Link>
            <Link href="/developers" className={`transition-colors ${navWhiteActive ? 'text-gray-600 hover:text-[#1D9E75]' : 'text-white/90 hover:text-[#9FE1CB]'}`}>{t.nav.developers}</Link>
            <Link href="/about" className={`transition-colors ${navWhiteActive ? 'text-gray-600 hover:text-[#1D9E75]' : 'text-white/90 hover:text-[#9FE1CB]'}`}>{t.nav.about}</Link>
            <Link href="/faq" className={`transition-colors ${navWhiteActive ? 'text-gray-600 hover:text-[#1D9E75]' : 'text-white/90 hover:text-[#9FE1CB]'}`}>FAQ</Link>
          </div>

          <Link href="/login" className={`px-8 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-all ${navWhiteActive ? 'bg-[#1D9E75] text-white' : 'bg-white text-[#085041]'}`}>
            {t.nav.login}
          </Link>
        </div>
      </nav>
    </>
  );
}
