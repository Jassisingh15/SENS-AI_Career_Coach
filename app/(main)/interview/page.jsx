import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-600/20 blur-2xl" />
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            Interview Preparation
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Test your domain expertise, review AI explanations, and track your performance trends over time.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
