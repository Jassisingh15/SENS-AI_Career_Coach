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
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Home Button */}
      <Link href="/" className="relative">
        <Button
          variant="secondary"
          className={`h-9 rounded-md px-2.5 text-sm font-medium flex items-center gap-2 border transition-colors duration-200 ${
            isHomeActive
              ? "border-blue-400/25 bg-blue-500/10 text-slate-50 shadow-sm shadow-blue-950/30"
              : "border-transparent bg-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100"
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
        {isHomeActive && (
          <span className="absolute -bottom-[10px] left-3 right-3 h-px bg-blue-400" />
        )}
      </Link>

      {/* Change Field Button */}
      <Link href="/onboarding?edit=true" className="relative">
        <Button
          variant="secondary"
          className={`h-9 rounded-md px-2.5 text-sm font-medium flex items-center gap-2 border transition-colors duration-200 ${
            isOnboardingActive
              ? "border-blue-400/25 bg-blue-500/10 text-slate-50 shadow-sm shadow-blue-950/30"
              : "border-transparent bg-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span className="hidden sm:inline">Change Field</span>
        </Button>
        {isOnboardingActive && (
          <span className="absolute -bottom-[10px] left-3 right-3 h-px bg-blue-400" />
        )}
      </Link>

      <SignedIn>
        {/* Industry Insights Button */}
        <Link href="/dashboard" className="relative">
          <Button
            variant="secondary"
            className={`hidden h-9 rounded-md px-2.5 text-sm font-medium items-center gap-2 border transition-colors duration-200 md:inline-flex ${
              isDashboardActive
                ? "border-blue-400/25 bg-blue-500/10 text-slate-50 shadow-sm shadow-blue-950/30"
                : "border-transparent bg-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Industry Insights
          </Button>

          <Button
            variant="secondary"
            className={`h-9 w-9 rounded-md p-0 border transition-colors md:hidden ${
              isDashboardActive
                ? "border-blue-400/25 bg-blue-500/10 text-slate-50"
                : "border-transparent bg-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          {isDashboardActive && (
            <span className="absolute -bottom-[10px] left-3 right-3 h-px bg-blue-400" />
          )}
        </Link>

        {/* Growth Tools Dropdown */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`h-9 rounded-md px-3 text-sm font-semibold flex items-center gap-2 text-white shadow-sm transition-all duration-200 ${
                  isGrowthActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-950/60 ring-1 ring-blue-300/25"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-950/50 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/50"
                }`}
              >
                <StarsIcon className="h-4 w-4 text-blue-100" />
                <span className="hidden md:block">Growth Tools</span>
                <ChevronDown className="h-4 w-4 text-blue-100/80" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 rounded-lg border border-slate-700/80 bg-[#111a2a] p-1.5 shadow-xl shadow-black/35">
              <DropdownMenuItem asChild>
                <Link
                  href="/resume"
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname?.startsWith("/resume")
                      ? "bg-blue-500/10 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <FileText className="h-4 w-4 text-blue-400" />
                  Build Resume
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/ai-cover-letter"
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname?.startsWith("/ai-cover-letter")
                      ? "bg-blue-500/10 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <PenBox className="h-4 w-4 text-blue-400" />
                  Cover Letter
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/interview"
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname?.startsWith("/interview")
                      ? "bg-blue-500/10 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-blue-400" />
                  Interview Prep
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isGrowthActive && (
            <span className="absolute -bottom-[10px] left-3 right-3 h-px bg-blue-400" />
          )}
        </div>
      </SignedIn>

      {/* Sign In Button */}
      <SignedOut>
        <SignInButton>
          <Button
            variant="secondary"
            className="h-9 rounded-md border border-blue-400/25 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-sm font-semibold text-white shadow-sm shadow-blue-950/50 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/50"
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
              avatarBox: "w-9 h-9 ring-1 ring-slate-600 hover:ring-blue-400/70 transition-all",
              userButtonPopoverCard: "bg-[#111a2a] border border-slate-700/80 shadow-2xl",
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
