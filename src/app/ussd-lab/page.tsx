"use client";

import React, { useState, useEffect } from 'react';
import { USSDPhone } from '@/components/USSDPhone';

const SCENARIOS = {
  stroke_positive_en: {
    name: "Critical Stroke Alert (English)",
    steps: ["*555#", "2", "1", "1", "1", "1", "1", "1", "1", "Lagos, Central"],
    description: "Positive stroke detection with immediate emergency alert in English."
  },
  low_risk_en: {
    name: "Low Risk Case (English)",
    steps: ["*555#", "2", "1", "2", "2", "2", "2", "2", "2", "Abuja, Garki"],
    description: "Reassurance message when no critical signs are detected. (Location as text)"
  }
};

export default function USSDLabPage() {
  const [screenContent, setScreenContent] = useState("");
  const [currentIndices, setCurrentIndices] = useState(""); // Stores only clean choices like "1*2*1"
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`sess_${Math.random().toString(36).substr(2, 6)}`);
  const [phoneNumber] = useState("+2348000000000");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [logs, setLogs] = useState<{ type: 'in' | 'out', text: string, timestamp: string }[]>([]);

  const addLog = (type: 'in' | 'out', text: string) => {
    setLogs(prev => [{ type, text, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  const callBackend = async (cleanText: string) => {
    setIsLoading(true);
    addLog('out', `POST /api/ussd text="${cleanText}"`);

    try {
      const response = await fetch('/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          sessionId,
          phoneNumber,
          text: cleanText
        })
      });

      const data = await response.text();
      setScreenContent(data);
      addLog('in', data);
      return data;
    } catch (error) {
      setScreenContent("END Connection error.");
      return "END Error";
    } finally {
      setIsLoading(false);
    }
  };

  const onSend = (input: string) => {
    // 1. Initial Dialing (e.g. *555#)
    if (!screenContent && input.includes('*')) {
      setCurrentIndices(""); // Keep pure
      callBackend(""); // Start session
      return;
    }

    // 2. Already in session
    if (screenContent) {
      if (screenContent.startsWith("END ")) {
        // Reset if we send something after END
        setCurrentIndices("");
        setScreenContent("");
        return;
      }

      const nextIndices = currentIndices ? `${currentIndices}*${input}` : input;
      setCurrentIndices(nextIndices);
      callBackend(nextIndices);
    }
  };

  const runScenario = async (scenarioKey: keyof typeof SCENARIOS) => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    (window as any).stopCountdown = false;

    // Reset session
    setCurrentIndices("");
    setScreenContent("");
    addLog('out', "INITIALIZING DEMO SESSION...");

    // Step 1: Dialing code
    await new Promise(r => setTimeout(r, 1200));
    await callBackend(""); // Start

    // Step 2+: Real choices
    let rolling = "";
    const choices = SCENARIOS[scenarioKey].steps.slice(1);

    for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        const isClinicalStep = (i >= 2 && i <= 7);

        if (isClinicalStep) {
            addLog('out', `ANALYZING STEP ${i+1}/${choices.length}...`);
            setCountdown(40);
            
            for (let t = 40; t > 0; t--) {
                if ((window as any).stopCountdown) break;
                setCountdown(t);
                await new Promise(r => setTimeout(r, 1000));
            }
            (window as any).stopCountdown = false;
            setCountdown(null);
        } else {
            await new Promise(r => setTimeout(r, 1600));
        }

        rolling = rolling ? `${rolling}*${choice}` : choice;
        setCurrentIndices(rolling);
        const res = await callBackend(rolling);

        if (res && res.includes("END")) {
            addLog('out', ">>> FINAL ANALYSIS RESULT DELIVERED <<<");
            await new Promise(r => setTimeout(r, 7000)); // Maximum hold for audience response
            break;
        }
    }

    setCountdown(null);
    setIsAutoPlaying(false);
    addLog('out', "--- DEMO SESSION COMPLETED ---");
  };

  const skipAssessment = () => {
    setCountdown(null);
    (window as any).stopCountdown = true;
  };

  return (
    <div className="min-h-screen bg-[#040F0C] text-white pt-8 px-4 pb-8 font-sans flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8 flex flex-col items-center text-center">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#5DD6A8] to-[#0D7A5F] bg-clip-text text-transparent leading-tight lowercase tracking-tighter italic">NeuroAlert.ussd</h1>
          <p className="text-white/70 text-sm font-medium leading-relaxed max-w-md mx-auto">
            Experience the power of Google Gemini AI on legacy GSM networks. 
            <span className="block text-[10px] mt-1 opacity-40 uppercase tracking-[0.2em] font-black">Offline AI Triage Simulator</span>
          </p>
        </div>

        {/* Action Grid (Mini) */}
        <div className="w-full grid grid-cols-2 gap-3 max-w-sm">
          {Object.entries(SCENARIOS).map(([key, scenario]) => (
            <button
              key={key}
              disabled={isAutoPlaying}
              onClick={() => runScenario(key as any)}
              className="group relative bg-[#0D7A5F]/10 hover:bg-[#0D7A5F]/20 p-4 rounded-2xl border border-[#0D7A5F]/20 transition-all text-center disabled:opacity-30"
            >
              <div className="text-xs font-black text-[#5DD6A8] leading-tight uppercase tracking-widest">{scenario.name.replace(" (English)", "")}</div>
              <div className="text-[9px] text-white/50 mt-1 line-clamp-1">{scenario.description}</div>
            </button>
          ))}
        </div>

        {/* Centered Mini Phone */}
        <div className="relative py-12 mt-4">
          <USSDPhone
            onSend={onSend}
            screenContent={screenContent}
            isLoading={isLoading}
          />
        </div>

        {/* Telemetry (Mini & Stealth) */}
        <div className="w-full max-w-md bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase text-[#5DD6A8] font-black tracking-[0.3em]">Network Trace</h2>
            <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#5DD6A8] animate-pulse"></div>)}
            </div>
          </div>
          
          {countdown !== null && (
            <div className="mb-4 bg-[#5DD6A8]/5 border border-[#5DD6A8]/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-[#5DD6A8] border-t-transparent animate-spin"></div>
                <div className="text-[10px] font-bold text-[#5DD6A8]/80 uppercase tracking-widest">Waiting Assessment...</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-black text-[#5DD6A8]">{countdown}s</div>
                <button onClick={skipAssessment} className="text-[8px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md uppercase font-black border border-white/10">Skip</button>
              </div>
            </div>
          )}

          <div className="space-y-2 font-mono text-[9px] max-h-[140px] overflow-y-auto custom-scrollbar text-left scroll-smooth">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 py-1 border-b border-white/[0.03] ${log.type === 'out' ? 'text-[#5396ff]' : 'text-[#5DD6A8]'}`}>
                <span className="opacity-30 tabular-nums">[{log.timestamp}]</span>
                <span className="font-bold w-6">{log.type === 'out' ? 'TX' : 'RX'}</span>
                <span className="flex-1 opacity-80 break-all">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
