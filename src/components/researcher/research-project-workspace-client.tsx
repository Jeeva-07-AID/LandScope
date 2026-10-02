"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";
import {
  ResearchProject,
  EvidenceItem,
  SpatialContext,
  INITIAL_EVIDENCE_REPOSITORY,
} from "@/lib/research/research-data";
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Database,
  Layers,
  BarChart3,
  Scale,
  Users,
  FileCheck2,
  Download,
  Share2,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { EvidenceDetailModal } from "./evidence-detail-modal";
import { LinkPolicyModal } from "./link-policy-modal";

interface ResearchProjectWorkspaceClientProps {
  user: UserAccount;
  role: RoleDefinition;
  project: ResearchProject;
}

type ProjectTab =
  | "overview"
  | "questions"
  | "evidence"
  | "datasets"
  | "gis"
  | "analysis"
  | "policy"
  | "collaborators"
  | "reports";

export function ResearchProjectWorkspaceClient({
  user,
  role,
  project,
}: ResearchProjectWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);
  const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<EvidenceItem | null>(null);
  const [selectedEvidenceForPolicy, setSelectedEvidenceForPolicy] = useState<EvidenceItem | null>(null);

  // Dynamic questions state (supports adding questions to Supabase)
  const [questions, setQuestions] = useState(project.researchQuestions);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [savingQuestion, setSavingQuestion] = useState(false);

  // Dynamic evidence repository state
  const [allEvidence, setAllEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_REPOSITORY);

  React.useEffect(() => {
    async function loadEvidence() {
      try {
        const res = await fetch("/api/research/evidence");
        if (res.ok) {
          const data = await res.json();
          if (data.evidence && Array.isArray(data.evidence)) {
            setAllEvidence(data.evidence);
          }
        }
      } catch {
        // Fallback to initial repository
      }
    }
    loadEvidence();
  }, []);

  // Resolved evidence items linked to this project
  const linkedEvidence = allEvidence.filter((e) =>
    project.evidenceIds.includes(e.id)
  );

  const tabs: Array<{ id: ProjectTab; label: string; icon: React.ReactNode; count?: number }> = [
    { id: "overview", label: "Overview", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "questions", label: "Research Questions", icon: <HelpCircle className="w-3.5 h-3.5" />, count: questions.length },
    { id: "evidence", label: "Evidence", icon: <FileCheck2 className="w-3.5 h-3.5" />, count: linkedEvidence.length },
    { id: "datasets", label: "Datasets", icon: <Database className="w-3.5 h-3.5" />, count: project.datasets.length },
    { id: "gis", label: "GIS Layers", icon: <Layers className="w-3.5 h-3.5" />, count: project.gisLayers.length },
    { id: "analysis", label: "Analysis & Metrics", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "policy", label: "Policy Scenarios", icon: <Scale className="w-3.5 h-3.5" />, count: project.policyScenarios.length },
    { id: "collaborators", label: "Collaborators", icon: <Users className="w-3.5 h-3.5" />, count: project.collaborators.length },
    { id: "reports", label: "Reports & Dossiers", icon: <Download className="w-3.5 h-3.5" />, count: project.reports.length },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 ${
        isHighContrast ? "high-contrast" : ""
      }`}
      style={{
        fontSize: fontSizeDelta !== 0 ? `${100 + fontSizeDelta * 6}%` : undefined,
      }}
    >
      {/* 1. National Banner */}
      <GovTopBanner
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onFontSizeChange={(delta) =>
          setFontSizeDelta((prev) => (delta === 0 ? 0 : Math.max(-2, Math.min(3, prev + delta))))
        }
      />

      {/* 2. Platform Header */}
      <Header
        userName={user.name}
        userRoleTitle={role.title}
        userEmail={user.email}
        organization={user.organization}
        unreadCount={0}
      />

      {/* 3. Project Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 shadow-2xs">
        <div className="max-w-[1600px] mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href="/app/researcher"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#112A4A] font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Research Intelligence</span>
              </Link>
              <span className="text-slate-300">/</span>
              <Breadcrumbs
                items={[
                  { label: "Research Projects", href: "/app/researcher" },
                  { label: project.title, active: true },
                ]}
              />
            </div>

            <div className="flex items-center gap-2">
              {project.isDemoProject && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                  Illustrative Demo Record
                </span>
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase">
                {project.status}
              </span>
              <Button
                variant="outline"
                size="xs"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export Project Dossier
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0A1C30] tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {project.subtitle || project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.organization}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Lead: <strong>{project.leadResearcherName}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: {project.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation Strip */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-[#112A4A] text-[#112A4A] bg-blue-50/20"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    activeTab === tab.id
                      ? "bg-[#112A4A] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Workspace Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Executive Abstract & Research Methodology
                </h2>
                <span className="text-xs text-slate-400 font-mono">Dossier ID: {project.id}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Research Questions
                  </span>
                  <strong className="text-base text-slate-900 font-tabular font-bold block">
                    {project.researchQuestions.length} Formulated
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    {project.researchQuestions.filter((q) => q.status === "Validated").length} empirically validated
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Linked Evidence & Data
                  </span>
                  <strong className="text-base text-slate-900 font-tabular font-bold block">
                    {project.evidenceCount} Studies • {project.datasetCount} Datasets
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Multi-temporal satellite rasters & eCourts records
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Policy Digital Twin Link
                  </span>
                  <strong className="text-base text-purple-900 font-tabular font-bold block">
                    {project.policyScenarios.length} Linked Scenario(s)
                  </strong>
                  <span className="text-[11px] text-purple-700">
                    Calibrating Master Plan 2031 parameters
                  </span>
                </div>
              </div>
            </div>

            {/* Quick summary of questions */}
            <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Investigative Hypotheses
              </h2>
              <div className="space-y-2">
                {project.researchQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-slate-900">
                        {idx + 1}. {q.question}
                      </strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {q.status}
                      </span>
                    </div>
                    {q.hypothesis && (
                      <p className="text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">Hypothesis:</span> {q.hypothesis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === "questions" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Research Questions & Hypotheses</h2>
                <p className="text-xs text-slate-500">
                  Empirically testable hypotheses linked to spatial datasets and econometric indices
                </p>
              </div>

              {!isAddingQuestion ? (
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#112A4A] text-white rounded-sm hover:bg-[#1A3E6D] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              ) : null}
            </div>

            {isAddingQuestion && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  New Research Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. How does cadastral formalization influence agricultural productivity across clusters?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#112A4A]"
                  disabled={savingQuestion}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingQuestion(false);
                      setNewQuestionText("");
                    }}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                    disabled={savingQuestion}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={savingQuestion || !newQuestionText.trim()}
                    onClick={async () => {
                      if (!newQuestionText.trim()) return;
                      setSavingQuestion(true);
                      try {
                        const res = await fetch(`/api/research/projects/${project.id}/questions`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ question: newQuestionText.trim() }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.question) {
                            setQuestions((prev) => [...prev, data.question]);
                          }
                          setNewQuestionText("");
                          setIsAddingQuestion(false);
                        }
                      } finally {
                        setSavingQuestion(false);
                      }
                    }}
                    className="px-3 py-1 text-xs font-semibold bg-[#112A4A] text-white rounded-sm hover:bg-[#1A3E6D] transition-colors disabled:opacity-50"
                  >
                    {savingQuestion ? "Saving..." : "Save Question"}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 border border-slate-200 rounded-sm space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block mb-0.5">
                        QUESTION #{idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {q.question}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                      {q.status}
                    </span>
                  </div>

                  {q.hypothesis && (
                    <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-sm text-blue-900 text-xs">
                      <strong>Working Hypothesis:</strong> {q.hypothesis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVIDENCE TAB */}
        {activeTab === "evidence" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Linked Research & Evidence</h2>
                <p className="text-xs text-slate-500">
                  Curated empirical studies, judicial cases, and cadastral audits supporting this project
                </p>
              </div>

              <Link
                href="/app/researcher#evidence-repository-section"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#112A4A] text-white rounded-sm hover:bg-[#1A3E6D] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Evidence</span>
              </Link>
            </div>

            {linkedEvidence.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-sm text-xs text-slate-500">
                No evidence items attached yet. Browse the repository to add empirical studies.
              </div>
            ) : (
              <div className="space-y-3">
                {linkedEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 border border-slate-200 rounded-sm space-y-2.5 text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold uppercase">
                            {ev.type}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                            {ev.evidenceStatus}
                          </span>
                          <span className="text-slate-400 text-[11px]">Ref: {ev.referenceNumber}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{ev.title}</h3>
                        <p className="text-slate-500 text-[11px]">
                          {ev.authorOrOrg} • {ev.year} • Scope: {ev.geography.state}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Confidence</span>
                        <strong className="text-emerald-700 font-bold font-tabular text-sm">
                          {ev.confidenceScore} / 100
                        </strong>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs">{ev.abstract}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex flex-wrap gap-1">
                        {ev.topics.map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedEvidenceForDetail(ev)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setSelectedEvidenceForPolicy(ev)}
                          leftIcon={<Scale className="w-3 h-3 text-purple-600" />}
                        >
                          Use in Policy Scenario
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DATASETS TAB */}
        {activeTab === "datasets" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Project Datasets & Spatial Layers</h2>
                <p className="text-xs text-slate-500">
                  Standardized spatial vectors, cloud-optimized rasters, and tabular revenue statistics
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.datasets.map((ds) => (
                <div key={ds.id} className="p-3.5 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-slate-900 font-semibold text-xs block">{ds.name}</strong>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>Provider: {ds.provider}</span>
                      <span>•</span>
                      <span>Format: {ds.format}</span>
                      <span>•</span>
                      <span>Size: {ds.size}</span>
                      <span>•</span>
                      <span>Records: {ds.recordsCount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Sync: {ds.lastSync}
                    </span>
                    <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3" />}>
                      Download Sample
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GIS LAYERS TAB */}
        {activeTab === "gis" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Spatial GIS Layers & Overlays</h2>
                <p className="text-xs text-slate-500">
                  OGC WMS / WFS spatial boundary layers configured for this research investigation
                </p>
              </div>

              <Link
                href="/app/researcher"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#112A4A] text-white rounded-sm hover:bg-[#1A3E6D] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Land Intelligence GIS</span>
              </Link>
            </div>

            <div className="space-y-3">
              {project.gisLayers.map((gl) => (
                <div key={gl.id} className="p-3.5 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase">
                        {gl.type}
                      </span>
                      <strong className="text-slate-900 font-semibold">{gl.name}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Source: {gl.source}</span>
                      <span>•</span>
                      <span>CRS: {gl.crs}</span>
                      <span>•</span>
                      <span>Coverage: {gl.coverage}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    OGC Validated
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === "analysis" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Quantitative Analysis & Econometric Findings</h2>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs leading-relaxed text-slate-800 space-y-2">
              <strong className="block text-slate-900 font-semibold">Principal Investigator Notes:</strong>
              <p>{project.analysisNotes}</p>
            </div>
          </div>
        )}

        {/* POLICY SCENARIOS TAB */}
        {activeTab === "policy" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Evidence → Policy Digital Twin Bridge</h2>
                <p className="text-xs text-slate-500">
                  Empirical research models registered for parameterizing Policy Lab simulations
                </p>
              </div>
            </div>

            {project.policyScenarios.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-sm text-xs text-slate-500">
                No policy scenarios linked yet. Use &quot;Use in Policy Scenario&quot; from the Evidence tab to establish a digital twin linkage.
              </div>
            ) : (
              <div className="space-y-3">
                {project.policyScenarios.map((sc) => (
                  <div key={sc.id} className="p-4 border border-purple-200 bg-purple-50/20 rounded-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-purple-950 font-bold text-sm">{sc.title}</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                        {sc.status}
                      </span>
                    </div>
                    <p className="text-slate-700">{sc.rationale}</p>
                    <div className="p-2 bg-white border border-purple-200 rounded-sm text-[11px] text-purple-900 font-medium">
                      Simulated Metrics: {sc.metrics}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COLLABORATORS TAB */}
        {activeTab === "collaborators" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Research Collaborators & Co-Investigators</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.collaborators.map((c, idx) => (
                <div key={idx} className="p-3.5 border border-slate-200 rounded-sm text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-semibold">{c.name}</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {c.role}
                    </span>
                  </div>
                  <span className="text-slate-500 block">{c.organization}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{c.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Project Reports, Working Papers & Citations</h2>
            </div>
            <div className="space-y-3">
              {project.reports.map((rep) => (
                <div key={rep.id} className="p-3.5 border border-slate-200 rounded-sm flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 font-semibold block">{rep.title}</strong>
                    <span className="text-slate-500 text-[11px]">{rep.type} • Generated {rep.generatedAt} • {rep.size}</span>
                  </div>
                  <Button variant="outline" size="xs" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download Report
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <EvidenceDetailModal
        evidence={selectedEvidenceForDetail}
        isOpen={selectedEvidenceForDetail !== null}
        onClose={() => setSelectedEvidenceForDetail(null)}
        onUseInPolicy={(ev) => {
          setSelectedEvidenceForDetail(null);
          setSelectedEvidenceForPolicy(ev);
        }}
      />

      <LinkPolicyModal
        evidence={selectedEvidenceForPolicy}
        isOpen={selectedEvidenceForPolicy !== null}
        onClose={() => setSelectedEvidenceForPolicy(null)}
        onSuccess={() => {}}
      />
    </div>
  );
}
