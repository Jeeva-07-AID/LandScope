"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  FlaskConical,
  BookOpen,
  MapPin,
  BarChart3,
  Users,
  CheckCircle,
  FileText,
  Layers,
  Sparkles,
  Building,
  GraduationCap,
  Scale,
  Globe,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { Button } from "@/components/ui/button";

export default function PublicLandingPage() {
  const [activeStage, setActiveStage] = useState<"research" | "gis" | "policy">("research");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#E5EEF8] selection:text-[#0A1C30]">
      {/* 1. Public Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-95 transition-opacity">
            <LandScopeLogo size="sm" variant="navy" showTagline={false} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#three-stages" className="hover:text-[#0A1C30] transition-colors">
              Platform
            </a>
            <a href="#test-policy" className="hover:text-[#0A1C30] transition-colors">
              Policy Digital Twin
            </a>
            <a href="#evidence" className="hover:text-[#0A1C30] transition-colors">
              Evidence Traceability
            </a>
            <a href="#stakeholders" className="hover:text-[#0A1C30] transition-colors">
              Stakeholders
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-600 hover:text-[#0A1C30] px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>

            <Link href="/login">
              <Button
                variant="saffron"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Enter LANDScope
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-24 border-b border-slate-200/80 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide mb-6 border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>National Spatial Decision-Support Architecture</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px] font-mono">SIH 2026 Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1C30] leading-[1.15]">
            MAKE BETTER LAND DECISIONS WITH EVIDENCE.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            LANDScope connects research, geospatial intelligence and policy simulation to help
            decision-makers explore the impact of land policies before implementation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/login">
              <Button
                variant="saffron"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold text-sm shadow-sm"
              >
                Enter LANDScope
              </Button>
            </Link>

            <a href="#three-stages">
              <Button variant="outline" size="lg" className="font-semibold text-sm">
                Explore the Platform
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 3. The Three Connected Stages */}
      <section id="three-stages" className="py-20 max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Integrated Data Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1C30]">
            From Empirical Data to Statutory Decisions
          </h2>
          <p className="text-sm text-slate-500">
            A cohesive workflow replacing fragmented spreadsheets with an explainable intelligence loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stage 1: Research */}
          <div className="bg-white border border-slate-200/90 rounded-sm p-8 space-y-4 hover:border-slate-300 transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider block">
                Stage 01 • Research
              </span>
              <h3 className="text-lg font-bold text-[#0A1C30]">Find and understand evidence.</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Curate empirical land research, peer-reviewed indices, econometric correlations, and AI-assisted synthesis grounded in verifiable source documents.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Empirical confidence scoring (0–100%)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Document citation provenance</span>
              </li>
            </ul>
          </div>

          {/* Stage 2: Land Intelligence */}
          <div className="bg-white border border-slate-200/90 rounded-sm p-8 space-y-4 hover:border-slate-300 transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                Stage 02 • Land Intelligence
              </span>
              <h3 className="text-lg font-bold text-[#0A1C30]">Explore what is happening on the ground.</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Multi-spectral satellite telemetry, sub-decimeter SVAMITVA drone cadastre, and multi-temporal land use change maps across State, District, and Tehsil tiers.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>OGC WMS 1.3 / WFS 2.0 spatial layers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Historical LULC trend vectors (2018–2026)</span>
              </li>
            </ul>
          </div>

          {/* Stage 3: Policy Simulation */}
          <div className="bg-white border border-slate-200/90 rounded-sm p-8 space-y-4 hover:border-slate-300 transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider block">
                Stage 03 • Policy Simulation
              </span>
              <h3 className="text-lg font-bold text-[#0A1C30]">Test what could happen before implementation.</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Spatial Digital Twin what-if modeling across 6 impact dimensions. Forecast agricultural retention, water stress, and tenure displacement before notifying gazettes.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Multi-dimensional baseline vs. scenario</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Automated statutory policy brief generation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Flagship Innovation: TEST A POLICY BEFORE YOU IMPLEMENT IT */}
      <section id="test-policy" className="py-20 bg-slate-900 text-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Flagship Innovation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              TEST A POLICY BEFORE YOU IMPLEMENT IT.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Eliminate unintended consequences by simulating regulatory interventions against live cadastral and hydrological baselines.
            </p>
          </div>

          {/* Stepper Pipeline Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-sm space-y-3">
              <span className="text-xs font-mono text-amber-400 font-bold block">STEP 01</span>
              <h4 className="text-base font-bold text-white">Current Landscape</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingest real-time multi-spectral satellite reflectance, aquifer piezometers, and SVAMITVA title status.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-sm space-y-3">
              <span className="text-xs font-mono text-amber-400 font-bold block">STEP 02</span>
              <h4 className="text-base font-bold text-white">Policy Scenario</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Define zoning ceilings, eco-buffer corridors, TOD transit incentives, or industrial conversion caps.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-sm space-y-3">
              <span className="text-xs font-mono text-amber-400 font-bold block">STEP 03</span>
              <h4 className="text-base font-bold text-white">Simulated Impact</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Execute mathematical digital twin engine evaluating 6 dimensions with trade-off radar analysis.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-sm space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold block">STEP 04</span>
              <h4 className="text-base font-bold text-white">Evidence-Based Decision</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect explainable &quot;WHY&quot; evidence trail and compile statutory executive policy briefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Evidence Traceability Section */}
      <section id="evidence" className="py-20 max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              Credibility & Explainability
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1C30]">
              Complete Evidence Traceability
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every flag, simulation metric, and policy recommendation can be inspected down to the underlying peer-reviewed monograph, drone survey flight, or sensor node.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-white border border-slate-200 rounded flex items-center justify-between">
                <span className="font-semibold">Statutory Grounding:</span>
                <span className="font-mono text-slate-500">Neutral non-causal terminology</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded flex items-center justify-between">
                <span className="font-semibold">Provenance Transparency:</span>
                <span className="font-mono text-slate-500">ICAR, CGWB, FSI Baselines</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-sm p-6 shadow-2xs space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-slate-500">
              <span>Evidence Trace Sample • SCN-2026-PERIURBAN-01</span>
              <span className="text-emerald-700 font-bold">Confidence: 94%</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Finding:</span>
                <p className="font-sans font-medium text-slate-900 text-sm">
                  Urban conversion velocity along Ashta corridor exceeds sustainable agrarian threshold by 38%.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Empirical Source:</span>
                  <span className="font-sans">Centre for Spatial Governance (2025)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Spatial Layers:</span>
                  <span className="font-sans">Sentinel-2 LULC + SVAMITVA RTK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Who LANDScope Serves */}
      <section id="stakeholders" className="py-20 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Multi-Stakeholder Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1C30]">
              Who LANDScope Serves
            </h2>
            <p className="text-sm text-slate-500">
              Role-specific workflows ensuring appropriate access boundaries for every land stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Researchers</h4>
              <p className="text-[11px] text-slate-500">Empirical studies & evidence curation</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
              <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Policymakers</h4>
              <p className="text-[11px] text-slate-500">Policy Twin modeling & statutory briefs</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
              <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Academic Inst.</h4>
              <p className="text-[11px] text-slate-500">Fellowships & inter-university grants</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Building className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Agencies</h4>
              <p className="text-[11px] text-slate-500">Demarcation & cadastral reconciliation</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
              <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Innovators</h4>
              <p className="text-[11px] text-slate-500">Spatial AI sandbox & pilot deployments</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-2">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Public Stakeholders</h4>
              <p className="text-[11px] text-slate-500">Public land use maps & open summaries</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Institutional Footer */}
      <footer className="bg-[#0A1C30] text-slate-400 py-10 border-t border-[#173860] text-xs font-sans">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">LANDScope</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">National Land Intelligence & Policy Innovation Platform</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span className="font-mono">SIH 2026 Prototype</span>
            <span>All rights reserved</span>
            <Link href="/login" className="text-amber-400 hover:underline">
              Enter Workspace →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
