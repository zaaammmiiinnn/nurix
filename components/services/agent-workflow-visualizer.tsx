"use client";

import React, { useState } from "react";

interface WorkflowStage {
  step: string;
  name: string;
  category: string;
  status: string;
  description: string;
  technicalTelemetry: string;
}

const STAGES: WorkflowStage[] = [
  {
    step: "01",
    name: "Incoming Request",
    category: "INGESTION",
    status: "COMPLETE",
    description: "Multi-channel webhook intake triggers the agent via PDF email attachment, scanned trade license, or CRM webhook event.",
    technicalTelemetry: "POST /api/v1/inbound-webhook [Payload: 1.4MB PDF Base64]",
  },
  {
    step: "02",
    name: "Retrieve Data",
    category: "EXTRACTION",
    status: "COMPLETE",
    description: "Optical Character Recognition (OCR) and vector embeddings extract line items, commercial registration numbers, and dates into structured JSON.",
    technicalTelemetry: "Zod Schema: { taxId: string, totalAed: number, lineItems: Array }",
  },
  {
    step: "03",
    name: "Validate",
    category: "POLICY EVALUATION",
    status: "COMPLETE",
    description: "Business rule validation checks totals against purchase orders, verifies tax numbers against UAE FTA registry, and confirms margin limits.",
    technicalTelemetry: "ConstraintCheck: VAT 5% match OK · PO Reference #9942 matched",
  },
  {
    step: "04",
    name: "Execute Action",
    category: "SYSTEM DISPATCH",
    status: "COMPLETE",
    description: "Automated tool execution updates ERP ledger, reconciles invoice line items, and generates payment voucher drafts in staging.",
    technicalTelemetry: "Dispatched to Oracle / Zoho Books API · 200 OK Response",
  },
  {
    step: "05",
    name: "Human Approval",
    category: "GOVERNANCE GATEWAY",
    status: "GATE CHECKED",
    description: "High-value transactions or confidence scores below 98% automatically route to a senior finance officer on Slack / WhatsApp for 1-click sign-off.",
    technicalTelemetry: "Threshold > AED 10,000 → Notification Dispatched to CFO WhatsApp",
  },
];

export function AgentWorkflowVisualizer() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = STAGES[activeStep];

  return (
    <div className="border border-stone bg-white p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone/80 text-[11px] font-mono text-olive">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
          <span className="text-charcoal font-semibold uppercase">5-STAGE AUTONOMOUS WORKFLOW PIPELINE</span>
        </div>
        <span className="px-2 py-0.5 bg-canvas border border-stone text-olive uppercase text-[10px]">
          DETERMINISTIC RUNTIME · AUDIT LOGGED
        </span>
      </div>

      {/* 5-Stage Stepper Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {STAGES.map((s, idx) => {
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3 text-left border transition-all cursor-pointer ${
                isSelected
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-stone bg-canvas/30 text-charcoal hover:border-charcoal/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                <span className={isSelected ? "text-stone" : "text-olive"}>{s.step}</span>
                <span className={isSelected ? "text-emerald-400" : "text-emerald-700"}>✓</span>
              </div>
              <p className="font-sans font-medium text-xs line-clamp-1">{s.name}</p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border border-stone/80 bg-canvas/40 p-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-olive">
            <span className="text-charcoal font-semibold">STAGE {current.step}</span>
            <span>{"//"}</span>
            <span>{current.category}</span>
          </div>

          <h4 className="font-display font-medium text-2xl text-charcoal tracking-tight">
            {current.name}
          </h4>

          <p className="text-sm text-olive leading-relaxed font-sans">
            {current.description}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 text-xs font-mono border border-stone bg-white text-charcoal disabled:opacity-40 cursor-pointer"
            >
              ← Previous Stage
            </button>
            <button
              type="button"
              disabled={activeStep === STAGES.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(STAGES.length - 1, prev + 1))}
              className="px-3 py-1.5 text-xs font-mono border border-charcoal bg-charcoal text-white disabled:opacity-40 cursor-pointer"
            >
              Next Stage →
            </button>
          </div>
        </div>

        {/* Technical Telemetry & Audit Frame */}
        <div className="lg:col-span-5 border border-stone bg-white p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone/70 text-[10px] text-olive uppercase">
            <span>REAL-TIME AUDIT LOG</span>
            <span className="text-emerald-700">VERIFIED</span>
          </div>

          <div className="bg-canvas p-3 border border-stone/50 text-[11px] text-charcoal leading-relaxed font-mono">
            <p className="text-olive mb-1">{"// TELEMETRY STATE"}</p>
            <p>{current.technicalTelemetry}</p>
          </div>

          <div className="space-y-1.5 text-[10px] text-olive pt-1">
            <p>• IMMUTABLE AUDIT TRAIL PRESERVED</p>
            <p>• ZERO LLM PROMPT INJECTION VULNERABILITY</p>
            <p>• SOC2 COMPLIANT ENCRYPTION AT REST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
