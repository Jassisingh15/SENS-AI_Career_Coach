import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-emerald-500/10 blur-xl" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Average Score</CardTitle>
          <Trophy className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-white">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {getAverageScore()}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Questions Practiced
          </CardTitle>
          <Brain className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {getTotalQuestions()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Total questions completed</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-violet-500/10 blur-xl" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Latest Score</CardTitle>
          <Target className="h-4 w-4 text-violet-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-white">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Most recent quiz score</p>
        </CardContent>
      </Card>
    </div>
  );
}
