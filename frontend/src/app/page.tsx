import Image from "next/image";
import { MessageSquare, Phone, MapPin, Activity, Globe, HeartPulse, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#101c26] text-white py-3 px-6 flex justify-center items-center gap-6 text-sm">
        <div>
          <span className="font-bold">Our USSD AI is now live across Africa.</span>
          <span className="ml-2 font-light hidden md:inline">Take advantage of fully automated stroke diagnostics in local languages.</span>
        </div>
        <button className="border border-white/40 px-4 py-1 rounded-full hover:bg-white/10 transition-colors text-xs whitespace-nowrap">
          Get Started
        </button>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f28b21] to-[#f5a652] hero-diagonal pb-40 text-white relative">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="w-8 h-8 bg-white text-[#f28b21] rounded-lg flex items-center justify-center font-bold text-xl">
              N
            </div>
            <span className="font-bold text-xl tracking-tight">NeuroAlert <span className="font-light">Africa</span></span>
          </div>
          
          <div className="hidden lg:flex flex-1 justify-center items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white/80 transition-colors">Product</a>
            <a href="#" className="hover:text-white/80 transition-colors">Pricing</a>
            <a href="#" className="hover:text-white/80 transition-colors">Platforms</a>
            <a href="#" className="hover:text-white/80 transition-colors">Developers</a>
            <a href="#" className="hover:text-white/80 transition-colors">About Us</a>
            <a href="#" className="hover:text-white/80 transition-colors">FAQ</a>
          </div>

          <button className="bg-white text-[#f28b21] px-8 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-shadow">
            Login
          </button>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 pt-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-5/12 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1]">
              Powering<br />
              Early Stroke<br />
              Outcomes
            </h1>
            <p className="text-lg text-white/90 leading-relaxed font-light">
              With simplified access to USSD infrastructure, healthcare providers use our powerful FAST AI, SMS, and Mobile Data APIs to bring life-saving triage systems directly to patients' feature phones.
            </p>
            <button className="bg-white text-[#f28b21] px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-lg transition-transform hover:-translate-y-0.5">
              Start building
            </button>
          </div>
          
          <div className="lg:w-7/12 relative mt-10 lg:mt-0">
            {/* Real Demo Image embedded in a tech mockup frame */}
            <div className="relative z-10 w-full max-w-xl mx-auto transform rotate-[-2deg] shadow-2xl rounded-2xl overflow-hidden border-8 border-white bg-white">
              <div className="h-6 bg-gray-100 flex items-center border-b border-gray-200">
                <div className="flex gap-1.5 ml-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
              </div>
              <img 
                src="/hero.png" 
                alt="Neurologist consulting using the platform" 
                className="w-full h-[350px] object-cover"
              />
            </div>
            
            {/* Floating Elements mimicking the Figma */}
            <div className="absolute -top-10 -right-4 bg-white p-4 rounded-xl shadow-xl transform rotate-[10deg] animate-bounce-slow">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <span className="text-[#f28b21]">*789#</span>
                Active USSD
              </div>
            </div>
            <div className="absolute bottom-10 -left-10 bg-white p-4 rounded-xl shadow-xl transform rotate-[-15deg]">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#f28b21]" />
                SMS Alert Sent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 relative z-10 -mt-20">
        <div className="lg:w-1/3 pt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Products</h2>
          <p className="text-gray-500 leading-relaxed font-light mb-8">
            We provide a variety of communication and diagnostic API products that are everything you need to build high-impact medical triage solutions. Our platform allows you to construct superior patient engagement experiences without the complexity that comes from working directly with mobile operators.
          </p>
        </div>
        
        <div className="lg:w-2/3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "USSD Triage", icon: Phone, desc: "Build real-time interactive menus that can be accessed on every type of mobile phone." },
            { title: "FAST AI Agent", icon: Activity, desc: "Evaluate stroke symptoms instantly using our embedded Gemini intelligence models." },
            { title: "SMS Alerts", icon: MessageSquare, desc: "Engage easily and effectively with patients and emergency teams through text." },
            { title: "Multilingual", icon: Globe, desc: "Reach patients in Hausa, Yoruba, Igbo, French, and English automatically." },
            { title: "Institution Data", icon: HeartPulse, desc: "Incentivise real-time patient syncing directly to hospital dashboards." },
            { title: "Geo-Mapping", icon: MapPin, desc: "Pinpoint emergency clusters dynamically using cell-tower triangulation APIs." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="h-24 w-20 bg-gray-50 rounded-xl mb-6 mx-auto relative flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <item.icon size={32} className="text-[#f28b21]" />
                <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-2 h-2"></div>
                <div className="absolute -bottom-2 -left-2 bg-yellow-400 rounded-full w-2 h-2"></div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{item.desc}</p>
              <a href="#" className="text-xs text-[#f28b21] font-semibold hover:underline">Learn More</a>
            </div>
          ))}
        </div>
      </section>

      {/* Video Band Section */}
      <section className="bg-[#e88028] py-20 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-white">
            <h2 className="text-3xl font-bold mb-6">Transforming Stroke Response through Voice</h2>
            <p className="font-light text-white/90 mb-4">
              Dr. Odede, a neurologist in Kenya built NeuroAlert, a web application that allows you to build your own patient call center. Using <strong className="font-bold">Voice Memo</strong>, you can connect with patients using various channels including inbound, outbound Voice and SMS.
            </p>
            <p className="font-light text-white/90 mb-8">
              Using our fully featured Voice API, Dr. Odede has been able to build a platform that supports many hospitals who are looking to enhance their emergency response experience.
            </p>
            <button className="bg-white text-[#e88028] px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-shadow">
              Read their story
            </button>
          </div>
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/50 aspect-video flex items-center justify-center">
              <img src="/hero.png" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <PlayCircle size={64} className="text-white relative z-10 cursor-pointer hover:scale-110 transition-transform" />
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded hidden md:flex items-center gap-2">
                <PlayCircle size={12} /> Watch on YouTube
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section - Simplified */}
      <section className="py-16 text-center border-b border-gray-100">
        <div className="flex justify-center items-center gap-12 grayscale opacity-50 flex-wrap">
           {/* Placeholder for Logos */}
           <h3 className="font-bold text-2xl tracking-tighter">Echo Mobile</h3>
           <h3 className="font-bold text-2xl tracking-tighter">JUMO</h3>
           <h3 className="font-bold text-2xl tracking-tighter">branch</h3>
        </div>
      </section>

      {/* Developer Section Split */}
      <section className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Code Area */}
        <div className="lg:w-1/2 bg-[#5d6a78] p-12 lg:p-24 flex items-center">
          <div className="bg-[#2c3e50] text-[#e0e6ed] w-full max-w-lg mx-auto rounded-lg shadow-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre overflow-x-auto">
            <span className="text-green-400"># import package</span>{"\n"}
            <span className="text-[#f28b21]">import</span> africastalking{"\n\n"}
            <span className="text-green-400"># initialize SDK</span>{"\n"}
            username = <span className="text-yellow-300">"YOUR_USERNAME"</span>{"\n\n"}
            <span className="text-green-400"># Initialize a service e.g. sms</span>{"\n"}
            sms = africastalking.SMS{"\n\n"}
            <span className="text-green-400"># Use the service synchronously</span>{"\n"}
            response = sms.send({`{`}{"\n"}
            {"  "}message: <span className="text-yellow-300">"FAST Stroke Alert: Patient needs immediate care!"</span>,{"\n"}
            {"  "}to: [<span className="text-yellow-300">"+2547XXXXXXX"</span>]{"\n"}
            {`}`}){"\n\n"}
            <span className="text-blue-300">print</span>(response)
          </div>
        </div>

        {/* Right Info Area */}
        <div className="lg:w-1/2 bg-[#f28b21] text-white p-12 lg:p-24 flex items-center">
          <div className="max-w-md">
            <div className="inline-block bg-red-600 px-3 py-1 rounded text-xs font-bold mb-6">NAAf Developers</div>
            <h2 className="text-3xl font-bold mb-6">Developer Resources</h2>
            <p className="font-light mb-4 leading-relaxed text-white/90">
              We have curated a set of developer tools that will make it easier for you to learn how to work with our APIs. These resources will help you build faster and test your applications before you deploy them to your users.
            </p>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#f28b21] transition-colors mt-4">
              See sample code
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative min-h-[300px] w-full opacity-40">
            {/* Extremely simple CSS map representation */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-2 p-10">
               {Array.from({length: 144}).map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${Math.random() > 0.6 ? 'bg-[#f28b21]' : Math.random() > 0.8 ? 'bg-gray-400' : 'bg-transparent'}`}></div>
               ))}
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                <Activity className="text-[#f28b21]" size={32} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">80+</div>
                <div className="text-gray-500 font-light">Telco Connections</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                <MapPin className="text-[#f28b21]" size={32} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">250,000+</div>
                <div className="text-gray-500 font-light">Screenings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101c26] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="font-bold text-xl mb-6">NeuroAlert <span className="text-[#f28b21]">Africa</span></div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">PRODUCTS</h4>
            <ul className="space-y-4">
              <li><a href="#" className="footer-link">SMS</a></li>
              <li><a href="#" className="footer-link">USSD</a></li>
              <li><a href="#" className="footer-link">Voice</a></li>
              <li><a href="#" className="footer-link">Airtime</a></li>
              <li><a href="#" className="footer-link">Mobile Data</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">RESOURCES</h4>
            <ul className="space-y-4">
              <li><a href="#" className="footer-link">Support</a></li>
              <li><a href="#" className="footer-link">Developers</a></li>
              <li><a href="#" className="footer-link">Github</a></li>
              <li><a href="#" className="footer-link">Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">COMPANY</h4>
            <ul className="space-y-4">
              <li><a href="#" className="footer-link">Our Story</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">LEGAL</h4>
            <ul className="space-y-4">
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-white/50">
          <div>NeuroAlert Africa. All rights reserved. © 2026</div>
          <div className="w-10 h-10 bg-[#0a121a] rounded-full flex items-center justify-center hover:bg-[#f28b21] transition-colors cursor-pointer">
            <MessageSquare size={16} />
          </div>
        </div>
      </footer>

    </main>
  );
}
