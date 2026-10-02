"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Lightbulb,
  Search,
  Plus,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  FileCheck2,
  Calendar,
  Users,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  FileText,
  Clock,
  Lock,
  Edit,
  Send,
  Trash2,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InnovationChallenge,
  ChallengeApplication,
  PilotProjectRecord,
  ChallengeCategory,
} from "@/lib/innovation/innovation-data";

export interface InnovationHubViewProps {
  userRole?: string;
  initialChallengeId?: string;
  onNavigateToGis?: (geo: { state: string; district: string; tehsil: string }) => void;
  onNavigateToPolicyLab?: (geo?: { state: string; district: string; tehsil: string }) => void;
  onNavigateToResearch?: (topic?: string) => void;
  onNavigateToReports?: (reportId?: string) => void;
  onNavigateToCollaboration?: (projectId?: string) => void;
}

export function InnovationHubView({
  userRole = "INNOVATOR",
  initialChallengeId,
  onNavigateToGis,
  onNavigateToPolicyLab,
  onNavigateToResearch,
  onNavigateToReports,
  onNavigateToCollaboration,
}: InnovationHubViewProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<
    "all" | "hackathons" | "grants" | "pilots" | "competitions" | "my-dashboard"
  >("all");

  // State
  const [challenges, setChallenges] = useState<InnovationChallenge[]>([]);
  const [pilots, setPilots] = useState<PilotProjectRecord[]>([]);
  const [savedChallengeIds, setSavedChallengeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [selectedGeography, setSelectedGeography] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Selected Challenge Detail Drawer
  const [selectedChallenge, setSelectedChallenge] = useState<InnovationChallenge | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userApplications, setUserApplications] = useState<ChallengeApplication[]>([]);
  const [selectedAppForReview, setSelectedAppForReview] = useState<ChallengeApplication | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Create Challenge Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ChallengeCategory>("Policy Challenge");
  const [newTheme, setNewTheme] = useState("Peri-Urban Governance");
  const [newGeography, setNewGeography] = useState("Madhya Pradesh (Sehore)");
  const [newDescription, setNewDescription] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newEligibility, setNewEligibility] = useState("Open to academic researchers & innovators");
  const [newDeadline, setNewDeadline] = useState("2026-11-30");
  const [newBudget, setNewBudget] = useState("₹15,00,000 Demonstration Grant");

  // Apply Form
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalOrg, setProposalOrg] = useState("");
  const [problemUnderstanding, setProblemUnderstanding] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [submitImmediately, setSubmitImmediately] = useState(false);

  // Review Form (1-20 each)
  const [revProblem, setRevProblem] = useState(16);
  const [revInnovation, setRevInnovation] = useState(18);
  const [revFeasibility, setRevFeasibility] = useState(16);
  const [revEvidence, setRevEvidence] = useState(17);
  const [revImpact, setRevImpact] = useState(18);
  const [revScalability, setRevScalability] = useState(17);
  const [revNotes, setRevNotes] = useState("");

  const isPublicUser = userRole === "PUBLIC";
  const canCreate = [
    "RESEARCHER",
    "ACADEMIC_INSTITUTION",
    "POLICYMAKER",
    "GOVERNMENT_AGENCY",
    "ADMIN",
    "INNOVATOR",
  ].includes(userRole);
  const canReview = ["POLICYMAKER", "GOVERNMENT_AGENCY", "ADMIN"].includes(userRole);

  // Fetch Challenges
  const fetchChallenges = useCallback(async () => {
    try {
      const res = await fetch("/api/innovation/challenges");
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges || []);

        if (initialChallengeId) {
          const match = data.challenges.find((c: InnovationChallenge) => c.id === initialChallengeId);
          if (match) setSelectedChallenge(match);
        }
      }
    } catch (err) {
      console.error("Failed to load challenges:", err);
    }
  }, [initialChallengeId]);

  // Fetch Pilots
  const fetchPilots = useCallback(async () => {
    try {
      const res = await fetch("/api/innovation/pilots");
      if (res.ok) {
        const data = await res.json();
        setPilots(data.pilots || []);
      }
    } catch (err) {
      console.error("Failed to load pilots:", err);
    }
  }, []);

  // Fetch User Applications / Dashboard
  const fetchUserData = useCallback(async () => {
    if (isPublicUser) return;
    try {
      const res = await fetch("/api/innovation/user-dashboard");
      if (res.ok) {
        const data = await res.json();
        setUserApplications(data.dashboard?.myApplications || []);
        const savedIds = new Set<string>(
          (data.dashboard?.savedChallenges || []).map((c: InnovationChallenge) => c.id)
        );
        setSavedChallengeIds(savedIds);
      }
    } catch (err) {
      console.error("Failed to load user dashboard:", err);
    }
  }, [isPublicUser]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([fetchChallenges(), fetchPilots(), fetchUserData()]);
      setLoading(false);
    }
    loadAll();
  }, [fetchChallenges, fetchPilots, fetchUserData]);

  // Toggle Save Challenge
  const handleToggleSave = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPublicUser) {
      setActionMessage("Please sign in to bookmark challenges");
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }
    try {
      const res = await fetch("/api/innovation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedChallengeIds((prev) => {
          const updated = new Set(prev);
          if (data.isSaved) updated.add(id);
          else updated.delete(id);
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  // Create Challenge Handler
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newProblem.trim()) return;

    try {
      const res = await fetch("/api/innovation/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          theme: newTheme,
          geography: newGeography,
          description: newDescription,
          problemStatement: newProblem,
          expectedOutcome: newOutcome || "Demonstration of spatial AI in land governance",
          eligibility: newEligibility,
          submissionDeadline: newDeadline,
          budgetOrPrize: newBudget,
          evaluationCriteria: [
            "Problem Understanding & Grounding",
            "Technical Innovation & Feasibility",
            "Evidence Traceability & Provenance",
            "Tenure Security & Scalability",
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage("Challenge created successfully!");
        setIsCreateModalOpen(false);
        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewProblem("");
        setNewOutcome("");
        await fetchChallenges();
        if (data.challenge) setSelectedChallenge(data.challenge);
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to create challenge");
      }
    } catch {
      setActionMessage("Network error creating challenge");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Submit Application Handler
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    if (!proposalTitle.trim() || !problemUnderstanding.trim() || !proposedSolution.trim()) return;

    try {
      const res = await fetch(`/api/innovation/challenges/${selectedChallenge.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalTitle,
          organization: proposalOrg,
          problemUnderstanding,
          proposedSolution,
          expectedImpact: expectedImpact || "Measurable improvement in cadastral precision",
          teamMembers,
          submitImmediately,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage(
          submitImmediately
            ? "Proposal successfully submitted and locked for review!"
            : "Application draft saved in your dashboard."
        );
        setIsApplyModalOpen(false);
        setProposalTitle("");
        setProblemUnderstanding("");
        setProposedSolution("");
        setExpectedImpact("");
        await fetchUserData();
        await fetchChallenges();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to submit application");
      }
    } catch {
      setActionMessage("Network error submitting application");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForReview) return;

    try {
      const res = await fetch(`/api/innovation/applications/${selectedAppForReview.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scores: {
            problemUnderstanding: revProblem,
            innovation: revInnovation,
            technicalFeasibility: revFeasibility,
            evidence: revEvidence,
            expectedImpact: revImpact,
            scalability: revScalability,
          },
          feedbackNotes: revNotes || "Illustrative evaluation completed.",
        }),
      });

      if (res.ok) {
        setActionMessage("Evaluation submitted successfully!");
        setIsReviewModalOpen(false);
        setSelectedAppForReview(null);
        await fetchUserData();
      } else {
        const err = await res.json();
        setActionMessage(err.error || "Failed to submit review");
      }
    } catch {
      setActionMessage("Network error submitting review");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Filtered Challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Tab filter
      if (activeTab === "hackathons" && c.category !== "Hackathon" && c.category !== "Knowledge Competition") {
        return false;
      }
      if (activeTab === "grants" && c.category !== "Research Grant") {
        return false;
      }
      if (activeTab === "competitions" && c.category !== "Knowledge Competition") {
        return false;
      }

      // Dropdown filters
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
      if (selectedTheme !== "All" && !c.theme.toLowerCase().includes(selectedTheme.toLowerCase())) return false;
      if (selectedGeography !== "All" && !c.geography.toLowerCase().includes(selectedGeography.toLowerCase()))
        return false;

      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.theme.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [challenges, activeTab, selectedCategory, selectedStatus, selectedTheme, selectedGeography, searchQuery]);

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto text-slate-800">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1C30] via-[#102A45] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-sm shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              National Land Technology & Research Opportunities
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Innovation Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              &quot;Turn land intelligence into real-world innovation.&quot; Accelerate tenure security,
              climate resilience, and cadastral demarcation through national hackathons, research grants, and
              collaborative pilot sandboxes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canCreate && (
              <Button
                variant="saffron"
                size="md"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-sm font-semibold"
              >
                + Create Challenge
              </Button>
            )}
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded border border-white/20 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-semibold">
                Active Opportunities
              </span>
              <span className="text-lg font-bold text-white">{challenges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Primary Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-sm p-1.5 shadow-2xs flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          All Challenges ({challenges.length})
        </button>

        <button
          onClick={() => setActiveTab("hackathons")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "hackathons"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          Active Hackathons & Competitions
        </button>

        <button
          onClick={() => setActiveTab("grants")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "grants"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-500" />
          Research Grants & Fellowships
        </button>

        <button
          onClick={() => setActiveTab("pilots")}
          className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
            activeTab === "pilots"
              ? "bg-[#0A1C30] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          Pilot Projects Sandbox ({pilots.length})
        </button>

        {!isPublicUser && (
          <button
            onClick={() => setActiveTab("my-dashboard")}
            className={`px-4 py-2 rounded-xs transition-colors flex items-center gap-2 ${
              activeTab === "my-dashboard"
                ? "bg-[#0A1C30] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            My Dashboard ({userApplications.length})
          </button>
        )}
      </div>

      {/* 3. Main Workspace Area */}
      {activeTab === "pilots" ? (
        /* ---------------- PILOT PROJECTS VIEW ---------------- */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-sm">
            <div>
              <h2 className="text-base font-bold text-[#0A1C30]">
                Field Pilot Projects & Ground Sandboxes
              </h2>
              <p className="text-xs text-slate-500">
                Live test deployments of spatial AI and participatory GIS across rural revenue tehsils.
              </p>
            </div>
            <Badge variant="saffron" className="text-xs">
              Demonstration Sandboxes
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pilots.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-sm p-5 hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      {p.status}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{p.pilotName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {p.location} • Lead: {p.leadOrganization}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {p.demonstrationLabel}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block">Core Challenge:</span>
                    <p className="text-slate-600">{p.problem}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Applied Innovation:</span>
                    <p className="text-slate-600">{p.innovation}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-slate-50 p-3 rounded border border-slate-100 grid grid-cols-3 gap-2 text-center">
                  {p.metrics.map((m, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] text-slate-500 block">{m.label}</span>
                      <span className="font-bold text-slate-900 text-sm">{m.value}</span>
                      {m.trend && (
                        <span className="text-[10px] text-emerald-600 block">{m.trend}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[11px]">Timeline: {p.timeline}</span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      if (onNavigateToGis) {
                        onNavigateToGis({
                          state: p.state,
                          district: p.district,
                          tehsil: p.tehsil || "Ashta",
                        });
                      }
                    }}
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    View in GIS
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "my-dashboard" ? (
        /* ---------------- MY DASHBOARD VIEW ---------------- */
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-sm">
            <h2 className="text-base font-bold text-[#0A1C30]">
              My Applications, Submissions & Saved Opportunities
            </h2>
            <p className="text-xs text-slate-500">
              Track your proposal lifecycle, review status, and bookmarked challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Submissions Column */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>My Submitted Proposals & Drafts</span>
                <Badge variant="outline" className="text-xs">
                  {userApplications.length} Record(s)
                </Badge>
              </h3>

              {userApplications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-sm p-8 text-center text-slate-500 text-xs">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>You have not submitted or drafted any proposals yet.</p>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setActiveTab("all")}
                    className="mt-3"
                  >
                    Browse Open Opportunities
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white border border-slate-200 rounded-sm p-4 hover:border-slate-300 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                app.status === "Submitted"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : app.status === "Under Review"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {app.status}
                            </span>
                            {app.isLocked && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {app.proposalTitle}
                          </h4>
                          <span className="text-xs text-slate-500">
                            Challenge: {app.challengeTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {canReview && app.applicantEmail !== userRole && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                setSelectedAppForReview(app);
                                setIsReviewModalOpen(true);
                              }}
                            >
                              Review Proposal
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {app.proposedSolution}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Draft"}</span>
                        <span>Team: {app.teamMembers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Challenges Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Bookmarked Opportunities</span>
                <Badge variant="outline" className="text-xs">
                  {savedChallengeIds.size} Saved
                </Badge>
              </h3>

              {savedChallengeIds.size === 0 ? (
                <div className="bg-white border border-slate-200 rounded-sm p-6 text-center text-slate-400 text-xs">
                  <Bookmark className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <p>No saved challenges. Click the bookmark icon on any card to save it here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {challenges
                    .filter((c) => savedChallengeIds.has(c.id))
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedChallenge(c)}
                        className="bg-white border border-slate-200 rounded-sm p-3 hover:border-slate-400 cursor-pointer transition-colors"
                      >
                        <span className="text-[10px] text-blue-600 font-semibold block uppercase">
                          {c.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</h4>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Deadline: {c.submissionDeadline}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- DISCOVERY & CHALLENGES LIST ---------------- */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search Query */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search challenges, datasets, topics, organizers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1C30]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#0A1C30]"
                >
                  <option value="All">All Categories</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Research Grant">Research Grant</option>
                  <option value="Policy Challenge">Policy Challenge</option>
                  <option value="Land Technology Challenge">Land Technology</option>
                  <option value="Knowledge Competition">Knowledge Competition</option>
                  <option value="Pilot Project">Pilot Project</option>
                </select>
              </div>

              {/* Geography Filter */}
              <div>
                <select
                  value={selectedGeography}
                  onChange={(e) => setSelectedGeography(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#0A1C30]"
                >
                  <option value="All">All Geographies</option>
                  <option value="National">National (Pan-India)</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#0A1C30]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open for Proposals</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-400 text-sm">
              Loading national innovation opportunities...
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-500 text-sm">
              <Lightbulb className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold">No innovation opportunities match your selected filters.</p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedTheme("All");
                  setSelectedGeography("All");
                  setSelectedStatus("All");
                  setSearchQuery("");
                }}
                className="mt-3"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChallenges.map((challenge) => {
                const isSaved = savedChallengeIds.has(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className="bg-white border border-slate-200 hover:border-slate-400 rounded-sm p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                          {challenge.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                            {challenge.status}
                          </span>
                          <button
                            onClick={(e) => handleToggleSave(challenge.id, e)}
                            className="text-slate-400 hover:text-amber-500 p-1"
                            title={isSaved ? "Remove bookmark" : "Save opportunity"}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-[#0A1C30] group-hover:text-blue-700 transition-colors line-clamp-2">
                        {challenge.title}
                      </h3>

                      {/* Theme */}
                      <p className="text-xs font-semibold text-amber-700 mt-1">
                        Theme: {challenge.theme}
                      </p>

                      {/* Short Description */}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="line-clamp-1 max-w-[170px]">{challenge.organizer}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="line-clamp-1">{challenge.geography}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          Deadline: {challenge.submissionDeadline}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {challenge.submissionsCount} proposal(s)
                        </span>
                      </div>

                      {/* Illustrative Demonstration Label */}
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">
                          {challenge.demonstrationLabel}
                        </span>
                        <span className="text-blue-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Challenge Detail Drawer / Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {selectedChallenge.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {selectedChallenge.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {selectedChallenge.demonstrationLabel}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0A1C30]">{selectedChallenge.title}</h2>
                <span className="text-xs text-slate-500">
                  Organized by {selectedChallenge.organizer} • {selectedChallenge.geography}
                </span>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
              {/* Problem Statement */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Problem Statement
                </h3>
                <p className="bg-amber-50/60 p-3.5 rounded border border-amber-200 text-slate-800 leading-relaxed font-sans">
                  {selectedChallenge.problemStatement}
                </p>
              </div>

              {/* Expected Outcome */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Expected Deliverables & Outcomes
                </h3>
                <p className="bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                  {selectedChallenge.expectedOutcome}
                </p>
              </div>

              {/* Eligibility & Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Eligibility</span>
                  <span className="text-slate-600">{selectedChallenge.eligibility}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Submission Deadline</span>
                  <span className="text-amber-700 font-semibold">
                    {selectedChallenge.submissionDeadline}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Duration: {selectedChallenge.startDate} to {selectedChallenge.endDate}
                  </span>
                </div>
              </div>

              {/* Budget / Award */}
              {selectedChallenge.budgetOrPrize && (
                <div className="bg-indigo-50/70 p-3 rounded border border-indigo-200 flex items-center justify-between">
                  <span className="font-bold text-indigo-900">Demonstration Grant / Prize:</span>
                  <span className="font-bold text-indigo-700 text-sm">
                    {selectedChallenge.budgetOrPrize}
                  </span>
                </div>
              )}

              {/* Evaluation Criteria */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Evaluation Criteria
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {selectedChallenge.evaluationCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related LANDScope System Contexts */}
              {selectedChallenge.relatedContext && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Associated LANDScope Intelligence Contexts
                  </h3>
                  <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200 text-slate-600 text-[11px]">
                    {selectedChallenge.relatedContext.evidenceTitle && (
                      <div className="flex items-center justify-between">
                        <span>Research Evidence:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedChallenge.relatedContext.evidenceTitle}
                        </span>
                      </div>
                    )}
                    {selectedChallenge.relatedContext.datasetName && (
                      <div className="flex items-center justify-between">
                        <span>Demarcation Dataset:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedChallenge.relatedContext.datasetName} (
                          {selectedChallenge.relatedContext.datasetFormat})
                        </span>
                      </div>
                    )}
                    {selectedChallenge.relatedContext.scenarioName && (
                      <div className="flex items-center justify-between">
                        <span>Policy Digital Twin Scenario:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedChallenge.relatedContext.scenarioName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleToggleSave(selectedChallenge.id, e)}
                leftIcon={
                  savedChallengeIds.has(selectedChallenge.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )
                }
              >
                {savedChallengeIds.has(selectedChallenge.id) ? "Saved" : "Save Opportunity"}
              </Button>

              <div className="flex items-center gap-2">
                {selectedChallenge.relatedContext?.state && onNavigateToGis && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedChallenge.relatedContext?.state) {
                        onNavigateToGis({
                          state: selectedChallenge.relatedContext.state,
                          district: selectedChallenge.relatedContext.district || "Sehore",
                          tehsil: selectedChallenge.relatedContext.tehsil || "Ashta",
                        });
                      }
                    }}
                  >
                    View in GIS
                  </Button>
                )}

                {!isPublicUser && selectedChallenge.status === "Open" && (
                  <Button
                    variant="saffron"
                    size="sm"
                    onClick={() => {
                      setIsApplyModalOpen(true);
                    }}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Apply / Submit Proposal
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Challenge Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0A1C30]">+ Create Innovation Opportunity</h3>
                <span className="text-xs text-slate-500">
                  Launch a research challenge, hackathon, or demonstration grant
                </span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Drone AI Cadastral Demarcation Challenge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0A1C30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ChallengeCategory)}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Policy Challenge">Policy Challenge</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Research Grant">Research Grant</option>
                    <option value="Land Technology Challenge">Land Technology</option>
                    <option value="Knowledge Competition">Knowledge Competition</option>
                    <option value="Pilot Project">Pilot Project</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Theme *</label>
                  <input
                    type="text"
                    required
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Geography *</label>
                  <input
                    type="text"
                    required
                    value={newGeography}
                    onChange={(e) => setNewGeography(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Overview of the research problem or hackathon challenge..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Problem Statement *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of the statutory or technological obstacle..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expected Deliverables</label>
                <input
                  type="text"
                  placeholder="e.g. Open-source deep learning segmentation model or policy whitepaper"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Eligibility</label>
                  <input
                    type="text"
                    value={newEligibility}
                    onChange={(e) => setNewEligibility(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Budget / Demonstration Grant</label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                Notice: All challenges are registered under the &quot;Illustrative Demonstration Challenge&quot;
                label. Permissions and access boundaries are strictly validated on the server.
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="saffron" size="sm">
                  Publish Challenge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Apply / Submit Proposal Modal */}
      {isApplyModalOpen && selectedChallenge && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0A1C30]">Submit Innovation Proposal</h3>
                <span className="text-xs text-slate-500">
                  Challenge: {selectedChallenge.title}
                </span>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., GeoVision: High-Resolution Orthomosaic Feature Delineator"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Applicant Organization</label>
                  <input
                    type="text"
                    placeholder="University, Lab, or Startup"
                    value={proposalOrg}
                    onChange={(e) => setProposalOrg(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Team Members</label>
                  <input
                    type="text"
                    placeholder="Names of collaborating researchers"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Understanding of the Problem Statement *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline your technical diagnosis of the land governance obstacle..."
                  value={problemUnderstanding}
                  onChange={(e) => setProblemUnderstanding(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Proposed Solution & Technical Methodology *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify model architecture, spatial datasets, or policy intervention mechanism..."
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Expected Impact on Land Governance
                </label>
                <input
                  type="text"
                  placeholder="e.g. 95% reduction in boundary dispute settlement latency"
                  value={expectedImpact}
                  onChange={(e) => setExpectedImpact(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Formal Submission</span>
                  <span className="text-[11px] text-slate-500">
                    If checked, your proposal will be locked and sent directly for evaluation.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={submitImmediately}
                  onChange={(e) => setSubmitImmediately(e.target.checked)}
                  className="w-4 h-4 text-[#0A1C30]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="saffron" size="sm">
                  {submitImmediately ? "Submit & Lock Proposal" : "Save as Draft"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Review / Evaluation Modal */}
      {isReviewModalOpen && selectedAppForReview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    Illustrative Evaluation
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0A1C30] mt-1">Review Proposal</h3>
                <span className="text-xs text-slate-500">
                  {selectedAppForReview.proposalTitle} ({selectedAppForReview.applicantName})
                </span>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">Proposal Summary:</span>
                <p className="text-slate-600 line-clamp-3">{selectedAppForReview.proposedSolution}</p>
              </div>

              {/* 6 Evaluation Dimensions (1-20 each) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Scoring Criteria (1 - 20 Points Each)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block">
                      Problem Understanding: <span className="font-bold">{revProblem}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revProblem}
                      onChange={(e) => setRevProblem(Number(e.target.value))}
                      className="w-full accent-[#0A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block">
                      Innovation: <span className="font-bold">{revInnovation}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revInnovation}
                      onChange={(e) => setRevInnovation(Number(e.target.value))}
                      className="w-full accent-[#0A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block">
                      Technical Feasibility: <span className="font-bold">{revFeasibility}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revFeasibility}
                      onChange={(e) => setRevFeasibility(Number(e.target.value))}
                      className="w-full accent-[#0A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block">
                      Evidence Grounding: <span className="font-bold">{revEvidence}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revEvidence}
                      onChange={(e) => setRevEvidence(Number(e.target.value))}
                      className="w-full accent-[#0A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block">
                      Expected Impact: <span className="font-bold">{revImpact}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revImpact}
                      onChange={(e) => setRevImpact(Number(e.target.value))}
                      className="w-full accent-[#0A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block">
                      Scalability: <span className="font-bold">{revScalability}/20</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={revScalability}
                      onChange={(e) => setRevScalability(Number(e.target.value))}
                      className="w-full accent-[#0A1C30]"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded border border-blue-200 text-center font-bold text-blue-900">
                  Total Assessment Score:{" "}
                  {revProblem + revInnovation + revFeasibility + revEvidence + revImpact + revScalability} / 120
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Evaluator Feedback & Recommendation Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Constructive feedback for the applicant..."
                  value={revNotes}
                  onChange={(e) => setRevNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="saffron" size="sm">
                  Submit Evaluation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
