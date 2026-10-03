import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { researchStore } from "@/lib/research/research-data";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import {
  getPersistedResearchProjects,
  createPersistedResearchProject,
} from "@/lib/supabase/research-service";

export async function GET() {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to access Research Projects." },
      { status: 401 }
    );
  }

  const allowedRoles = ["RESEARCHER", "ACADEMIC_INSTITUTION", "ADMIN"];
  if (!allowedRoles.includes(ctx.role.code)) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have access to research project workspaces.`,
        requiredRole: "RESEARCHER",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const projects = await getPersistedResearchProjects(supabaseClient, ctx.user.email);

  return NextResponse.json({
    success: true,
    userRole: ctx.role.code,
    projectsCount: projects.length,
    projects,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required to create a Research Project." },
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
    const { title, subtitle, description, researchQuestions, geographyId, state, district, tehsil } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Project title is required." },
        { status: 400 }
      );
    }

    const formattedQuestions = Array.isArray(researchQuestions)
      ? researchQuestions.map((q: unknown) => {
          const qObj = typeof q === "object" && q !== null ? (q as Record<string, unknown>) : null;
          return {
            question: typeof q === "string" ? q : (typeof qObj?.question === "string" ? qObj.question : "Primary Research Question"),
            hypothesis: typeof qObj?.hypothesis === "string" ? qObj.hypothesis : "",
          };
        })
      : [
          {
            question: "What spatial and econometrics determinants drive land conversion?",
            hypothesis: "Baseline empirical hypothesis to be validated with cadastral data.",
          },
        ];

    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    const userId = ctx.supabaseUserId || ctx.user.supabaseId || "d0a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c";

    let newProject;
    try {
      newProject = await createPersistedResearchProject(
        supabaseClient,
        {
          title: title.trim(),
          subtitle: subtitle?.trim(),
          description: description?.trim(),
          geographyId: geographyId || "IN-MP-SEH-ASH",
          state: state || "Madhya Pradesh",
          district: district || "Sehore",
          tehsil: tehsil || "Ashta",
          researchQuestions: formattedQuestions,
        },
        {
          id: userId,
          email: ctx.user.email,
          name: ctx.user.name,
        }
      );
      // Synchronize in-memory mirror if present
      try {
        researchStore.createProject({
          title: newProject.title,
          subtitle: newProject.subtitle,
          description: newProject.description,
          status: "Active",
          leadResearcherId: ctx.user.id,
          leadResearcherName: ctx.user.name,
          leadResearcherEmail: ctx.user.email,
          organization: ctx.user.organization,
          collaborators: newProject.collaborators,
          researchQuestions: newProject.researchQuestions,
          analysisNotes: newProject.analysisNotes,
        });
      } catch {
        // In-memory sync optional
      }
    } catch (dbErr: unknown) {
      const msg = dbErr instanceof Error ? dbErr.message : "Database error";
      console.error("Supabase project persistence error:", msg);
      return NextResponse.json(
        { error: "DATABASE_ERROR", message: `Failed to persist research project: ${msg}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Research project created successfully.",
        project: newProject,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process project creation request." },
      { status: 500 }
    );
  }
}
