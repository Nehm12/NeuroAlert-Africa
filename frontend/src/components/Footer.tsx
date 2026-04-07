"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Navbar";
import { useTranslation } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language, setLanguage } = useTranslation();
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

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
          <h4 className="font-bold mb-6 text-sm text-white">{t.footer.resources}</h4>
          <ul className="space-y-4">
            <li><Link href="/status" className="hover:text-[#1AEEAF] transition-colors text-xs font-light">Statut du Système</Link></li>
            <li><Link href="/developers" className="hover:text-white transition-colors text-xs font-light">Documentation API</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors text-xs font-light">FAQ & Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm text-white">{t.footer.mission}</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="hover:text-white transition-colors text-xs font-light">{t.footer.history}</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors text-xs font-light">{t.footer.contact}</Link></li>
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">{t.footer.careers}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm text-white">{t.footer.legal}</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">{t.footer.terms}</a></li>
            <li><a href="#" className="hover:text-white transition-colors text-xs font-light">{t.footer.privacy}</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-[#085041] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-light opacity-60">
        <div>NeuroAlert Africa. {t.footer.rights} © 2026</div>
      </div>
    </footer>
  );
}
