"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  Layers,
  BookOpen,
  Download,
  HelpCircle,
  ShieldAlert,
  Droplets,
  Scale,
  TreePine,
  Building2,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAnalyticsForGeography,
  AnalyticsGeographyProfile,
  AnalyticsWhyTrail,
  ANALYTICS_WHY_TRAILS,
  AnalyticalTrendInsight,
} from "@/lib/analytics/analytics-data";
import { GEOGRAPHIC_HIERARCHY } from "@/lib/gis/gis-data";

export interface AnalyticsWorkstationViewProps {
  initialState?: string;
  initialDistrict?: string;
  initialTehsil?: string;
  userRole?: string;
  onNavigateToGis?: (geoCtx: { state: string; district: string; tehsil: string }) => void;
  onNavigateToResearch?: (context?: { state: string; district: string; tehsil: string; topic?: string }) => void;
  onNavigateToReports?: (context: Record<string, unknown>) => void;
}

export function AnalyticsWorkstationView({
  initialState = "Madhya Pradesh",
  initialDistrict = "Sehore",
  initialTehsil = "Ashta",
  userRole = "POLICYMAKER",
  onNavigateToGis,
  onNavigateToResearch,
  onNavigateToReports,
}: AnalyticsWorkstationViewProps) {
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedTehsil, setSelectedTehsil] = useState<string>(initialTehsil);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeWhyTrail, setActiveWhyTrail] = useState<AnalyticsWhyTrail | null>(null);

  // Sync state if initial props change
  const [prevGeoProps, setPrevGeoProps] = useState({ initialState, initialDistrict, initialTehsil });
  if (
    initialState !== prevGeoProps.initialState ||
    initialDistrict !== prevGeoProps.initialDistrict ||
    initialTehsil !== prevGeoProps.initialTehsil
  ) {
    setPrevGeoProps({ initialState, initialDistrict, initialTehsil });
    if (initialState) setSelectedState(initialState);
    if (initialDistrict) setSelectedDistrict(initialDistrict);
    if (initialTehsil) setSelectedTehsil(initialTehsil);
  }

  // Retrieve current analytics profile
  const profile: AnalyticsGeographyProfile = getAnalyticsForGeography(
    selectedState,
    selectedDistrict,
    selectedTehsil,
    selectedYear
  );

  const availableDistricts =
    GEOGRAPHIC_HIERARCHY.find((s) => s.name === selectedState)?.districts || [];
  const availableTehsils =
    availableDistricts.find((d) => d.name === selectedDistrict)?.tehsils || ["Ashta"];

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const dists = GEOGRAPHIC_HIERARCHY.find((s) => s.name === st)?.districts || [];
    if (dists.length > 0) {
      setSelectedDistrict(dists[0].name);
      setSelectedTehsil(dists[0].tehsils[0] || "Main");
    }
  };

  const handleDistrictChange = (dst: string) => {
    setSelectedDistrict(dst);
    const tehs = availableDistricts.find((d) => d.name === dst)?.tehsils || [];
    if (tehs.length > 0) {
      setSelectedTehsil(tehs[0]);
    }
  };

  const handleOpenWhy = (whyKey: string) => {
    const trail = ANALYTICS_WHY_TRAILS[whyKey] || ANALYTICS_WHY_TRAILS["why-agri-conversion"];
    setActiveWhyTrail(trail);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Header */}
      <div className="bg-white border-b border-slate-200 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Breadcrumbs
              items={[
                { label: "National SDI Registry" },
                { label: "Land Governance Analytics", active: true },
              ]}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0A1C30] tracking-tight mt-1 flex items-center gap-2">
              <span>Land Governance Analytics</span>
              <Badge variant="official" size="sm" dot>
                Cross-Sector Intelligence
              </Badge>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyze land-use trends, climate resilience, governance indicators and policy outcomes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToGis && (
              <Button
                variant="outline"
                size="xs"
                onClick={() =>
                  onNavigateToGis({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                  })
                }
                leftIcon={<MapPin className="w-3.5 h-3.5 text-[#D35E0E]" />}
              >
                View on Map
              </Button>
            )}
            {onNavigateToResearch && (
              <Button
                variant="outline"
                size="xs"
                onClick={() =>
                  onNavigateToResearch({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    topic: "Land-Use & Peri-Urban",
                  })
                }
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-[#112A4A]" />}
              >
                Explore Supporting Research
              </Button>
            )}
            {onNavigateToReports && (
              <Button
                variant="primary"
                size="xs"
                onClick={() =>
                  onNavigateToReports({
                    state: selectedState,
                    district: selectedDistrict,
                    tehsil: selectedTehsil,
                    scenarioTitle: "Analytics Decision Brief: Land-Use & Resilience Assessment",
                  })
                }
                leftIcon={<Download className="w-3.5 h-3.5 text-white" />}
              >
                Generate Analytics Brief
              </Button>
            )}
          </div>
        </div>

        {/* Geographic & Timeline Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Geo Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D35E0E]" />
              Study Area:
            </span>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-900 text-xs"
            >
              {GEOGRAPHIC_HIERARCHY.map((st) => (
                <option key={st.name} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-900 text-xs"
            >
              {availableDistricts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Tehsil */}
            <select
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-900 text-xs"
            >
              {availableTehsils.map((t) => (
                <option key={t} value={t}>
                  {t} Tehsil
                </option>
              ))}
            </select>
          </div>

          {/* Timeline Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5" />
            <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Year:</span>
            {[2018, 2020, 2022, 2024, 2026].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  selectedYear === yr
                    ? "bg-[#112A4A] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Land-Use Trend Chart & Policy Performance */}
        <div className="lg:col-span-8 space-y-6">
          {/* VISUALIZATION 1: Multi-Temporal Land-Use Trend (2018-2026) */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#112A4A]" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Multi-Temporal Land-Use Trend (2018–2026)
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                {profile.metadata.analysisType}
              </span>
            </div>

            {/* Visual SVG Multi-Series Trend Chart */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Land-Use Distribution (% of Total 1,240 sq km Geographic Area)</span>
                <div className="flex items-center gap-3 text-[11px] font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
                    Agriculture
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" />
                    Built-Up
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-teal-700 inline-block" />
                    Forest
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                    Water
                  </span>
                </div>
              </div>

              {/* Stacked Comparative Timeline Bars */}
              <div className="space-y-2 pt-2">
                {profile.timeSeries.map((ts) => {
                  const isCurrent = ts.year === selectedYear;
                  return (
                    <div
                      key={ts.year}
                      className={`p-2 rounded transition-all ${
                        isCurrent
                          ? "bg-white ring-1 ring-[#112A4A] shadow-xs"
                          : "hover:bg-white/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{ts.year}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-bold">
                              Selected
                            </span>
                          )}
                        </span>
                        <div className="font-mono text-[11px] text-slate-600 space-x-3">
                          <span className="text-emerald-700 font-bold">Agri: {ts.agriculturePct}%</span>
                          <span className="text-amber-800 font-bold">Built: {ts.builtUpPct}%</span>
                          <span className="text-teal-800">Forest: {ts.forestPct}%</span>
                          <span className="text-blue-800">Water: {ts.waterPct}%</span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="h-4 w-full bg-slate-200 rounded-xs flex overflow-hidden">
                        <div
                          style={{ width: `${ts.agriculturePct}%` }}
                          className="bg-emerald-600 h-full"
                          title={`Agriculture: ${ts.agriculturePct}%`}
                        />
                        <div
                          style={{ width: `${ts.builtUpPct}%` }}
                          className="bg-amber-600 h-full"
                          title={`Built-up: ${ts.builtUpPct}%`}
                        />
                        <div
                          style={{ width: `${ts.forestPct}%` }}
                          className="bg-teal-700 h-full"
                          title={`Forest: ${ts.forestPct}%`}
                        />
                        <div
                          style={{ width: `${ts.waterPct}%` }}
                          className="bg-blue-600 h-full"
                          title={`Water: ${ts.waterPct}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>Methodology: Multi-temporal Sentinel-2 OBIA change detection.</span>
                <span>Spatial Reference: Ashta Revenue Cadastre (EPSG:4326)</span>
              </div>
            </div>
          </section>

          {/* VISUALIZATION 2: Policy Performance Simulation Correlation */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#D35E0E]" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Policy Performance vs Baseline Calibration
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                {profile.climateResilience.statusLabel}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Correlating current geographic baseline against the active Policy Digital Twin simulation (
              <strong>{profile.policyPerformance.simulationResult.scenarioTitle}</strong>).
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Sector Dimension</th>
                    <th className="p-2.5">Current Baseline</th>
                    <th className="p-2.5">Simulated Scenario</th>
                    <th className="p-2.5">Estimated Delta</th>
                    <th className="p-2.5 text-right">Evidence Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {profile.policyPerformance.simulationResult.sectorImpacts.map((si, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{si.dimension}</td>
                      <td className="p-2.5 font-mono text-slate-600">{si.baselineValue}</td>
                      <td className="p-2.5 font-mono text-slate-900 font-semibold">{si.scenarioValue}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700">{si.deltaText}</td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleOpenWhy(si.whyExplainKey || "why-agri-conversion")}
                          className="text-[11px] text-blue-700 font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          Why?
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* VISUALIZATION 3: Trend Detection Insights (Neutral, Non-Causal) */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#112A4A]" />
                <span>Analytical Trend Signals & Observational Insights</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Period: 2018–2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.insights.map((ins) => {
                const isInc = ins.observedTrend === "Increasing";
                const isDec = ins.observedTrend === "Decreasing";
                return (
                  <div
                    key={ins.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs">{ins.metric}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          isInc
                            ? "bg-amber-100 text-amber-900"
                            : isDec
                            ? "bg-blue-100 text-blue-900"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {isInc ? (
                          <TrendingUp className="w-3 h-3 text-amber-700" />
                        ) : isDec ? (
                          <TrendingDown className="w-3 h-3 text-blue-700" />
                        ) : (
                          <Minus className="w-3 h-3 text-slate-600" />
                        )}
                        <span>{ins.observedTrend} ({ins.percentageChange})</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 leading-snug">{ins.narrative}</p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/60">
                      <span className="italic">{ins.analyticalCaveat}</span>
                      <button
                        onClick={() => handleOpenWhy(ins.whyKey)}
                        className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                      >
                        Evidence
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Climate Resilience & Governance Indicators */}
        <div className="lg:col-span-4 space-y-6">
          {/* Climate & Resilience Panel */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Climate & Resilience</span>
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                Model Output
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Aquifer Status Indicator */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-900">Aquifer Depletion State</span>
                  <Badge variant="outline" size="sm" className="bg-red-100 text-red-900 border-red-300">
                    {profile.climateResilience.aquiferStatus}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-slate-600 text-[11px]">Recharge Score:</span>
                  <span className="font-mono font-bold text-red-800">
                    {profile.climateResilience.aquiferRechargeScore} / 100
                  </span>
                </div>
                <div className="w-full bg-red-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    style={{ width: `${profile.climateResilience.aquiferRechargeScore}%` }}
                    className="bg-red-600 h-full"
                  />
                </div>
              </div>

              {/* Water Stress Index */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">
                    Water Stress Index
                  </span>
                  <strong className="text-slate-900 font-mono text-xs">
                    {profile.climateResilience.waterStressIndex} / 100
                  </strong>
                </div>
                <Badge variant="outline" size="sm">
                  {profile.climateResilience.waterStressStatus}
                </Badge>
              </div>

              {/* Flood & Drought Vulnerability */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Flood Exposure
                  </span>
                  <span className="font-bold text-slate-800">
                    {profile.climateResilience.floodRiskCategory} ({profile.climateResilience.floodExposureIndex}%)
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Drought Hazard
                  </span>
                  <span className="font-bold text-red-700">
                    {profile.climateResilience.droughtVulnerability}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Cadastral Governance Panel */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#112A4A]" />
                <span>Cadastral Governance Signals</span>
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                Demo Dataset
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Cadastral Formalization:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {profile.governance.cadastralFormalizationPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    style={{ width: `${profile.governance.cadastralFormalizationPct}%` }}
                    className="bg-emerald-600 h-full"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Title Mutation Dispute Rate:</span>
                  <span className="font-mono font-bold text-amber-800">
                    {profile.governance.disputeRatePct}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Annual Court Plaints: {profile.governance.annualLitigationPlaints} cases
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Mutation Turnaround
                  </span>
                  <span className="font-bold text-slate-800">
                    {profile.governance.averageMutationDays} Days
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    SVAMITVA Coverage
                  </span>
                  <span className="font-bold text-emerald-700">
                    {profile.governance.svamitvaTitleDeedCoveragePct}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Supporting Evidence References */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BookOpen className="w-4 h-4 text-[#112A4A]" />
              <span>Evidence Basis</span>
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {profile.supportingEvidence.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-2 bg-slate-50 border border-slate-200 rounded-sm space-y-0.5">
                  <strong className="block text-slate-900 font-semibold truncate">{ev.title}</strong>
                  <span className="text-[10px] text-slate-500 block">
                    {ev.authorOrOrg} ({ev.year}) • {ev.evidenceStatus}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 3. "Why?" Explainability Modal */}
      {activeWhyTrail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Evidence Traceability Modal
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeWhyTrail.metric}
                </h3>
              </div>
              <button
                onClick={() => setActiveWhyTrail(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-sm text-xs text-blue-900 font-semibold">
              {activeWhyTrail.question}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Observed Pattern / Model Relationship
                </span>
                <p className="text-slate-800 mt-0.5">{activeWhyTrail.observedTrend}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Attached Empirical Research Source
                </span>
                <strong className="text-slate-900 block font-semibold">
                  {activeWhyTrail.researchSource.title}
                </strong>
                <p className="text-[11px] text-slate-600 italic">
                  &ldquo;{activeWhyTrail.researchSource.quote}&rdquo;
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  <span>{activeWhyTrail.researchSource.organization} ({activeWhyTrail.researchSource.year})</span>
                  <span className="mx-1">•</span>
                  <span>Ref: {activeWhyTrail.researchSource.reference}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Spatial Layer
                  </span>
                  <p className="text-slate-700">{activeWhyTrail.spatialLayer}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Analysis Method
                  </span>
                  <p className="text-slate-700">{activeWhyTrail.analysisMethod}</p>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-sm text-[11px] text-amber-900 space-y-0.5">
                <span className="font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  Model Limitations & Ground Truth Requirement:
                </span>
                <p>{activeWhyTrail.limitations}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setActiveWhyTrail(null)}>
                Close Evidence Trace
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
