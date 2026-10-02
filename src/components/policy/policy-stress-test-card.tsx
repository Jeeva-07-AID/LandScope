"use client";

import React from "react";
import { StressCondition } from "@/lib/policy/policy-twin-data";
import {
  Flame,
  CloudRain,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface PolicyStressTestCardProps {
  selectedStress: StressCondition;
  onSelectStress: (stress: StressCondition) => void;
}

export function PolicyStressTestCard({
  selectedStress,
  onSelectStress,
}: PolicyStressTestCardProps) {
  const conditions: Array<{
    id: StressCondition;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    impactSummary: string;
  }> = [
    {
      id: "Normal Conditions",
      label: "Normal Conditions",
      description: "Standard macroeconomic growth and average 920mm annual precipitation.",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      impactSummary: "Baseline model dynamics operate under historical trend assumptions.",
    },
    {
      id: "High Urban Growth",
      label: "High Urban Growth (+40%)",
      description: "Accelerated logistics influx; 1.4x higher warehousing conversion demand.",
      icon: <Building2 className="w-3.5 h-3.5" />,
      color: "text-amber-800 bg-amber-50 border-amber-300",
      impactSummary: "Agricultural conversion pressure increases by 40%; tested cap absorbs spike.",
    },
    {
      id: "Climate Stress",
      label: "Climate Stress (Drought)",
      description: "Consecutive deficient monsoons; subsoil infiltration down 35%.",
      icon: <Flame className="w-3.5 h-3.5" />,
      color: "text-rose-800 bg-rose-50 border-rose-300",
      impactSummary: "Pervious vegetative soil ratio becomes decisive to prevent deep aquifer collapse.",
    },
    {
      id: "Infrastructure Pressure",
      label: "Infrastructure Pressure",
      description: "Rapid arterial highway widening; 1.25x commercial strip allotment.",
      icon: <Zap className="w-3.5 h-3.5" />,
      color: "text-purple-800 bg-purple-50 border-purple-300",
      impactSummary: "Setbacks along Parvati tributaries buffer increased impervious surface velocity.",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#D35E0E]" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Policy Stress-Testing Sandbox
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
          Illustrative Scenario Stress Test
        </span>
      </div>

      <p className="text-[11px] text-slate-500">
        Evaluate scenario resilience under demographic shocks and climatic anomalies before finalizing statutory gazette drafting.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {conditions.map((cond) => {
          const isSelected = selectedStress === cond.id;
          return (
            <button
              key={cond.id}
              type="button"
              onClick={() => onSelectStress(cond.id)}
              className={`p-3 rounded-sm border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? `${cond.color} shadow-xs ring-1 ring-[#112A4A]`
                  : "bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span>{cond.icon}</span>
                  <span>{cond.label}</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">{cond.description}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-200/60 text-[10px] italic">
                {cond.impactSummary}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
