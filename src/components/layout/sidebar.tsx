"use client";

import React from "react";
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  FlaskConical,
  BarChart3,
  FileSpreadsheet,
  Users,
  Lightbulb,
  HelpCircle,
  Settings,
  Code,
  LogOut,
  Shield,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavSection =
  | "overview"
  | "research-evidence"
  | "land-intelligence"
  | "policy-lab"
  | "analytics"
  | "collaboration"
  | "innovation-hub"
  | "reports"
  | "api-center"
  | "design-system"
  | "help-docs"
  | "settings"
  | "profile";

export interface NavGroupItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "saffron" | "navy" | "green" | "neutral";
  requiredModule?: string;
}

export interface NavGroup {
  title: string;
  items: NavGroupItem[];
}

export interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  allowedModules?: string[];
  isOpen?: boolean;
  onCloseMobile?: () => void;
  user?: {
    name: string;
    roleTitle: string;
    roleCode?: string;
    organization: string;
    email: string;
  };
  onLogout?: () => void;
  className?: string;
}

export function Sidebar({
  currentSection,
  onSelectSection,
  allowedModules,
  isOpen = true,
  onCloseMobile,
  user,
  onLogout,
  className,
}: SidebarProps) {
  // Navigation groups as per Section 4 specifications
  const navigationGroups: NavGroup[] = [
    {
      title: "WORKSPACE",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: <LayoutDashboard className="w-4 h-4" />,
          requiredModule: "overview",
        },
        {
          id: "research-evidence",
          label: "Research",
          icon: <BookOpen className="w-4 h-4" />,
          requiredModule: "research-evidence",
        },
        {
          id: "land-intelligence",
          label: "Land Intelligence",
          icon: <MapPin className="w-4 h-4" />,
          requiredModule: "land-intelligence",
        },
        {
          id: "policy-lab",
          label: "Policy Lab",
          icon: <FlaskConical className="w-4 h-4" />,
          requiredModule: "policy-lab",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: <BarChart3 className="w-4 h-4" />,
          requiredModule: "analytics",
        },
      ],
    },
    {
      title: "COLLABORATION",
      items: [
        {
          id: "collaboration",
          label: "Projects",
          icon: <Users className="w-4 h-4" />,
          requiredModule: "collaboration",
        },
        {
          id: "innovation-hub",
          label: "Innovation Hub",
          icon: <Lightbulb className="w-4 h-4" />,
          requiredModule: "innovation-hub",
        },
      ],
    },
    {
      title: "OUTPUT",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: <FileSpreadsheet className="w-4 h-4" />,
          requiredModule: "reports",
        },
      ],
    },
    {
      title: "DEVELOPER",
      items: [
        {
          id: "api-center",
          label: "API Center",
          icon: <Code className="w-4 h-4" />,
          requiredModule: "overview", // accessible across roles
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="w-4 h-4" />,
        },
        {
          id: "help-docs",
          label: "Help",
          icon: <HelpCircle className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleItemClick = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile?.();
  };

  return (
    <aside
      className={cn(
        "w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none font-sans z-30 transition-all",
        isOpen ? "flex" : "hidden md:flex",
        className
      )}
    >
      {/* Scrollable Navigation Groups */}
      <div className="p-3 space-y-5 overflow-y-auto flex-1">
        {navigationGroups.map((group) => {
          // Filter items based on user's authorized modules
          const visibleItems = group.items.filter((item) => {
            if (!item.requiredModule) return true;
            if (!allowedModules) return true;
            return allowedModules.includes(item.requiredModule);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>

              <nav className="space-y-0.5" aria-label={group.title}>
                {visibleItems.map((item) => {
                  const isActive = currentSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer group text-left",
                        isActive
                          ? "bg-[#0A1C30] text-white font-semibold shadow-2xs"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-700"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.2 rounded font-bold font-mono tracking-tight",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Compact Institutional User Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2.5">
        {user ? (
          <div className="flex items-center justify-between gap-2 text-left">
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-semibold text-amber-700 px-1 py-0.2 bg-amber-50 rounded border border-amber-200 truncate">
                  {user.roleTitle}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  SIH 2026 Prototype
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 font-mono text-center">
            LANDScope Sovereign Platform
          </div>
        )}
      </div>
    </aside>
  );
}
