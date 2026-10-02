import React from "react";
import { Filter, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface DataFiltersProps {
  groups: FilterGroup[];
  selectedValues: Record<string, string[]>;
  onFilterChange: (groupId: string, optionId: string) => void;
  onResetFilters: () => void;
  className?: string;
}

export function DataFilters({
  groups,
  selectedValues,
  onFilterChange,
  onResetFilters,
  className,
}: DataFiltersProps) {
  const totalActive = Object.values(selectedValues).reduce(
    (acc, arr) => acc + (arr ? arr.length : 0),
    0
  );

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-sm p-3.5 flex flex-col gap-3 font-sans text-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Filter className="w-3.5 h-3.5 text-[#112A4A]" />
          <span>Faceted Filters</span>
          {totalActive > 0 && (
            <span className="px-1.5 py-0.2 bg-[#112A4A] text-white text-[10px] rounded-full font-tabular">
              {totalActive}
            </span>
          )}
        </div>

        {totalActive > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {groups.map((group) => {
          const selectedInGroup = selectedValues[group.id] || [];

          return (
            <div key={group.id} className="space-y-1.5">
              <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                {group.title}
              </div>

              <div className="space-y-1">
                {group.options.map((opt) => {
                  const isChecked = selectedInGroup.includes(opt.id);

                  return (
                    <label
                      key={opt.id}
                      onClick={() => onFilterChange(group.id, opt.id)}
                      className={cn(
                        "flex items-center justify-between p-1.5 rounded-xs transition-colors cursor-pointer select-none",
                        isChecked ? "bg-slate-100 text-[#0A1C30] font-medium" : "hover:bg-slate-50 text-slate-600"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-2xs border flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-[#112A4A] border-[#112A4A] text-white"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs">{opt.label}</span>
                      </div>

                      {opt.count !== undefined && (
                        <span className="text-[10px] text-slate-400 font-tabular">
                          ({opt.count})
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
