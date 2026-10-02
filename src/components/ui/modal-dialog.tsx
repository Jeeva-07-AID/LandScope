import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  maxWidth = "lg",
  className,
}: ModalDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "relative w-full bg-white border border-slate-300 rounded-sm shadow-xl z-50 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Institutional Top Indicator Line */}
        <div className="h-1 bg-[#112A4A] w-full" />

        {/* Dialog Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-col gap-0.5 pr-6">
            <div className="flex items-center gap-2">
              <h2 id="dialog-title" className="text-base font-bold text-[#0A1C30] tracking-tight">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-slate-500 font-normal">{subtitle}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-sm hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-5 overflow-y-auto text-sm text-slate-700 flex-1">{children}</div>

        {/* Dialog Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-3.5 bg-slate-50 border-t border-slate-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
