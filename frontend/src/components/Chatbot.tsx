"use client";
import { useState } from "react";
import { MessageSquare, X, Send, Activity, User } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(29,158,117,0.3)] flex items-center justify-center transition-all duration-500 z-[100] ${
          isOpen ? "bg-[#E24B4A] rotate-90" : "bg-[#1D9E75] hover:scale-110"
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <MessageSquare className="text-white" size={24} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF9F27] rounded-full border-2 border-white animate-pulse"></div>
        )}
      </button>

      {/* Chat Modal */}
      <div
        className={`fixed bottom-28 right-8 w-[350px] sm:w-[400px] bg-white rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.2)] border border-[#F1EFE8] flex flex-col overflow-hidden transition-all duration-500 z-[100] origin-bottom-right ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-[#04342C] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/20 flex items-center justify-center text-[#9FE1CB]">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">{t.chatbot.title}</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1AEEAF] animate-pulse"></div>
                <div className="text-[10px] text-white/50 uppercase font-black tracking-widest">Active Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 h-[400px] p-6 overflow-y-auto bg-[#F8F7F3] space-y-4">
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1D9E75] shrink-0">
              <Activity size={16} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-[#F1EFE8] text-sm text-[#5F5E5A] leading-relaxed">
              {t.chatbot.welcome}
            </div>
          </div>

          <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-[#1D9E75] shadow-sm flex items-center justify-center text-white shrink-0">
              <User size={16} />
            </div>
            <div className="bg-[#04342C] p-4 rounded-2xl rounded-tr-none shadow-md text-sm text-white leading-relaxed">
              I need information about stroke symptoms.
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#F1EFE8] flex items-center gap-3">
          <input
            type="text"
            placeholder={t.chatbot.placeholder}
            className="flex-1 bg-[#F8F7F3] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1D9E75] transition-all outline-none"
          />
          <button className="w-10 h-10 rounded-xl bg-[#1D9E75] text-white flex items-center justify-center shadow-lg hover:bg-[#085041] transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
      
      {/* Overlay for closing when clicking outside on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/5 z-[90] lg:hidden"
          onClick={toggleChat}
        ></div>
      )}
    </>
  );
}
