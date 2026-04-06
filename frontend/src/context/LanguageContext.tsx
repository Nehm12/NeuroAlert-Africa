"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Inlining ALL translations to ensure 100% stability against caching/loading issues
const dictionary_fr = {
  "nav": {
    "features": "Fonctionnalités",
    "pricing": "Tarifs",
    "institutions": "Institutions",
    "developers": "Développeurs",
    "about": "À Propos",
    "faq": "FAQ",
    "login": "Connexion"
  },
  "hero": {
    "badge": "Détection précoce d'AVC",
    "title": "Chaque minute\ncompte pour le\ncerveau.",
    "subtitle": "Composez *789# depuis n'importe quel téléphone. Notre triage USSD guidé par l'IA vous oriente en 60 secondes vers l'hôpital le plus proche — Sans internet.",
    "cta": "Accès Institutions"
  },
  "home_features": {
    "title": "Triage & Alerte",
    "desc": "NeuroAlert est un système d'alerte neuro-vasculaire universel. Nous permettons un diagnostic clinique immédiat via USSD pour accélérer la prise en charge des AVC partout en Afrique.",
    "card1_title": "Triage USSD",
    "card1_desc": "Interactive menus accessible on any feature phone via *789#.",
    "card2_title": "Agent IA FAST",
    "card2_desc": "Immediate stroke evaluation using Gemini models following FAST protocols.",
    "card3_title": "Alerte Urgence",
    "card3_desc": "Critical alerts pushed instantly to the medical dashboard the second risk is detected.",
    "card4_title": "Multi-langues",
    "card4_desc": "Automatic support for Hausa, Yoruba, Igbo, French, and English.",
    "card5_title": "Données Cliniques",
    "card5_desc": "Real-time patient data synchronization to hospital portals.",
    "card6_title": "Géo-Localisation",
    "card6_desc": "Mapping emergency cases via cell tower triangulation for rapid response."
  },
  "how_it_works": {
    "title": "Comment ça marche : USSD *789#",
    "step1_title": "Composez le *789#",
    "step1_desc": "Pas d'internet ni de smartphone requis. Accédez au système de triage instantanément via USSD sur tous les types de téléphones.",
    "step2_title": "Suivez les instructions F.A.S.T",
    "step2_desc": "Le menu interactif guide l'utilisateur à travers le test F.A.S.T (Visage, Bras, Parole, Temps) dans sa langue locale.",
    "step3_title": "Alerte de secours immédiate",
    "step3_desc": "Si le score est critique, une alerte est immédiatement envoyée au dashboard de l'hôpital le plus proche."
  },
  "product": {
    "badge": "Un Produit Unique",
    "title": "L'agent iA USSD F.A.S.T",
    "desc": "NeuroAlert n'est pas une simple application mobile. C'est un moteur d'intelligence artificielle intégré directement dans les réseaux télécoms africains (USSD). Sans internet, notre IA diagnostique et prévient les urgences liés aux AVC.",
    "card1_title": "Triage USSD Universel",
    "card1_desc": "Aucune connexion 3G/4G requise. Le patient compose le *789# et est facturé zéro FCFA. Infrastructure Africa's Talking.",
    "card2_title": "Inférence IA Google",
    "card2_desc": "Modèle Gemini analysant les réponses USSD (Face, Arms, Speech, Time) pour évaluer la probabilité critique.",
    "card3_title": "Support Multi-Lingue",
    "card3_desc": "Détection automatique de la langue (Français, Hausa, Yoruba, Igbo) et questions F.A.S.T adaptées.",
    "cta_title": "Standard clinique au bout des doigts.",
    "cta_desc": "Hôpitaux connectés à l'API NeuroAlert pour alertes patients instantanées.",
    "cta_btn": "Voir les dashboards"
  },
  "pricing": {
    "title": "Modèle Freemium accessible",
    "desc": "Gratuit pour les patients. Coûts hospitaliers minimum via soutien philanthropique.",
    "free_badge": "VITAL",
    "free_title": "Individuel",
    "free_subtitle": "Gratuit pour toujours.",
    "premium_title": "Institutions",
    "premium_subtitle": "Hôpitaux & Ministères",
    "premium_price": "Sur Devis",
    "btn_free": "Composer *789#",
    "btn_premium": "Contact Ventes",
    "ong_title": "ONG ?",
    "ong_desc": "Infrastructure Premium gracieuse pour les organismes de santé publique."
  },
  "institutions": {
    "badge": "Hôpitaux",
    "title1": "Sauvez des vies",
    "title2": "en temps réel.",
    "desc": "Transformez les signaux USSD en salle de commande tactique.",
    "demo_btn": "Démo",
    "alert_badge": "CRITIQUE",
    "alert_patient": "Patient #8942 - FAST 3/3",
    "alert_zone": "Ikeja. Team dispatchée.",
    "partners_title": "Ils nous font confiance",
    "partners_desc": "Gouvernements et opérateurs unis contre l'AVC.",
    "card1_title": "Push Alerts",
    "card1_desc": "Notifications instantanées sur test FAST majeur.",
    "card2_title": "Heatmaps",
    "card2_desc": "Identifiez les clusters neuro-critiques.",
    "card3_title": "Collaboration",
    "card3_desc": "Partage de rapports F.A.S.T PDF."
  },
  "developers": {
    "badge": "Open Source",
    "title": "Construisez avec nous",
    "desc": "Intégrez le triage F.A.S.T via nos API.",
    "sdk_title": "SDK & REST API",
    "sdk_desc": "Télémétrie USSD temps réel pour HIS (DHIS2, OpenMRS).",
    "github_title": "GitHub",
    "github_desc": "Moteur IA Open-source licence MIT.",
    "doc_btn": "Documentation",
    "github_btn": "GitHub"
  },
  "about": {
    "title": "Histoire & Mission",
    "desc": "Démocratiser l'accès au diagnostic IA pour tous.",
    "problem_title": "Le Problème",
    "problem_p1": "316 cas AVC / 100k hab. Reconnaissance tardive des symptômes.",
    "problem_p2": "La Golden Hour est cruciale.",
    "stats_problem": "Mortalité évitable",
    "solution_title": "La Solution",
    "solution_p1": "IA sur clavier feature phone à 10$.",
    "solution_p2": "Pas de smartphone requis.",
    "stats_solution": "95% couverture mobile"
  },
  "faq": {
    "title": "FAQ",
    "desc": "Réponses sur technique et infrastructure.",
    "q1": "Pourquoi l'USSD ?",
    "a1": "Fonctionne sans internet sur tous les téléphones.",
    "q2": "Gratuité ?",
    "a2": "Oui, pour tous les patients.",
    "q3": "Comment l'IA détecte ?",
    "a3": "Via protocole international F.A.S.T.",
    "q4": "Données partagées ?",
    "a4": "Probabilité, localisation Cell-Tower, heure d'apparition.",
    "q5": "Intégration hôpitaux ?",
    "a5": "Portail dédié et Webhooks."
  },
  "footer": {
    "lang": "Langue",
    "rights": "Tous droits réservés."
  }
};

const dictionary_en = {
  "nav": {
    "features": "Features",
    "pricing": "Pricing",
    "institutions": "Institutions",
    "developers": "Developers",
    "about": "About Us",
    "faq": "FAQ",
    "login": "Login"
  },
  "hero": {
    "badge": "Early Stroke Detection",
    "title": "Every minute\ncounts for the\nbrain.",
    "subtitle": "Dial *789# from any phone. USSD triage guides you in 60 seconds. No internet required.",
    "cta": "Institution Access"
  },
  "home_features": {
    "title": "Triage & Alerting",
    "desc": "Universal neuro-vascular alert system. Immediate clinical diagnosis via USSD.",
    "card1_title": "USSD Triage",
    "card1_desc": "Interactive menus on any feature phone.",
    "card2_title": "FAST AI Agent",
    "card2_desc": "Stroke evaluation using Gemini.",
    "card3_title": "Emergency Alert",
    "card3_desc": "Instant alerts to medical dashboards.",
    "card4_title": "Multilingual",
    "card4_desc": "Hausa, Yoruba, Igbo, French, English.",
    "card5_title": "Clinical Data",
    "card5_desc": "Real-time sync to hospital portals.",
    "card6_title": "Geo-Mapping",
    "card6_desc": "Cell tower triangulation response."
  },
  "how_it_works": {
    "title": "How it Works",
    "step1_title": "Dial *789#",
    "step1_desc": "No internet required. Instant triage access.",
    "step2_title": "F.A.S.T AI prompts",
    "step2_desc": "Interactive menu in your language.",
    "step3_title": "Alert Dispatch",
    "step3_desc": "Critical alerts pushed to hospitals."
  },
  "product": {
    "badge": "Unique Product",
    "title": "F.A.S.T USSD AI Agent",
    "desc": "AI engine in telecom networks. Internet-free diagnosis.",
    "card1_title": "Universal USSD",
    "card1_desc": "Zero FCFA charge. Africa's Talking infra.",
    "card2_title": "Google AI",
    "card2_desc": "Gemini-based FAST evaluation.",
    "card3_title": "Multilingual",
    "card3_desc": "Regional language detection.",
    "cta_title": "Clinical standard.",
    "cta_desc": "API alerts in seconds.",
    "cta_btn": "Dashboards"
  },
  "pricing": {
    "title": "Freemium model",
    "desc": "Free for patients. Minimal institutional costs.",
    "free_badge": "VITAL",
    "free_title": "Free User",
    "free_subtitle": "Free forever.",
    "premium_title": "Institutions",
    "premium_subtitle": "Hospitals & Ministries",
    "premium_price": "On Quote",
    "btn_free": "Dial *789#",
    "btn_premium": "Contact Sales",
    "ong_title": "NGO?",
    "ong_desc": "Free premium infrastructure for non-profits."
  },
  "institutions": {
    "badge": "Hospitals",
    "title1": "Save lives",
    "title2": "real-time.",
    "desc": "Tactical command room from USSD signals.",
    "demo_btn": "Demo",
    "alert_badge": "CRITICAL",
    "alert_patient": "Patient #8942 - FAST 3/3",
    "alert_zone": "Ikeja zone response.",
    "partners_title": "Trusted partners",
    "partners_desc": "United against stroke.",
    "card1_title": "Push Alerts",
    "card1_desc": "Instant screen notifications.",
    "card2_title": "Heatmaps",
    "card2_desc": "Identify neuro-critical clusters.",
    "card3_title": "Collaboration",
    "card3_desc": "Digitized PDF reports."
  },
  "developers": {
    "badge": "Open Source",
    "title": "Build with us",
    "desc": "Integrate FAST intelligence.",
    "sdk_title": "SDK & API",
    "sdk_desc": "Real-time telemetry for HIS.",
    "github_title": "GitHub",
    "github_desc": "MIT license AI engine.",
    "doc_btn": "Documentation",
    "github_btn": "GitHub"
  },
  "about": {
    "title": "Story & Mission",
    "desc": "AI diagnosis for everyone.",
    "problem_title": "The Problem",
    "problem_p1": "High stroke rates, late diagnosis.",
    "problem_p2": "Golden Hour is crucial.",
    "stats_problem": "Avoidable mortality",
    "solution_title": "The Solution",
    "solution_p1": "AI on a $10 keypad.",
    "solution_p2": "No smartphone needed.",
    "stats_solution": "95% mobile coverage"
  },
  "faq": {
    "title": "FAQ",
    "desc": "Tech and infra answers.",
    "q1": "Why USSD?",
    "a1": "Works without internet on any phone.",
    "q2": "Is it free?",
    "a2": "Yes, for all patients.",
    "q3": "How does AI detect?",
    "a3": "Modeled on FAST protocol.",
    "q4": "Shared data?",
    "a4": "Probability, location, tech onset time.",
    "q5": "Hospital sync?",
    "a5": "Institutional portal and webhooks."
  },
  "footer": {
    "lang": "Language",
    "rights": "All rights reserved."
  }
};

type Language = "fr" | "en";
type Translations = typeof dictionary_fr;

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const translations = { fr: dictionary_fr, en: dictionary_en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved && (saved === "fr" || saved === "en")) {
      setLanguage(saved);
    } else {
      const browserLang = typeof window !== 'undefined' ? navigator.language.split("-")[0] : 'fr';
      if (browserLang === "en") setLanguage("en");
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const t = translations[language] || dictionary_fr;

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "fr" as Language,
      t: dictionary_fr,
      setLanguage: () => {}
    };
  }
  return context;
};
