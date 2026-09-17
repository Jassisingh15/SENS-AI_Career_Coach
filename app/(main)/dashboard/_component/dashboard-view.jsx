"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  Loader2,
  FileText,
  Download,
  RotateCcw,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const gradients = [
  "from-indigo-500/20 to-purple-500/10",
  "from-pink-500/20 to-rose-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-blue-500/20 to-cyan-500/10",
  "from-yellow-500/20 to-orange-500/10",
];

const borderColors = [
  "border-indigo-500/30",
  "border-pink-500/30",
  "border-emerald-500/30",
  "border-blue-500/30",
  "border-yellow-500/30",
];

// random color on each render
const randomIndex = Math.floor(Math.random() * gradients.length);

const currentGradient = gradients[randomIndex];
const currentBorder = borderColors[randomIndex];

// Group roadmap lines under their month, week, phase, or step heading.
const createRoadmapBlocks = (roadmap) => {
  const lines = roadmap.split("\n").filter((line) => line.trim() !== "");
  const blocks = [];

  lines.forEach((line) => {
    const isHeading = /week|month|phase|step/i.test(line.toLowerCase());

    if (isHeading) {
      blocks.push({ type: "header", text: line, items: [] });
      return;
    }

    if (blocks.length === 0) {
      blocks.push({ type: "header", text: "Overview", items: [] });
    }

    blocks[blocks.length - 1].items.push(line);
  });

  return blocks;
};

const DashboardView = ({ insights }) => {
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-emerald-500";
      case "medium":
        return "bg-amber-400";
      case "low":
        return "bg-rose-500";
      default:
        return "bg-slate-400";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-400" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-400" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-400" };
      default:
        return { icon: LineChart, color: "text-slate-400" };
    }
  };

  const marketOutlook = getMarketOutlookInfo(insights.marketOutlook);
  const OutlookIcon = marketOutlook.icon;
  const outlookColor = marketOutlook.color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");

  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // 🚀 GENERATE ROADMAP
  const generateRoadmap = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/roadmap", {
        method: "POST",
      });

      const data = await response.json();
      setRoadmap(data?.roadmap || "No roadmap generated");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("roadmap-content");

    if (!element) {
      alert("Roadmap content not found!");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#080C14",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("ai-career-roadmap.pdf");
  };

  // ⬇ DOWNLOAD ROADMAP
  const downloadRoadmap = () => {
    if (!roadmap) return;

    const element = document.createElement("a");
    const file = new Blob([roadmap], { type: "text/plain" });

    element.href = URL.createObjectURL(file);
    element.download = "career-roadmap.txt";

    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="relative space-y-8">
      {/* Background Ambient Light Spots */}
      <div className="pointer-events-none absolute -top-16 -left-10 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-10 -z-10 h-80 w-80 rounded-full bg-gradient-to-bl from-violet-600/15 via-purple-500/5 to-transparent blur-3xl" />

      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-600/20 blur-2xl" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Industry Intelligence & Career Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time market signals, hiring demand forecasts, and salary benchmarks
          </p>
        </div>
        <Badge variant="cyan" className="self-start sm:self-auto text-xs px-3 py-1">
          Last updated: {lastUpdatedDate}
        </Badge>
      </div>

      {/* METRICS CARD GRID WITH HOVER ELEVATION & COLOR-CODED ACCENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* 1. Market Outlook - Emerald for Positive Milestones */}
        <Card className="hover:-translate-y-1 transition-all duration-300 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-emerald-500/10 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Market Outlook
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {insights.marketOutlook}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        {/* 2. Industry Growth - Cyan for Growth */}
        <Card className="hover:-translate-y-1 transition-all duration-300 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Industry Growth
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {insights.growthRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Annual expansion velocity
            </p>

            <Progress value={insights.growthRate} className="mt-3" />

            <p className="text-[11px] text-slate-400 mt-2">
              Driven by AI adoption & tech hiring demand
            </p>
          </CardContent>
        </Card>

        {/* 3. Demand Level - Violet for AI Score */}
        <Card className="hover:-translate-y-1 transition-all duration-300 border-violet-500/20 hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] relative overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-violet-600/10 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Demand Level
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 shadow-[0_0_10px_rgba(124,58,237,0.2)]">
              <BriefcaseIcon className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                {insights.demandLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active open requisitions
            </p>

            <div className="mt-3 h-2 w-full rounded-full bg-slate-800/80 border border-white/5 overflow-hidden">
              <div
                className={`h-2 rounded-full ${getDemandLevelColor(insights.demandLevel)} shadow-[0_0_10px_currentColor]`}
                style={{ width: "100%" }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Candidate competition index
            </p>
          </CardContent>
        </Card>

        {/* 4. Top Skills */}
        <Card className="hover:-translate-y-1 transition-all duration-300 border-white/10 hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] relative overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-indigo-500/10 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Top In-Demand Skills
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Brain className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {insights.topSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Skills that accelerate interview callbacks
            </p>
          </CardContent>
        </Card>

      </div>

      {/* SALARY RANGES CHART */}
      <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl hover:border-white/15 transition-all">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-white">Salary Ranges by Role</CardTitle>
          <CardDescription className="text-slate-400">
            Displaying minimum, median, and maximum compensation benchmarks (in thousands USD)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl text-slate-100">
                          <p className="font-bold text-white mb-1">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-xs text-slate-300">
                              <span className="font-medium text-indigo-300">{item.name}:</span> ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#6366F1" name="Min Salary (K)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="median" fill="#7C3AED" name="Median Salary (K)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" fill="#06B6D4" name="Max Salary (K)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* INDUSTRY TRENDS & RECOMMENDED SKILLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl hover:border-white/15 transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-white">Key Industry Trends</CardTitle>
            <CardDescription className="text-slate-400">Emerging macro movements shaping this field</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed p-2.5 rounded-xl border border-white/5 bg-slate-950/40">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl hover:border-white/15 transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-white">High-Impact Recommended Skills</CardTitle>
            <CardDescription className="text-slate-400">Strategic skills to add for maximum leverage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="cyan" className="text-xs py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ROADMAP SECTION WITH ANIMATED AI AURA BORDER BUTTON & SHIMMER LOADING */}
      <Card className="overflow-hidden border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative">
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span>AI Career Roadmap Generator</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Personalized step-by-step milestone plan structured for your target goals
          </CardDescription>
        </CardHeader>

        <CardContent>

          {!roadmap ? (
            <div className="flex flex-col items-center py-10 space-y-4">
              {/* ANIMATED AI AURA BORDER BUTTON */}
              <div className="relative group p-[1.5px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 animate-pulse-slow blur-[1px] group-hover:blur-[2px]" />
                <button
                  onClick={generateRoadmap}
                  disabled={loading}
                  className="relative px-8 py-3 rounded-xl font-bold text-white bg-slate-950 hover:bg-slate-900 transition-all duration-200 flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      Generating AI Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                      Generate AI Career Roadmap
                    </>
                  )}
                </button>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm">
                Generates a structured multi-phase milestone curriculum
              </p>

              {/* PURPLE SHIMMER LOADING SKELETON */}
              {loading && (
                <div className="w-full max-w-xl space-y-3 pt-6 animate-pulse">
                  <div className="h-4 w-1/3 rounded-lg bg-gradient-to-r from-violet-600/20 via-indigo-500/30 to-violet-600/20" />
                  <div className="h-16 w-full rounded-xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-white/5" />
                  <div className="h-16 w-full rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/5" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">

              {/* ROADMAP CONTENT (PDF TARGET) */}
              <div
                id="roadmap-content"
                className="rounded-xl border border-white/10 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md"
              >
                <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Your AI Career Roadmap</span>
                </h3>

                <div className="space-y-3 text-sm text-slate-300">
                  {createRoadmapBlocks(roadmap).map((block, i) => (
                    <div
                      key={i}
                      className={`overflow-hidden rounded-xl border bg-slate-900/80 shadow-md ${currentBorder}`}
                    >
                      {/* HEADER */}
                      <div
                        className={`bg-gradient-to-r px-4 py-2 font-semibold text-slate-100 ${currentGradient}`}
                      >
                        {block.text}
                      </div>

                      {/* CONTENT */}
                      <div className="space-y-1.5 p-3 text-xs text-slate-300">
                        {block.items.slice(0, 4).map((item, j) => (
                          <div key={j} className="flex gap-2">
                            <span className="text-indigo-400">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 flex-wrap pt-2">
                <button
                  onClick={() => setRoadmap("")}
                  className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:border-rose-400 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Regenerate
                </button>

                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 hover:border-indigo-400 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>

                <button
                  onClick={downloadRoadmap}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 hover:border-cyan-400 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Download TXT
                </button>
              </div>

            </div>
          )}

        </CardContent>

      </Card>

    </div>
  );
};

export default DashboardView;
