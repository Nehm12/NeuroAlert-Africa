import { MapPin, BellRing, Users } from "lucide-react";

export default function InstitutionsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 font-sans bg-[#F8F7F3]">
      <section className="max-w-5xl mx-auto px-6 text-center mb-16">
        <span className="inline-block bg-[#E1F5EE] text-[#085041] font-bold px-4 py-1.5 rounded-full mb-6 text-xs uppercase tracking-wider">Hôpitaux et Ministères</span>
        <h1 className="font-serif text-4xl leading-tight md:text-6xl text-[#04342C] mb-6">Sauvez des vies,<br />visualisez l'urgence en temps réel.</h1>
        <p className="text-lg text-[#5F5E5A] max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Les tableaux de bord NeuroAlert Premium transforment les signaux USSD envoyés par la population en une salle de commande tactique pour les acteurs de la santé. Optimisez le déploiement de vos ambulances avant même que le patient n'arrive.
        </p>
        <button className="bg-[#1D9E75] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-[#0F6E56] transition-colors">Demander une démo</button>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-[#c8e6da] relative">
          {/* Dashboard Proxy Image */}
          <img src="https://placehold.co/1400x500/c8e6da/04342C/png?text=DASHBOARD+ANALYTICS" className="w-full h-[500px] object-cover mix-blend-multiply" alt="Institution Dashboard Analytics" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04342C] to-transparent opacity-80"></div>
          <div className="absolute bottom-10 left-10 text-white max-w-xl">
             <div className="bg-[#E24B4A] text-white text-xs font-bold px-3 py-1 rounded inline-block mb-3 animate-pulse">ALERTE CRITIQUE</div>
             <h3 className="font-serif text-3xl mb-2">Patient #8942 - Score FAST 3/3</h3>
             <p className="text-[#9FE1CB] font-light">Zone Ikeja. Distance estimée à l'hôpital: 4.2km. Equipe dispatchée.</p>
          </div>
        </div>
      </section>

      {/* Panorama des Institutions / Partenaires */}
      <section className="bg-white border-y border-[#E1F5EE] py-16 mb-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl text-[#085041] mb-2">Ils nous font confiance</h2>
          <p className="text-[#5F5E5A] font-light text-sm mb-12 max-w-2xl mx-auto">
            Gouvernements, acteurs mondiaux de la santé et opérateurs télécoms s'unissent autour de NeuroAlert pour démocratiser l'alerte d'urgence.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-70 hover:opacity-100 transition-all duration-500">
            {/* Santé Internationale */}
            <div className="flex justify-center">
              <img src="https://logo.clearbit.com/who.int" alt="OMS / WHO Logo" className="h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex justify-center">
              <img src="https://logo.clearbit.com/ifrc.org" alt="Croix Rouge" className="h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            
            {/* Telecoms */}
            <div className="flex justify-center">
              <img src="https://logo.clearbit.com/mtn.co.za" alt="MTN" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex justify-center">
              <img src="https://logo.clearbit.com/orange.com" alt="Orange" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex justify-center">
              <img src="https://logo.clearbit.com/airtel.africa" alt="Airtel" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E1F5EE]">
          <BellRing size={32} className="text-[#EF9F27] mb-6" />
          <h3 className="font-bold text-[#1a1a18] text-xl mb-3">Réception Push Push</h3>
          <p className="text-[#5F5E5A] text-sm leading-relaxed">Soyez notifié sur vos écrans institutionnels dès qu'un patient à proximité déclenche un test FAST majeur sur USSD.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E1F5EE]">
          <MapPin size={32} className="text-[#1D9E75] mb-6" />
          <h3 className="font-bold text-[#1a1a18] text-xl mb-3">Cartographie & Heatmaps</h3>
          <p className="text-[#5F5E5A] text-sm leading-relaxed">Identifiez les clusters d'événements neuro-critiques. Exportez vos analyses pour le Ministère de la Santé.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E1F5EE]">
          <Users size={32} className="text-[#085041] mb-6" />
          <h3 className="font-bold text-[#1a1a18] text-xl mb-3">Collaboration Médicale</h3>
          <p className="text-[#5F5E5A] text-sm leading-relaxed">Coordonnez les équipes d'intervention d'urgence. Partagez le rapport F.A.S.T instantanément via PDF digitalisé.</p>
        </div>
      </section>
    </main>
  );
}
