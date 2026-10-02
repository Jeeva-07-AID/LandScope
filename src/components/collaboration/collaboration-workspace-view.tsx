"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  FolderGit2,
  Share2,
  Plus,
  Shield,
  FileText,
  Database,
  MapPin,
  Clock,
  MessageSquare,
  Activity,
  Send,
  Trash2,
  ExternalLink,
  Lock,
  UserCheck,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle,
  MailCheck,
  XCircle,
  FileSpreadsheet,
  CornerDownRight,
  TrendingUp,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ModalDialog } from "@/components/ui/modal-dialog";
import {
  CollaborativeProject,
  ProjectMember,
  MemberInvitation,
  SharedEvidence,
  SharedDataset,
  SharedGisContext,
  SharedPolicyScenario,
  ProjectComment,
  ProjectActivityEvent,
  ProjectRole,
  ProjectPermission,
  ProjectType,
  ProjectVisibility,
} from "@/lib/collaboration/collaboration-data";

export interface CollaborationWorkspaceViewProps {
  userRole?: string;
  initialProjectId?: string;
  onNavigateToGis?: (geo: { state: string; district: string; tehsil: string }) => void;
  onNavigateToPolicyLab?: (geo?: { state: string; district: string; tehsil: string }) => void;
  onNavigateToResearch?: (topic?: string) => void;
  onNavigateToReports?: (reportId?: string) => void;
}

export function CollaborationWorkspaceView({
  userRole = "RESEARCHER",
  initialProjectId,
  onNavigateToGis,
  onNavigateToPolicyLab,
  onNavigateToResearch,
  onNavigateToReports,
}: CollaborationWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "shared" | "invitations" | "activity">("projects");
  const [ownedProjects, setOwnedProjects] = useState<CollaborativeProject[]>([]);
  const [sharedProjects, setSharedProjects] = useState<CollaborativeProject[]>([]);
  const [invitations, setInvitations] = useState<MemberInvitation[]>([]);
  const [recentActivities, setRecentActivities] = useState<ProjectActivityEvent[]>([]);
  const [selectedProject, setSelectedProject] = useState<CollaborativeProject | null>(null);
  const [projectDetailTab, setProjectDetailTab] = useState<
    "overview" | "members" | "evidence" | "datasets" | "gis" | "scenarios" | "reports" | "comments" | "activity"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    organization: "",
    projectRole: "RESEARCHER" as ProjectRole,
    projectPermission: "write" as ProjectPermission,
  });

  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    researchArea: "Land Economics & Peri-Urban Governance",
    geography: "Madhya Pradesh > Sehore > Ashta",
    projectType: "Research" as ProjectType,
    visibility: "Private" as ProjectVisibility,
  });

  const [commentInput, setCommentInput] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({
    title: "",
    authorOrOrg: "",
    year: 2026,
    confidence: 92,
    evidenceType: "Research Paper",
    notes: "",
  });

  const isPublic = userRole === "PUBLIC";

  // Initial load projects effect
  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const res = await fetch("/api/collaboration/projects");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setOwnedProjects(data.owned || []);
          setSharedProjects(data.shared || []);
          setInvitations(data.invitations || []);
          setRecentActivities(data.recentActivities || []);
          const all = [...(data.owned || []), ...(data.shared || [])];
          if (all.length > 0) {
            const match = initialProjectId ? all.find((p: CollaborativeProject) => p.id === initialProjectId) : all[0];
            setSelectedProject(match || all[0]);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, [initialProjectId]);

  // Re-fetch collaboration projects on user actions
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/collaboration/projects");
      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Session expired. Please log in.");
        } else {
          setErrorMsg("Failed to load collaborative projects.");
        }
        return;
      }
      const data = await res.json();
      setOwnedProjects(data.owned || []);
      setSharedProjects(data.shared || []);
      setInvitations(data.invitations || []);
      setRecentActivities(data.recentActivities || []);

      const all = [...(data.owned || []), ...(data.shared || [])];
      if (all.length > 0) {
        const match = initialProjectId ? all.find((p: CollaborativeProject) => p.id === initialProjectId) : all[0];
        setSelectedProject(match || all[0]);
      }
    } catch {
      setErrorMsg("Network error loading collaboration data.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh single project
  const refreshProject = async (id: string) => {
    try {
      const res = await fetch(`/api/collaboration/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProject(data.project);
        setOwnedProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
        setSharedProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle invite member
  const handleInviteMember = async () => {
    if (!selectedProject || !inviteForm.name || !inviteForm.email) return;
    try {
      const res = await fetch(`/api/collaboration/projects/${selectedProject.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      if (res.ok) {
        await refreshProject(selectedProject.id);
        setInviteModalOpen(false);
        setInviteForm({
          name: "",
          email: "",
          organization: "",
          projectRole: "RESEARCHER",
          projectPermission: "write",
        });
      } else {
        const err = await res.json();
        alert(err.message || "Failed to invite member.");
      }
    } catch (err) {
      alert("Error inviting member.");
    }
  };

  // Accept invitation
  const handleAcceptInvite = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/collaboration/invitations/${invitationId}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchProjects();
      } else {
        alert("Failed to accept invitation.");
      }
    } catch (err) {
      alert("Error accepting invitation.");
    }
  };

  // Reject invitation
  const handleRejectInvite = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/collaboration/invitations/${invitationId}/reject`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchProjects();
      } else {
        alert("Failed to reject invitation.");
      }
    } catch (err) {
      alert("Error rejecting invitation.");
    }
  };

  // Handle create project
  const handleCreateProject = async () => {
    if (!newProjectForm.title) return;
    try {
      const res = await fetch("/api/collaboration/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectForm),
      });
      if (res.ok) {
        const data = await res.json();
        setNewProjectModalOpen(false);
        setNewProjectForm({
          title: "",
          subtitle: "",
          description: "",
          researchArea: "Land Economics & Peri-Urban Governance",
          geography: "Madhya Pradesh > Sehore > Ashta",
          projectType: "Research",
          visibility: "Private",
        });
        await fetchProjects();
        if (data.project) setSelectedProject(data.project);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create project.");
      }
    } catch (err) {
      alert("Error creating project.");
    }
  };

  // Handle post comment
  const handleAddComment = async () => {
    if (!selectedProject || !commentInput.trim()) return;
    try {
      const res = await fetch(`/api/collaboration/projects/${selectedProject.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput.trim(), parentId: replyParentId || undefined }),
      });
      if (res.ok) {
        setCommentInput("");
        setReplyParentId(null);
        await refreshProject(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to post comment.");
      }
    } catch (err) {
      alert("Error posting comment.");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(
        `/api/collaboration/projects/${selectedProject.id}/comments?commentId=${encodeURIComponent(commentId)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await refreshProject(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete comment.");
      }
    } catch (err) {
      alert("Error deleting comment.");
    }
  };

  // Handle add evidence
  const handleAddEvidence = async () => {
    if (!selectedProject || !evidenceForm.title) return;
    try {
      const res = await fetch(`/api/collaboration/projects/${selectedProject.id}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evidenceForm),
      });
      if (res.ok) {
        setEvidenceModalOpen(false);
        setEvidenceForm({ title: "", authorOrOrg: "", year: 2026, confidence: 92, evidenceType: "Research Paper", notes: "" });
        await refreshProject(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add evidence.");
      }
    } catch (err) {
      alert("Error adding evidence.");
    }
  };

  // Handle remove evidence
  const handleRemoveEvidence = async (evidenceId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(
        `/api/collaboration/projects/${selectedProject.id}/evidence?evidenceId=${encodeURIComponent(evidenceId)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await refreshProject(selectedProject.id);
      } else {
        alert("Failed to remove evidence.");
      }
    } catch (err) {
      alert("Error removing evidence.");
    }
  };

  // Role headline mapping
  const getRoleSectionTitle = () => {
    switch (userRole) {
      case "POLICYMAKER":
        return "Policy Collaborations";
      case "ACADEMIC_INSTITUTION":
        return "Institutional Projects";
      case "GOVERNMENT_AGENCY":
        return "Agency Projects";
      case "RESEARCHER":
      default:
        return "My Projects";
    }
  };

  if (isPublic) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="p-8 text-center bg-white border border-slate-200 rounded-sm">
          <Lock className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#0A1C30]">Institutional Collaboration Workspace</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
            Multi-stakeholder project collaboration is reserved for authorized researchers, policymakers, academic institutions, and government agencies. Public users can browse published research and public briefs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <Breadcrumbs
            items={[
              { label: "National SDI Registry" },
              { label: "Collaboration Workspace", active: true },
            ]}
          />
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-xl font-bold text-[#0A1C30] tracking-tight">
              Collaboration Workspace
            </h1>
            <span className="text-[10px] font-bold text-[#D35E0E] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
              SIH Demonstration Account
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Work across research, evidence, geospatial intelligence and policy experimentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setNewProjectModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Collaboration Project
          </Button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "projects"
              ? "border-[#D35E0E] text-[#D35E0E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          {getRoleSectionTitle()} ({ownedProjects.length})
        </button>
        <button
          onClick={() => setActiveTab("shared")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "shared"
              ? "border-[#D35E0E] text-[#D35E0E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Shared With Me ({sharedProjects.length})
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "invitations"
              ? "border-[#D35E0E] text-[#D35E0E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Pending Invitations
          {invitations.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#D35E0E] text-white text-[10px] flex items-center justify-center font-bold">
              {invitations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "activity"
              ? "border-[#D35E0E] text-[#D35E0E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Recent Activity ({recentActivities.length})
        </button>
      </div>

      {/* INVITATIONS TAB */}
      {activeTab === "invitations" ? (
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-sm">Pending Project Invitations</CardTitle>
            <CardDescription className="text-xs">
              Invitations from institutional project owners to collaborate across land research, policy simulation, or demarcation audits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <MailCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No pending project invitations.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {invitations.map((inv) => (
                  <div key={inv.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{inv.projectTitle}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Invited by <span className="font-semibold text-slate-700">{inv.inviterName}</span> ({inv.inviterEmail})
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#112A4A] px-2 py-0.5 rounded">
                          Role: {inv.assignedRole}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">Permission: {inv.assignedPermission}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleAcceptInvite(inv.id)}
                        leftIcon={<CheckCircle className="w-3 h-3" />}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleRejectInvite(inv.id)}
                        leftIcon={<XCircle className="w-3 h-3" />}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : activeTab === "activity" ? (
        /* ACTIVITY TAB */
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-sm">Platform Collaboration Activity Log</CardTitle>
            <CardDescription className="text-xs">
              Chronological log of multi-stakeholder project milestones, evidence contributions, and scenario evaluations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-[#112A4A]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{act.actorName}</span>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold text-[#D35E0E] bg-orange-50 px-1.5 py-0.5 rounded">
                      {act.type.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* PROJECTS LIST & WORKSPACE GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Projects Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {activeTab === "projects" ? "Active Projects" : "Collaborations Joined"}
            </h3>

            {(activeTab === "projects" ? ownedProjects : sharedProjects).length === 0 ? (
              <div className="p-6 text-center bg-white border border-slate-200 rounded-sm">
                <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No collaborative projects found.</p>
              </div>
            ) : (
              (activeTab === "projects" ? ownedProjects : sharedProjects).map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white border-[#D35E0E] shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#112A4A] bg-blue-50 px-1.5 py-0.5 rounded">
                        {proj.projectType || proj.category}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">{proj.lastUpdated}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{proj.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{proj.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <span>Owner: <strong className="text-slate-700">{proj.ownerName}</strong></span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" /> {proj.members.length} members
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" /> {proj.evidence.length} evidence
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-slate-400" /> {proj.datasets.length} datasets
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Project Details Workspace (8 Cols) */}
          <div className="lg:col-span-8">
            {selectedProject ? (
              <div className="bg-white border border-slate-200 rounded-sm divide-y divide-slate-200">
                {/* Project Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#D35E0E] px-2 py-0.5 rounded">
                        {selectedProject.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#112A4A] px-2 py-0.5 rounded">
                        {selectedProject.projectType || selectedProject.category}
                      </span>
                      {selectedProject.isPrivate && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-slate-500" /> Private Project
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Created: {selectedProject.createdAt.split("T")[0]}</span>
                  </div>

                  <h2 className="text-base font-bold text-[#0A1C30]">{selectedProject.title}</h2>
                  <p className="text-xs text-slate-600 mt-1">{selectedProject.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Lead / Owner</span>
                      <span className="font-bold text-slate-800 text-xs">{selectedProject.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Research Area</span>
                      <span className="font-medium text-slate-700 text-xs">{selectedProject.researchArea || "Land Policy"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Geography</span>
                      <span className="font-medium text-slate-700 text-xs">{selectedProject.geography || "Central India"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Visibility</span>
                      <span className="font-medium text-[#112A4A] text-xs uppercase">{selectedProject.visibility || "Private"}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex flex-wrap items-center gap-1 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
                  {[
                    { id: "overview", label: "Overview", icon: FolderGit2 },
                    { id: "members", label: `Members (${selectedProject.members.length})`, icon: Users },
                    { id: "evidence", label: `Evidence (${selectedProject.evidence.length})`, icon: FileText },
                    { id: "datasets", label: `Datasets (${selectedProject.datasets.length})`, icon: Database },
                    { id: "gis", label: `GIS Context (${selectedProject.gisContexts.length})`, icon: MapPin },
                    { id: "scenarios", label: `Scenarios (${selectedProject.scenarios.length})`, icon: TrendingUp },
                    { id: "reports", label: `Reports (${selectedProject.associatedReportIds?.length || 0})`, icon: FileSpreadsheet },
                    { id: "comments", label: `Comments (${selectedProject.comments.length})`, icon: MessageSquare },
                    { id: "activity", label: "Activity", icon: Activity },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = projectDetailTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() =>
                          setProjectDetailTab(
                            tab.id as
                              | "overview"
                              | "members"
                              | "evidence"
                              | "datasets"
                              | "gis"
                              | "scenarios"
                              | "reports"
                              | "comments"
                              | "activity"
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-sm transition-all ${
                          isActive
                            ? "bg-white text-[#D35E0E] shadow-xs font-bold border border-slate-200"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab Content Panes */}
                <div className="p-4 sm:p-5">
                  {/* OVERVIEW TAB */}
                  {projectDetailTab === "overview" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1C30] mb-1">
                          Project Objective & Collaboration Scope
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-white border border-slate-200 rounded-sm">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Empirical Studies</span>
                          <span className="text-lg font-bold text-[#0A1C30]">{selectedProject.evidence.length}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Attached from Research</span>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-sm">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">GIS Contexts</span>
                          <span className="text-lg font-bold text-[#0A1C30]">{selectedProject.gisContexts.length}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Tehsil Boundary Baselines</span>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-sm">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Policy Scenarios</span>
                          <span className="text-lg font-bold text-[#0A1C30]">{selectedProject.scenarios.length}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Digital Twin Simulations</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MEMBERS TAB */}
                  {projectDetailTab === "members" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Project Collaborators & Access Controls
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Multi-stakeholder team members across Research, Policy, Academic, and Agency nodes.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setInviteModalOpen(true)}
                          leftIcon={<Plus className="w-3 h-3 text-[#D35E0E]" />}
                        >
                          Invite Member
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Collaborator</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Project Role</TableHead>
                            <TableHead>Permission</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.members.map((mem) => (
                            <TableRow key={mem.id}>
                              <TableCell>
                                <span className="font-bold text-slate-800 block text-xs">{mem.name}</span>
                                <span className="text-[10px] text-slate-400">{mem.email}</span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-600">{mem.organization}</TableCell>
                              <TableCell>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {mem.projectRole}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-[10px] font-medium text-slate-500 capitalize">{mem.projectPermission}</span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    mem.status === "ACTIVE"
                                      ? "text-emerald-700 bg-emerald-50"
                                      : "text-amber-700 bg-amber-50"
                                  }`}
                                >
                                  {mem.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* EVIDENCE TAB */}
                  {projectDetailTab === "evidence" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Empirical Research & Evidence Repository
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Shared studies and peer-reviewed papers informing policy design and spatial modeling.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setEvidenceModalOpen(true)}
                          leftIcon={<Plus className="w-3 h-3 text-[#D35E0E]" />}
                        >
                          Add Evidence
                        </Button>
                      </div>

                      {selectedProject.evidence.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-slate-200 rounded-sm">
                          <p className="text-xs text-slate-500">No empirical evidence shared yet.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {selectedProject.evidence.map((ev) => (
                            <div key={ev.id} className="py-3 flex items-start justify-between gap-3">
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{ev.title}</h5>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                  <span>{ev.authorOrOrg} • {ev.year}</span>
                                  <span className="text-[10px] font-bold bg-blue-50 text-[#112A4A] px-1.5 py-0.2 rounded">
                                    {ev.evidenceType}
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-700">
                                    {ev.confidence}% Confidence
                                  </span>
                                </div>
                                {ev.notes && <p className="text-[11px] text-slate-600 italic mt-1">&ldquo;{ev.notes}&rdquo;</p>}
                                <span className="text-[10px] text-slate-400 block mt-1">
                                  Added by {ev.addedBy} on {ev.dateAdded}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {onNavigateToResearch && (
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onNavigateToResearch(ev.title)}
                                    rightIcon={<ExternalLink className="w-3 h-3" />}
                                  >
                                    View Evidence
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleRemoveEvidence(ev.id)}
                                  className="text-slate-400 hover:text-red-600"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DATASETS TAB */}
                  {projectDetailTab === "datasets" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Spatial & Cadastral Datasets
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Multi-spectral satellite imagery stacks and vector cadastre layers linked to this project.
                          </p>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dataset Name</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Geography</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.datasets.map((ds) => (
                            <TableRow key={ds.id}>
                              <TableCell className="text-xs font-bold text-slate-800">{ds.name}</TableCell>
                              <TableCell className="text-xs text-slate-600">{ds.format}</TableCell>
                              <TableCell className="text-xs text-slate-600">{ds.geography}</TableCell>
                              <TableCell className="text-xs text-slate-500">{ds.coverage}</TableCell>
                              <TableCell>
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                  {ds.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* GIS TAB */}
                  {projectDetailTab === "gis" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Saved Geospatial Intelligence Contexts
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            State, district, and tehsil boundaries with active OGC layer configurations.
                          </p>
                        </div>
                      </div>

                      {selectedProject.gisContexts.map((gis) => (
                        <div key={gis.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0A1C30]">
                              {gis.state} &gt; {gis.district} &gt; {gis.tehsil}
                            </span>
                            {onNavigateToGis && (
                              <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                  onNavigateToGis({
                                    state: gis.state,
                                    district: gis.district,
                                    tehsil: gis.tehsil,
                                  })
                                }
                                leftIcon={<MapPin className="w-3 h-3" />}
                              >
                                Open in Land Intelligence
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {gis.selectedLayers.map((lay) => (
                              <span
                                key={lay}
                                className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded"
                              >
                                {lay}
                              </span>
                            ))}
                          </div>
                          {gis.notes && <p className="text-[11px] text-slate-500 mt-2">&ldquo;{gis.notes}&rdquo;</p>}
                          <span className="text-[10px] text-slate-400 block mt-1.5">
                            Saved by {gis.savedBy} on {gis.dateSaved}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SCENARIOS TAB */}
                  {projectDetailTab === "scenarios" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Policy Digital Twin Scenarios
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Simulated policy parameter models and statutory multi-dimensional impact briefs.
                          </p>
                        </div>
                      </div>

                      {selectedProject.scenarios.map((scn) => (
                        <div key={scn.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#0A1C30]">{scn.name}</span>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                {scn.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {scn.geography} • Type: {scn.policyType}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {scn.impactDimensions?.map((dim) => (
                                <span key={dim} className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                                  {dim}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Created by {scn.createdBy} • Simulation: {scn.lastSimulation}
                            </span>
                          </div>
                          {onNavigateToPolicyLab && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => onNavigateToPolicyLab()}
                              leftIcon={<ExternalLink className="w-3 h-3 text-[#D35E0E]" />}
                            >
                              Open Policy Scenario
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* REPORTS TAB */}
                  {projectDetailTab === "reports" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Associated Policy Briefs & Reports
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Evidence-backed policy briefs linked from the Reports module.
                          </p>
                        </div>
                      </div>

                      {(!selectedProject.associatedReportIds || selectedProject.associatedReportIds.length === 0) ? (
                        <div className="p-6 text-center border border-dashed border-slate-200 rounded-sm">
                          <p className="text-xs text-slate-500">No policy reports linked yet.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {selectedProject.associatedReportIds.map((repId) => (
                            <div key={repId} className="py-3 flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-[#0A1C30] block">
                                  Statutory Policy Decision Brief: Controlled Peri-Urban Expansion
                                </span>
                                <span className="text-[11px] text-slate-500">Reference: {repId}</span>
                              </div>
                              {onNavigateToReports && (
                                <Button
                                  variant="primary"
                                  size="xs"
                                  onClick={() => onNavigateToReports(repId)}
                                  leftIcon={<FileSpreadsheet className="w-3 h-3" />}
                                >
                                  Open Policy Brief
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COMMENTS TAB */}
                  {projectDetailTab === "comments" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Inter-Institutional Discussion & Deliberation
                      </h4>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {selectedProject.comments.map((cmt) => (
                          <div
                            key={cmt.id}
                            className={`p-3 rounded-sm border ${
                              cmt.parentId ? "ml-6 bg-white border-blue-100" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {cmt.parentId && <CornerDownRight className="w-3 h-3 text-slate-400" />}
                                <span className="text-xs font-bold text-slate-800">{cmt.authorName}</span>
                                <span className="text-[10px] uppercase font-bold text-[#112A4A] bg-blue-50 px-1.5 py-0.2 rounded">
                                  {cmt.authorRole}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">{cmt.timestamp}</span>
                                <button
                                  onClick={() => setReplyParentId(cmt.id)}
                                  className="text-[10px] text-blue-600 hover:underline"
                                >
                                  Reply
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(cmt.id)}
                                  className="text-slate-400 hover:text-red-600 transition-colors"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-700 mt-1">{cmt.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add comment form */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        {replyParentId && (
                          <div className="flex items-center justify-between text-[11px] text-blue-700 bg-blue-50 px-2 py-1 rounded">
                            <span>Replying to comment...</span>
                            <button onClick={() => setReplyParentId(null)} className="text-slate-500 hover:text-slate-800">
                              Cancel Reply
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            placeholder={replyParentId ? "Type reply..." : "Add comment, policy feedback, or methodological note..."}
                            className="flex-1 text-xs border border-slate-200 rounded-sm px-3 py-2 focus:outline-none focus:border-[#D35E0E]"
                          />
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={handleAddComment}
                            leftIcon={<Send className="w-3 h-3" />}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIVITY TAB */}
                  {projectDetailTab === "activity" && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Project Event Audit Log
                      </h4>
                      <div className="divide-y divide-slate-100">
                        {selectedProject.activities.map((act) => (
                          <div key={act.id} className="py-2.5 flex items-start gap-2.5">
                            <Activity className="w-3.5 h-3.5 text-[#112A4A] mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <span className="text-xs text-slate-800 font-medium block">{act.description}</span>
                              <span className="text-[10px] text-slate-400">
                                {act.actorName} ({act.actorRole}) • {act.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-sm">
                <p className="text-xs text-slate-500">Select a project on the left to inspect collaborative workspace.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <ModalDialog
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title="Invite Project Collaborator"
        >
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                placeholder="e.g. Prof. Sudhir Kulkarni"
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Email</label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="e.g. academic@landscope.demo"
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Organization</label>
              <input
                type="text"
                value={inviteForm.organization}
                onChange={(e) => setInviteForm({ ...inviteForm, organization: e.target.value })}
                placeholder="e.g. National Institute of Advanced Rural Studies"
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Role</label>
                <select
                  value={inviteForm.projectRole}
                  onChange={(e) => setInviteForm({ ...inviteForm, projectRole: e.target.value as ProjectRole })}
                  className="w-full border border-slate-200 rounded-sm px-2 py-1.5 text-xs"
                >
                  <option value="RESEARCHER">RESEARCHER</option>
                  <option value="POLICYMAKER">POLICYMAKER</option>
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="GOVERNMENT_AGENCY">GOVERNMENT_AGENCY</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Permissions</label>
                <select
                  value={inviteForm.projectPermission}
                  onChange={(e) => setInviteForm({ ...inviteForm, projectPermission: e.target.value as ProjectPermission })}
                  className="w-full border border-slate-200 rounded-sm px-2 py-1.5 text-xs"
                >
                  <option value="write">Read & Write</option>
                  <option value="comment">Comment Only</option>
                  <option value="read">Read-Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="xs" onClick={() => setInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="xs" onClick={handleInviteMember}>
                Send Invitation
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* New Project Modal */}
      {newProjectModalOpen && (
        <ModalDialog
          isOpen={newProjectModalOpen}
          onClose={() => setNewProjectModalOpen(false)}
          title="Create Collaboration Project"
        >
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Name</label>
              <input
                type="text"
                value={newProjectForm.title}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                placeholder="e.g. Peri-Urban Land Governance Study"
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                value={newProjectForm.description}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                rows={2}
                placeholder="Describe project objectives and scope..."
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Research Area</label>
                <input
                  type="text"
                  value={newProjectForm.researchArea}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, researchArea: e.target.value })}
                  placeholder="e.g. Land Economics & Peri-Urban Governance"
                  className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Geography</label>
                <input
                  type="text"
                  value={newProjectForm.geography}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, geography: e.target.value })}
                  placeholder="e.g. Madhya Pradesh > Sehore > Ashta"
                  className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Type</label>
                <select
                  value={newProjectForm.projectType}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, projectType: e.target.value as ProjectType })}
                  className="w-full border border-slate-200 rounded-sm px-2 py-1.5 text-xs"
                >
                  <option value="Research">Research</option>
                  <option value="Policy Analysis">Policy Analysis</option>
                  <option value="Land Governance">Land Governance</option>
                  <option value="Climate & Resilience">Climate & Resilience</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Academic Study">Academic Study</option>
                  <option value="Innovation Pilot">Innovation Pilot</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Visibility</label>
                <select
                  value={newProjectForm.visibility}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, visibility: e.target.value as ProjectVisibility })}
                  className="w-full border border-slate-200 rounded-sm px-2 py-1.5 text-xs"
                >
                  <option value="Private">Private</option>
                  <option value="Project Members">Project Members</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="xs" onClick={() => setNewProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="xs" onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* Add Evidence Modal */}
      {evidenceModalOpen && (
        <ModalDialog
          isOpen={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
          title="Attach Shared Research Evidence"
        >
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Evidence Title</label>
              <input
                type="text"
                value={evidenceForm.title}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
                placeholder="e.g. Tenure Insecurity and Agricultural Credit Accessibility"
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Author / Source</label>
                <input
                  type="text"
                  value={evidenceForm.authorOrOrg}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, authorOrOrg: e.target.value })}
                  placeholder="e.g. NITI Aayog & NCAER"
                  className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Publication Year</label>
                <input
                  type="number"
                  value={evidenceForm.year}
                  onChange={(e) => setEvidenceForm({ ...evidenceForm, year: parseInt(e.target.value, 10) })}
                  className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contextual Notes</label>
              <textarea
                value={evidenceForm.notes}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, notes: e.target.value })}
                rows={2}
                placeholder="Why is this evidence relevant to project collaborators?"
                className="w-full border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="xs" onClick={() => setEvidenceModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="xs" onClick={handleAddEvidence}>
                Attach Evidence
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </div>
  );
}
