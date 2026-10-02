"use client";

import React from "react";
import {
  GeoIntelligenceData,
  EvidenceTrail,
  EVIDENCE_TRAILS,
} from "@/lib/gis/gis-data";
import { EvidenceItem } from "@/lib/research/research-data";
import { SelectedGeography } from "@/lib/gis/selected-geography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Compass,
  Scale,
  FolderPlus,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  MapPin,
} from "lucide-react";

interface GisIntelligencePanelProps {
  intelligence: GeoIntelligenceData;
  relatedEvidence: EvidenceItem[];
  selectedYear: number;
  userRole: string;
  currentTier?: "country" | "state" | "district" | "tehsil";
  selectedState?: string;
  selectedDistrict?: string;
  selectedTehsil?: string;
  selectedGeography?: SelectedGeography;
  onDrillDownToDemo?: () => void;
  onOpenEvidenceTrail: (trail: EvidenceTrail) => void;
  onOpenEvidenceDetail: (evidence: EvidenceItem) => void;
  onAddToProject: (evidence: EvidenceItem) => void;
  onTestPolicyScenario: (geographyContext: {
    state: string;
    district: string;
    tehsil: string;
    year: number;
    builtUpPct: number;
    agriculturePct: number;
    source?: string;
  }) => void;
  onNavigateToReports: (geographyContext: {
    state: string;
    district: string;
    tehsil: string;
    source?: string;
  }) => void;
  onNavigateToResearch: (context?: SelectedGeography) => void;
  onNavigateToAnalytics?: (context?: SelectedGeography) => void;
}

export function GisIntelligencePanel({
  intelligence,
  relatedEvidence,
  selectedYear,
  userRole,
  currentTier = "tehsil",
  selectedState,
  selectedDistrict,
  selectedTehsil,
  selectedGeography,
  onDrillDownToDemo,
  onOpenEvidenceTrail,
  onOpenEvidenceDetail,
  onAddToProject,
  onTestPolicyScenario,
  onNavigateToReports,
  onNavigateToResearch,
  onNavigateToAnalytics,
}: GisIntelligencePanelProps) {
  const { geography, landUse, environment, infrastructure, governance, trends } = intelligence;

  const handleOpenUrbanTrail = () => {
    const trail = EVIDENCE_TRAILS["urban-expansion-ashta"];
    if (trail) onOpenEvidenceTrail(trail);
  };

  const handleOpenWaterTrail = () => {
    const trail = EVIDENCE_TRAILS["aquifer-stress-ashta"];
    if (trail) onOpenEvidenceTrail(trail);
  };

  const handleOpenDisputeTrail = () => {
    const trail = EVIDENCE_TRAILS["dispute-reduction-ashta"];
    if (trail) onOpenEvidenceTrail(trail);
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* 1. Selected Geography Header & Key Cross-Module CTA */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
        {/* Tier Hierarchy Breadcrumb Pill */}
        <div className="flex items-center justify-between gap-1 pb-1 border-b border-slate-100">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {currentTier === "country"
              ? "TIER 0 • NATIONAL LEVEL (INDIA)"
              : currentTier === "state"
              ? `TIER 1 • STATE (${selectedState || geography.state})`
              : currentTier === "district"
              ? `TIER 2 • DISTRICT (${selectedDistrict || geography.district})`
              : `TIER 3 • LOCAL CADASTRAL (${selectedTehsil || geography.tehsil})`}
          </span>
          {currentTier !== "tehsil" && onDrillDownToDemo && (
            <button
              type="button"
              onClick={onDrillDownToDemo}
              className="text-[10px] font-bold text-[#D35E0E] hover:underline"
            >
              Jump to Ashta Demo →
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              {selectedGeography?.placeName
                ? `${selectedGeography.placeName.toUpperCase()} LAND INTELLIGENCE`
                : currentTier === "country"
                ? "NATIONAL LAND INTELLIGENCE"
                : currentTier === "state"
                ? "REGIONAL LAND INTELLIGENCE"
                : currentTier === "district"
                ? "DISTRICT LAND INTELLIGENCE"
                : "LOCAL LAND INTELLIGENCE"}
            </span>
            <h2 className="text-base font-bold text-[#0A1C30] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-[#D35E0E]" />
              <span>
                {selectedGeography?.placeName || (currentTier === "country" ? "India" : currentTier === "state" ? (selectedState || geography.state) : `${selectedTehsil || geography.tehsil}, ${selectedDistrict || geography.district}`)}
              </span>
              <span className="text-xs font-normal text-slate-400">
                ({selectedGeography?.state || selectedState || geography.state})
              </span>
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Dataset Origin
            </span>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Illustrative LANDScope Demo Dataset
            </span>
          </div>
        </div>

        {/* Primary Action Bridge: Research, Policy, Analytics & Reports */}
        <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0A1C30] text-white rounded-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-300" />
              <strong className="text-xs font-bold text-white tracking-wide">
                SPATIAL INTELLIGENCE ACTIONS
              </strong>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600 font-bold">
              Active Context
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Connected GIS intelligence for {selectedGeography?.placeName || selectedDistrict || selectedState || "this region"}. Pass active geography to research, policy simulator, or analytics.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <Button
              variant="saffron"
              size="xs"
              onClick={() => onNavigateToResearch(selectedGeography)}
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Research This Region
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                onTestPolicyScenario({
                  state: selectedGeography?.state || geography.state,
                  district: selectedGeography?.district || geography.district,
                  tehsil: selectedGeography?.tehsil || geography.tehsil,
                  year: selectedYear,
                  builtUpPct: landUse.builtUpPct,
                  agriculturePct: landUse.agriculturePct,
                  source: "GIS",
                })
              }
              leftIcon={<Scale className="w-3.5 h-3.5 text-purple-300" />}
              className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
            >
              Test Policy Scenario (POLICY DIGITAL TWIN BRIDGE)
            </Button>
            {onNavigateToAnalytics && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onNavigateToAnalytics(selectedGeography)}
                leftIcon={<TrendingUp className="w-3.5 h-3.5 text-blue-300" />}
                className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
              >
                View Analytics
              </Button>
            )}
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                onNavigateToReports({
                  state: selectedGeography?.state || geography.state,
                  district: selectedGeography?.district || geography.district,
                  tehsil: selectedGeography?.tehsil || geography.tehsil,
                  source: "GIS",
                })
              }
              leftIcon={<FileText className="w-3.5 h-3.5 text-slate-300" />}
              className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700"
            >
              Generate Intelligence Brief
            </Button>
          </div>
        </div>

        {/* Quick Regional Stats Strip */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Spatial Extent
            </span>
            <strong className="text-slate-800 font-tabular text-sm">
              {geography.areaSqKm.toLocaleString()}
            </strong>
            <span className="text-slate-500 text-[11px] ml-1">sq km</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Cadastral Parcels
            </span>
            <strong className="text-slate-800 font-tabular text-sm">
              {geography.totalParcels.toLocaleString()}
            </strong>
            <span className="text-slate-500 text-[11px] ml-1">Khasras</span>
          </div>
        </div>
      </div>

      {/* 2. Land-Use Profile & Directional Trend Intelligence */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Land-Use Profile & Trend Intelligence
            </h3>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
            Illustrative Demo Analysis
          </span>
        </div>

        {/* Land-Use Progress Stack */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded-xs overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${landUse.agriculturePct}%` }}
              className="bg-emerald-600 transition-all duration-500"
              title={`Agriculture: ${landUse.agriculturePct}%`}
            />
            <div
              style={{ width: `${landUse.builtUpPct}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Built-up: ${landUse.builtUpPct}%`}
            />
            <div
              style={{ width: `${landUse.forestPct}%` }}
              className="bg-teal-700 transition-all duration-500"
              title={`Forest: ${landUse.forestPct}%`}
            />
            <div
              style={{ width: `${landUse.waterPct}%` }}
              className="bg-cyan-500 transition-all duration-500"
              title={`Water: ${landUse.waterPct}%`}
            />
          </div>

          {/* 4 Interactive Land Use Trend Cards with "Why?" Evidence Trails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            {/* Agriculture */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>Agriculture</span>
                </span>
                <span className="font-bold text-slate-900 font-tabular">
                  {landUse.agriculturePct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-rose-700 font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{trends.agriculture.changePct}%</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenUrbanTrail}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
            </div>

            {/* Built-up / Urban */}
            <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Built-up / Urban</span>
                </span>
                <span className="font-bold text-amber-900 font-tabular">
                  {landUse.builtUpPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-amber-800 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{trends.builtUp.changePct}% (Fast)</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenUrbanTrail}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-amber-300 text-[10px] text-amber-900 font-bold hover:bg-amber-100 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
            </div>

            {/* Forest */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-700 shrink-0" />
                  <span>Forest & Eco-Buffer</span>
                </span>
                <span className="font-bold text-slate-900 font-tabular">
                  {landUse.forestPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Minus className="w-3.5 h-3.5" />
                  <span>Stable (Geo-fenced)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">FSI Protected</span>
              </div>
            </div>

            {/* Water */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                  <span>Water Bodies</span>
                </span>
                <span className="font-bold text-slate-900 font-tabular">
                  {landUse.waterPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-rose-700 font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{trends.water.changePct}% Aquifer</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenWaterTrail}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Environmental & Governance Multi-Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Environmental Indicators */}
        <div className="bg-white border border-slate-200 rounded-sm p-3.5 shadow-2xs space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Environmental Indicators
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Aquifer Recharge Index:</span>
              <span
                className={`font-bold font-tabular px-1.5 py-0.2 rounded text-[11px] ${
                  environment.aquiferStatus === "Critical"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {environment.aquiferRechargeIndex} / 100 ({environment.aquiferStatus})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Forest Buffer Health:</span>
              <strong className="text-slate-800 font-tabular">
                {environment.forestBufferHealth}%
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Drought Vulnerability:</span>
              <strong className="text-amber-800">{environment.droughtVulnerability}</strong>
            </div>
          </div>
        </div>

        {/* Governance & Titling Indicators */}
        <div className="bg-white border border-slate-200 rounded-sm p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Governance & Titling
            </span>
            <button
              type="button"
              onClick={handleOpenDisputeTrail}
              className="text-[10px] text-blue-700 font-semibold hover:underline"
            >
              Why disputes fell?
            </button>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Cadastral Formalization:</span>
              <strong className="text-emerald-700 font-bold font-tabular">
                {governance.cadastralFormalizationPct}%
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Dispute Pendency Rate:</span>
              <strong className="text-slate-800 font-tabular">
                {governance.disputePendencyRate}% of parcels
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Avg Mutation Latency:</span>
              <strong className="text-slate-800 font-tabular">
                {governance.averageMutationDays} Days
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Related Research Evidence for Selected Geography */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#112A4A]" />
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Related Research Evidence ({relatedEvidence.length})
            </h3>
          </div>
          <Button variant="ghost" size="xs" onClick={() => onNavigateToResearch(selectedGeography)}>
            Explore All Evidence
          </Button>
        </div>

        {relatedEvidence.length === 0 ? (
          <p className="text-slate-500 italic text-center py-4">
            No research evidence indexed for this geography yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {relatedEvidence.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-slate-900 font-semibold leading-snug line-clamp-2">
                    {item.title}
                  </strong>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                    {item.confidenceScore}% Conf
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {item.authorOrOrg} • {item.year} • Ref: {item.referenceNumber}
                </p>

                <div className="pt-1 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onOpenEvidenceDetail(item)}
                  >
                    Open Evidence
                  </Button>
                  {userRole === "RESEARCHER" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onAddToProject(item)}
                      leftIcon={<FolderPlus className="w-3 h-3 text-blue-600" />}
                    >
                      Add to Project
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
