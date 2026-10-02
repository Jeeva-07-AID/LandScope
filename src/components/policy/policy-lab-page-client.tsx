"use client";

import React, { useState } from "react";
import { GovTopBanner } from "@/components/layout/gov-top-banner";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PolicyLabWorkspaceView } from "./policy-lab-workspace-view";
import { UserAccount, RoleDefinition } from "@/lib/auth/rbac-data";
import { useRouter, useSearchParams } from "next/navigation";

interface PolicyLabPageClientProps {
  user: UserAccount;
  role: RoleDefinition;
}

export function PolicyLabPageClient({ user, role }: PolicyLabPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read geographic context passed from Land Intelligence GIS
  const stateFromUrl = searchParams.get("state") || "Madhya Pradesh";
  const districtFromUrl = searchParams.get("district") || "Sehore";
  const tehsilFromUrl = searchParams.get("tehsil") || "Ashta";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeDelta, setFontSizeDelta] = useState(0);

  const handleNavigateToReports = (ctx: Record<string, unknown>) => {
    const s = typeof ctx.state === "string" ? ctx.state : stateFromUrl;
    const d = typeof ctx.district === "string" ? ctx.district : districtFromUrl;
    const t = typeof ctx.tehsil === "string" ? ctx.tehsil : tehsilFromUrl;
    const scn = typeof ctx.scenarioTitle === "string" ? ctx.scenarioTitle : "Controlled Peri-Urban Expansion 2031";
    router.push(`/app/reports?state=${encodeURIComponent(s)}&district=${encodeURIComponent(d)}&tehsil=${encodeURIComponent(t)}&scenarioTitle=${encodeURIComponent(scn)}`);
  };

  const handleNavigateToResearch = (ref?: string) => {
    router.push(`/app/${role.slug}?section=research-evidence${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 ${
        isHighContrast ? "high-contrast" : ""
      }`}
      style={{
        fontSize: fontSizeDelta !== 0 ? `${100 + fontSizeDelta * 6}%` : undefined,
      }}
    >
      <GovTopBanner
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onFontSizeChange={(delta) =>
          setFontSizeDelta((prev) => (delta === 0 ? 0 : Math.max(-2, Math.min(3, prev + delta))))
        }
      />

      <Header
        userName={user.name}
        userRoleTitle={role.title}
        userEmail={user.email}
        organization={user.organization}
        unreadCount={0}
      />

      <div className="flex-1 flex max-w-[1700px] w-full mx-auto relative overflow-hidden">
        <Sidebar
          currentSection="policy-lab"
          onSelectSection={(sec) => {
            if (sec !== "policy-lab") {
              router.push(`/app/${role.slug}?section=${sec}`);
            }
          }}
          allowedModules={role.allowedModules}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
          <PolicyLabWorkspaceView
            initialState={stateFromUrl}
            initialDistrict={districtFromUrl}
            initialTehsil={tehsilFromUrl}
            userRole={role.code}
            onNavigateToReports={handleNavigateToReports}
            onNavigateToResearch={handleNavigateToResearch}
          />
        </main>
      </div>

      <footer className="w-full bg-[#0A1C30] text-slate-400 border-t border-[#173860] py-3 text-xs font-sans">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
          <div>
            <strong className="text-slate-300">LANDScope</strong> — SIH 2026 Demonstration Environment • Session: {user.email}
          </div>
          <div className="text-slate-500">
            Role: <span className="text-orange-400 font-bold">{role.title}</span> • Policy Digital Twin Engine
          </div>
        </div>
      </footer>
    </div>
  );
}
