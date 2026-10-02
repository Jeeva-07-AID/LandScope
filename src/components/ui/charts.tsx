import React, { useState } from "react";
import { cn } from "@/lib/utils";

// 1. Multi-Year LULC (Land Use / Land Cover) Trend Chart
export interface LulcTrendPoint {
  year: string;
  agriculture: number; // in thousand hectares
  forest: number;
  builtUp: number;
  waterBodies: number;
}

export interface LulcTrendChartProps {
  data: LulcTrendPoint[];
  height?: number;
  className?: string;
}

export function LulcTrendChart({
  data,
  height = 220,
  className,
}: LulcTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Normalization bounds
  const maxY = 100; // percentages
  const width = 600;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / (data.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxY) * innerHeight;

  // Path builders
  const makeLinePath = (key: keyof Omit<LulcTrendPoint, "year">) => {
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[key] as number)}`)
      .join(" ");
  };

  return (
    <div className={cn("w-full flex flex-col font-sans", className)}>
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ minWidth: "460px" }}
        >
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={getY(tick)}
                x2={width - padding.right}
                y2={getY(tick)}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={tick === 0 ? "0" : "3,3"}
              />
              <text
                x={padding.left - 8}
                y={getY(tick) + 3}
                textAnchor="end"
                fontSize="10"
                fill="#64748B"
                className="font-tabular"
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* Series lines */}
          {/* 1. Agriculture (Muted Saffron) */}
          <path
            d={makeLinePath("agriculture")}
            fill="none"
            stroke="#D35E0E"
            strokeWidth="2.5"
          />

          {/* 2. Forest (Forest Green) */}
          <path
            d={makeLinePath("forest")}
            fill="none"
            stroke="#166534"
            strokeWidth="2"
          />

          {/* 3. Built-up (Government Navy) */}
          <path
            d={makeLinePath("builtUp")}
            fill="none"
            stroke="#112A4A"
            strokeWidth="2"
          />

          {/* 4. Water Bodies (Teal) */}
          <path
            d={makeLinePath("waterBodies")}
            fill="none"
            stroke="#0891B2"
            strokeWidth="1.8"
            strokeDasharray="4,2"
          />

          {/* Interactive Data Points & Hover Vertical Guideline */}
          {hoveredIdx !== null && (
            <line
              x1={getX(hoveredIdx)}
              y1={padding.top}
              x2={getX(hoveredIdx)}
              y2={padding.top + innerHeight}
              stroke="#0A1C30"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}

          {data.map((d, i) => (
            <g
              key={d.year}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Year label */}
              <text
                x={getX(i)}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                fill={hoveredIdx === i ? "#0A1C30" : "#64748B"}
                fontWeight={hoveredIdx === i ? "bold" : "normal"}
              >
                {d.year}
              </text>

              {/* Data circles */}
              <circle
                cx={getX(i)}
                cy={getY(d.agriculture)}
                r={hoveredIdx === i ? 4.5 : 3}
                fill="#ffffff"
                stroke="#D35E0E"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.forest)}
                r={hoveredIdx === i ? 4.5 : 2.5}
                fill="#ffffff"
                stroke="#166534"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.builtUp)}
                r={hoveredIdx === i ? 4.5 : 2.5}
                fill="#ffffff"
                stroke="#112A4A"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Institutional Legend & Hover Tooltip */}
      <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#D35E0E] inline-block" />
            <span className="text-[11px] text-slate-700 font-medium">Agriculture (44.2%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#166534] inline-block" />
            <span className="text-[11px] text-slate-700 font-medium">Forest Reserve (23.8%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#112A4A] inline-block" />
            <span className="text-[11px] text-slate-700 font-medium">Built-up / Urban (18.4%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0891B2] border-b border-dashed border-[#0891B2] inline-block" />
            <span className="text-[11px] text-slate-700 font-medium">Water Bodies (6.1%)</span>
          </div>
        </div>

        {hoveredIdx !== null && (
          <div className="text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            Year {data[hoveredIdx].year}: Agri {data[hoveredIdx].agriculture}% | Built {data[hoveredIdx].builtUp}%
          </div>
        )}
      </div>
    </div>
  );
}

// 2. District Benchmark Horizontal Bar Chart (Tenure Security Index)
export interface DistrictBenchmarkItem {
  district: string;
  state: string;
  score: number; // 0 - 100
  target: number;
  status: "high" | "medium" | "low";
}

export function DistrictIndexBarChart({
  items,
  className,
}: {
  items: DistrictBenchmarkItem[];
  className?: string;
}) {
  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200">
        <span className="font-semibold uppercase text-[10px] tracking-wider">
          District / Administrative Unit
        </span>
        <span className="font-semibold uppercase text-[10px] tracking-wider">
          Tenure Security Index (Out of 100)
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const barColor =
            item.score >= 80
              ? "bg-[#166534]"
              : item.score >= 60
              ? "bg-[#112A4A]"
              : "bg-[#D35E0E]";

          return (
            <div key={item.district} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">{item.district}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({item.state})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-tabular font-bold text-slate-800">{item.score}</span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Bar track */}
              <div className="relative w-full h-3 bg-slate-100 rounded-xs overflow-hidden border border-slate-200">
                {/* Benchmark marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                  style={{ left: `${item.target}%` }}
                  title={`National Target: ${item.target}`}
                />
                {/* Fill bar */}
                <div
                  className={cn("h-full transition-all duration-500 rounded-2xs", barColor)}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#166534] rounded-xs" /> High (80+)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#112A4A] rounded-xs" /> Moderate (60-79)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#D35E0E] rounded-xs" /> Needs Review (&lt;60)
          </span>
        </div>
        <span className="font-medium text-slate-600">National Average: 68.4</span>
      </div>
    </div>
  );
}

// 3. Policy Lab Scenario Impact Comparison Meter
export interface ScenarioMetric {
  label: string;
  baseline: number;
  simulated: number;
  unit: string;
  trend: "positive" | "negative" | "neutral";
}

export function ScenarioImpactMeter({
  metrics,
  className,
}: {
  metrics: ScenarioMetric[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      {metrics.map((m) => {
        const delta = Number((m.simulated - m.baseline).toFixed(1));
        const deltaPercent = Number(((delta / m.baseline) * 100).toFixed(1));
        const isUp = delta > 0;

        return (
          <div
            key={m.label}
            className="p-3 bg-slate-50 border border-slate-200 rounded-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{m.label}</span>
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                  m.trend === "positive"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : m.trend === "negative"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                {isUp ? `+${deltaPercent}%` : `${deltaPercent}%`}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#0A1C30] font-tabular">
                  {m.simulated}
                </span>
                <span className="text-xs text-slate-500">{m.unit}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Baseline: {m.baseline} {m.unit}
              </div>
            </div>

            {/* Micro Dual-Bar Comparison */}
            <div className="w-full space-y-1 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400 w-12 shrink-0">Simulated</span>
                <div className="h-1.5 flex-1 bg-slate-200 rounded-xs overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      m.trend === "positive" ? "bg-[#166534]" : "bg-[#D35E0E]"
                    )}
                    style={{ width: `${Math.min(100, (m.simulated / (m.baseline * 1.5)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400 w-12 shrink-0">Baseline</span>
                <div className="h-1.5 flex-1 bg-slate-200 rounded-xs overflow-hidden">
                  <div
                    className="h-full bg-slate-400"
                    style={{ width: `${Math.min(100, (m.baseline / (m.baseline * 1.5)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
