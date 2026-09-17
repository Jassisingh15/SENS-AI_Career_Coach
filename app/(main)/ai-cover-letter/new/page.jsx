import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto max-w-4xl py-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 text-indigo-400 hover:text-indigo-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            Create Cover Letter
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Generate an AI-tailored, high-converting cover letter aligned with target job specifications
          </p>
        </div>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}
