import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[var(--gray-100)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--green-800)] rounded-xl flex items-center justify-center">
              <span className="text-white font-display text-xl">N</span>
            </div>
            <span className="font-display text-2xl tracking-tight text-[var(--green-900)]">NeuroAlert <span className="text-[var(--green-400)]">Africa</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#impact" className="nav-link">Impact</a>
            <a href="#partners" className="nav-link">Partners</a>
            <button className="btn-primary">Institutional Access</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-50)] border border-[var(--green-100)] rounded-full">
              <span className="w-2 h-2 bg-[var(--green-400)] rounded-full animate-pulse"></span>
              <span className="text-[var(--green-800)] text-sm font-medium">Real-time Stroke Detection</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-display leading-[1.1]">
              In a stroke, <br />
              <span className="text-[var(--green-600)] italic">every minute</span> counts.
            </h1>
            <p className="text-xl text-[var(--gray-600)] max-w-xl leading-relaxed">
              Dial <strong className="text-[var(--green-900)] font-bold">*789#</strong> from any mobile phone. 
              Our AI guides you through the FAST test in 60 seconds and alerts emergency services instantly—no internet required.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="btn-primary flex items-center gap-2">
                Learn How it Works
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y2="12" x1="19" y1="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button className="btn-secondary">View Case Study</button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--green-100)] rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[var(--amber)] rounded-full opacity-10 blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* Note: In a real app, I'd use the generated image path here */}
              <div className="aspect-square bg-[var(--green-900)] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-900)]/60 to-transparent z-10"></div>
                {/* Simulated high-tech overlay */}
                <div className="absolute top-6 right-6 z-20 glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--red)] rounded-full"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--gray-900)]">Active Alert</span>
                  </div>
                  <div className="text-xs font-medium">Lagos, Ikeja Zone</div>
                </div>
                <img 
                  src="/hero.png" 
                  alt="NeuroAlert in Action"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { label: "Stroke incidence in SSA", val: "316", unit: "per 100k" },
              { label: "3-year mortality rate", val: "80%", unit: "without early care" },
              { label: "Global strokes annually", val: "15M", unit: "per WHO" },
              { label: "USSD Connectivity", val: "95%", unit: "across Africa" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl font-display text-[var(--green-800)] mb-2 group-hover:scale-110 transition-transform">
                  {stat.val}
                </div>
                <div className="text-sm font-medium text-[var(--gray-900)]">{stat.label}</div>
                <div className="text-[10px] text-[var(--gray-300)] uppercase tracking-wider mt-1">{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAST Section */}
      <section id="how-it-works" className="py-24 bg-[var(--gray-50)]">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-display mb-6">How NeuroAlert Saves Lives</h2>
          <p className="text-[var(--gray-600)] text-lg">
            Our platform simplifies complex medical diagnostics into a 60-second USSD interaction.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Dial *789#", desc: "Access the system from any mobile device instantly.", highlight: "No Internet" },
            { step: "02", title: "Guided FAST Test", desc: "Interactive symptom check in your local language.", highlight: "AI-Powered" },
            { step: "03", title: "Instant Analysis", desc: "Probabilities calculated in real-time by our agents.", highlight: "Zero Latency" },
            { step: "04", title: "Emergency Response", desc: "Automatic alerts to rescue teams and family.", highlight: "Life-Saving" }
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 relative overflow-hidden group hover:border-[var(--green-400)] transition-colors">
              <div className="text-5xl font-display text-[var(--green-50)] absolute -top-2 -right-2 opacity-50 group-hover:text-[var(--green-100)] transition-colors">
                {item.step}
              </div>
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--green-400)] mb-4">{item.highlight}</div>
                <h3 className="text-xl mb-4">{item.title}</h3>
                <p className="text-sm text-[var(--gray-600)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--green-900)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--green-800)]/20 -skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-8">
            Are you a healthcare institution?
          </h2>
          <p className="text-[var(--green-100)] text-xl max-w-2xl mx-auto mb-12">
            Join the network. Get access to the real-time alerting dashboard and help us reduce response times across the continent.
          </p>
          <div className="flex justify-center gap-6">
            <button className="bg-white text-[var(--green-900)] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
              Request a Demo
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Impact Reports
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[var(--gray-900)] text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale brightness-200">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[var(--green-900)] font-display text-lg">N</span>
            </div>
            <span className="font-display text-xl tracking-tight">NeuroAlert</span>
          </div>
          <div className="flex gap-8 text-[var(--gray-300)] text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-[var(--gray-600)] text-xs">
            © 2026 NeuroAlert Africa. All rights reserved. Built for Harvard HSIL Hackathon.
          </p>
        </div>
      </footer>
    </main>
  );
}
