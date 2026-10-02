import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
    label?: string;
    isPositiveGood?: boolean;
  };
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "navy" | "saffron" | "green" | "red" | "neutral";
  };
  description?: string;
  className?: string;
  accentBar?: "navy" | "saffron" | "green" | "teal" | "none";
}

export function StatCard({
  title,
  value,
  unit,
  change,
  icon,
  badge,
  description,
  className,
  accentBar = "none",
}: StatCardProps) {
  const accentClasses = {
    none: "",
    navy: "border-t-3 border-t-[#112A4A]",
    saffron: "border-t-3 border-t-[#D35E0E]",
    green: "border-t-3 border-t-[#166534]",
    teal: "border-t-3 border-t-[#0E7490]",
  };

  const badgeVariants = {
    navy: "bg-[#E5EEF8] text-[#112A4A] border-[#C5D7ED]",
    saffron: "bg-[#FEF2E8] text-[#B44A08] border-[#FED7AA]",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    red: "bg-rose-50 text-rose-800 border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const getTrendColor = () => {
    if (!change) return "";
    const isGood = change.isPositiveGood ?? true;
    if (change.trend === "neutral") return "text-slate-500";
    if (change.trend === "up") return isGood ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold";
    if (change.trend === "down") return isGood ? "text-rose-700 font-semibold" : "text-emerald-700 font-semibold";
    return "text-slate-600";
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-sm p-4 flex flex-col justify-between transition-all hover:border-slate-300 shadow-2xs",
        accentClasses[accentBar],
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-snug">
          {title}
        </span>
        {icon && (
          <div className="text-slate-400 p-1 bg-slate-50 rounded border border-slate-100 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Row */}
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-black text-[#0A1C30] tracking-tight font-tabular">
          {value}
        </span>
        {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
      </div>

      {/* Footer / Context Row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
        {change && (
          <div className={cn("flex items-center gap-1 text-[11px]", getTrendColor())}>
            {change.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
            {change.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
            {change.trend === "neutral" && <Minus className="w-3.5 h-3.5" />}
            <span>{change.value}</span>
            {change.label && <span className="text-slate-500 font-normal">{change.label}</span>}
          </div>
        )}

        {badge && (
          <span
            className={cn(
              "px-1.5 py-0.5 text-[10px] font-semibold border rounded-sm ml-auto",
              badgeVariants[badge.variant || "neutral"]
            )}
          >
            {badge.text}
          </span>
        )}

        {!change && !badge && description && (
          <span className="text-[11px] text-slate-500 truncate">{description}</span>
        )}
      </div>
    </div>
  );
}
