"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  User,
  Menu,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LandScopeLogo } from "@/components/branding/landscope-logo";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  userName?: string;
  userRoleTitle?: string;
  userEmail?: string;
  organization?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onOpenSearch?: () => void;
  onToggleSidebar?: () => void;
  onToggleNotifications?: () => void;
  unreadCount?: number;
}

export function Header({
  userName = "Platform User",
  userRoleTitle = "Authorized User",
  userEmail,
  breadcrumbs = [{ label: "LANDScope" }, { label: "Workspace" }],
  onOpenSearch,
  onToggleSidebar,
  onToggleNotifications,
  unreadCount = 2,
}: HeaderProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs font-sans">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Logo + Clean Breadcrumbs */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="hover:opacity-95 shrink-0 transition-opacity" title="LANDScope Platform Home">
            <LandScopeLogo size="sm" variant="navy" showTagline={false} />
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Clean Breadcrumbs Hierarchy */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-slate-900 transition-colors truncate max-w-[140px]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate max-w-[180px]",
                      idx === breadcrumbs.length - 1 ? "font-semibold text-slate-900" : "text-slate-500"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile (Strictly clean, no 10 controls) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 text-xs transition-colors border border-slate-200/60"
            title="Search parcels, khasra, evidence (Cmd/Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline text-[11px] text-slate-500">Quick Search...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.2 bg-white rounded border border-slate-300 text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Alert Bell */}
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative p-2 rounded-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="System Alerts & Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200"
            title={`Signed in as ${userName} (${userRoleTitle})`}
          >
            <div className="w-7 h-7 rounded-sm bg-[#0A1C30] text-white flex items-center justify-center text-xs font-bold font-mono tracking-tight shrink-0 shadow-2xs">
              {getInitials(userName)}
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <span className="font-bold text-slate-800 block truncate max-w-[130px]">{userName}</span>
              <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                {userRoleTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
