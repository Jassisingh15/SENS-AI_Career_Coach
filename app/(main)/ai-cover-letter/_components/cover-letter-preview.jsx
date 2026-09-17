"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { improveCoverLetter } from "@/actions/cover-letter";
import { Sparkles, Loader2 } from "lucide-react";

const CoverLetterPreview = ({ content }) => {
  const [letter, setLetter] = useState(content);
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    try {
      setLoading(true);
      const improved = await improveCoverLetter(letter);
      setLetter(improved);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-color-mode="dark" className="py-2 space-y-5">
      {/* Improve Button with Animated AI Aura */}
      <div className="flex justify-end">
        <div className="relative inline-block group p-[1px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.35)]">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 animate-pulse-slow blur-[1px]" />
          <Button
            onClick={handleImprove}
            disabled={loading}
            className="relative px-6 py-2.5 font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-cyan-400" />
                Improving with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-cyan-300" />
                Improve with AI
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="w-full space-y-3 animate-pulse">
          <div className="h-4 w-1/4 rounded bg-gradient-to-r from-violet-600/30 via-indigo-500/40 to-violet-600/30" />
          <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-white/5" />
        </div>
      )}

      {/* Preview */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        <MDEditor value={letter} preview="preview" height={700} />
      </div>
    </div>
  );
};

export default CoverLetterPreview;