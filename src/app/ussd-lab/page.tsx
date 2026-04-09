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
    steps: ["*555#", "2", "1", "2", "2", "2", "2", "2", "2", "Abuja"],
    description: "Reassurance message when no critical signs are detected."
  }
};

export default function USSDLabPage() {
  const [screenContent, setScreenContent] = useState("");
  const [currentIndices, setCurrentIndices] = useState(""); // Stores only clean choices like "1*2*1"
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`sess_${Math.random().toString(36).substr(2, 6)}`);
  const [phoneNumber] = useState("+2348000000000");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
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
    } catch (error) {
      setScreenContent("END Connection error.");
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

    // Reset
    setCurrentIndices("");
    setScreenContent("");

    // Step 1: Dialing code
    addLog('out', `Auto-Dialing ${SCENARIOS[scenarioKey].steps[0]}...`);
    await new Promise(r => setTimeout(r, 800));
    await callBackend(""); // Start

    // Step 2+: Real choices
    let rolling = "";
    const choices = SCENARIOS[scenarioKey].steps.slice(1);

    for (const choice of choices) {
      await new Promise(r => setTimeout(r, 1800));
      rolling = rolling ? `${rolling}*${choice}` : choice;
      setCurrentIndices(rolling);
      await callBackend(rolling);
    }

    setIsAutoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#040F0C] text-white pt-6 px-8 pb-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5DD6A8] to-[#0D7A5F] bg-clip-text text-transparent">AI through USSD for Stroke Triage</h1>
            <p className="text-white/60 mt-2">
              <span className="text-[#5DD6A8] font-bold">Simulator:</span> Experience the power of 
              Google Gemini AI running on legacy GSM networks. No data or internet required for the user.
            </p>
          </div>

          <div className="bg-[#071A14] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Demo Scenarios</h2>
            {Object.entries(SCENARIOS).map(([key, scenario]) => (
              <button
                key={key}
                disabled={isAutoPlaying}
                onClick={() => runScenario(key as any)}
                className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl text-left border border-white/5 transition-all text-sm mb-2 disabled:opacity-50"
              >
                <div className="font-bold text-[#5DD6A8]">{scenario.name}</div>
                <div className="text-white/40 text-xs">{scenario.description}</div>
              </button>
            ))}
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xs uppercase text-white/40 mb-4 font-mono">Telemetry Logs</h2>
            <div className="space-y-2 font-mono text-[10px] max-h-[200px] overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 border-l-2 pl-2 ${log.type === 'out' ? 'text-blue-400 border-blue-400' : 'text-green-400 border-green-400'}`}>
                  <span className="opacity-40">{log.timestamp}</span>
                  <span className="font-bold">{log.type.toUpperCase()}</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <USSDPhone
            onSend={onSend}
            screenContent={screenContent}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
