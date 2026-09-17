"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
          Performance Trend
        </CardTitle>
        <CardDescription className="text-slate-400">Your quiz score trajectory over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
                        <p className="text-sm font-bold text-white">
                          Score: <span className="text-emerald-400">{payload[0].value}%</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#7C3AED", r: 5, strokeWidth: 2, stroke: "#080C14" }}
                activeDot={{ fill: "#06B6D4", r: 7, strokeWidth: 2, stroke: "#080C14" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
