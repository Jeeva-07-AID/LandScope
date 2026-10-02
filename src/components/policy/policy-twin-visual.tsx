"use client";

import React from "react";
import {
  MapPin,
  Sliders,
  Play,
  BarChart3,
  FileCheck2,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyTwinVisualProps {
  activeStage?: number;
  onSelectStage?: (stage: number) => void;
  geographyName?: string;
  className?: string;
}

export function PolicyTwinVisual({
  activeStage = 3,
  onSelectStage,
  geographyName = "Sehore, Madhya Pradesh",
  className,
}: PolicyTwinVisualProps) {
  const steps = [
    {
      step: 1,
      title: "Current Land",
      subtitle: geographyName,
      icon: <MapPin className="w-3.5 h-3.5" />,
    },
    {
      step: 2,
      title: "Policy Scenario",
      subtitle: "Zoning & Moratoriums",
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
    {
      step: 3,
      title: "Simulation",
      subtitle: "Calibrate & Run",
      icon: <Play className="w-3.5 h-3.5" />,
    },
    {
      step: 4,
      title: "Impact Analysis",
      subtitle: "Multi-Sector Evaluation",
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
      step: 5,
      title: "Evidence & Decision",
      subtitle: "Explainability & Brief",
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav
      aria-label="Policy Simulation Workflow"
      className={cn(
        "bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3 font-sans",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Policy Digital Twin Workflow
          </span>
          <span className="text-xs text-slate-600 font-medium">
            Test policy decisions on digital cadastre before statutory gazetting
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <span>Active Step:</span>
          <strong className="text-[#112A4A] font-bold">
            {activeStage} of {steps.length}
          </strong>
        </div>
      </div>

      {/* Horizontal Stepper Grid */}
      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {steps.map((st) => {
          const isCompleted = activeStage > st.step;
          const isCurrent = activeStage === st.step;

          return (
            <li
              key={st.step}
              onClick={() => onSelectStage && onSelectStage(st.step)}
              className={cn(
                "relative p-2.5 rounded-sm border transition-all select-none text-left flex items-start gap-2.5",
                isCurrent &&
                  "bg-blue-50/70 border-[#112A4A] ring-1 ring-[#112A4A]/20 shadow-2xs",
                isCompleted &&
                  "bg-slate-50/90 border-slate-200 text-slate-700 hover:border-slate-300",
                !isCurrent && !isCompleted && "bg-white border-slate-200 text-slate-400 opacity-70",
                onSelectStage && "cursor-pointer"
              )}
            >
              {/* Step indicator circle */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors",
                  isCurrent && "bg-[#112A4A] text-white",
                  isCompleted && "bg-emerald-600 text-white",
                  !isCurrent && !isCompleted && "bg-slate-200 text-slate-600"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.step}
              </div>

              {/* Step Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <strong
                    className={cn(
                      "text-xs font-bold block truncate",
                      isCurrent ? "text-[#112A4A]" : isCompleted ? "text-slate-800" : "text-slate-500"
                    )}
                  >
                    {st.title}
                  </strong>
                </div>
                <span className="text-[10.5px] text-slate-500 block truncate">
                  {st.subtitle}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
