export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-white text-[#1a1a18]">
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <h1 className="font-serif text-5xl text-[#085041] mb-6">Notre Histoire & Mission</h1>
        <p className="text-lg text-[#5F5E5A] font-light leading-relaxed">
          Né d'un constat alarmant sur le retard de prise en charge des accidents vasculaires cérébraux (AVC) en Afrique Subsaharienne, NeuroAlert veut démocratiser l'accès au diagnostic instantané par Intelligence Artificielle pour les populations non connectées à internet.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl text-[#085041] mb-4">Le Problème</h2>
            <p className="text-[#5F5E5A] font-light leading-relaxed mb-4">
              L'Afrique enregistre 316 cas d'AVC pour 100 000 habitants, l'un des taux les plus élevés au monde. Le défi principal n'est pas médical, il est logistique : le diagnostic se fait trop tard car les populations reconnaissent mal les symptômes et n'ont pas accès rapidement à Internet pour chercher des informations.
            </p>
            <p className="text-[#5F5E5A] font-light leading-relaxed">
              Le standard « Golden Hour » (traiter l'AVC dans les 60 minutes) est souvent un mirage. 80% des décès liés à l'AVC peuvent être évités si une thrombolyse est administrée à temps.
            </p>
          </div>
          <div className="h-64 bg-[#E1F5EE] rounded-3xl p-8 flex items-center justify-center text-center">
             <div className="font-serif text-6xl text-[#E24B4A]">80%<div className="font-sans text-sm text-[#085041] mt-4 font-light">Mortalité évitable avec un<br/>diagnostic ultra-précoce</div></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center flex-row-reverse">
          <div className="order-2 md:order-1 h-64 bg-[#04342C] rounded-3xl p-8 flex items-center justify-center text-center">
             <div className="font-serif text-6xl text-[#1D9E75]">USSD<div className="font-sans text-sm text-[#E1F5EE] mt-4 font-light">95% de couverture mobile<br/>Sans connexion 3G/4G</div></div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-3xl text-[#085041] mb-4">La Solution</h2>
            <p className="text-[#5F5E5A] font-light leading-relaxed mb-4">
              En couplant la technologie USSD (universelle en Afrique) à un agent conversationnel d'IA (LLM), nous amenons l'expertise d'un neurologue directement sur le clavier alphanumérique d'un téléphone basique à 10$.
            </p>
            <p className="text-[#5F5E5A] font-light leading-relaxed">
              NeuroAlert ne demande ni téléchargement, ni forfait internet. Juste un numéro d'urgence *789# et un système de traduction IA conscient du contexte local (Français, Hausa, Yoruba).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
