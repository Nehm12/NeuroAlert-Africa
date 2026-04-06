"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import fr from "../locales/fr.json";
import en from "../locales/en.json";

type Language = "fr" | "en";
type Translations = typeof fr;

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const translations = { fr, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    // Basic automatic detection
    const saved = localStorage.getItem("lang") as Language;
    if (saved && (saved === "fr" || saved === "en")) {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") setLanguage("en");
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};
