import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "saffron" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#173860] disabled:opacity-50 disabled:pointer-events-none select-none text-center cursor-pointer";

    const variantStyles = {
      // Primary: Institutional Government Blue
      primary:
        "bg-[#112A4A] text-white hover:bg-[#173860] active:bg-[#0A1C30] border border-[#0A1C30] shadow-xs",
      // Secondary: Clean slate institutional
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-300",
      // Outline: High contrast government border
      outline:
        "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-300 active:bg-slate-100 shadow-2xs",
      // Ghost: Subdued
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
      // Saffron: Indian official accent button
      saffron:
        "bg-[#D35E0E] text-white hover:bg-[#B44A08] active:bg-[#933904] border border-[#B44A08] shadow-xs",
      // Danger: Disputed / alert action
      danger:
        "bg-red-700 text-white hover:bg-red-800 active:bg-red-900 border border-red-800 shadow-xs",
      // Success: Approved / verified
      success:
        "bg-[#166534] text-white hover:bg-[#14532D] active:bg-[#052E16] border border-[#14532D] shadow-xs",
    };

    const sizeStyles = {
      xs: "text-xs px-2 py-1 gap-1 h-7",
      sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
      md: "text-sm px-3.5 py-2 gap-2 h-9",
      lg: "text-base px-5 py-2.5 gap-2.5 h-11",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-3.5 w-3.5 mr-1.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
