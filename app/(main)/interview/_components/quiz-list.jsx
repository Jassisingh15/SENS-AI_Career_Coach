"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Recent Quizzes
              </CardTitle>
              <CardDescription className="text-slate-400">
                Review your past quiz performance and targeted improvement areas
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")} size="default">
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment, i) => (
              <div
                key={assessment.id}
                className="cursor-pointer rounded-xl border border-white/10 bg-slate-950/40 p-4 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className="text-lg font-bold text-white">
                    Quiz {i + 1}
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      Score: {assessment.quizScore.toFixed(1)}%
                    </span>
                    <span className="text-slate-400">
                      {format(new Date(assessment.createdAt), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                </div>
                {assessment.improvementTip && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                    💡 {assessment.improvementTip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-white/10 bg-slate-900/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Quiz Details</DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
