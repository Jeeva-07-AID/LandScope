import React, { useState, useEffect } from "react";
import { Globe, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface GovTopBannerProps {
  onFontSizeChange?: (delta: number) => void;
  onToggleHighContrast?: () => void;
  isHighContrast?: boolean;
}

export function GovTopBanner({
  onFontSizeChange,
  onToggleHighContrast,
  isHighContrast = false,
}: GovTopBannerProps) {
  const [timeStr, setTimeStr] = useState("02 Oct 2026 | 20:25:00 IST");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
          " | " +
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }) +
          " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#07172A] text-slate-300 text-[11px] font-sans border-b border-[#112A4A] select-none">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Platform Identity & Subtle Prototype Label */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">
            LANDScope
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-mono text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-amber-400/10 rounded border border-amber-400/20">
            SIH 2026 Prototype
          </span>
          <span className="text-slate-400 hidden lg:inline">
            • National Land Intelligence & Policy Decision Support Platform
          </span>
        </div>

        {/* Right: Accessibility & Live IST Clock */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{timeStr}</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Clean Font Size Controls */}
          <div className="flex items-center gap-1 bg-[#0A1C30] px-1.5 py-0.5 rounded border border-[#173860]">
            <button
              type="button"
              onClick={() => onFontSizeChange?.(-1)}
              className="px-1 text-[10px] text-slate-400 hover:text-white cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange?.(0)}
              className="px-1 text-[10px] text-slate-300 hover:text-white font-bold cursor-pointer"
              title="Reset Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange?.(1)}
              className="px-1 text-[10px] text-slate-400 hover:text-white cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={onToggleHighContrast}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] transition-colors cursor-pointer",
              isHighContrast
                ? "bg-white text-black border-white font-bold"
                : "bg-[#0A1C30] text-slate-300 border-[#173860] hover:text-white"
            )}
            title="Toggle High Contrast Display"
          >
            <Eye className="w-3 h-3 text-slate-400" />
            <span className="hidden md:inline">Contrast</span>
          </button>
        </div>
      </div>
    </div>
  );
}
