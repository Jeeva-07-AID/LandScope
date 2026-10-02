"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  MapPin,
  FlaskConical,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
} from "lucide-react";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("policy-secretary");

  const roles = [
    {
      id: "policy-secretary",
      title: "Principal Policy Analyst",
      sector: "Policy Lab & Regulatory Impact",
      icon: <FlaskConical className="w-5 h-5 text-[#D35E0E]" />,
      description:
        "Formulate what-if zoning scenarios, model cross-sector trade-offs, and synthesize evidence-backed draft Gazette resolutions.",
      focus: ["Policy Digital Twin", "Scenario Equilibrium", "Gazette Drafting"],
    },
    {
      id: "district-magistrate",
      title: "District Governance Officer",
      sector: "Tenure Security & Conciliation",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      description:
        "Monitor district-level tenure security, track active land dispute queues, and review inter-departmental revenue mutations.",
      focus: ["Dispute Lok Adalat", "DILRMP Audit", "Nodal Collaboration"],
    },
    {
      id: "gis-surveyor",
      title: "Senior Cadastral Cartographer",
      sector: "Spatial Data & Ground-Truth",
      icon: <MapPin className="w-5 h-5 text-[#112A4A]" />,
      description:
        "Inspect high-resolution cadastral vector parcels, verify survey boundaries against CORS network, and analyze multi-temporal LULC.",
      focus: ["Cadastral Parcels", "EPSG:4326 Telemetry", "Drone Validation"],
    },
    {
      id: "research-fellow",
      title: "Policy Research Fellow",
      sector: "Empirical Studies & Evidence",
      icon: <BookOpen className="w-5 h-5 text-cyan-700" />,
      description:
        "Access peer-reviewed datasets, empirical studies with confidence scores, and analyze land tenure econometric indices.",
      focus: ["Evidence Traceability", "DOI Repository", "Econometric Indices"],
    },
  ];

  const handleProceed = () => {
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-6 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <LandScopeLogo size="sm" variant="navy" showTagline={false} />
          </Link>
          <span className="text-xs text-slate-500">Step 2: Operational Perspective</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge variant="official" size="sm" className="mb-2">
            Personalized Workspace
          </Badge>
          <h1 className="text-2xl font-black text-[#0A1C30] tracking-tight">
            Select Your Analytical Perspective
          </h1>
          <p className="text-xs text-slate-600 mt-1.5">
            LANDScope adapts its decision-support workflows based on your governance role, whether you are modeling policy, evaluating GIS cadastre, or researching evidence.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-5 rounded-sm border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-[#112A4A] ring-1 ring-[#112A4A] shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        {r.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0A1C30]">{r.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{r.sector}</div>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-[#112A4A] border-[#112A4A] text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {r.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {r.focus.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceed}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Enter LANDScope Workspace
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-200 bg-white">
        LANDScope is a prototype developed for Smart India Hackathon 2026 (SIH26019).
      </footer>
    </div>
  );
}
