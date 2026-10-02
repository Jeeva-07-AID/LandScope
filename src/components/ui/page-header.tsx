import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string | { text: string; variant?: "saffron" | "navy" | "green" | "neutral" };
  badgeVariant?: "saffron" | "navy" | "green" | "neutral";
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  badge,
  badgeVariant = "navy",
  action,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  const badgeStyles = {
    saffron: "bg-amber-50 text-amber-900 border-amber-200",
    navy: "bg-slate-100 text-slate-800 border-slate-200",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const badgeText = typeof badge === "object" && badge !== null ? badge.text : badge;
  const effectiveVariant =
    (typeof badge === "object" && badge !== null && badge.variant ? badge.variant : badgeVariant) || "navy";
  const effectiveSubtitle = subtitle || description;

  return (
    <div className={cn("space-y-2 pb-6 border-b border-slate-200/80 mb-8", className)}>
      {breadcrumbs && <div className="text-xs text-slate-500 mb-1">{breadcrumbs}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#0A1C30]">
              {title}
            </h1>
            {badgeText && (
              <span
                className={cn(
                  "text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded border tracking-wider",
                  badgeStyles[effectiveVariant]
                )}
              >
                {badgeText}
              </span>
            )}
          </div>
          {effectiveSubtitle && (
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {effectiveSubtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
