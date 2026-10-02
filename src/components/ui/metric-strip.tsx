import React from "react";
import { cn } from "@/lib/utils";

export interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtext?: string;
  caption?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export interface MetricStripProps {
  metrics: MetricItem[];
  className?: string;
}

export function MetricStrip({ metrics, className }: MetricStripProps) {
  // Cap strictly at 4 metrics maximum as per design guidelines
  const displayMetrics = metrics.slice(0, 4);

  return (
    <div
      className={cn(
        "bg-white border border-slate-200/90 rounded-sm shadow-2xs divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8",
        className
      )}
    >
      {displayMetrics.map((m, idx) => (
        <div key={idx} className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A1C30]">
                {m.value}
              </span>
              {m.change && (
                <span
                  className={cn(
                    "text-xs font-semibold font-mono",
                    (m.changeType === "positive" || (!m.changeType && m.trend === "up"))
                      ? "text-emerald-700"
                      : (m.changeType === "negative" || (!m.changeType && m.trend === "down"))
                      ? "text-rose-600"
                      : "text-slate-500"
                  )}
                >
                  {m.change}
                </span>
              )}
            </div>
            {(m.subtext || m.caption) && (
              <span className="text-[11px] text-slate-400 block">{m.subtext || m.caption}</span>
            )}
          </div>

          {m.icon && <div className="text-slate-400 shrink-0 p-1.5 bg-slate-50 rounded">{m.icon}</div>}
        </div>
      ))}
    </div>
  );
}
