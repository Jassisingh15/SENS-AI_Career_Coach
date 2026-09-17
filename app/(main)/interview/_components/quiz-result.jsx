"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  return (
    <div className="mx-auto rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
        <Trophy className="h-7 w-7 text-amber-400" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6 p-0">
        {/* Score Overview */}
        <div className="text-center space-y-3 p-6 rounded-xl border border-white/10 bg-slate-950/50 backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Final Assessment Score</p>
          <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {result.quizScore.toFixed(1)}%
          </div>
          <Progress value={result.quizScore} className="w-full max-w-md mx-auto" />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-slate-200 backdrop-blur-md">
            <p className="font-semibold text-indigo-300 mb-1">💡 Improvement Tip:</p>
            <p className="text-slate-300 text-sm leading-relaxed">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Question Review</h3>
          {result.questions.map((q, index) => (
            <div key={index} className="border border-white/10 bg-slate-950/40 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-slate-100 text-sm md:text-base">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
              <div className="text-xs space-y-1">
                <p className={q.isCorrect ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                  Your answer: {q.userAnswer}
                </p>
                {!q.isCorrect && (
                  <p className="text-emerald-400 font-medium">Correct answer: {q.answer}</p>
                )}
              </div>
              <div className="text-xs bg-slate-900/80 border border-white/5 p-3 rounded-lg text-slate-300 space-y-1">
                <p className="font-semibold text-indigo-300">Explanation:</p>
                <p className="leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="p-0 pt-4">
          <Button onClick={onStartNew} className="w-full" size="lg">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
