import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "official"
    | "gazetted"
    | "saffron"
    | "dispute"
    | "pending"
    | "cadastral"
    | "neutral"
    | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    // Official / Verified title / FRA approved
    official: "bg-emerald-50 text-emerald-800 border-emerald-300",
    // Gazetted notification / Government validated
    gazetted: "bg-[#E5EEF8] text-[#112A4A] border-[#C5D7ED]",
    // Saffron priority / National focus
    saffron: "bg-[#FEF2E8] text-[#B44A08] border-[#FED7AA]",
    // Active dispute / Encroachment alert / Litigation
    dispute: "bg-rose-50 text-rose-800 border-rose-300",
    // Under review / Pending demarcation
    pending: "bg-amber-50 text-amber-800 border-amber-300",
    // Cadastral / GIS spatial layer / Hydro
    cadastral: "bg-cyan-50 text-cyan-800 border-cyan-300",
    // Neutral slate
    neutral: "bg-slate-100 text-slate-700 border-slate-300",
    // Simple outline
    outline: "bg-white text-slate-700 border-slate-300",
  };

  const dotColors = {
    official: "bg-emerald-600",
    gazetted: "bg-[#112A4A]",
    saffron: "bg-[#D35E0E]",
    dispute: "bg-rose-600",
    pending: "bg-amber-500",
    cadastral: "bg-cyan-600",
    neutral: "bg-slate-500",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.2 gap-1 font-medium",
    md: "text-xs px-2 py-0.5 gap-1.5 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border uppercase tracking-wider select-none leading-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
