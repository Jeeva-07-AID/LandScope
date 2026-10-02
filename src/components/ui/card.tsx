import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "accent-navy" | "accent-saffron" | "muted";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default: "bg-white border-slate-200 text-slate-900 shadow-2xs",
    elevated: "bg-white border-slate-300 text-slate-900 shadow-xs",
    "accent-navy": "bg-white border-slate-200 border-t-3 border-t-[#112A4A] shadow-2xs",
    "accent-saffron": "bg-white border-slate-200 border-t-3 border-t-[#D35E0E] shadow-2xs",
    muted: "bg-slate-50 border-slate-200 text-slate-800",
  };

  return (
    <div
      className={cn(
        "rounded-sm border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1 p-4 pb-3 border-b border-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-bold text-[#0A1C30] tracking-tight flex items-center justify-between",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-500 font-normal leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3.5 pt-2.5 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500",
        className
      )}
      {...props}
    />
  );
}
