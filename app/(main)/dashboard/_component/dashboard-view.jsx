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
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");

  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // 🚀 GENERATE ROADMAP
  const generateRoadmap = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/roadmap", {
        method: "POST",
      });

      const data = await res.json();
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
    backgroundColor: "#0b0b0b", // 🔥 IMPORTANT FIX
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
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <Badge variant="outline">
          Last updated: {lastUpdatedDate}
        </Badge>
      </div>

      {/* MARKET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

  {/* Industry Growth */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Industry Growth
      </CardTitle>
      <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold">
            {insights.growthRate.toFixed(1)}%
          </div>
          <p className="text-[11px] text-muted-foreground">
            Industry expansion rate
          </p>
        </div>
      </div>

      <Progress value={insights.growthRate} className="mt-3" />

      <p className="text-[11px] text-gray-400 mt-2">
        Driven by AI adoption & hiring demand increase
      </p>
    </CardContent>
  </Card>

  {/* Demand Level */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Demand Level
      </CardTitle>
      <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold">
            {insights.demandLevel}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Job market status
          </p>
        </div>
      </div>

      <div className="h-2 w-full rounded-full mt-3 bg-white/10">
        <div
          className={`h-2 rounded-full ${getDemandLevelColor(insights.demandLevel)}`}
        />
      </div>

      <p className="text-[11px] text-gray-400 mt-2">
        Reflects job openings & competition level
      </p>
    </CardContent>
  </Card>

  {/* Top Skills */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Top Skills
      </CardTitle>
      <Brain className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="flex flex-wrap gap-1">
        {insights.topSkills.map((skill) => (
          <Badge
            key={skill}
            className="bg-white text-black hover:bg-gray-200"
          >
            {skill}
          </Badge>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-3">
        Skills that increase hiring chances
      </p>
    </CardContent>
  </Card>

</div>
      {/* Salary Ranges Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* INDUSTRY TRENDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.keyTrends.map((trend, index) => (
                <li key={index}>• {trend}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} className="bg-white text-black hover:bg-gray-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ROADMAP SECTION */}
      <Card className="bg-[#0b0b0b] border-white/10 text-white">

        <CardHeader>
          <CardTitle>🎯 Career Roadmap</CardTitle>
          <CardDescription className="text-gray-400">
            AI-generated step-by-step learning plan
          </CardDescription>
        </CardHeader>

        <CardContent>

  {!roadmap ? (
    <div className="flex flex-col items-center py-10">

      <button
  onClick={generateRoadmap}
  disabled={loading}
  className="px-6 py-2 rounded-lg font-medium text-white 
  bg-gradient-to-r from-indigo-500 to-purple-600 
  hover:from-indigo-600 hover:to-purple-700 
  transition shadow-lg shadow-indigo-500/20"
>
  {loading ? "Generating..." : "Generate Roadmap"}
</button>

      <p className="text-gray-500 text-sm mt-3">
        Structured 2–4 month AI roadmap
      </p>

    </div>
  ) : (
    <div className="space-y-4">

      {/* ROADMAP CONTENT (PDF TARGET) */}
      <div
        id="roadmap-content"
        className="p-4 rounded-xl border border-white/10 bg-white/5"
      >
        <h3 className="text-blue-400 font-semibold mb-2">
          📌 Your Roadmap
        </h3>

        <div className="space-y-3 text-sm text-gray-300">

          {roadmap
            .split("\n")
            .filter((line) => line.trim() !== "")
            .reduce((acc, line) => {
              const isHeader = /week|month|phase|step/i.test(line.toLowerCase());

              if (isHeader) {
                acc.push({ type: "header", text: line, items: [] });
              } else {
                if (acc.length === 0) {
                  acc.push({ type: "header", text: "Overview", items: [] });
                }
                acc[acc.length - 1].items.push(line);
              }

              return acc;
            }, [])
            .map((block, i) => (
              <div
                key={i}
                className={`rounded-xl border overflow-hidden bg-white/5 ${currentBorder}`}
              >

                {/* HEADER */}
                <div
                  className={`px-4 py-2 text-white font-semibold bg-gradient-to-r ${currentGradient}`}
                >
                  {block.text}
                </div>

                {/* CONTENT */}
                <div className="p-3 space-y-1 text-xs text-gray-300">
                  {block.items.slice(0, 4).map((item, j) => (
                    <div key={j} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}

        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 flex-wrap">

        <button
          onClick={() => setRoadmap("")}
          className="px-3 py-1 text-xs rounded-full border border-white/10 hover:bg-red-500/10 hover:border-red-400/30 transition"
        >
          🔄 Regenerate
        </button>

        <button
          onClick={downloadPDF}
          className="px-3 py-1 text-xs rounded-full border border-white/10 hover:bg-blue-500/10 hover:border-blue-400/30 transition"
        >
          ⬇ Download PDF
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

