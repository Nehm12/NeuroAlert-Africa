import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface USSDPhoneProps {
  onSend: (text: string) => void;
  screenContent: string;
  isLoading?: boolean;
}

export const USSDPhone: React.FC<USSDPhoneProps> = ({ onSend, screenContent, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll screen content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [screenContent]);

  const handleSend = () => {
    if (input.trim() || !screenContent) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="relative mx-auto w-[240px] h-[480px] bg-[#1a1a1a] rounded-[32px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-4 border-[#2a2a2a] flex flex-col items-center">
      {/* Speaker Bar (Retro) */}
      <div className="w-12 h-1 bg-[#333] rounded-full mb-6 mt-2"></div>

      {/* Screen Area (Smaller, Old-School) */}
      <div className="w-full flex-1 bg-[#0a0a0a] rounded-xl overflow-hidden flex flex-col border-2 border-black relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
        <div className="flex-1 overflow-y-auto pt-6 pb-2 px-3 custom-scrollbar relative z-0" ref={scrollRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={screenContent || 'dialer'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex flex-col justify-center items-center py-16 space-y-3">
                  <div className="w-6 h-6 border-2 border-[#5DD6A8] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[#5DD6A8] text-[8px] font-bold tracking-widest uppercase opacity-80">Loading...</span>
                </div>
              ) : (
                <div className="w-full flex flex-col justify-center items-center text-center">
                  {screenContent ? (
                    <div className="w-full text-left space-y-3">
                      <div className={`p-3 rounded-lg border ${
                        screenContent.includes("ALERTE") || screenContent.includes("DANGER") || screenContent.includes("STROKE")
                          ? "bg-red-950/40 border-red-500/30 text-red-200"
                          : screenContent.startsWith("END")
                          ? "bg-[#0D7A5F]/20 border-[#0D7A5F]/40 text-[#5DD6A8]"
                          : "bg-white/[0.03] border-white/10 text-white/90"
                      } text-[11px] font-medium leading-normal whitespace-pre-wrap`}>
                        {screenContent.startsWith("CON ") ? screenContent.slice(4) : 
                         screenContent.startsWith("END ") ? screenContent.slice(4) : screenContent}
                      </div>
                      
                      {!screenContent.startsWith("END ") && (
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          className="w-full bg-white/[0.05] border border-white/20 rounded-md px-2 py-2 text-white outline-none focus:border-[#5DD6A8]/50 text-xs"
                          placeholder="..."
                          autoFocus
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 opacity-20 py-16">
                       <div className="text-3xl grayscale">📱</div>
                       <div className="text-[10px] font-mono text-white tracking-widest uppercase">Select Scenario</div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Retro Send Button integrated into bottom of screen */}
        {!screenContent.startsWith("END ") && screenContent && (
            <button 
                onClick={handleSend}
                disabled={isLoading}
                className="mx-3 mb-3 bg-[#0D7A5F] hover:bg-[#128C6E] py-2 rounded-md text-white font-black text-[10px] uppercase transition-all disabled:opacity-30"
            >
                {isLoading ? "Wait..." : "Send"}
            </button>
        )}
      </div>

      {/* Physical Numeric Keypad (Mini Style) */}
      <div className="w-full px-1 mt-4 mb-2 grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
              <button
                  key={key}
                  onClick={() => setInput(prev => prev + key.toString())}
                  className="h-8 bg-[#252525] hover:bg-[#333] active:bg-[#444] rounded text-white/60 font-medium text-[10px] border-b-2 border-black"
              >
                  {key}
              </button>
          ))}
      </div>

      {/* Physical Bottom Controls */}
      <div className="w-full flex justify-around items-center px-4 mb-2">
          <div className="w-6 h-6 rounded-full border border-green-500/20 bg-green-500/5"></div>
          <div className="w-10 h-1 bg-[#333] rounded-full"></div>
          <div className="w-6 h-6 rounded-full border border-red-500/20 bg-red-500/5"></div>
      </div>
    </div>
  );
};
