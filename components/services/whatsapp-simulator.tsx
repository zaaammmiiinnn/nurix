"use client";

import React, { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  userPrompt: string;
  botReply: string;
  actionsTriggered: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "real-estate",
    name: "Real Estate Lead Qualification",
    userPrompt: "Hi, I'm looking for a 4-bedroom villa in Dubai Hills Estate with a budget around AED 7.5M. Are there any ready units?",
    botReply: "Welcome to Elysian Properties. We have 3 verified ready villas in Dubai Hills Estate matching AED 7.2M - 7.6M. I can share the official floorplan brochures and book an in-person viewing with our senior broker Mr. Mansoor. Would tomorrow at 11:00 AM or 3:30 PM GST work for you?",
    actionsTriggered: [
      "Meta Cloud API Webhook Received (14ms)",
      "Intent Extracted: Buyer / Villa / AED 7.5M Budget",
      "Supabase CRM Lead Record Inserted (#LEAD-4829)",
      "Elysian Broker Calendar Slot Temporarily Held",
      "PDF Floorplan Dispatched to Client WhatsApp",
    ],
  },
  {
    id: "clinic",
    name: "Healthcare Appointment & Triage",
    userPrompt: "Hello, I need an urgent consultation with a dermatologist at your Dubai branch for tomorrow morning.",
    botReply: "Hello from Aura Wellness Clinics. Dr. Layla (Consultant Dermatologist) has an opening tomorrow at 10:15 AM at our Jumeirah 1 clinic. To reserve your consultation slot, please reply with your full name and insurance provider, or click to confirm.",
    actionsTriggered: [
      "Meta Cloud API Webhook Received (12ms)",
      "Specialty Tagged: Dermatology / Urgent",
      "EMR Schedule Slot Reserved for 15 minutes",
      "Insurance Eligibility Query Dispatched",
      "SMS & WhatsApp 24-hr reminder queued",
    ],
  },
  {
    id: "logistics",
    name: "B2B Freight Status & Tender Triage",
    userPrompt: "Please provide the current customs clearance status for Container BKG-99201 arriving at Jebel Ali Port.",
    botReply: "Container BKG-99201 passed Dubai Customs clearance today at 08:45 GST at Jebel Ali Terminal 2. The bill of lading and release voucher have been synced. Estimated dispatch to Al Quoz depot is today at 14:30 GST. Our operations officer is assigned.",
    actionsTriggered: [
      "Meta Cloud API Webhook Received (16ms)",
      "Container ID Validated against Port Webhook Feed",
      "Status Checked: Customs Cleared",
      "Dispatch Officer WhatsApp Group Pinged",
      "Delivery Note PDF Attached in Thread",
    ],
  },
];

export function WhatsAppSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);

  return (
    <div className="border border-stone bg-white p-6 sm:p-8 space-y-6">
      {/* Simulation Header / Warning Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone/80 text-[11px] font-mono text-olive">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
          <span className="text-charcoal font-semibold uppercase">LIVE CONVERSATION SIMULATOR</span>
        </div>
        <span className="px-2 py-0.5 bg-canvas border border-stone text-olive uppercase text-[10px]">
          ILLUSTRATIVE DEMO · ZERO REAL OUTBOUND MESSAGES
        </span>
      </div>

      {/* Scenario Selector Tabs */}
      <div>
        <label className="mono-label block text-[10px] text-olive uppercase mb-2">
          SELECT SAMPLE INQUIRY SCENARIO
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(scenario);
                }}
                className={`p-3 text-left border text-xs font-mono transition-colors cursor-pointer ${
                  isSelected
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-stone bg-canvas/40 text-charcoal hover:border-charcoal/40"
                }`}
              >
                <span className="block text-[10px] opacity-70 mb-0.5">USE CASE</span>
                <span className="font-sans font-medium text-xs line-clamp-1">{scenario.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Interface Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Phone Window */}
        <div className="lg:col-span-7 border border-stone bg-[#EFEAE2] p-4 sm:p-5 relative">
          <div className="flex items-center justify-between pb-3 mb-4 bg-white/90 border border-stone/70 p-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-mono text-xs font-bold">
                NW
              </div>
              <div>
                <span className="block font-medium text-charcoal">NeuralWaves Assistant</span>
                <span className="block text-[10px] text-emerald-700 font-mono">Official Meta Verified API</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-olive">DUBAI / UAE</span>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 min-h-[220px]">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#D9FDD3] text-charcoal p-3.5 text-xs shadow-sm border border-[#C5E8BF] rounded-lg rounded-tr-none">
                <p className="leading-relaxed font-sans">{selectedScenario.userPrompt}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] font-mono text-olive">
                  <span>10:42 AM</span>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <Check className="w-3 h-3 text-emerald-600 -ml-2" />
                </div>
              </div>
            </div>

            {/* Bot message */}
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white text-charcoal p-3.5 text-xs shadow-sm border border-stone/70 rounded-lg rounded-tl-none">
                <p className="leading-relaxed font-sans">{selectedScenario.botReply}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone/30 text-[9px] font-mono text-olive">
                  <span>LATENCY: 18ms</span>
                  <span>10:42 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Workflow Engine Telemetry */}
        <div className="lg:col-span-5 border border-stone bg-canvas p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone/80 text-[10px] font-mono text-olive uppercase">
            <span>AUTOMATED BACKEND ACTIONS</span>
            <span className="text-emerald-700 font-semibold">5 / 5 SUCCESS</span>
          </div>

          <p className="text-xs text-olive font-sans">
            Every conversation triggers programmatic API actions in the client&apos;s existing systems without manual human copying:
          </p>

          <div className="space-y-2">
            {selectedScenario.actionsTriggered.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 bg-white border border-stone/70 text-[11px] font-mono text-charcoal"
              >
                <span className="text-[10px] font-bold text-olive">0{idx + 1}</span>
                <span className="leading-tight">{action}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[10px] font-mono text-olive flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-charcoal" />
            <span>Deterministic guards prevent hallucinated pricing or commitments.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
