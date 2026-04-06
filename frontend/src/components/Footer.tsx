"use client";
import Link from "next/link";
import { MessageSquare, Globe } from "lucide-react";
import { Logo } from "./Navbar";
import { useTranslation } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <footer className="bg-[#04342C] text-[#E1F5EE] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
            <Logo className="w-6 h-6 text-[#1D9E75]" />
            NeuroAlert
          </Link>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm text-white">{t.nav.features.toUpperCase()}</h4>
          <ul className="space-y-4">
            <li><Link href="/product" className="hover:text-white transition-colors text-xs font-light">SMS & USSD</Link></li>
            <li><Link href="/product" className="hover:text-white transition-colors text-xs font-light">FAST AI</Link></li>
            <li><Link href="/institutions" className="hover:text-white transition-colors text-xs font-light">Dashboards</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm text-white">RESSOURCES</h4>
          <ul className="space-y-4">
            <li><Link href="/faq" className="hover:text-white transition-colors text-xs font-light">{t.nav.faq}</Link></li>
            <li><Link href="/developers" className="hover:text-white transition-colors text-xs font-light">{t.nav.developers} & API</Link></li>
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm text-white">NOTRE MISSION</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="hover:text-white transition-colors text-xs font-light">Notre Histoire</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors text-xs font-light">Contact</Link></li>
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">Carrières</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm text-white">LÉGAL</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">Conditions d'utilisation</a></li>
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">Confidentialité</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-[#085041] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-light opacity-60">
        <div>NeuroAlert Africa. {t.footer.rights} © 2026</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-[#085041] px-4 py-2 rounded-full border border-white/10">
            <Globe size={14} className="text-[#9FE1CB]" />
            <div className="flex gap-2 font-bold uppercase tracking-widest transition-all">
              <span 
                className={`cursor-pointer hover:text-[#9FE1CB] transition-colors ${language === 'fr' ? 'text-white' : 'text-white/40'}`}
                onClick={() => setLanguage('fr')}
              >FR</span>
              <span className="text-white/40">|</span>
              <span 
                className={`cursor-pointer hover:text-[#9FE1CB] transition-colors ${language === 'en' ? 'text-white' : 'text-white/40'}`}
                onClick={() => setLanguage('en')}
              >EN</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-[#085041] rounded-full flex items-center justify-center hover:bg-[#1D9E75] transition-colors cursor-pointer text-white shadow-lg">
            <MessageSquare size={16} />
          </div>
        </div>
      </div>
    </footer>
  );
}
