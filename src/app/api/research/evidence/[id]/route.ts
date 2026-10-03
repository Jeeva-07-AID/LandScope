import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hasPermission } from "@/lib/auth/session";
import { getAuthenticatedSupabaseClient } from "@/lib/supabase/client";
import {
  getPersistedEvidenceById,
  updatePersistedEvidence,
} from "@/lib/supabase/research-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const ctx = await getAuthenticatedUser();
  if (!ctx) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Authentication required to access evidence details." },
      { status: 401 }
    );
  }

  const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
  const item = await getPersistedEvidenceById(supabaseClient, id);

  if (!item) {
    return NextResponse.json(
      { success: false, error: "NOT_FOUND", message: `Evidence item with ID "${id}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    evidence: item,
    demonstrationLabel: item.isDemoRecord
      ? "Illustrative LANDScope Demo Dataset"
      : "Sovereign Empirical Evidence",
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const ctx = await getAuthenticatedUser();

  if (!ctx) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Authentication required to update evidence." },
      { status: 401 }
    );
  }

  if (!hasPermission(ctx, "research:write")) {
    return NextResponse.json(
      {
        success: false,
        error: "FORBIDDEN",
        message: `Access Denied: Role '${ctx.role.title}' does not have permission 'research:write'.`,
        requiredPermission: "research:write",
        userRole: ctx.role.code,
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const supabaseClient = getAuthenticatedSupabaseClient(ctx.supabaseAccessToken);
    const updated = await updatePersistedEvidence(supabaseClient, id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: `Evidence item '${id}' not found or could not be updated.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Evidence successfully updated.",
      evidence: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update evidence.";
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: msg },
      { status: 500 }
    );
  }
}
