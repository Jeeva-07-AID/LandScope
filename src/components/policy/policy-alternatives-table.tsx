"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Minus,
  TrendingDown,
  TrendingUp,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyAlternativesTableProps {
  onSelectPreset?: (presetKey: "baseline" | "scenarioA" | "scenarioB") => void;
}

export function PolicyAlternativesTable({ onSelectPreset }: PolicyAlternativesTableProps) {
  const comparisonRows = [
    {
      dimension: "Agriculture",
      metric: "Annual Farmland Conversion",
      baseline: "1,200 Ha / Year (Loss)",
      scenarioA: "650 Ha / Year (Capped)",
      scenarioB: "300 Ha / Year (Strict Moratorium)",
      statusA: "+550 Ha Protected",
      statusB: "+900 Ha Protected",
    },
    {
      dimension: "Water",
      metric: "Aquifer Recharge Index",
      baseline: "44 / 100 (Critical)",
      scenarioA: "70 / 100 (Semi-Critical)",
      scenarioB: "84 / 100 (Safe)",
      statusA: "+26 Pts Recharge",
      statusB: "+40 Pts Recharge",
    },
    {
      dimension: "Ecology",
      metric: "Eco-Sensitive Buffer Zone",
      baseline: "250m Buffer (68% Canopy)",
      scenarioA: "750m Buffer (86% Canopy)",
      scenarioB: "1,200m Buffer (95% Canopy)",
      statusA: "+18% Protection",
      statusB: "+27% Protection",
    },
    {
      dimension: "Urban Development",
      metric: "Logistics Capacity Footprint",
      baseline: "78% Unregulated Expansion",
      scenarioA: "63% Managed Expansion",
      scenarioB: "48% Constrained Expansion",
      statusA: "-15% Absorption",
      statusB: "-30% Absorption",
    },
    {
      dimension: "Infrastructure",
      metric: "Peak Stormwater Runoff",
      baseline: "100% Inundation Baseline",
      scenarioA: "72% (-28% Runoff)",
      scenarioB: "58% (-42% Runoff)",
      statusA: "Moderate Drainage Relief",
      statusB: "High Drainage Relief",
    },
    {
      dimension: "Governance",
      metric: "Boundary Litigation Risk",
      baseline: "6.2% Disputed Parcels",
      scenarioA: "3.6% (-42% Plaints)",
      scenarioB: "3.6% (-42% Plaints)",
      statusA: "RTK Cadastre Enforced",
      statusB: "RTK Cadastre Enforced",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#112A4A]" />
            <span>Policy Alternatives Multi-Scenario Comparison</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Objective side-by-side comparison across 6 land governance dimensions (No subjective ranking)
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
          Illustrative Model Output
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] text-slate-600">
              <th className="p-2.5 font-bold">Dimension & Metric</th>
              <th className="p-2.5 font-bold text-slate-700 bg-slate-100/60">
                Baseline (Unregulated)
              </th>
              <th className="p-2.5 font-bold text-blue-900 bg-blue-50/40">
                Scenario A (Controlled Expansion)
              </th>
              <th className="p-2.5 font-bold text-emerald-900 bg-emerald-50/40">
                Scenario B (Agro Protection)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5">
                  <strong className="text-slate-900 block font-semibold">{row.dimension}</strong>
                  <span className="text-[11px] text-slate-500">{row.metric}</span>
                </td>
                <td className="p-2.5 bg-slate-50/40 font-mono text-slate-700">
                  {row.baseline}
                </td>
                <td className="p-2.5 bg-blue-50/20">
                  <span className="font-mono text-blue-900 font-semibold block">{row.scenarioA}</span>
                  <span className="text-[10px] text-blue-700 font-medium">({row.statusA})</span>
                </td>
                <td className="p-2.5 bg-emerald-50/20">
                  <span className="font-mono text-emerald-900 font-semibold block">{row.scenarioB}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">({row.statusB})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onSelectPreset && (
        <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 mr-2">Load Preset into Simulator:</span>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectPreset("baseline")}
          >
            Load Baseline
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectPreset("scenarioA")}
            className="border-blue-400 text-blue-900 bg-blue-50/30"
          >
            Load Scenario A
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelectPreset("scenarioB")}
            className="border-emerald-400 text-emerald-900 bg-emerald-50/30"
          >
            Load Scenario B
          </Button>
        </div>
      )}
    </div>
  );
}
