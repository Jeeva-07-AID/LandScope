"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  User,
  Scale,
  BookOpen,
  GraduationCap,
  Building2,
  Lightbulb,
  Globe2,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("researcher@landscope.demo");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState("researcher");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const demoAccounts = [
    {
      role: "RESEARCHER",
      slug: "researcher",
      name: "Dr. Ananya Sharma",
      email: "researcher@landscope.demo",
      title: "Senior Policy Research Fellow",
      icon: <BookOpen className="w-3.5 h-3.5 text-[#112A4A]" />,
      allowed: "Research, Datasets, AI Copilot, GIS",
    },
    {
      role: "POLICYMAKER",
      slug: "policymaker",
      name: "Vikram Malhotra",
      email: "policymaker@landscope.demo",
      title: "Strategic Policy Analyst",
      icon: <Scale className="w-3.5 h-3.5 text-[#D35E0E]" />,
      allowed: "Policy Lab, Scenarios, Analytics, Reports",
    },
    {
      role: "ACADEMIC_INSTITUTION",
      slug: "academic",
      name: "Prof. Sudhir Kulkarni",
      email: "academic@landscope.demo",
      title: "Dean of Spatial Sciences",
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />,
      allowed: "Joint Projects, Publications, Innovation Hub",
    },
    {
      role: "GOVERNMENT_AGENCY",
      slug: "agency",
      name: "Sunil Deshmukh",
      email: "agency@landscope.demo",
      title: "Cadastral Reconciliation Officer",
      icon: <Building2 className="w-3.5 h-3.5 text-blue-700" />,
      allowed: "Demarcation, Inter-Agency Tasks, Audits",
    },
    {
      role: "INNOVATOR",
      slug: "innovator",
      name: "Rohan Varma",
      email: "innovator@landscope.demo",
      title: "Lead Geospatial AI Engineer",
      icon: <Lightbulb className="w-3.5 h-3.5 text-amber-600" />,
      allowed: "AI Sandbox, Vision Models, Crowdsourcing",
    },
    {
      role: "PUBLIC",
      slug: "public",
      name: "Kavita Rao",
      email: "public@landscope.demo",
      title: "Community Land Advocate",
      icon: <Globe2 className="w-3.5 h-3.5 text-cyan-700" />,
      allowed: "Public Maps, Land Trends, Open Reports",
    },
    {
      role: "ADMIN",
      slug: "admin",
      name: "System Admin",
      email: "admin@landscope.demo",
      title: "Lead Security & System Architect",
      icon: <Shield className="w-3.5 h-3.5 text-slate-700" />,
      allowed: "Full System Administration & User Management",
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Authentication failed");
        setIsLoading(false);
        return;
      }

      // Session cookie is set; route to user's authorized workspace
      router.push(data.redirectUrl || `/app/${selectedRole}`);
      router.refresh();
    } catch {
      setErrorMsg("Connection error during authentication.");
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setSelectedRole(acc.slug);
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: acc.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to authenticate demo account");
        setIsLoading(false);
        return;
      }

      router.push(data.redirectUrl || `/app/${acc.slug}`);
      router.refresh();
    } catch {
      setErrorMsg("Network error during demo session creation.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0A1C30] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portal</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-400">
            LANDScope Authentication • SIH26019
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/60 text-center">
            <div className="flex justify-center mb-3">
              <LandScopeLogo size="md" variant="navy" showTagline={false} />
            </div>
            <h1 className="text-base font-bold text-[#0A1C30] tracking-tight">
              Platform Authentication Gateway
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure RBAC session retrieval — Server-enforced permissions
            </p>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <Input
              label="Work Official Email (Demo Account)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. researcher@landscope.demo"
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Passkey / Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Authorized Workspace
            </Button>
          </form>

          {/* SIH Demonstration Accounts Section */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                SIH Demonstration Accounts (1-Click Authenticated Login):
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Click account to test RBAC
              </span>
            </div>

            <div className="space-y-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  disabled={isLoading}
                  className="w-full p-2.5 rounded bg-white border border-slate-200 hover:border-[#112A4A] hover:bg-slate-50 text-left transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1 rounded bg-slate-50 border border-slate-200 group-hover:bg-slate-100">
                      {acc.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#112A4A] flex items-center gap-2">
                        <span>{acc.name}</span>
                        <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-600 font-normal">
                          {acc.slug}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {acc.email} • {acc.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {acc.allowed}
                    </span>
                    <span className="text-[10px] font-bold text-[#D35E0E] group-hover:underline">
                      Sign In &rarr;
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-slate-400 text-center font-mono">
              Note: LANDScope — SIH 2026 Demonstration Environment. No real government identities or real officer names.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-200 bg-white">
        Prototype developed for Smart India Hackathon 2026 — SIH26019.
      </footer>
    </div>
  );
}
