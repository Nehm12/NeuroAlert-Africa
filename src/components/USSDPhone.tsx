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
    <div className="relative mx-auto w-[310px] h-[580px] bg-black rounded-[45px] border-[8px] border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-[#1a1a1a] rounded-full"></div>
      </div>

      {/* Screen Area */}
      <div className="flex-1 mt-8 mb-4 mx-3 bg-[#0a0a0a] rounded-[32px] overflow-hidden flex flex-col border border-white/5 relative">
        <div className="h-full flex flex-col pt-10 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={screenContent || 'dialer'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col"
            >
              {isLoading ? (
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="w-8 h-8 border-2 border-[#0D7A5F] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <span className="text-white/60 text-xs font-mono">Loading...</span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                  {screenContent ? (
                    <div className="w-full text-left space-y-4">
                      <div className="text-white/90 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {screenContent.startsWith("CON ") ? screenContent.slice(4) : 
                         screenContent.startsWith("END ") ? screenContent.slice(4) : screenContent}
                      </div>
                      
                      {!screenContent.startsWith("END ") && (
                        <div className="pt-2">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#0D7A5F]/50 transition-colors text-sm"
                            placeholder="Type here..."
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 opacity-40">
                       <div className="text-4xl text-center">📱</div>
                       <div className="text-xs uppercase tracking-widest font-bold text-white">Enter USSD Code</div>
                       <div className="text-[10px] text-white italic">e.g. *555#</div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Numeric Keypad for mouse interaction */}
        <div className="px-6 pb-2 grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
                <button
                    key={key}
                    onClick={() => setInput(prev => prev + key.toString())}
                    className="h-10 bg-white/5 hover:bg-white/10 active:bg-white/20 rounded-lg text-white font-medium text-sm transition-colors border border-white/5"
                >
                    {key}
                </button>
            ))}
            <div className="col-span-3 mt-1">
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-full bg-[#0D7A5F] hover:bg-[#10916F] py-3 rounded-xl text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? "SENDING..." : "SEND / ENVOYER"}
                </button>
            </div>
        </div>

        {/* Fake Footer Controls */}
        <div className="h-12 bg-black/20 flex justify-center items-center mt-2">
            <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/5">
                <div className="w-3 h-3 rounded-sm border-2 border-white/40"></div>
            </div>
        </div>
      </div>
    </div>
  );
};
