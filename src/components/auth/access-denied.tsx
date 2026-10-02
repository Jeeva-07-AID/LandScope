"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AccessDeniedProps {
  currentRoleTitle?: string;
  currentRoleSlug?: string;
  requiredRoleTitle?: string;
  requiredPermission?: string;
}

export function AccessDenied({
  currentRoleTitle = "Unspecified Role",
  currentRoleSlug = "login",
  requiredRoleTitle = "Restricted Area",
  requiredPermission = "Role-Specific Authorization",
}: AccessDeniedProps) {
  const returnUrl = currentRoleSlug ? `/app/${currentRoleSlug}` : "/login";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans select-none">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden text-center">
        {/* Red Warning Hairline */}
        <div className="h-1 bg-red-700 w-full" />

        <div className="p-8 space-y-6">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Lock className="w-3 h-3" />
              <span>403 Forbidden • Access Denied</span>
            </div>
            <h1 className="text-xl font-bold text-[#0A1C30] tracking-tight">
              Restricted Workspace
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              You don&apos;t have permission to access this workspace. Access to LANDScope operational modules is restricted according to verified organizational mandates.
            </p>
          </div>

          {/* Authorization Details Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-left text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Your Authenticated Role:</span>
              <span className="font-bold text-[#0A1C30]">{currentRoleTitle}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-500">Target Workspace:</span>
              <span className="font-semibold text-rose-800">{requiredRoleTitle}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-500">Required Permission:</span>
              <span className="font-mono text-[10px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {requiredPermission}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2">
            <Link href={returnUrl} className="block w-full">
              <Button
                variant="primary"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Return to My Authorized Workspace
              </Button>
            </Link>

            <Link href="/" className="inline-block text-xs text-slate-500 hover:text-slate-800 transition-colors">
              Return to Public Portal
            </Link>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 font-mono">
          Security Event Logged: RBAC-SEC-403
        </div>
      </div>
    </div>
  );
}
