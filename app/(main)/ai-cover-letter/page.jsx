import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-600/20 blur-2xl" />
        <div className="space-y-1 relative z-10 text-center sm:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            My Cover Letters
          </h1>
          <p className="text-slate-400 text-sm">
            AI-tailored cover letters generated from your job description and resume
          </p>
        </div>
        <Link href="/ai-cover-letter/new" className="relative z-10">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
