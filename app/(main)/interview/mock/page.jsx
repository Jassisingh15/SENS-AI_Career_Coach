import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <div className="container mx-auto space-y-6 py-4 max-w-4xl">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0 text-indigo-400 hover:text-indigo-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            Mock Interview
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Test your knowledge with real-world industry questions and AI evaluation
          </p>
        </div>
      </div>

      <Quiz />
    </div>
  );
}
