"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries, isEditMode = false }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success(isEditMode ? "Profile updated successfully!" : "Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, router, isEditMode]);

  const watchIndustry = watch("industry");

  return (
    <div className="flex items-center justify-center px-3 py-6 relative">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-violet-600/15 blur-3xl -z-10" />

      <Card className="mx-2 w-full max-w-xl overflow-hidden border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10 bg-slate-950/60 p-6 md:p-8">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            {isEditMode ? "Update Career Profile" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            {isEditMode
              ? "Change your target industry and specialization to recalculate career analytics"
              : "Select your industry and background to get customized career intelligence and AI recommendations."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-rose-400 font-medium">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-rose-400 font-medium">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-rose-400 font-medium">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, React, Next.js, Product Design"
                {...register("skills")}
              />
              <p className="text-xs text-slate-400">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-rose-400 font-medium">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background and career objectives..."
                className="h-32"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-rose-400 font-medium">{errors.bio.message}</p>
              )}
            </div>

            <div className="pt-2">
              {/* ANIMATED AI AURA BORDER AROUND SUBMIT */}
              <div className="relative group p-[1.5px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 animate-pulse-slow blur-[1px]" />
                <Button
                  type="submit"
                  className="relative w-full py-3 h-12 text-base font-bold bg-slate-950 hover:bg-slate-900 text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                      {isEditMode ? "Save Changes" : "Complete Profile"}
                    </>
                  )}
                </Button>
              </div>

              {/* PURPLE SHIMMER LOADER */}
              {updateLoading && (
                <div className="w-full space-y-2 pt-4 animate-pulse">
                  <div className="h-2.5 w-1/3 mx-auto rounded bg-gradient-to-r from-violet-600/30 via-indigo-500/40 to-violet-600/30" />
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
