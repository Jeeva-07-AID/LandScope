import React from "react";

interface LandScopeLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  variant?: "light" | "dark" | "navy";
  subtitle?: string;
}

export function LandScopeLogo({
  className = "",
  size = "md",
  showTagline = false,
  variant = "navy",
  subtitle = "National Land Intelligence, Research & Policy Innovation Platform",
}: LandScopeLogoProps) {
  // Dimensions
  const iconSize = size === "sm" ? 32 : size === "md" ? 40 : 48;
  const titleSize = size === "sm" ? "text-base font-bold" : size === "md" ? "text-lg font-bold" : "text-2xl font-black";
  const subSize = size === "sm" ? "text-[10px]" : size === "md" ? "text-[11px]" : "text-xs";

  const isDark = variant === "dark";
  const titleColor = isDark ? "text-white" : "text-[#0A1C30]";
  const subColor = isDark ? "text-slate-300" : "text-slate-600";
  const accentColor = isDark ? "text-orange-400" : "text-[#D35E0E]";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Original Geometric Emblem: Terrain contours + Map coordinate grid + Data intelligence nodes */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200"
          aria-label="LANDScope Geometric Emblem"
        >
          {/* Base Hexagonal/Shield Frame */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="7"
            fill={isDark ? "#112A4A" : "#0A1C30"}
            stroke={isDark ? "#204B7D" : "#173860"}
            strokeWidth="1.5"
          />

          {/* GIS Coordinate Grid Lines (Subtle) */}
          <line x1="4" y1="18" x2="44" y2="18" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8" />
          <line x1="4" y1="31" x2="44" y2="31" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8" />
          <line x1="18" y1="4" x2="18" y2="44" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8" />
          <line x1="31" y1="4" x2="31" y2="44" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8" />

          {/* Terrain / Land Contours (Layered Polygon) */}
          <path
            d="M8 36L18 24L26 31L34 20L40 27V40C40 42.2091 38.2091 44 36 44H12C9.79086 44 8 42.2091 8 40V36Z"
            fill="#166534"
            fillOpacity="0.35"
          />
          <path
            d="M8 38L20 28L28 34L35 25L40 30V40C40 42.2091 38.2091 44 36 44H12C9.79086 44 8 42.2091 8 40V38Z"
            fill="#166534"
            fillOpacity="0.6"
          />

          {/* Precision Topographic Vector Contour Line */}
          <path
            d="M8 33C14 26 22 28 27 22C32 16 36 21 40 18"
            stroke="#D35E0E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cadastral Polygon Highlight with Saffron Point */}
          <polygon
            points="18,12 28,10 32,18 22,20"
            fill="#0E7490"
            fillOpacity="0.45"
            stroke="#38BDF8"
            strokeWidth="1.2"
          />

          {/* Intelligence Nodes / Satellite Data Points */}
          <circle cx="28" cy="10" r="2.2" fill="#D35E0E" />
          <circle cx="28" cy="10" r="4.2" stroke="#D35E0E" strokeWidth="0.8" strokeOpacity="0.6" />
          <circle cx="18" cy="24" r="1.8" fill="#38BDF8" />
          <circle cx="34" cy="20" r="1.8" fill="#4ADE80" />
        </svg>
      </div>

      {/* Brand Nomenclature */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSize} tracking-tight ${titleColor}`}>
            LAND<span className={accentColor}>Scope</span>
          </span>
        </div>

        {subtitle && (
          <span className={`${subSize} font-medium ${subColor} tracking-tight line-clamp-1`}>
            {subtitle}
          </span>
        )}

        {showTagline && (
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Explore • Analyze • Simulate • Decide
          </span>
        )}
      </div>
    </div>
  );
}
