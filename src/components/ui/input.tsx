import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  compact?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      compact = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-red-600 font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full bg-white text-slate-900 border transition-all duration-150 rounded-sm font-sans placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#173860] focus:border-[#173860] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed",
              compact ? "h-8 text-xs px-2.5" : "h-9 text-sm px-3",
              leftIcon ? (compact ? "pl-7" : "pl-9") : "",
              rightIcon ? (compact ? "pr-7" : "pr-9") : "",
              error
                ? "border-red-500 focus:border-red-600 focus:ring-red-500"
                : "border-slate-300 hover:border-slate-400",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-slate-500 leading-tight">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
