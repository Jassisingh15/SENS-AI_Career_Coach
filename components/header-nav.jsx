"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Home,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderNav() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isOnboardingActive = pathname?.startsWith("/onboarding");
  const isDashboardActive = pathname?.startsWith("/dashboard");
  const isGrowthActive =
    pathname?.startsWith("/resume") ||
    pathname?.startsWith("/ai-cover-letter") ||
    pathname?.startsWith("/interview");

  return (
    <div className="flex items-center space-x-2 md:space-x-3">
      {/* Home Button */}
      <Link href="/" className="relative">
        <Button
          variant="secondary"
          className={`flex items-center gap-2 border transition-all duration-200 ${
            isHomeActive
              ? "border-indigo-500/40 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
              : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
        {isHomeActive && (
          <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_#818cf8]" />
        )}
      </Link>

      {/* Change Field Button */}
      <Link href="/onboarding?edit=true" className="relative">
        <Button
          variant="secondary"
          className={`flex items-center gap-2 border transition-all duration-200 ${
            isOnboardingActive
              ? "border-indigo-500/40 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
              : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span className="hidden sm:inline">Change Field</span>
        </Button>
        {isOnboardingActive && (
          <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_#818cf8]" />
        )}
      </Link>

      <SignedIn>
        {/* Industry Insights Button */}
        <Link href="/dashboard" className="relative">
          <Button
            variant="secondary"
            className={`hidden items-center gap-2 border transition-all duration-200 md:inline-flex ${
              isDashboardActive
                ? "border-indigo-500/40 bg-indigo-500/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Industry Insights
          </Button>

          <Button
            variant="secondary"
            className={`h-9 w-9 p-0 border md:hidden ${
              isDashboardActive
                ? "border-indigo-500/40 bg-indigo-500/15 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          {isDashboardActive && (
            <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_#818cf8]" />
          )}
        </Link>

        {/* Growth Tools Dropdown */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`flex items-center gap-2 text-white shadow-lg transition-all duration-300 ${
                  isGrowthActive
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 shadow-[0_0_25px_rgba(124,58,237,0.5)] ring-1 ring-indigo-400/50"
                    : "bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 shadow-indigo-950/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]"
                }`}
              >
                <StarsIcon className="h-4 w-4 text-cyan-300" />
                <span className="hidden md:block">Growth Tools</span>
                <ChevronDown className="h-4 w-4 text-indigo-200" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 p-1.5 border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <DropdownMenuItem asChild>
                <Link
                  href="/resume"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname?.startsWith("/resume")
                      ? "bg-indigo-600/20 text-white font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Build Resume
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/ai-cover-letter"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname?.startsWith("/ai-cover-letter")
                      ? "bg-cyan-600/20 text-white font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <PenBox className="h-4 w-4 text-cyan-400" />
                  Cover Letter
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/interview"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname?.startsWith("/interview")
                      ? "bg-emerald-600/20 text-white font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-emerald-400" />
                  Interview Prep
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isGrowthActive && (
            <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_#818cf8]" />
          )}
        </div>
      </SignedIn>

      {/* Sign In Button */}
      <SignedOut>
        <SignInButton>
          <Button
            variant="secondary"
            className="border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400 hover:bg-indigo-500/20 hover:text-white font-semibold shadow-sm"
          >
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>

      {/* User Profile */}
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 transition-all",
              userButtonPopoverCard: "bg-slate-900 border border-white/10 shadow-2xl backdrop-blur-xl",
              userPreviewMainIdentifier: "font-semibold text-white",
              userPreviewSecondaryIdentifier: "text-slate-400",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  );
}
