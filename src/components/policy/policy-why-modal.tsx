"use client";

import React from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { Button } from "@/components/ui/button";
import { SimulationEvidenceTrail } from "@/lib/policy/policy-twin-data";
import {
  FileText,
  Database,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calculator,
  Compass,
} from "lucide-react";

interface PolicyWhyModalProps {
  trail: SimulationEvidenceTrail | null;
  isOpen: boolean;
  onClose: () => void;
  onViewResearch?: (refNum: string) => void;
}

export function PolicyWhyModal({
  trail,
  isOpen,
  onClose,
  onViewResearch,
}: PolicyWhyModalProps) {
  if (!trail) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={trail.title}
      subtitle={`Policy Digital Twin Explainability • ${trail.question}`}
      badge={
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
          {trail.status}
        </span>
      }
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-[11px] text-slate-500 italic">
            LANDScope Evidence-to-Decision Trace (SIH26019)
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs" onClick={onClose}>
              Close
            </Button>
            {onViewResearch && (
              <Button
                variant="primary"
                size="xs"
                onClick={() => {
                  onClose();
                  onViewResearch(trail.evidenceSource.reference);
                }}
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              >
                View Supporting Research
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs text-slate-700">
        {/* Core Question & Answer Banner */}
        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-sm">
          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block mb-1">
            Simulated Hypothesis & Question
          </span>
          <p className="text-purple-950 font-bold text-sm leading-snug">
            {trail.question}
          </p>
        </div>

        {/* Structured 6-Step Evidence Trace */}
        <div className="space-y-2.5">
          {/* 1. Evidence Source */}
          <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <span className="p-1 bg-slate-100 rounded text-[#112A4A]">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <span>1. Supporting Empirical Study</span>
            </div>
            <p className="text-slate-800 font-medium pl-6">{trail.evidenceSource.title}</p>
            <div className="text-[11px] text-slate-500 pl-6 flex items-center gap-2">
              <span>{trail.evidenceSource.author} ({trail.evidenceSource.year})</span>
              <span>•</span>
              <span className="font-mono text-slate-600">Ref: {trail.evidenceSource.reference}</span>
            </div>
            <p className="text-[11px] text-slate-600 italic pl-6 pt-0.5">
              &ldquo;{trail.evidenceSource.quote}&rdquo;
            </p>
          </div>

          {/* 2. Spatial Data & Historical Trend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Spatial Layer Linkage</span>
              </div>
              <p className="text-slate-800 text-[11px] leading-snug">{trail.spatialLayer}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Compass className="w-3.5 h-3.5 text-blue-700" />
                <span>3. Historical Trend (2018–2026)</span>
              </div>
              <p className="text-slate-800 text-[11px] leading-snug">{trail.historicalTrend}</p>
            </div>
          </div>

          {/* 3. Scenario Parameter & Calculation Details */}
          <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <span className="p-1 bg-slate-100 rounded text-amber-700">
                <Calculator className="w-3.5 h-3.5" />
              </span>
              <span>4. Scenario Parameter & Mathematical Model</span>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-slate-800 font-medium">
                <strong>Parameter:</strong> {trail.scenarioParameter}
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                {trail.calculationDetails}
              </div>
            </div>
          </div>

          {/* 4. Limitations */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] text-slate-600 space-y-1">
            <strong className="text-slate-700 block uppercase text-[10px] tracking-wider">
              Model Assumptions & Limitations
            </strong>
            <p>{trail.limitations}</p>
          </div>
        </div>

        {/* Prototype notice */}
        <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-sm text-[11px] text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Illustrative Model Output:</strong> This calculation is an illustrative scenario simulation designed for Smart India Hackathon prototype evaluation. It does not represent an official Government of India projection.
          </span>
        </div>
      </div>
    </ModalDialog>
  );
}
