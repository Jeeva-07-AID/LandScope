import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { AccessDenied } from "@/components/auth/access-denied";
import { researchStore } from "@/lib/research/research-data";
import { ResearchProjectWorkspaceClient } from "@/components/researcher/research-project-workspace-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ResearchProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const ctx = await getAuthenticatedUser();

  // 1. Unauthenticated users cannot access researcher project workspace
  if (!ctx) {
    redirect(`/login?redirect=/app/researcher/projects/${resolvedParams.projectId}`);
  }

  // 2. Strict RBAC: Policymaker and Public cannot access researcher-private project data
  const allowedRoles = ["RESEARCHER", "ACADEMIC_INSTITUTION", "ADMIN"];
  if (!allowedRoles.includes(ctx.role.code)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AccessDenied
          currentRoleTitle={ctx.role.title}
          currentRoleSlug={ctx.role.slug}
          requiredRoleTitle="Researcher Private Project Workspace"
          requiredPermission="research:write (Restricted Project Data)"
        />
      </div>
    );
  }

  // 3. Fetch project from Supabase PostgreSQL (or fallback to store)
  const { getAuthenticatedSupabaseClient } = await import("@/lib/supabase/client");
  const { getPersistedResearchProjectById } = await import("@/lib/supabase/research-service");
  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const project =
    (await getPersistedResearchProjectById(supabaseClient, resolvedParams.projectId)) ||
    researchStore.getProjectById(resolvedParams.projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-sm p-6 text-center space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Project Not Found</h2>
          <p className="text-xs text-slate-500">
            The research project dossier &apos;{resolvedParams.projectId}&apos; does not exist or has been archived.
          </p>
          <Link
            href="/app/researcher"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#112A4A] text-white rounded-sm hover:bg-[#1A3E6D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Research Intelligence</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResearchProjectWorkspaceClient
      user={ctx.user}
      role={ctx.role}
      project={project}
    />
  );
}
