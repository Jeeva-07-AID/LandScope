import React from "react";
import { Sliders, RotateCcw, Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ScenarioParameter {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  baseline: number;
}

export interface ScenarioControlsProps {
  parameters: ScenarioParameter[];
  onParameterChange: (id: string, value: number) => void;
  onReset: () => void;
  onRunSimulation: () => void;
  isSimulating?: boolean;
  className?: string;
}

export function ScenarioControls({
  parameters,
  onParameterChange,
  onReset,
  onRunSimulation,
  isSimulating = false,
  className,
}: ScenarioControlsProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-sm p-4 flex flex-col gap-4 font-sans text-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#D35E0E]" />
          <div>
            <h4 className="text-xs font-bold text-[#0A1C30] uppercase tracking-wider">
              Policy Simulation Parameters
            </h4>
            <span className="text-[11px] text-slate-500">
              Adjust regulatory levers to model spatio-economic outcomes
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Sliders Stack */}
      <div className="space-y-4">
        {parameters.map((param) => {
          const isModified = param.value !== param.baseline;

          return (
            <div key={param.id} className="space-y-1.5 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-xs">{param.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#112A4A] font-tabular text-sm">
                    {param.value} {param.unit}
                  </span>
                  {isModified && (
                    <span className="text-[10px] text-orange-700 bg-orange-100 px-1 rounded">
                      (Base: {param.baseline})
                    </span>
                  )}
                </div>
              </div>

              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => onParameterChange(param.id, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#112A4A]"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Min: {param.min} {param.unit}</span>
                <span className="text-slate-500 italic">{param.description}</span>
                <span>Max: {param.max} {param.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Actions */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Equilibrium Engine Ready (v4.2)</span>
        </span>

        <Button
          variant="saffron"
          size="sm"
          onClick={onRunSimulation}
          isLoading={isSimulating}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
        >
          Compute Scenario Impact
        </Button>
      </div>
    </div>
  );
}
