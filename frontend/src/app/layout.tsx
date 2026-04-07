import type { Metadata } from "next"; // build-refresh-v2
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "NeuroAlert Africa — USSD Stroke Triage",
  description: "AI-powered, USSD-based early stroke detection system for Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased text-[#1a1a18]`}>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
            <Chatbot />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
