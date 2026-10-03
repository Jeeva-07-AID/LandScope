import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { researchStore } from "@/lib/research/research-data";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import {
  getPersistedResearchProjectById,
  updatePersistedResearchProject,
  deletePersistedResearchProject,
} from "@/lib/supabase/research-service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { projectId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Research Project details." },
      { status: 401 }
    );
  }

  // Acceptance Test 8: Policymaker cannot access researcher-private project data
  // Only RESEARCHER, ACADEMIC_INSTITUTION, and ADMIN are permitted to inspect researcher project workspaces.
  const allowedRoles = ["RESEARCHER", "ACADEMIC_INSTITUTION", "ADMIN"];
  if (!allowedRoles.includes(ctx.role.code)) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' is not authorized to access private researcher project data.`,
        requiredRole: "RESEARCHER",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const project = (await getPersistedResearchProjectById(supabaseClient, projectId)) || researchStore.getProjectById(projectId);

  if (!project) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: `Research project '${projectId}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    project,
  });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { projectId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to update Research Project." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "research:write")) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'research:write'.`,
        requiredPermission: "research:write",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { title, description, status, visibility, tags, state, district, tehsil } = body;

    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    const updated = await updatePersistedResearchProject(supabaseClient, projectId, {
      title,
      description,
      status,
      visibility,
      tags,
      state,
      district,
      tehsil,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: `Research project '${projectId}' not found or could not be updated.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Research project updated successfully.",
      project: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update research project.";
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const ctx = await getAuthenticatedUser();
  const { projectId } = await params;

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to delete Research Project." },
      { status: 401 }
    );
  }

  // Deletion requires research:write and owner/admin privileges
  if (!hasPermission(ctx, "research:write") && ctx.role.code !== "ADMIN") {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' is not authorized to delete research projects.`,
        requiredRole: "RESEARCHER",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    await deletePersistedResearchProject(supabaseClient, projectId);

    return NextResponse.json({
      success: true,
      message: `Research project '${projectId}' deleted successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete research project.";
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: msg },
      { status: 500 }
    );
  }
}
