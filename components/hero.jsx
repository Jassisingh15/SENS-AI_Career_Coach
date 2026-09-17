"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef(null);
  const router = useRouter();

  const { isSignedIn } = useUser();

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTryAiCoach = () => {
    if (isSignedIn) {
      router.push("/ai-coach");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <section className="relative isolate w-full overflow-hidden pb-12 pt-20 md:pt-24">
      {/* Ambient Multi-Colored Halos */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-600/25 via-indigo-600/15 to-transparent blur-3xl" />

      <div className="pointer-events-none absolute top-20 right-[15%] -z-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="pointer-events-none absolute top-40 left-[15%] -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 space-y-6 text-center">
        {/* Pill Badge */}
        <div className="flex justify-center">
          <Badge
            variant="default"
            className="flex items-center gap-2 px-4 py-1.5 text-sm border-indigo-500/20 bg-indigo-500/10 text-indigo-300 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen AI Career Acceleration Platform</span>
          </Badge>
        </div>

        {/* Headings */}
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-transparent drop-shadow-sm leading-[1.1]">
            <span className="block">Your AI Career Coach for</span>
            <span className="block mt-2">Professional Success</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed">
            Get personalized career guidance, AI-generated resumes, industry
            insights, and interview preparation tailored to your skills and
            aspirations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-8 text-base shadow-lg shadow-indigo-950/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleTryAiCoach}
            className="border-white/15 bg-white/5 px-8 text-base hover:bg-white/10 hover:border-white/30 text-white backdrop-blur-md shadow-sm transition-all duration-200"
          >
            Try AI Coach
          </Button>
        </div>

        {/* Banner Preview with Ambient Halo */}
        <div className="hero-image-wrapper mt-8 md:mt-12 relative max-w-5xl mx-auto">
          {/* Subtle Halo Behind Banner */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-violet-600/20 via-cyan-500/10 to-indigo-600/20 blur-2xl transform scale-95" />
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="mx-auto rounded-2xl border border-white/15 shadow-2xl shadow-black/80 ring-1 ring-white/10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
