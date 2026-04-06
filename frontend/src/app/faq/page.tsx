export default function FaqPage() {
  const faqs = [
    { q: "Qu'est ce que l'USSD et pourquoi l'utiliser ?", a: "Contrairement à une application mobile classique, l'USSD (*789#) fonctionne sur tous les modèles de téléphones (feature phones) sans connexion internet. C'est la technologie la plus accessible en Afrique, utilisée au quotidien pour le transfert d'argent (Mobile Money)." },
    { q: "Le service est-il réellement gratuit pour les patients ?", a: "Oui. En partenariat avec les opérateurs télécoms et via le modèle Freemium financé par les requêtes hospitalières de pointe, le patient en détresse ne paie rien pour diagnostiquer et déclencher l'alerte." },
    { q: "Comment l'IA détecte un AVC sans voir le patient ?", a: "Le système utilise le protocole international F.A.S.T modélisé. Posant des questions simples à l'entourage (Est-ce que le visage est asymétrique ? Peut-il lever les bras ?), notre LLM évalue la cohérence clinique des réponses." },
    { q: "Quelles données sont partagées à l'hôpital ?", a: "En cas d'alerte critique, NeuroAlert pousse automatiquement un rapport contenant : le degré de probabilité, la localisation approximative Cell-Tower (si autorisée), et l'estimation de l'heure d'apparition (le 'Time' du F.A.S.T)." },
    { q: "Comment les hôpitaux peuvent-ils se connecter ?", a: "Les hôpitaux utilisent notre portail 'Institutions' pour visualiser la carte thermique. Des alertes Push et des Webhooks peuvent être configurés pour envoyer l'information dans leurs outils de gestion (HIS) existants." }
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#F8F7F3]">
      <section className="max-w-3xl mx-auto px-6 mb-16 text-center">
        <h1 className="font-serif text-5xl text-[#085041] mb-6">Foire Aux Questions</h1>
        <p className="text-lg text-[#5F5E5A] font-light leading-relaxed">
          Toutes les réponses à vos interrogations sur la plateforme, de la technique médicale à l'infrastructure réseau.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E1F5EE]">
              <h3 className="font-bold text-[#1a1a18] text-xl mb-3 flex gap-4">
                <span className="text-[#1D9E75] font-serif">Q.</span>
                {faq.q}
              </h3>
              <p className="text-[#5F5E5A] text-sm leading-relaxed pl-10 font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
