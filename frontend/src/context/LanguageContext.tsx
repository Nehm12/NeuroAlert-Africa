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
    "title": "Ingénierie & Triage",
    "desc": "NeuroAlert redéfinit l'urgence neuro-vasculaire via une infrastructure hybride USSD-AI. Nous déployons des protocoles cliniques critiques là où l'internet ne parvient pas.",
    "card1_title": "Inférence Neuronale USSD",
    "card1_desc": "Évaluation clinique prédictive via modèles Google Gemini sur infrastructure GSM héritée.",
    "card2_title": "Géo-Triangulation Cell-Tower",
    "card2_desc": "Dispatching d'urgence haute précision sans GPS ni internet dans les zones blanches.",
    "card3_title": "NLP Multi-Dialectal Local",
    "card3_desc": "Détection automatique des symptômes en Haoussa, Yoruba et Igbo via traitement du langage naturel.",
    "card4_title": "Télémétrie HIS EHR Sync",
    "card4_desc": "Synchronisation bidirectionnelle en temps réel avec les systèmes hospitaliers (OpenMRS/DHIS2).",
    "card5_title": "Infrastructure Zero-HTTP",
    "card5_desc": "Disponibilité opérationnelle critique en l'absence totale de couverture data ou internet.",
    "card6_title": "FAST Dématérialisé",
    "card6_desc": "Standardisation médicale internationale portée sur les réseaux mobiles via protocole USSD."
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
    "badge": "Ingénierie Clinique",
    "vanguard_badge": "VANGUARD CLINICAL GRADE",
    "title": "L'agent Neural USSD",
    "desc": "NeuroAlert transforme les réseaux GSM hérités en un moteur d'inférence diagnostique. Nous apportons la puissance de Google Gemini sur des terminaux à 10$, sans data ni internet.",
    "card1_title": "Interface Inférence USSD",
    "card1_desc": "Protocoles diagnostiques dématérialisés tournant sur infrastructure GSM (Zero-HTTP).",
    "card2_title": "Triangulation Cell-Tower",
    "card2_desc": "Localisation d'urgence haute précision par maillage d'antennes relais, sans GPS.",
    "card3_title": "Inférence NLP Native",
    "card3_desc": "Modèles de langage optimisés pour les dialectes africains (Français, Hausa, Yoruba, Igbo).",
    "cta_title": "Standard clinique. Partout.",
    "cta_desc": "Hôpitaux connectés via le dashboard d'alerte critique NeuroAlert pour une intervention en moins de 60s.",
    "cta_btn": "Voir le Dashboard",
    "triage_feed": "Flux de Triage Live",
    "mesh_title": "Architecture Mesh Zero-Data",
    "mesh_desc": "Intelligence clinique dématérialisée via le pont USSD-to-GEMINI.",
    "gsm_protocol": "Protocole Global GSM",
    "hipaa_compliant": "Inférence Conforme HIPAA",
    "gsm_uptime": "Disponibilité GSM",
    "latency_avg": "Latence Inférence",
    "inst_sync": "Sync Institutionnelle",
    "openmrs_reg": "Enregistré OpenMRS",
    "level1": "Niveau 1",
    "level1_desc": "Couche GSM",
    "level2": "Niveau 2",
    "level2_desc": "Passerelle USSD",
    "level3": "Niveau 3",
    "level3_desc": "Inférence Gemini",
    "level4": "Niveau 4",
    "level4_desc": "Dispatching PHI"
  },
  "pricing": {
    "title": "Modèle d'Impact & Échelle",
    "desc": "NeuroAlert assure une accessibilité universelle pour les populations civiles tout en offrant une ingénierie de pointe pour les infrastructures hospitalières.",
    "free_badge": "ACCÈS UNIVERSEL",
    "free_title": "Protocole Public",
    "free_subtitle": "Détection précoce pour les citoyens via USSD.",
    "btn_free": "Accès Gratuit *789#",
    "premium_title": "Command Center",
    "premium_subtitle": "Grade Institutionnel pour Hôpitaux & Ministères.",
    "premium_price": "Sur Devis",
    "btn_premium": "Contacter l'Ingénierie",
    "free_feat1": "Inférence IA Clinique Gemini",
    "free_feat2": "SMS d'urgence 100% Gratuits",
    "free_feat3": "Dispatching Géo-Triangulation",
    "premium_feat1": "Dashboard Triage Live temps-réel",
    "premium_feat2": "Alerting Push PHI (HIPAA Compliant)",
    "premium_feat3": "Synchronisation HIS (OpenMRS / DHIS2)",
    "premium_feat4": "Analytics Incidence Régionale",
    "premium_feat5": "Support Technique 24/7 Redondant",
    "premium_feat6": "Hébergement Cloud Souverain",
    "ong_title": "Partenariats Humanitaires",
    "ong_desc": "Nous collaborons avec les ONG internationales pour déployer NeuroAlert dans les zones de conflit et les camps de réfugiés."
  },
  "institutions": {
    "badge": "Infrastructure Clinique",
    "title1": "Le Command Center",
    "title2": "Neuro-Vasculaire.",
    "desc": "NeuroAlert déploie une couche logicielle d'alerte critique sur votre infrastructure existante. Nous synchronisons les données de triage USSD-IA directement avec vos services d'urgence.",
    "demo_btn": "Protocoles d'Intégration",
    "alert_badge": "ALERTE NIVEAU 1",
    "alert_patient": "Triage Clinique Gemini",
    "alert_zone": "Maillage GSM Zone Ouest",
    "partners_title": "Interconnexion Régionale",
    "partners_desc": "Nous collaborons avec les ministères de la santé et les opérateurs télécoms pour un déploiement souverain.",
    "card1_title": "Alerting PHI Temps-Réel",
    "card1_desc": "Reception instantanée des dossiers de triage sur le dashboard prioritaire NeuroAlert.",
    "card2_title": "Géo-Dispatching Précis",
    "card2_desc": "Visualisation cartographique des cas critiques par triangulation GSM sans dépendance GPS.",
    "card3_title": "Interopérabilité HIS",
    "card3_desc": "Synchronisation bidirectionnelle native avec OpenMRS, DHIS2 et les systèmes EHR propriétaires.",
    "interop_title": "Interopérabilité Sémantique",
    "interop_desc": "Nos protocoles supportent les standards HL7 FHIR pour une communication fluide entre les systèmes de santé.",
    "node_inference": "Nœud d'Inférence",
    "vitals_sync": "Sync Signes Vitaux",
    "feature1": "Accès Prioritaire PHI (HIPAA Compliant)",
    "feature2": "Interconnexion native HIS/EHR",
    "feature3": "Protocoles d'urgence automatisés"
  },
  "developers": {
    "badge": "Open Source",
    "title": "Ingénierie & Open Source",
    "desc": "Contribuez au moteur FAST AI et bâtissez l'infrastructure de triage de demain.",
    "fast_ai_title": "Architecture FAST AI",
    "fast_ai_desc": "Un moteur d'inférence neuronal conçu pour les environnements à faible bande passante, transformant les sessions USSD en diagnostics cliniques.",
    "contribute_title": "Contribuer au Projet",
    "contribute_desc": "NeuroAlert est un projet communautaire. Améliorez nos modèles de dialectes locaux ou optimisez l'infrastructure GSM.",
    "api_ref_title": "Référence API",
    "api_ref_desc": "Documentation complète sur les webhooks d'alerte, l'intégration HIS et les points de terminaison USSD.",
    "terminal_header": "fast-ai-engine --version 2.1.0",
    "stack_title": "Stack Technologique",
    "stack_desc": "Google Gemini Pro, Python 3.11, FastAPI, PostgreSQL, et protocoles USSD-GSM.",
    "sdk_title": "SDK & REST API",
    "sdk_desc": "Télémétrie USSD temps réel pour HIS (DHIS2, OpenMRS).",
    "github_title": "GitHub",
    "github_desc": "Moteur IA Open-source licence MIT.",
    "doc_btn": "Documentation",
    "github_btn": "GitHub"
  },
  "about": {
    "badge": "Qui Sommes-Nous ?",
    "title": "Pionniers du Triage Neuro-Vasculaire.",
    "desc": "NeuroAlert Africa est une initiative d'ingénierie médicale visant à éradiquer la mortalité évitable due aux AVC via l'intelligence artificielle dématérialisée.",
    "mission_title": "Notre Mission",
    "mission_p1": "Déployer une infrastructure de triage critique accessible à 1,3 milliard de personnes, sans dépendance à l'internet haut débit.",
    "vision_title": "Notre Vision",
    "vision_p1": "Devenir le standard de triage neurologique mondial pour les zones mal desservies.",
    "problem_title": "L'Urgence",
    "problem_p1": "L'AVC est l'une des principales causes de handicap et de décès en Afrique, exacerbé par un diagnostic tardif.",
    "problem_p2": "Chaque seconde sans triage réduit les chances de récupération motrice et cognitive.",
    "stats_problem": "Cas avec Diagnostic Tardif",
    "solution_title": "Innovation USSD-IA",
    "solution_p1": "Notre moteur FAST AI analyse les symptômes en temps réel via des sessions USSD légères.",
    "solution_p2": "Nous connectons l'IA de pointe Google Gemini aux téléphones 'feature' les plus simples.",
    "stats_solution": "Accessibilité Universelle"
  },
  "team": {
    "founders_title": "Co-Fondateurs",
    "builders_title": "Ingénierie & Développement",
    "experts_title": "Experts Cliniques",
    "mentors_title": "Mentors & Stratégie",
    "founder1_name": "Ibrahim Diallo",
    "founder1_role": "CEO & Architecte Visionnaire",
    "founder2_name": "Dr. Sarah Mensah",
    "founder2_role": "CTO & Architecte IA",
    "builder1_name": "Koffi Anan",
    "builder1_role": "Lead Backend Engineering",
    "builder2_name": "Anita Bello",
    "builder2_role": "Expert USSD & Frontend",
    "builder3_name": "Jean-Baptiste Traoré",
    "builder3_role": "Ingénieur Data & NLP",
    "builder4_name": "Fatimata Sow",
    "builder4_role": "Ops & Scalabilité",
    "expert1_name": "Dr. Samuel Okonkwo",
    "expert1_role": "Neurologue Chef - Lagos State Hospital",
    "expert2_name": "Dr. Maria Silva",
    "expert2_role": "Spécialiste en Médecine d'Urgence",
    "mentor1_name": "Prof. Jean Dupont",
    "mentor1_role": "Conseiller Stratégique Santé Mondiale",
    "mentor2_name": "Dr. Elena Rodriguez",
    "mentor2_role": "Expert en Déploiement Technologique"
  },
  "faq": {
    "title": "FAQ",
    "desc": "Réponses sur technique et infrastructure.",
    "q1": "Pourquoi l'USSD ?",
    "a1": "Fonctionne sans internet sur tous les téléphones (même à 10$).",
    "q2": "Gratuité ?",
    "a2": "L'accès au triage *789# est 100% gratuit pour tous les patients.",
    "q3": "Comment l'IA détecte l'AVC ?",
    "a3": "Via le protocole international F.A.S.T intégré en menu interactif.",
    "q4": "Confidentialité des données ?",
    "a4": "Données chiffrées (HIPAA/RGPD) et anonymisées lors du triage.",
    "q5": "Intégration hôpitaux ?",
    "a5": "Portail dédié Vanguard et Webhooks pour une alerte instantanée.",
    "q6": "Compatibilité HIS (Dhis2, OpenMRS) ?",
    "a6": "NeuroAlert s'intègre nativement avec les systèmes de gestion hospitalière via API.",
    "q7": "Fonctionne-t-il sans internet ?",
    "a7": "Oui. Toute la session de triage passe par le réseau GSM (Zero-HTTP).",
    "q8": "Langues supportées ?",
    "a8": "Haoussa, Yoruba, Igbo, Français et Anglais sont supportés nativement.",
    "q9": "Besoin de matériel spécifique ?",
    "a9": "Aucun. Pas de smartphone requis, un simple 'feature phone' suffit.",
    "q10": "Temps de réponse de l'IA ?",
    "a10": "L'inférence via notre moteur FAST AI prend moins de 5 secondes.",
    "q11": "Formation du personnel ?",
    "a11": "Le dashboard Vanguard est conçu pour être maîtrisé en moins de 30 min.",
    "q12": "Couverture géographique ?",
    "a12": "Disponible partout où un signal mobile GSM est détecté.",
    "support_title": "Besoin d'autre chose ?",
    "support_desc": "Notre équipe d'ingénierie clinique est disponible pour répondre à vos questions techniques.",
    "support_cta": "Contacter le Support"
  },
  "footer": {
    "lang": "Langue",
    "rights": "Tous droits réservés.",
    "resources": "RESSOURCES",
    "mission": "NOTRE MISSION",
    "legal": "LÉGAL",
    "history": "Notre Histoire",
    "contact": "Contact",
    "careers": "Carrières",
    "terms": "Conditions d'utilisation",
    "privacy": "Confidentialité"
  },
  "ussd_flow": {
    "step1": "Accès USSD",
    "step1_detail": "Composez *789#",
    "step2": "F - VISAGE",
    "step2_detail": "Affaissement du visage ?",
    "step3": "A - BRAS",
    "step3_detail": "Incapacité à lever les bras ?",
    "step4": "S - PAROLE",
    "step4_detail": "Trouble de l'élocution ?",
    "step5": "T - TEMPS",
    "step5_detail": "Extrême Urgence. Appelez.",
    "step6": "Analyse IA",
    "step6_detail": "Triage clinique instantané",
    "step7": "Alerte Urgence",
    "step7_detail": "Envoi immédiat à l'hôpital"
  },
  "dashboard": {
    "title": "Système d'Alerte Hospitalier",
    "queue": "File de Triage Active",
    "fast_score": "SCORE F.A.S.T",
    "dispatch": "DISPATCHING AMBULANCE",
    "eta": "ARRIVÉE ESTIMÉE : 8 MIN",
    "status_critical": "CRITIQUE",
    "status_stable": "STABLE",
    "status_pending": "EN ATTENTE",
    "master_node": "Nœud Master : Lagos",
    "triage_feed_desc": "Flux de Triage Live USSD"
  },
  "impact": {
    "badge": "Échelle & Impact",
    "title": "Résultats concrets.",
    "subtitle": "Chaque jour nous réduisons l'écart de soin.",
    "screenings": "Dépistages AVC",
    "screenings_desc": "Évaluations cliniques via USSD en Afrique.",
    "triage": "Vitesse de Triage",
    "triage_desc": "Amélioration du temps de prise en charge (Golden Hour).",
    "partners": "Hôpitaux Partenaires",
    "partners_desc": "Réseaux d'alerte clinique intégrés.",
    "reach": "Portée Mondiale",
    "reach_desc": "Grandes villes avec accès triage 24/7.",
    "validated": "Protocoles Cliniques Validés",
    "note": "En partenariat avec les ministères de la santé dans 12+ régions."
  },
  "chatbot": {
    "welcome": "Bienvenue sur NeuroAlert. Comment puis-je vous aider ?",
    "placeholder": "Écrivez votre message...",
    "title": "NeuroBot Assistant"
  },
  "contact": {
    "badge": "Contact & Support",
    "title": "Parlons de\nl'avenir du triage.",
    "subtitle": "Que vous soyez un citoyen avec une question ou une institution cherchant à déployer NeuroAlert, notre équipe d'ingénierie est à votre écoute.",
    "type_label": "Vous nous contactez en tant que :",
    "type_citizen": "Citoyen / Particulier",
    "type_institution": "Institution / Entreprise",
    "form_name": "Nom Complet",
    "form_email": "Email Professionnel",
    "form_institution": "Nom de l'Institution",
    "form_role": "Votre Rôle / Titre",
    "form_type": "Type d'Institution",
    "form_scale": "Échelle de Déploiement",
    "form_message": "Votre Message / Besoins Spécifiques",
    "form_submit": "Envoyer le Message",
    "success_title": "Message Envoyé",
    "success_msg": "Merci. Notre équipe d'ingénierie clinique examinera votre demande et vous contactera sous 24h.",
    "inst_types": {
      "hospital": "Hôpital / Centre de Santé",
      "ministry": "Ministère de la Santé",
      "ngo": "Organisation Non-Gouvernementale",
      "telecom": "Opérateur Télécom",
      "other": "Autre"
    },
    "scales": {
      "local": "Local (Une Ville)",
      "regional": "Régional (Une Province)",
      "national": "National (Tout le Pays)"
    }
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
    "title": "Engineering & Triage",
    "desc": "NeuroAlert redefines neuro-vascular emergency via a hybrid USSD-AI infrastructure. We deploy critical clinical protocols where the internet cannot reach.",
    "card1_title": "USSD-Native Neural Inference",
    "card1_desc": "Predictive clinical stroke evaluation via Google Gemini models on legacy GSM infrastructure.",
    "card2_title": "Cell-Tower Triangulation",
    "card2_desc": "GPS-less high-precision emergency dispatch and mapping for remote/white zones.",
    "card3_title": "Multi-Dialectal Native NLP",
    "card3_desc": "Automatic symptom detection in Hausa, Yoruba, and Igbo using Natural Language Processing.",
    "card4_title": "EHR HIS Real-time Telemetry",
    "card4_desc": "Seamless bidirectional sync with hospital management systems (OpenMRS/DHIS2).",
    "card5_title": "Offline Zero-HTTP Resilience",
    "card5_desc": "Mission-critical operations in total absence of internet or data coverage.",
    "card6_title": "Dematerialized FAST Protocol",
    "card6_desc": "International clinical standards deployed on mobile networks via USSD protocol."
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
    "badge": "Clinical Engineering",
    "vanguard_badge": "VANGUARD CLINICAL GRADE",
    "title": "The USSD Neural Agent",
    "desc": "NeuroAlert transforms legacy GSM networks into a diagnostic inference engine. We bring the power of Google Gemini to $10 mobile devices—without data or internet.",
    "card1_title": "USSD-Native Inference",
    "card1_desc": "Dematerialized diagnostic protocols running on regional GSM infrastructure (Zero-HTTP).",
    "card2_title": "Cell-Tower Triangulation",
    "card2_desc": "High-precision emergency mapping via carrier match mesh, no GPS required.",
    "card3_title": "Native NLP Inference",
    "card3_desc": "LLM-optimized diagnostics for African dialects (English, Hausa, Yoruba, Igbo).",
    "cta_title": "Clinical standard. Anywhere.",
    "cta_desc": "Hospitals connected via NeuroAlert critical alert dashboard for interventions in under 60 seconds.",
    "cta_btn": "View Physician Dashboard",
    "triage_feed": "Live Triage Feed",
    "mesh_title": "Zero-Data Mesh Architecture",
    "mesh_desc": "Operational clinical intelligence delivered via USSD-to-GEMINI bridge.",
    "gsm_protocol": "Global GSM Protocol",
    "hipaa_compliant": "HIPAA Compliant Inference",
    "gsm_uptime": "GSM Uptime",
    "latency_avg": "Inference Latency",
    "inst_sync": "Institutional Sync",
    "openmrs_reg": "OpenMRS Registered",
    "level1": "Level 1",
    "level1_desc": "GSM Layer",
    "level2": "Level 2",
    "level2_desc": "USSD Gateway",
    "level3": "Level 3",
    "level3_desc": "Gemini Inference",
    "level4": "Level 4",
    "level4_desc": "PHI Dispatch"
  },
  "pricing": {
    "title": "Impact & Scale Model",
    "desc": "NeuroAlert ensures universal accessibility for civil populations while providing advanced clinical engineering for hospital infrastructures.",
    "free_badge": "UNIVERSAL ACCESS",
    "free_title": "Public Protocol",
    "free_subtitle": "Early detection for citizens via USSD.",
    "btn_free": "Free Access *789#",
    "premium_title": "Command Center",
    "premium_subtitle": "Institutional Grade for Hospitals & Ministries.",
    "premium_price": "Custom Quote",
    "btn_premium": "Contact Engineering",
    "free_feat1": "Gemini Clinical AI Inference",
    "free_feat2": "100% Free Emergency SMS",
    "free_feat3": "Geo-Triangulation Dispatch",
    "premium_feat1": "Live Triage Dashboard (Real-time)",
    "premium_feat2": "Push PHI Alerting (HIPAA Compliant)",
    "premium_feat3": "HIS Synchronization (OpenMRS / DHIS2)",
    "premium_feat4": "Regional Incidence Analytics",
    "premium_feat5": "24/7 Redundant Technical Support",
    "premium_feat6": "Sovereign Cloud Hosting",
    "ong_title": "Humanitarian Partnerships",
    "ong_desc": "We collaborate with international NGOs to deploy NeuroAlert in conflict zones and refugee camps."
  },
  "institutions": {
    "badge": "Clinical Infrastructure",
    "title1": "Institutional Neuro-",
    "title2": "Vascular Command Center.",
    "desc": "NeuroAlert deploys a critical alert software layer on your existing infrastructure. We sync USSD-AI triage data directly with your emergency services.",
    "demo_btn": "Integration Protocols",
    "alert_badge": "LEVEL 1 ALERT",
    "alert_patient": "Gemini Clinical Triage",
    "alert_zone": "West Zone GSM Mesh",
    "partners_title": "Regional Interconnection",
    "partners_desc": "We collaborate with Ministries of Health and telecom operators for sovereign deployment.",
    "card1_title": "Real-time PHI Alerting",
    "card1_desc": "Instant reception of triage records on the NeuroAlert priority dashboard.",
    "card2_title": "Precision Geo-Dispatch",
    "card2_desc": "Map visualization of critical cases via GSM triangulation without GPS dependency.",
    "card3_title": "HIS Interoperability",
    "card3_desc": "Native bidirectional sync with OpenMRS, DHIS2, and proprietary EHR systems.",
    "interop_title": "Semantic Interoperability",
    "interop_desc": "Our protocols support HL7 FHIR standards for seamless communication between health systems.",
    "node_inference": "Inference Node",
    "vitals_sync": "Vitals Sync",
    "feature1": "Priority PHI Access (HIPAA Compliant)",
    "feature2": "Native HIS/EHR Interconnection",
    "feature3": "Automated Emergency Protocols"
  },
  "developers": {
    "badge": "Open Source",
    "title": "Engineering & Open Source",
    "desc": "Contribute to the FAST AI engine and build the triage infrastructure of tomorrow.",
    "fast_ai_title": "FAST AI Architecture",
    "fast_ai_desc": "A neural inference engine designed for low-bandwidth environments, transforming USSD sessions into clinical diagnostics.",
    "contribute_title": "How to Contribute",
    "contribute_desc": "NeuroAlert is a community-driven project. Improve local dialect models or help optimize GSM infrastructure.",
    "api_ref_title": "API Reference",
    "api_ref_desc": "Full documentation on alert webhooks, HIS integration, and USSD endpoints.",
    "terminal_header": "fast-ai-engine --version 2.1.0",
    "stack_title": "Technology Stack",
    "stack_desc": "Google Gemini Pro, Python 3.11, FastAPI, PostgreSQL, and legacy USSD-GSM protocols.",
    "sdk_title": "SDK & API",
    "sdk_desc": "Real-time telemetry for HIS.",
    "github_title": "GitHub",
    "github_desc": "MIT license AI engine.",
    "doc_btn": "Documentation",
    "github_btn": "GitHub"
  },
  "about": {
    "badge": "Who We Are",
    "title": "Pioneers of Neuro-Vascular Triage.",
    "desc": "NeuroAlert Africa is a medical engineering initiative dedicated to eradicating preventable stroke mortality through dematerialized artificial intelligence.",
    "mission_title": "Our Mission",
    "mission_p1": "To deploy a critical triage infrastructure accessible to 1.3 billion people, without dependence on broadband internet.",
    "vision_title": "Our Vision",
    "vision_p1": "To become the global neurological triage standard for underserved areas.",
    "problem_title": "The Emergency",
    "problem_p1": "Stroke is a leading cause of disability and death in Africa, exacerbated by late diagnosis.",
    "problem_p2": "Every second without triage reduces the chances of motor and cognitive recovery.",
    "stats_problem": "Cases with Late Diagnosis",
    "solution_title": "USSD-AI Innovation",
    "solution_p1": "Our FAST AI engine analyzes symptoms in real-time through lightweight USSD sessions.",
    "solution_p2": "We connect Google Gemini's advanced AI to the simplest feature phones.",
    "stats_solution": "Universal Accessibility"
  },
  "team": {
    "founders_title": "Co-Founders",
    "builders_title": "Engineering & Development",
    "experts_title": "Clinical Experts",
    "mentors_title": "Mentors & Strategy",
    "founder1_name": "Ibrahim Diallo",
    "founder1_role": "CEO & Visionary Architect",
    "founder2_name": "Dr. Sarah Mensah",
    "founder2_role": "CTO & AI Architect",
    "builder1_name": "Koffi Anan",
    "builder1_role": "Lead Backend Engineering",
    "builder2_name": "Anita Bello",
    "builder2_role": "USSD & Frontend Expert",
    "builder3_name": "Jean-Baptiste Traoré",
    "builder3_role": "Data & NLP Engineer",
    "builder4_name": "Fatimata Sow",
    "builder4_role": "Ops & Scalability",
    "expert1_name": "Dr. Samuel Okonkwo",
    "expert1_role": "Chief Neurologist - Lagos State Hospital",
    "expert2_name": "Dr. Maria Silva",
    "expert2_role": "Emergency Medicine Specialist",
    "mentor1_name": "Prof. Jean Dupont",
    "mentor1_role": "Strategic Global Health Advisor",
    "mentor2_name": "Dr. Elena Rodriguez",
    "mentor2_role": "Technological Deployment Expert"
  },
  "faq": {
    "title": "FAQ",
    "desc": "Tech and infra answers.",
    "q1": "Why USSD?",
    "a1": "Works without internet on any phone (even $10 ones).",
    "q2": "Is it free?",
    "a2": "Access to *789# triage is 100% free for all patients.",
    "q3": "How does AI detect stroke?",
    "a3": "Modeled on the international F.A.S.T protocol integrated into an interactive menu.",
    "q4": "Data Privacy?",
    "a4": "Encrypted (HIPAA/GDPR compliant) and anonymized during triage.",
    "q5": "Hospital sync?",
    "a5": "Dedicated Vanguard portal and Webhooks for instant alerting.",
    "q6": "HIS Compatibility (DHIS2, OpenMRS)?",
    "a6": "NeuroAlert integrates natively with hospital management systems via API.",
    "q7": "Does it work without internet?",
    "a7": "Yes. The entire triage session runs over the GSM network (Zero-HTTP).",
    "q8": "Supported Languages?",
    "a8": "Hausa, Yoruba, Igbo, French, and English are natively supported.",
    "q9": "Need specific hardware?",
    "a9": "None. No smartphone required; a simple 'feature phone' is sufficient.",
    "q10": "AI Response Time?",
    "a10": "Inference via our FAST AI engine takes less than 5 seconds.",
    "q11": "Staff Training?",
    "a11": "The Vanguard dashboard is designed to be mastered in under 30 minutes.",
    "q12": "Geographical Coverage?",
    "a12": "Available anywhere a GSM mobile signal is detected.",
    "support_title": "Need anything else?",
    "support_desc": "Our clinical engineering team is available to answer your technical questions.",
    "support_cta": "Contact Support"
  },
  "footer": {
    "lang": "Language",
    "rights": "All rights reserved.",
    "resources": "RESOURCES",
    "mission": "OUR MISSION",
    "legal": "LEGAL",
    "history": "Our Story",
    "contact": "Contact",
    "careers": "Careers",
    "terms": "Terms of Use",
    "privacy": "Privacy Policy"
  },
  "ussd_flow": {
    "step1": "USSD Access",
    "step1_detail": "Dial *789#",
    "step2": "F - FACE",
    "step2_detail": "Is it sagging?",
    "step3": "A - ARM",
    "step3_detail": "Can't raise arms?",
    "step4": "S - SPEECH",
    "step4_detail": "Slurred speech?",
    "step5": "T - TIME",
    "step5_detail": "Extreme Urgency. Call.",
    "step6": "AI Analysis",
    "step6_detail": "Instant clinical triage",
    "step7": "Emergency Alert",
    "step7_detail": "Immediate Hospital Dispatch"
  },
  "dashboard": {
    "title": "Hospital Alert System",
    "queue": "Active Triage Queue",
    "fast_score": "F.A.S.T SCORE",
    "dispatch": "AMBULANCE DISPATCHING",
    "eta": "ESTIMATED ARRIVAL: 8 MIN",
    "status_critical": "CRITICAL",
    "status_stable": "STABLE",
    "status_pending": "PENDING",
    "master_node": "Master Node: Lagos",
    "triage_feed_desc": "Real-time USSD Triage Feed"
  },
  "impact": {
    "badge": "Scale & Impact",
    "title": "Real-world results.",
    "subtitle": "Scaling hope globally and reducing the care gap.",
    "screenings": "Stroke Screenings",
    "screenings_desc": "USSD-based clinical assessments in Africa.",
    "triage": "Triage Speed",
    "triage_desc": "Improvement in time-to-treatment (Golden Hour).",
    "partners": "Hospital Partners",
    "partners_desc": "Integrated clinical alert networks.",
    "reach": "Global Reach",
    "reach_desc": "Major cities with 24/7 triage access.",
    "validated": "Validated Clinical Protocols",
    "note": "Partnering with health ministries in 12+ regions."
  },
  "chatbot": {
    "welcome": "Welcome to NeuroAlert. How can I help you today?",
    "placeholder": "Type your message...",
    "title": "NeuroBot Assistant"
  },
  "contact": {
    "badge": "Contact & Support",
    "title": "Let's talk about\nthe future of triage.",
    "subtitle": "Whether you are a citizen with a question or an institution looking to deploy NeuroAlert, our engineering team is here to help.",
    "type_label": "You are contacting us as:",
    "type_citizen": "Citizen / Individual",
    "type_institution": "Institution / Enterprise",
    "form_name": "Full Name",
    "form_email": "Professional Email",
    "form_institution": "Institution Name",
    "form_role": "Your Role / Title",
    "form_type": "Institution Type",
    "form_scale": "Deployment Scale",
    "form_message": "Your Message / Specific Requirements",
    "form_submit": "Send Message",
    "success_title": "Message Sent",
    "success_msg": "Thank you. Our clinical engineering team will review your request and contact you within 24 hours.",
    "inst_types": {
      "hospital": "Hospital / Health Center",
      "ministry": "Ministry of Health",
      "ngo": "Non-Governmental Organization",
      "telecom": "Telecom Operator",
      "other": "Other"
    },
    "scales": {
      "local": "Local (One City)",
      "regional": "Regional (One Province)",
      "national": "National (Full Country)"
    }
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

  const t = (translations[language] || dictionary_fr) as Translations;

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
