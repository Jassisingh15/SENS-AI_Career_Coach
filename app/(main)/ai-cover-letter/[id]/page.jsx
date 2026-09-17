import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

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
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            {coverLetter?.jobTitle} <span className="text-indigo-400 font-semibold text-2xl md:text-3xl">at</span> {coverLetter?.companyName}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Generated tailored cover letter preview and AI editor
          </p>
        </div>
      </div>

      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  );
}
