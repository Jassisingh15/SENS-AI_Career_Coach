// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index} className="border-white/10 bg-slate-950/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-white">
                {item.title} <span className="text-indigo-400">@</span> {item.organization}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className="border-indigo-500/30 bg-slate-950/60 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Title / Position</label>
                <Input
                  placeholder="e.g., Software Engineer"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-rose-400 font-medium">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Organization / Company</label>
                <Input
                  placeholder="e.g., Google"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-xs text-rose-400 font-medium">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Start Date</label>
                <Input
                  type="month"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-xs text-rose-400 font-medium">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">End Date</label>
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                />
                {errors.endDate && (
                  <p className="text-xs text-rose-400 font-medium">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
              />
              <label htmlFor="current" className="text-xs font-medium text-slate-300 cursor-pointer">
                I currently work / study here
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Role Description & Key Accomplishments</label>
              <Textarea
                placeholder={`Key responsibilities and measurable impact in your ${type.toLowerCase()}...`}
                className="h-32"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* AI IMPROVE BUTTON WITH ANIMATED AI AURA BORDER */}
            <div className="pt-1">
              <div className="relative inline-block group p-[1px] rounded-lg overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 animate-pulse-slow blur-[1px]" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleImproveDescription}
                  disabled={isImproving || !watch("description")}
                  className="relative border-white/10 bg-slate-950 text-indigo-300 hover:text-white"
                >
                  {isImproving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin text-cyan-400" />
                      Improving with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 text-cyan-300" />
                      Improve with AI
                    </>
                  )}
                </Button>
              </div>

              {/* PURPLE SHIMMER SKELETON LOADER */}
              {isImproving && (
                <div className="w-full space-y-2 pt-3 animate-pulse">
                  <div className="h-3 w-3/4 rounded bg-gradient-to-r from-violet-600/30 via-indigo-500/40 to-violet-600/30" />
                  <div className="h-3 w-1/2 rounded bg-gradient-to-r from-violet-600/20 via-indigo-500/30 to-violet-600/20" />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-2 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
