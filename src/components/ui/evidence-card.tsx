import React from "react";
import { FileText, ExternalLink, ShieldCheck, Database, Award, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface EvidenceCardProps {
  title: string;
  agency: string;
  year: number | string;
  referenceNumber: string; // e.g. DOI or Gazette Notification ID
  abstract: string;
  confidenceScore: number; // 0 - 100
  methodology: string;
  peerReviewStatus: "Peer Reviewed" | "Government Audit" | "Empirical Fieldwork" | "Satellite Verified";
  sampleSize?: string;
  tags?: string[];
  downloadUrl?: string;
  className?: string;
  onViewDetails?: () => void;
}

export function EvidenceCard({
  title,
  agency,
  year,
  referenceNumber,
  abstract,
  confidenceScore,
  methodology,
  peerReviewStatus,
  sampleSize,
  tags,
  downloadUrl,
  className,
  onViewDetails,
}: EvidenceCardProps) {
  const getConfidenceBadge = (score: number) => {
    if (score >= 90) return { label: "High Confidence (90%+)", color: "text-emerald-800 bg-emerald-50 border-emerald-300" };
    if (score >= 75) return { label: "Standard Confidence (75-89%)", color: "text-blue-800 bg-blue-50 border-blue-300" };
    return { label: "Preliminary / Provisional", color: "text-amber-800 bg-amber-50 border-amber-300" };
  };

  const conf = getConfidenceBadge(confidenceScore);

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-sm p-4 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-2xs font-sans",
        className
      )}
    >
      <div>
        {/* Header: Agency, Year, Reference */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-[#112A4A]">{agency}</span>
            <span>•</span>
            <span className="font-tabular">{year}</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1 rounded">
              {referenceNumber}
            </span>
          </div>

          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-sm border shrink-0",
              conf.color
            )}
          >
            {conf.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-[#0A1C30] hover:text-[#112A4A] transition-colors leading-snug cursor-pointer mb-2" onClick={onViewDetails}>
          {title}
        </h4>

        {/* Abstract */}
        <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
          {abstract}
        </p>

        {/* Methodology & Metadata Strip */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-sm border border-slate-100 text-[11px] text-slate-600 mb-3">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Methodology
            </span>
            <span className="font-medium text-slate-800 line-clamp-1">{methodology}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Validation Status
            </span>
            <span className="font-medium text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{peerReviewStatus}</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs mt-1">
        {sampleSize && (
          <span className="text-[11px] text-slate-500">
            Cohort: <strong className="text-slate-700">{sampleSize}</strong>
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex items-center gap-1 text-xs font-semibold text-[#112A4A] hover:text-[#D35E0E] transition-colors cursor-pointer"
          >
            <span>Examine Evidence</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
