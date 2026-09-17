"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  // Update content when letter is generated
  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter, router, reset]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl p-2 sm:p-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-white">Target Job Details</CardTitle>
          <CardDescription className="text-slate-400">
            Provide the target company and role details to personalize your AI cover letter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., Vercel, Stripe, Linear"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-xs text-rose-400 font-medium">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Senior Full Stack Engineer"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-xs text-rose-400 font-medium">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the target position's job requirements and role description..."
                className="h-36"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end pt-2">
              <div className="relative inline-block group p-[1px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 animate-pulse-slow blur-[1px]" />
                <Button
                  type="submit"
                  disabled={generating}
                  className="relative px-8 py-2.5 font-bold"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-cyan-400" />
                      Generating Cover Letter...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 text-cyan-300" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>

              {generating && (
                <div className="w-full space-y-3 pt-6 animate-pulse">
                  <div className="h-3 w-1/3 rounded bg-gradient-to-r from-violet-600/30 via-indigo-500/40 to-violet-600/30" />
                  <div className="h-20 w-full rounded-xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-white/5" />
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
